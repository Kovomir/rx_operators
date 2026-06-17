import type { PipelineOperatorType } from "./types";

export type OperatorCatalogItem = {
  type: PipelineOperatorType
  label: string
  description: string
  expressionPreview: string
}

export const OPERATOR_CATALOG: OperatorCatalogItem[] = [
  {
    type: "map",
    label: "map",
    description: "Transformuje každou hodnotu na novou hodnotu.",
    expressionPreview: "x => x * 2",
  },
  {
    type: "filter",
    label: "filter",
    description: "Propustí pouze hodnoty, které splní podmínku.",
    expressionPreview: "x => x > 3",
  },
];

export function getOperatorCatalogItem(type: PipelineOperatorType) {
  return OPERATOR_CATALOG.find((operator) => operator.type === type);
}
