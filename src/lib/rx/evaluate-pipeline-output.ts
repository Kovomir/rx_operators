import type { PipelineOperator } from "@/features/pipeline-editor";
import type { StreamValue } from "@/types/stream";

import { createPipelineRuntime } from "./pipeline-runtime";

export function evaluatePipeline(
  sourceValues: StreamValue[],
  operators: PipelineOperator[]
) {
  const outputValues: StreamValue[] = [];
  const tapValues: StreamValue[] = [];
  const runtime = createPipelineRuntime({
    operators,
    sourceValues,
    logTapValues: false,
    onOutputValue: (value) => outputValues.push(value),
    onTraceEvent: (event) => {
      if (event.type === "operator-tap") {
        tapValues.push(event.value);
      }
    },
  });

  try {
    // Leave the demo source open while queued timers finish, just as in the
    // visualizer. Completing it after the last input would flush debounce early.
    runtime.flush();
    return { outputValues, tapValues };
  } finally {
    runtime.dispose();
  }
}
