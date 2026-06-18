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
  operator?: PipelineOperator;
};

export type StagePosition = PipelineStage & {
  x: number;
  y: number;
};

export type ValueAnimationStatus =
  | "queued"
  | "moving"
  | "mapped"
  | "passed"
  | "dropped"
  | "completed";

export type ValueAnimationSegment = {
  at: number;
  durationMs: number;
  x: number;
  y: number;
  opacity: number;
  scale: number;
  value: number;
  status: ValueAnimationStatus;
};

export type ValueAnimation = {
  value: StreamValue;
  segments: ValueAnimationSegment[];
};
