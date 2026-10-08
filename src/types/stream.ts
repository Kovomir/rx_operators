import type { StreamColor, StreamShape } from "@/features/pipeline-editor";

export type StreamId = string;

export type StreamValue = {
  id: string;
  shape: StreamShape;
  color: StreamColor;
  value: number;
  label?: string;
  timerDurationMs?: number;
  timerFadeDurationMs?: number;
  timerOpacity?: number;
  timerShowCompleteMark?: boolean;
  timerStoppedAtMs?: number;
  emittedAtMs?: number;
};
