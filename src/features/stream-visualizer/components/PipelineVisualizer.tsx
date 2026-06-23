import { useCallback, useEffect, useMemo, useState } from "react";

import type { PipelineOperator } from "@/features/pipeline-editor";

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
  operators: PipelineOperator[];
};

export function PipelineVisualizer({ operators }: PipelineVisualizerProps) {
  const [sourceValues, setSourceValues] = useState<StreamValue[]>(() =>
    createDefaultStreamValues()
  );
  const [outputValues, setOutputValues] = useState<StreamValue[]>([]);
  const [playbackSpeed, setPlaybackSpeed] = useState<PlaybackSpeed>(1);

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

  const appendOutputValue = useCallback((value: StreamValue) => {
    setOutputValues((currentValues) => [...currentValues, value]);
  }, []);

  const resetRunState = useCallback(() => {
    resetVisualValues();
    setOutputValues([]);
  }, [resetVisualValues]);

  const { emitValue } = usePipelineRuntime({
    operators,
    onOutputValue: appendOutputValue,
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
    setSourceValues(createDefaultStreamValues());
  }

  return (
    <section className="min-w-0 overflow-hidden rounded-lg border bg-background shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b px-4 py-3">
        <div className="min-w-0">
          <h2 className="text-sm font-semibold text-foreground">
            Vizualizace streamu
          </h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Vizualizace vaší Rx pipeline.
          </p>
        </div>

        <VisualizerControls
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
          outputValueCount={outputValues.length}
        />
        <ValueLayer visualValues={visualValues} />
      </VisualizerCanvas>
    </section>
  );
}
