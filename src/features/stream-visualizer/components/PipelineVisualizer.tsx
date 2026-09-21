import { useCallback, useEffect, useMemo, useState } from "react";

import type { PipelineOperator } from "@/features/pipeline-editor";
import { evaluatePipelineOutput } from "@/lib/rx/evaluate-pipeline-output";

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
  canEmitLiveValue?: boolean;
  canRandomizeValues?: boolean;
  defaultPlaybackSpeed?: PlaybackSpeed;
  description?: string;
  operators: PipelineOperator[];
  sourceValues?: StreamValue[];
  title?: string;
};

export function PipelineVisualizer({
  canEmitLiveValue,
  canRandomizeValues,
  defaultPlaybackSpeed = DEFAULT_PLAYBACK_SPEED,
  description = "Vizualizace vaší Rx pipeline.",
  operators,
  sourceValues: providedSourceValues,
  title = "Vizualizace streamu",
}: PipelineVisualizerProps) {
  const [localSourceValues, setLocalSourceValues] = useState<StreamValue[]>(() =>
    createDefaultStreamValues()
  );
  const [playbackSpeed, setPlaybackSpeed] = useState<PlaybackSpeed>(
    defaultPlaybackSpeed
  );
  const sourceValues = providedSourceValues ?? localSourceValues;
  const expectedOutputValues = useMemo(
    () => evaluatePipelineOutput(sourceValues, operators),
    [operators, sourceValues]
  );
  const usesControlledSourceValues = providedSourceValues !== undefined;
  const canEmitLiveValueControl =
    canEmitLiveValue ?? !usesControlledSourceValues;
  const canRandomizeValuesControl =
    canRandomizeValues ?? !usesControlledSourceValues;

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
  const {
    clearScheduledTimeouts,
    handleTraceEvent,
    resetVisualValues,
    visualValues,
  } = useVisualScheduler({
    playbackSpeed,
    stagePositionById,
    streamLanes,
  });

  const handleOutputValue = useCallback(() => undefined, []);

  const resetRunState = useCallback(() => {
    resetVisualValues();
  }, [resetVisualValues]);

  const { emitValue } = usePipelineRuntime({
    operators,
    onOutputValue: handleOutputValue,
    onRuntimeCleanup: clearScheduledTimeouts,
    onTraceEvent: handleTraceEvent,
  });

  const runSourceValues = useCallback(
    (values: StreamValue[]) => {
      resetRunState();

      values.forEach((value) => {
        emitValue(value, "demo");
      });
    },
    [emitValue, resetRunState]
  );

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      runSourceValues(sourceValues);
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [operators, playbackSpeed, runSourceValues, sourceValues]);

  function emitLiveValue() {
    const [nextValue] = createDefaultStreamValues(1);

    if (nextValue) {
      emitValue(nextValue, "live");
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
        </div>

        <VisualizerControls
          canEmitLiveValue={canEmitLiveValueControl}
          canRandomizeValues={canRandomizeValuesControl}
          playbackSpeed={playbackSpeed}
          onEmitLiveValue={emitLiveValue}
          onPlaybackSpeedChange={setPlaybackSpeed}
          onRandomizeValues={randomizeValues}
          onRestart={() => runSourceValues(sourceValues)}
        />
      </div>

      <VisualizerCanvas width={visualizerWidth}>
        <TrackLayer
          stagePositions={stagePositions}
          streamLanes={streamLanes}
          visualizerWidth={visualizerWidth}
        />
        <StageLayer
          stagePositions={stagePositions}
          sourceValueCount={sourceValues.length}
          outputValueCount={expectedOutputValues.length}
        />
        <ValueLayer visualValues={visualValues} />
      </VisualizerCanvas>
    </section>
  );
}
