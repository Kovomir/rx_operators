import type { StreamValue } from "@/types/stream";

import { MAIN_STREAM_ID, type StreamId } from "./stream-identity";

export type PipelineTraceEventMetadata = {
  occurredAtMs: number;
  sequence: number;
  streamId: StreamId;
};

export type PipelineTraceSource = "demo" | "live";

export type PipelineTraceEventPayload =
  | {
      type: "source-next";
      source: PipelineTraceSource;
      value: StreamValue;
    }
  | {
      type: "operator-enter";
      stageId: string;
      value: StreamValue;
    }
  | {
      type: "operator-map";
      stageId: string;
      before: StreamValue;
      after: StreamValue;
    }
  | {
      type: "operator-pass";
      stageId: string;
      value: StreamValue;
    }
  | {
      type: "operator-drop";
      stageId: string;
      value: StreamValue;
    }
  | {
      type: "subscriber-next";
      value: StreamValue;
    };

export type PipelineTraceEvent =
  PipelineTraceEventMetadata & PipelineTraceEventPayload;

export type PipelineTraceEventInput = PipelineTraceEventPayload & {
  streamId?: StreamId;
};

export function withPipelineTraceMetadata(
  event: PipelineTraceEventInput,
  sequence: number,
  occurredAtMs: number
): PipelineTraceEvent {
  return {
    ...event,
    occurredAtMs,
    sequence,
    streamId: event.streamId ?? MAIN_STREAM_ID,
  };
}
