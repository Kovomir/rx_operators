import { useCallback, useEffect, useMemo, useState } from "react";

import type { PipelineOperator } from "@/features/pipeline-editor";
import { evaluatePipelineOutput } from "@/lib/rx/evaluate-pipeline-output";

import { EMIT_GAP_MS } from "../constants";
import { usePipelineRuntime } from "../hooks/use-pipeline-runtime";
import { useVisualScheduler } from "../hooks/use-visual-scheduler";
import type { PlaybackSpeed } from "../playback";
import {
  buildPipelineStages,
  getStagePositions,
  getVisualizerWidth,
} from "../pipeline-layout";
import { createDefaultStreamValues } from "../source-values";
import type { StreamValue } from "../types";
import { StageLayer } from "./StageLayer";
import { TrackLayer } from "./TrackLayer";
import { ValueLayer } from "./ValueLayer";
import { VisualizerCanvas } from "./VisualizerCanvas";
import { VisualizerControls } from "./VisualizerControls";

type PipelineVisualizerProps = {
  canEmitLiveValue?: boolean;
  canRandomizeValues?: boolean;
  description?: string;
  operators: PipelineOperator[];
  sourceValues?: StreamValue[];
  title?: string;
};

export function PipelineVisualizer({
  canEmitLiveValue,
  canRandomizeValues,
  description = "Vizualizace vaší Rx pipeline.",
  operators,
  sourceValues: providedSourceValues,
  title = "Vizualizace streamu",
}: PipelineVisualizerProps) {
  const [localSourceValues, setLocalSourceValues] = useState<StreamValue[]>(() =>
    createDefaultStreamValues()
  );
  const [playbackSpeed, setPlaybackSpeed] = useState<PlaybackSpeed>(1);
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
  const stagePositions = useMemo(() => getStagePositions(stages), [stages]);
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
    getScaledDuration,
    handleVisualEvent,
    resetVisualValues,
    scheduleTimeout,
    visualValues,
  } = useVisualScheduler({
    playbackSpeed,
    stagePositionById,
  });

  const handleOutputValue = useCallback(() => undefined, []);

  const resetRunState = useCallback(() => {
    resetVisualValues();
  }, [resetVisualValues]);

  const { emitValue } = usePipelineRuntime({
    operators,
    onOutputValue: handleOutputValue,
    onRuntimeCleanup: clearScheduledTimeouts,
    onVisualEvent: handleVisualEvent,
  });

  const runSourceValues = useCallback(
    (values: StreamValue[]) => {
      resetRunState();

      const emitGapMs = getScaledDuration(EMIT_GAP_MS);

      values.forEach((value, index) => {
        scheduleTimeout(() => {
          emitValue(value);
        }, index * emitGapMs);
      });
    },
    [emitValue, getScaledDuration, resetRunState, scheduleTimeout]
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
      emitValue(nextValue);
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
