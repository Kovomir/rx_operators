import type { PipelineOperator } from "@/features/pipeline-editor";
import type { StreamValue } from "@/features/stream-visualizer";

import { applyMapOperator, passesFilterOperator } from "./operator-semantics";

export function evaluatePipelineOutput(
  sourceValues: StreamValue[],
  operators: PipelineOperator[]
): StreamValue[] {
  return operators.reduce(
    (currentValues, operator) => applyPipelineOperator(currentValues, operator),
    sourceValues
  );
}

function applyPipelineOperator(
  values: StreamValue[],
  operator: PipelineOperator
): StreamValue[] {
  switch (operator.type) {
    case "map":
      return values.map((value) => applyMapOperator(value, operator));
    case "filter":
      return values.filter((value) => passesFilterOperator(value, operator));
  }
}
