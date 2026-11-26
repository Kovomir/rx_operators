import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import type { PipelineOperator } from "@/features/pipeline-editor";
import type { PipelineScrollSyncController } from "@/features/pipeline-scroll-sync";
import type { PipelineTraceEvent } from "@/lib/rx/pipeline-trace";
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
import { SubscriberOutput } from "./SubscriberOutput";
import { TrackLayer } from "./TrackLayer";
import { ValueLayer } from "./ValueLayer";
import { VisualizerCanvas } from "./VisualizerCanvas";
import { VisualizerControls } from "./VisualizerControls";

const LIVE_OUTPUT_LIMIT = 10;

const INITIAL_RUN_STATE = {
  outputCount: 0,
  outputValues: [] as StreamValue[],
  runId: 0,
  sourceCount: 0,
};

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
  showSubscriberOutput?: boolean;
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
  showSubscriberOutput = false,
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
  const [runState, setRunState] = useState(INITIAL_RUN_STATE);
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

  const resetRunState = useCallback(() => {
    resetVisualValues();
    setRunState((current) => ({ ...INITIAL_RUN_STATE, runId: current.runId + 1 }));
  }, [resetVisualValues]);

  const handleRuntimeTraceEvent = useCallback(
    (event: PipelineTraceEvent) => {
      if (event.type === "source-next") {
        setRunState((current) => ({
          ...current,
          sourceCount: current.sourceCount + 1,
        }));
      }

      if (event.type === "subscriber-next") {
        const { id, color, shape, value } = event.value;
        setRunState((current) => {
          const outputCount = current.outputCount + 1;
          if (!showSubscriberOutput) {
            return { ...current, outputCount };
          }

          const outputValues = [...current.outputValues, { id, color, shape, value }];

          return {
            ...current,
            outputCount,
            outputValues: canEmitLiveValueControl
              ? outputValues.slice(-LIVE_OUTPUT_LIMIT)
              : outputValues,
          };
        });
      }

      handleTraceEvent(event);
    },
    [canEmitLiveValueControl, handleTraceEvent, showSubscriberOutput]
  );

  const { emitValue, resetRuntime } = usePipelineRuntime({
    operators,
    onRuntimeCleanup: clearScheduledTimeouts,
    onTraceEvent: handleRuntimeTraceEvent,
  });

  const runSourceValues = useCallback(
    (values: StreamValue[]) => {
      resetRunState();
      resetRuntime(values);
    },
    [resetRunState, resetRuntime]
  );

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      runSourceValues(autoRunSourceValues ? sourceValues : []);
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [
    autoRunSourceValues,
    playbackSpeed,
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
          : nextValue
      );
    }
  }

  function randomizeValues() {
    if (!usesControlledSourceValues) {
      setLocalSourceValues(createDefaultStreamValues());
    }
  }

  return (
    <section className="min-w-0 overflow-hidden rounded-lg border bg-card shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b px-4 py-2">
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
          sourceValueCount={runState.sourceCount}
          outputValueCount={runState.outputCount}
        />
        <ValueLayer visualValues={visualValues} />
      </VisualizerCanvas>

      {showSubscriberOutput && (
        <div className="bg-muted/60 px-4 py-3 dark:bg-background/40">
          <SubscriberOutput
            runId={runState.runId}
            totalCount={runState.outputCount}
            values={runState.outputValues}
          />
        </div>
      )}
    </section>
  );
}
