import type { StreamColor, StreamShape } from "@/features/pipeline-editor";

export type StreamId = string;

export type StreamValue = {
  id: string;
  shape: StreamShape;
  color: StreamColor;
  value: number;
};
