import type { PipelineOperator } from "@/features/pipeline-editor";

export function clonePipelineOperators(
  operators: PipelineOperator[]
): PipelineOperator[] {
  return operators.map((operator) => {
    switch (operator.type) {
      case "map":
        return {
          ...operator,
          config: { ...operator.config },
        };
      case "filter":
        return {
          ...operator,
          config: {
            ...operator.config,
            allowedColors: [...operator.config.allowedColors],
            allowedShapes: [...operator.config.allowedShapes],
            allowedValueKinds: [...operator.config.allowedValueKinds],
          },
        };
      case "skip":
        return {
          ...operator,
          config: { ...operator.config },
        };
      case "take":
        return {
          ...operator,
          config: { ...operator.config },
        };
      case "tap":
        return {
          ...operator,
          config: { ...operator.config },
        };
      case "startWith":
        return {
          ...operator,
          config: { ...operator.config },
        };
      case "debounceTime":
        return {
          ...operator,
          config: { ...operator.config },
        };
      case "delay":
        return {
          ...operator,
          config: { ...operator.config },
        };
      case "catchError":
        return {
          ...operator,
          config: { ...operator.config },
        };
      case "distinctUntilChanged":
      case "scan":
        return {
          ...operator,
          config: {},
        };
    }
  });
}
