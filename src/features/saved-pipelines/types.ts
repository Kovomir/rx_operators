import type { PipelineOperator } from "@/features/pipeline-editor";

export const SAVED_PLAYGROUND_STATE_VERSION = 1;
export const SAVED_PIPELINE_LIMIT = 10;

export type SavedPlaygroundState = {
  version: typeof SAVED_PLAYGROUND_STATE_VERSION;
  operators: PipelineOperator[];
};

export type SavedPipeline = {
  id: string;
  name: string;
  playgroundState: SavedPlaygroundState;
  createdAt: string;
  updatedAt: string;
};

export type SavePipelineResult =
  | { ok: true; pipeline: SavedPipeline }
  | { ok: false; message: string };
