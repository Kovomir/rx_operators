import type {
  FilterTarget,
  MapOperation,
  PipelineOperator,
  PipelineOperatorType,
  StreamColor,
  StreamShape,
  StreamValueKind,
} from "./types";

export type OperatorCatalogItem = {
  type: PipelineOperatorType;
  label: string;
  description: string;
};

export const OPERATOR_CATALOG: OperatorCatalogItem[] = [
  {
    type: "map",
    label: "map",
    description: "Transformuje číselnou hodnotu každé položky.",
  },
  {
    type: "filter",
    label: "filter",
    description: "Propustí jen položky, které splní nastavenou podmínku.",
  },
];

export const MAP_OPERATION_LABELS: Record<MapOperation, string> = {
  add: "+",
  subtract: "-",
  multiply: "*",
};

export const FILTER_TARGET_LABELS: Record<FilterTarget, string> = {
  color: "Barva",
  shape: "Tvar",
  value: "Hodnota",
};

export const STREAM_COLOR_LABELS: Record<StreamColor, string> = {
  red: "Červená",
  blue: "Modrá",
  green: "Zelená",
};

export const STREAM_SHAPE_LABELS: Record<StreamShape, string> = {
  circle: "Kruh",
  square: "Čtverec",
  triangle: "Trojúhelník",
};

export const STREAM_VALUE_KIND_LABELS: Record<StreamValueKind, string> = {
  odd: "Lichá",
  even: "Sudá",
};

export function getOperatorCatalogItem(type: PipelineOperatorType) {
  return OPERATOR_CATALOG.find((operator) => operator.type === type);
}

export function getOperatorExpressionPreview(operator: PipelineOperator) {
  switch (operator.type) {
    case "map":
      return `x => x ${MAP_OPERATION_LABELS[operator.config.operation]} ${operator.config.operand}`;
    case "filter":
      switch (operator.config.target) {
        case "color":
          return `barva ∈ ${operator.config.allowedColors
            .map((color) => STREAM_COLOR_LABELS[color])
            .join(", ")}`;
        case "shape":
          return `tvar ∈ ${operator.config.allowedShapes
            .map((shape) => STREAM_SHAPE_LABELS[shape])
            .join(", ")}`;
        case "value":
          return `hodnota ∈ ${operator.config.allowedValueKinds
            .map((kind) => STREAM_VALUE_KIND_LABELS[kind])
            .join(", ")}`;
      }
  }
}
