import type {
  PipelineOperator,
} from "@/features/pipeline-editor";
import type { StreamId, StreamValue } from "@/types/stream";

export type { StreamId, StreamValue };

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

export type StreamLane = {
  streamId: StreamId;
  index: number;
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
  animationKey: string;
  streamId: StreamId;
  streamValue: StreamValue;
  displayValue: number;
  status: ValueAnimationStatus;
  x: number;
  y: number;
  opacity: number;
  scale: number;
  transitionDurationMs: number;
};
