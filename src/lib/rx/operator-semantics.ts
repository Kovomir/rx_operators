import type {
  FilterPipelineOperator,
  MapPipelineOperator,
  SkipPipelineOperator,
  StartWithPipelineOperator,
  TakePipelineOperator,
} from "@/features/pipeline-editor";
import type { StreamValue } from "@/types/stream";

export function applyMapOperator(
  streamValue: StreamValue,
  operator: MapPipelineOperator
): StreamValue {
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

export function applySkipOperator(
  values: StreamValue[],
  operator: SkipPipelineOperator
) {
  return values.slice(operator.config.count);
}

export function applyTakeOperator(
  values: StreamValue[],
  operator: TakePipelineOperator
) {
  return values.slice(0, operator.config.count);
}

export function applyDistinctUntilChangedOperator(values: StreamValue[]) {
  return values.filter(
    (value, index) => index === 0 || value.value !== values[index - 1].value
  );
}

export function applyStartWithOperator(
  values: StreamValue[],
  operator: StartWithPipelineOperator
) {
  return [createStartWithValue(operator), ...values];
}

export function createStartWithValue(
  operator: StartWithPipelineOperator
): StreamValue {
  return {
    id: `${operator.id}-start-value`,
    shape: "circle",
    color: "green",
    value: operator.config.value,
  };
}
