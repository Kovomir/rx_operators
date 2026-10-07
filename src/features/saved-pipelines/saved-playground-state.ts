import type {
  FilterPipelineOperator,
  FilterTarget,
  MapOperation,
  PipelineOperator,
  StartWithOperatorConfig,
  StreamColor,
  StreamShape,
  StreamValueKind,
  TapOperatorConfig,
} from "@/features/pipeline-editor";

import {
  SAVED_PLAYGROUND_STATE_VERSION,
  type SavedPlaygroundState,
} from "./types";

const MAP_OPERATIONS = ["add", "subtract", "multiply"] satisfies MapOperation[];
const FILTER_TARGETS = ["color", "shape", "value"] satisfies FilterTarget[];
const STREAM_COLORS = ["red", "blue", "green"] satisfies StreamColor[];
const STREAM_SHAPES = ["circle", "square", "triangle"] satisfies StreamShape[];
const STREAM_VALUE_KINDS = ["odd", "even"] satisfies StreamValueKind[];
const TAP_EFFECTS = ["consoleLog"] satisfies TapOperatorConfig["effect"][];
const START_WITH_VALUES = Array.from({ length: 11 }, (_, value) => value) satisfies StartWithOperatorConfig["value"][];

export function createSavedPlaygroundState(
  operators: PipelineOperator[]
): SavedPlaygroundState {
  return {
    version: SAVED_PLAYGROUND_STATE_VERSION,
    operators: clonePipelineOperators(operators),
  };
}

export function parseSavedPlaygroundState(
  value: unknown
): SavedPlaygroundState | null {
  if (!isRecord(value) || value.version !== SAVED_PLAYGROUND_STATE_VERSION) {
    return null;
  }

  if (!Array.isArray(value.operators)) {
    return null;
  }

  const operators = value.operators.map(parsePipelineOperator);

  if (operators.some((operator) => operator === null)) {
    return null;
  }

  return {
    version: SAVED_PLAYGROUND_STATE_VERSION,
    operators: operators as PipelineOperator[],
  };
}

function parsePipelineOperator(value: unknown): PipelineOperator | null {
  if (!isRecord(value) || typeof value.id !== "string") {
    return null;
  }

  switch (value.type) {
    case "map":
      return parseMapPipelineOperator(value.id, value.config);
    case "filter":
      return parseFilterPipelineOperator(value.id, value.config);
    case "skip":
      return parseCountPipelineOperator(value.id, "skip", value.config);
    case "take":
      return parseCountPipelineOperator(value.id, "take", value.config);
    case "distinctUntilChanged":
      return parseNoConfigPipelineOperator(value.id, "distinctUntilChanged");
    case "tap":
      return parseTapPipelineOperator(value.id, value.config);
    case "startWith":
      return parseStartWithPipelineOperator(value.id, value.config);
    default:
      return null;
  }
}

function parseMapPipelineOperator(
  id: string,
  config: unknown
): PipelineOperator | null {
  if (
    !isRecord(config) ||
    !isOneOf(config.operation, MAP_OPERATIONS) ||
    typeof config.operand !== "number"
  ) {
    return null;
  }

  return {
    id,
    type: "map",
    config: {
      operation: config.operation,
      operand: config.operand,
    },
  };
}

function parseFilterPipelineOperator(
  id: string,
  config: unknown
): FilterPipelineOperator | null {
  if (!isRecord(config) || !isOneOf(config.target, FILTER_TARGETS)) {
    return null;
  }

  if (
    !isArrayOf(config.allowedColors, STREAM_COLORS) ||
    !isArrayOf(config.allowedShapes, STREAM_SHAPES) ||
    !isArrayOf(config.allowedValueKinds, STREAM_VALUE_KINDS)
  ) {
    return null;
  }

  return {
    id,
    type: "filter",
    config: {
      target: config.target,
      allowedColors: [...config.allowedColors],
      allowedShapes: [...config.allowedShapes],
      allowedValueKinds: [...config.allowedValueKinds],
    },
  };
}

function parseCountPipelineOperator(
  id: string,
  type: "skip" | "take",
  config: unknown
): PipelineOperator | null {
  if (
    !isRecord(config) ||
    typeof config.count !== "number" ||
    !Number.isInteger(config.count) ||
    config.count < 0
  ) {
    return null;
  }

  return {
    id,
    type,
    config: {
      count: config.count,
    },
  };
}

function parseNoConfigPipelineOperator(
  id: string,
  type: "distinctUntilChanged"
): PipelineOperator {
  return {
    id,
    type,
    config: {},
  };
}

function parseTapPipelineOperator(
  id: string,
  config: unknown
): PipelineOperator | null {
  if (!isRecord(config) || !isOneOf(config.effect, TAP_EFFECTS)) {
    return null;
  }

  return {
    id,
    type: "tap",
    config: {
      effect: config.effect,
    },
  };
}

function parseStartWithPipelineOperator(
  id: string,
  config: unknown
): PipelineOperator | null {
  if (!isRecord(config) || !isOneOfNumber(config.value, START_WITH_VALUES)) {
    return null;
  }

  return {
    id,
    type: "startWith",
    config: {
      value: config.value,
    },
  };
}

function clonePipelineOperators(operators: PipelineOperator[]) {
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
      case "take":
        return {
          ...operator,
          config: { ...operator.config },
        };
      case "distinctUntilChanged":
        return {
          ...operator,
          config: {},
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
    }
  });
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isOneOf<TValue extends string>(
  value: unknown,
  allowedValues: readonly TValue[]
): value is TValue {
  return typeof value === "string" && allowedValues.includes(value as TValue);
}

function isArrayOf<TValue extends string>(
  value: unknown,
  allowedValues: readonly TValue[]
): value is TValue[] {
  return Array.isArray(value) && value.every((item) => isOneOf(item, allowedValues));
}

function isOneOfNumber<TValue extends number>(
  value: unknown,
  allowedValues: readonly TValue[]
): value is TValue {
  return typeof value === "number" && allowedValues.includes(value as TValue);
}
