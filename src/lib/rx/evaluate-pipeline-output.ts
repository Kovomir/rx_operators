import type { PipelineOperator } from "@/features/pipeline-editor";
import type { StreamValue } from "@/types/stream";

import { createPipelineRuntime } from "./pipeline-runtime";

export function evaluatePipelineOutput(
  sourceValues: StreamValue[],
  operators: PipelineOperator[]
): StreamValue[] {
  return evaluatePipeline(sourceValues, operators).values;
}

export function evaluatePipelineTapValues(
  sourceValues: StreamValue[],
  operators: PipelineOperator[]
): number[] {
  return evaluatePipeline(sourceValues, operators).tapValues;
}

function evaluatePipeline(
  sourceValues: StreamValue[],
  operators: PipelineOperator[]
) {
  const values: StreamValue[] = [];
  const tapValues: number[] = [];
  const runtime = createPipelineRuntime({
    operators,
    sourceValues,
    logTapValues: false,
    onOutputValue: (value) => values.push(value),
    onTraceEvent: (event) => {
      if (event.type === "operator-tap") {
        tapValues.push(event.value.value);
      }
    },
  });

  try {
    // Leave the demo source open while queued timers finish, just as in the
    // visualizer. Completing it after the last input would flush debounce early.
    runtime.flush();
    return { values, tapValues };
  } finally {
    runtime.dispose();
  }
}
