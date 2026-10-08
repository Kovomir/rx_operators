import type { PipelineTraceEvent } from "@/lib/rx/pipeline-trace";
import type { StreamId } from "@/lib/rx/stream-identity";

import type {
  LiveVisualValue,
  StagePosition,
  StreamLane,
} from "./types";

export type VisualTracePlayerAction =
  | {
      type: "upsert-value";
      atMs: number;
      value: LiveVisualValue;
    }
  | {
      type: "update-value";
      atMs: number;
      valueId: string;
      update: Partial<LiveVisualValue>;
    }
  | {
      type: "remove-value";
      atMs: number;
      valueId: string;
    };

export type VisualTracePlayerArgs = {
  liveSourceMinStartGapMs?: number;
  playbackSpeed: number;
  runId: number;
  stagePositionById: Map<string, StagePosition>;
  streamLanes: StreamLane[];
};

export type VisualTracePlayerState = {
  delayTimerEndAtMsByValue: Map<string, number>;
  nextSourceStartByStream: Map<string, number>;
  previousValueLaneIndexByStream: Map<StreamId, number>;
  timerStartedAtMsByValue: Map<string, number>;
  valueLaneIndexByValue: Map<string, number>;
  streamIdByValue: Map<string, StreamId>;
  visualClockByValue: Map<string, number>;
};

export type PlayTraceEventArgs = VisualTracePlayerArgs & {
  elapsedMs: number;
  event: PipelineTraceEvent;
  state: VisualTracePlayerState;
};
