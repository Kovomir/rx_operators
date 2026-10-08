import type {
  DebounceTimeOperatorConfig,
  CatchErrorOperatorConfig,
  DelayOperatorConfig,
  DistinctUntilChangedOperatorConfig,
  FilterOperatorConfig,
  MapOperatorConfig,
  PipelineOperator,
  PipelineOperatorType,
  ScanOperatorConfig,
  SkipOperatorConfig,
  StartWithOperatorConfig,
  TapOperatorConfig,
  TakeOperatorConfig,
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

export const DEFAULT_SKIP_CONFIG: SkipOperatorConfig = {
  count: 1,
};

export const DEFAULT_TAKE_CONFIG: TakeOperatorConfig = {
  count: 1,
};

export const DEFAULT_DISTINCT_UNTIL_CHANGED_CONFIG: DistinctUntilChangedOperatorConfig =
  {};

export const DEFAULT_TAP_CONFIG: TapOperatorConfig = {
  effect: "consoleLog",
};

export const DEFAULT_START_WITH_CONFIG: StartWithOperatorConfig = {
  value: 0,
};

export const DEFAULT_SCAN_CONFIG: ScanOperatorConfig = {};

export const DEFAULT_DEBOUNCE_TIME_CONFIG: DebounceTimeOperatorConfig = {
  durationMs: 500,
};

export const DEFAULT_CATCH_ERROR_CONFIG: CatchErrorOperatorConfig = {
  replacementValue: -1,
};

export const DEFAULT_DELAY_CONFIG: DelayOperatorConfig = {
  durationMs: 1000,
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
    case "skip":
      return {
        id,
        type,
        config: { ...DEFAULT_SKIP_CONFIG },
      };
    case "take":
      return {
        id,
        type,
        config: { ...DEFAULT_TAKE_CONFIG },
      };
    case "distinctUntilChanged":
      return {
        id,
        type,
        config: { ...DEFAULT_DISTINCT_UNTIL_CHANGED_CONFIG },
      };
    case "tap":
      return {
        id,
        type,
        config: { ...DEFAULT_TAP_CONFIG },
      };
    case "startWith":
      return {
        id,
        type,
        config: { ...DEFAULT_START_WITH_CONFIG },
      };
    case "scan":
      return {
        id,
        type,
        config: { ...DEFAULT_SCAN_CONFIG },
      };
    case "debounceTime":
      return {
        id,
        type,
        config: { ...DEFAULT_DEBOUNCE_TIME_CONFIG },
      };
    case "catchError":
      return {
        id,
        type,
        config: { ...DEFAULT_CATCH_ERROR_CONFIG },
      };
    case "delay":
      return {
        id,
        type,
        config: { ...DEFAULT_DELAY_CONFIG },
      };
  }
}
