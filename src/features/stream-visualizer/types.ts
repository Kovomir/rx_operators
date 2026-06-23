import type {
  PipelineOperator,
  StreamColor,
  StreamShape,
} from "@/features/pipeline-editor";

export type StreamValue = {
  id: string;
  shape: StreamShape;
  color: StreamColor;
  value: number;
};

export type PipelineStageKind = "source" | "operator" | "subscriber";

export type PipelineStage = {
  id: string;
  kind: PipelineStageKind;
  label: string;
  expression?: string;
  operator?: PipelineOperator;
};

export type StagePosition = PipelineStage & {
  x: number;
  y: number;
};

export type ValueAnimationStatus =
  | "moving"
  | "mapped"
  | "passed"
  | "dropped"
  | "completed";

export type LiveVisualValue = {
  id: string;
  streamValue: StreamValue;
  displayValue: number;
  status: ValueAnimationStatus;
  x: number;
  y: number;
  opacity: number;
  scale: number;
  transitionDurationMs: number;
};
