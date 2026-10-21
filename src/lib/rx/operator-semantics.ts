import type {
  CatchErrorPipelineOperator,
  FilterPipelineOperator,
  MapPipelineOperator,
  StartWithPipelineOperator,
} from "@/features/pipeline-editor";
import type { StreamValue } from "@/types/stream";

export function applyMapOperator(
  streamValue: StreamValue,
  operator: MapPipelineOperator
): StreamValue {
  if (doesMapOperatorThrow(streamValue, operator)) {
    throw createStreamError(createErrorStreamValue(streamValue, operator.id));
  }

  const { operation, operand } = operator.config;

  switch (operation) {
    case "add":
      return {
        ...streamValue,
        value: streamValue.value + operand,
      };
    case "subtract":
      return {
        ...streamValue,
        value: streamValue.value - operand,
      };
    case "multiply":
      return {
        ...streamValue,
        value: streamValue.value * operand,
      };
  }
}

export type StreamPipelineError = {
  kind: "stream-error";
  value: StreamValue;
};

export function doesMapOperatorThrow(
  streamValue: StreamValue,
  operator: MapPipelineOperator
) {
  return operator.config.throwOnValue === streamValue.value;
}

export function createErrorStreamValue(
  streamValue: StreamValue,
  namespace: string
): StreamValue {
  return {
    ...streamValue,
    id: `${namespace}-${streamValue.id}-error`,
    kind: "error",
  };
}

export function createStreamError(value: StreamValue): StreamPipelineError {
  return {
    kind: "stream-error",
    value,
  };
}

export function isStreamPipelineError(
  error: unknown
): error is StreamPipelineError {
  return (
    typeof error === "object" &&
    error !== null &&
    "kind" in error &&
    error.kind === "stream-error" &&
    "value" in error
  );
}

export function passesFilterOperator(
  streamValue: StreamValue,
  operator: FilterPipelineOperator
) {
  switch (operator.config.target) {
    case "color":
      return operator.config.allowedColors.includes(streamValue.color);
    case "shape":
      return operator.config.allowedShapes.includes(streamValue.shape);
    case "value": {
      const valueKind = Math.abs(streamValue.value % 2) === 0 ? "even" : "odd";
      return operator.config.allowedValueKinds.includes(valueKind);
    }
  }
}

export function applyDistinctUntilChangedOperator(values: StreamValue[]) {
  return values.filter(
    (value, index) => index === 0 || value.value !== values[index - 1].value
  );
}

export function createStartWithValue(
  operator: StartWithPipelineOperator
): StreamValue {
  return {
    id: `${operator.id}-start-value`,
    shape: "circle",
    color: "green",
    value: operator.config.value,
    emittedAtMs: 0,
  };
}

export function applyScanStep(
  streamValue: StreamValue,
  accumulator: number
) {
  const nextAccumulator = accumulator + streamValue.value;

  return {
    accumulator: nextAccumulator,
    value: {
      ...streamValue,
      value: nextAccumulator,
    },
  };
}

export function createCatchErrorReplacementValue(
  operator: CatchErrorPipelineOperator,
  errorValue?: StreamValue
): StreamValue {
  return {
    id: `${operator.id}-replacement-${errorValue?.id ?? "value"}`,
    shape: errorValue?.shape ?? "circle",
    color: "green",
    value: -1,
  };
}
