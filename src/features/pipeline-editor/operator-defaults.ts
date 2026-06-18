import type {
  FilterOperatorConfig,
  MapOperatorConfig,
  PipelineOperator,
  PipelineOperatorType,
} from "./types";

export const DEFAULT_MAP_CONFIG: MapOperatorConfig = {
  operation: "multiply",
  operand: 2,
};

export const DEFAULT_FILTER_CONFIG: FilterOperatorConfig = {
  target: "value",
  allowedColors: ["red", "blue", "green"],
  allowedShapes: ["circle", "square", "triangle"],
  allowedValueKinds: ["even"],
};

export function createDefaultPipelineOperator(
  id: string,
  type: PipelineOperatorType
): PipelineOperator {
  switch (type) {
    case "filter":
      return {
        id,
        type,
        config: {
          ...DEFAULT_FILTER_CONFIG,
          allowedColors: [...DEFAULT_FILTER_CONFIG.allowedColors],
          allowedShapes: [...DEFAULT_FILTER_CONFIG.allowedShapes],
          allowedValueKinds: [...DEFAULT_FILTER_CONFIG.allowedValueKinds],
        },
      };
    case "map":
      return {
        id,
        type,
        config: { ...DEFAULT_MAP_CONFIG },
      };
  }
}
