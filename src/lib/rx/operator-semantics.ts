import type {
  FilterPipelineOperator,
  MapPipelineOperator,
} from "@/features/pipeline-editor";
import type { StreamValue } from "@/features/stream-visualizer";

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
