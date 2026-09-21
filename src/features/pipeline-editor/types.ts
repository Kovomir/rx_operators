export type StreamColor = "red" | "blue" | "green";

export type StreamShape = "circle" | "square" | "triangle";

export type StreamValueKind = "odd" | "even";

export type PipelineOperatorType = "map" | "filter" | "skip";

export type MapOperation = "add" | "subtract" | "multiply";

export type FilterTarget = "color" | "shape" | "value";

export type MapOperatorConfig = {
  operation: MapOperation;
  operand: number;
};

export type FilterOperatorConfig = {
  target: FilterTarget;
  allowedColors: StreamColor[];
  allowedShapes: StreamShape[];
  allowedValueKinds: StreamValueKind[];
};

export type SkipOperatorConfig = {
  count: number;
};

export type MapPipelineOperator = {
  id: string;
  type: "map";
  config: MapOperatorConfig;
};

export type FilterPipelineOperator = {
  id: string;
  type: "filter";
  config: FilterOperatorConfig;
};

export type SkipPipelineOperator = {
  id: string;
  type: "skip";
  config: SkipOperatorConfig;
};

export type PipelineOperator =
  | MapPipelineOperator
  | FilterPipelineOperator
  | SkipPipelineOperator;

export type PipelineEditorMode = "editable" | "readonly";
