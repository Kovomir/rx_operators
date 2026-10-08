import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import type { PipelineOperator } from "@/features/pipeline-editor";
import type { PipelineScrollSyncController } from "@/features/pipeline-scroll-sync";
import type { PipelineTraceEvent } from "@/lib/rx/pipeline-trace";
import { withPipelineTraceMetadata } from "@/lib/rx/pipeline-trace";
import { MousePointerClickIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

import { usePipelineRuntime } from "../hooks/use-pipeline-runtime";
import { useVisualScheduler } from "../hooks/use-visual-scheduler";
import { DEFAULT_PLAYBACK_SPEED, type PlaybackSpeed } from "../playback";
import {
  buildPipelineStages,
  getStagePositions,
  getVisualizerWidth,
} from "../pipeline-layout";
import { createDefaultStreamValues } from "../source-values";
import {
  buildStreamLanes,
  getStreamY,
} from "../stream-layout";
import { MAIN_STREAM_ID } from "@/lib/rx/stream-identity";
import type { StreamValue } from "../types";
import { StageLayer } from "./StageLayer";
import { TrackLayer } from "./TrackLayer";
import { ValueLayer } from "./ValueLayer";
import { VisualizerCanvas } from "./VisualizerCanvas";
import { VisualizerControls } from "./VisualizerControls";

type PipelineVisualizerProps = {
  autoRunSourceValues?: boolean;
  canEmitLiveValue?: boolean;
  canRandomizeValues?: boolean;
  defaultPlaybackSpeed?: PlaybackSpeed;
  description?: string;
  liveSourceMinStartGapMs?: number;
  liveValueTimerDurationMs?: number;
  operators: PipelineOperator[];
  placeLiveValueButtonUnderDescription?: boolean;
  scrollSync?: PipelineScrollSyncController;
  selectedOperatorId?: string | null;
  selectedOperatorFocusKey?: number;
  restartKey?: number;
  sourceValues?: StreamValue[];
  title?: string;
};

export function PipelineVisualizer({
  autoRunSourceValues = true,
  canEmitLiveValue,
  canRandomizeValues,
  defaultPlaybackSpeed = DEFAULT_PLAYBACK_SPEED,
  description = "Vizualizace vaší Rx pipeline.",
  liveSourceMinStartGapMs,
  liveValueTimerDurationMs,
  operators,
  placeLiveValueButtonUnderDescription = false,
  scrollSync,
  selectedOperatorId,
  selectedOperatorFocusKey,
  restartKey,
  sourceValues: providedSourceValues,
  title = "Vizualizace streamu",
}: PipelineVisualizerProps) {
  const [localSourceValues, setLocalSourceValues] = useState<StreamValue[]>(() =>
    createDefaultStreamValues()
  );
  const [playbackSpeed, setPlaybackSpeed] = useState<PlaybackSpeed>(
    defaultPlaybackSpeed
  );
  const sourceEmissionTimeoutsRef = useRef<number[]>([]);
  const syntheticTraceSequenceRef = useRef(0);
  const [stageValueCounts, setStageValueCounts] = useState({
    output: 0,
    source: 0,
  });
  const sourceValues = providedSourceValues ?? localSourceValues;
  const usesControlledSourceValues = providedSourceValues !== undefined;
  const canEmitLiveValueControl =
    canEmitLiveValue ?? !usesControlledSourceValues;
  const canRandomizeValuesControl =
    canRandomizeValues ?? !usesControlledSourceValues;
  const showLiveValueButtonUnderDescription =
    canEmitLiveValueControl && placeLiveValueButtonUnderDescription;

  const stages = useMemo(() => buildPipelineStages(operators), [operators]);
  const streamLanes = useMemo(() => buildStreamLanes([MAIN_STREAM_ID]), []);
  const mainStreamY = getStreamY(streamLanes, MAIN_STREAM_ID);
  const stagePositions = useMemo(
    () => getStagePositions(stages, mainStreamY),
    [mainStreamY, stages]
  );
  const stagePositionById = useMemo(
    () =>
      new Map(
        stagePositions.map((stagePosition) => [stagePosition.id, stagePosition])
      ),
    [stagePositions]
  );
  const visualizerWidth = getVisualizerWidth(stages.length);
  const selectedStagePosition = selectedOperatorId
    ? stagePositionById.get(selectedOperatorId)
    : undefined;
  const {
    clearScheduledTimeouts,
    handleTraceEvent,
    resetVisualValues,
    visualValues,
  } = useVisualScheduler({
    liveSourceMinStartGapMs,
    playbackSpeed,
    stagePositionById,
    streamLanes,
  });

  const handleOutputValue = useCallback(() => undefined, []);

  const resetRunState = useCallback(() => {
    resetVisualValues();
    setStageValueCounts({
      output: 0,
      source: 0,
    });
  }, [resetVisualValues]);

  const handleRuntimeTraceEvent = useCallback(
    (event: PipelineTraceEvent) => {
      if (event.type === "source-next") {
        setStageValueCounts((currentCounts) => ({
          ...currentCounts,
          source: currentCounts.source + 1,
        }));
      }

      if (event.type === "subscriber-next") {
        setStageValueCounts((currentCounts) => ({
          ...currentCounts,
          output: currentCounts.output + 1,
        }));
      }

      handleTraceEvent(event);
    },
    [handleTraceEvent]
  );

  const clearSourceEmissionTimeouts = useCallback(() => {
    for (const timeoutId of sourceEmissionTimeoutsRef.current) {
      window.clearTimeout(timeoutId);
    }

    sourceEmissionTimeoutsRef.current = [];
  }, []);

  const { emitError, emitValue, resetRuntime } = usePipelineRuntime({
    operators,
    onOutputValue: handleOutputValue,
    onRuntimeCleanup: clearScheduledTimeouts,
    onTraceEvent: handleRuntimeTraceEvent,
  });

  const runSourceValues = useCallback(
    (values: StreamValue[]) => {
      clearSourceEmissionTimeouts();
      resetRunState();
      resetRuntime();

      values.forEach((value) => {
        const timeoutId = window.setTimeout(() => {
          if (value.kind === "cancelled") {
            handleRuntimeTraceEvent(
              withPipelineTraceMetadata(
                {
                  source: "demo",
                  type: "source-cancelled",
                  value,
                },
                syntheticTraceSequenceRef.current,
                performance.now()
              )
            );
            syntheticTraceSequenceRef.current += 1;
            return;
          }

          if (value.kind === "error") {
            emitError(value, "demo");
            return;
          }

          emitValue(value, "demo");
        }, value.emittedAtMs ?? 0);

        sourceEmissionTimeoutsRef.current.push(timeoutId);
      });
    },
    [
      clearSourceEmissionTimeouts,
      emitError,
      emitValue,
      handleRuntimeTraceEvent,
      resetRunState,
      resetRuntime,
    ]
  );

  useEffect(() => {
    if (!autoRunSourceValues) {
      const timeoutId = window.setTimeout(() => {
        clearSourceEmissionTimeouts();
        resetRunState();
        resetRuntime();
      }, 0);

      return () => {
        window.clearTimeout(timeoutId);
        clearSourceEmissionTimeouts();
      };
    }

    const timeoutId = window.setTimeout(() => {
      runSourceValues(sourceValues);
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
      clearSourceEmissionTimeouts();
    };
  }, [
    autoRunSourceValues,
    clearSourceEmissionTimeouts,
    playbackSpeed,
    resetRunState,
    resetRuntime,
    restartKey,
    runSourceValues,
    sourceValues,
  ]);

  function emitLiveValue() {
    const [nextValue] = createDefaultStreamValues(1);

    if (nextValue) {
      emitValue(
        liveValueTimerDurationMs
          ? { ...nextValue, timerDurationMs: liveValueTimerDurationMs }
          : nextValue,
        "live"
      );
    }
  }

  function randomizeValues() {
    if (!usesControlledSourceValues) {
      setLocalSourceValues(createDefaultStreamValues());
    }
  }

  return (
    <section className="min-w-0 overflow-hidden rounded-lg border bg-background shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b px-4 py-3">
        <div className="min-w-0">
          <h2 className="text-sm font-semibold text-foreground">{title}</h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {description}
          </p>
          {showLiveValueButtonUnderDescription && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-3"
              onClick={emitLiveValue}
            >
              <MousePointerClickIcon />
              Vložit hodnotu
            </Button>
          )}
        </div>

        <VisualizerControls
          canEmitLiveValue={canEmitLiveValueControl}
          canRandomizeValues={canRandomizeValuesControl}
          hideEmitLiveValue={showLiveValueButtonUnderDescription}
          playbackSpeed={playbackSpeed}
          onEmitLiveValue={emitLiveValue}
          onPlaybackSpeedChange={setPlaybackSpeed}
          onRandomizeValues={randomizeValues}
          onRestart={() => runSourceValues(sourceValues)}
        />
      </div>

      <VisualizerCanvas
        centeredX={selectedStagePosition?.x}
        centerRequestKey={selectedOperatorFocusKey}
        width={visualizerWidth}
        scrollSync={scrollSync}
      >
        <TrackLayer
          stagePositions={stagePositions}
          streamLanes={streamLanes}
          visualizerWidth={visualizerWidth}
        />
        <StageLayer
          stagePositions={stagePositions}
          selectedStageId={selectedOperatorId}
          sourceValueCount={stageValueCounts.source}
          outputValueCount={stageValueCounts.output}
        />
        <ValueLayer visualValues={visualValues} />
      </VisualizerCanvas>
    </section>
  );
}
