export type PipelineOperatorType = "map" | "filter"

export type PipelineOperator = {
  id: string
  type: PipelineOperatorType
}

export type PipelineEditorMode = "editable" | "readonly"
