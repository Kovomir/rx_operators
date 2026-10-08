import { MAIN_STREAM_ID, type StreamId } from "@/lib/rx/stream-identity";

import {
  DEMO_VISUAL_VALUE_MIN_START_GAP_MS,
  LIVE_VISUAL_VALUE_MIN_START_GAP_MS,
} from "./constants";
import { getStreamValueY as getStreamValueLaneY } from "./stream-layout";
import type { StreamLane } from "./types";
import {
  reserveVisualWindow,
} from "./visual-scheduling";
import type { VisualTracePlayerState } from "./visual-trace-player-types";

export function createVisualTracePlayerState(): VisualTracePlayerState {
  return {
    delayTimerEndAtMsByValue: new Map(),
    nextSourceStartByStream: new Map(),
    previousValueLaneIndexByStream: new Map(),
    timerStartedAtMsByValue: new Map(),
    valueLaneIndexByValue: new Map(),
    streamIdByValue: new Map(),
    visualClockByValue: new Map(),
  };
}

export function removeVisualTracePlayerValue(
  state: VisualTracePlayerState,
  valueId: string
) {
  state.delayTimerEndAtMsByValue.delete(valueId);
  state.timerStartedAtMsByValue.delete(valueId);
  state.visualClockByValue.delete(valueId);
  state.streamIdByValue.delete(valueId);
  state.valueLaneIndexByValue.delete(valueId);
}

export function reserveValueVisualTime(
  state: VisualTracePlayerState,
  valueId: string,
  durationMs: number,
  elapsedMs: number
) {
  return (
    elapsedMs +
    reserveVisualWindow(
      state.visualClockByValue,
      valueId,
      durationMs,
      elapsedMs
    ).delayMs
  );
}

export function getValueStreamY(
  state: VisualTracePlayerState,
  streamLanes: StreamLane[],
  valueId: string
) {
  return getStreamValueLaneY(
    streamLanes,
    state.streamIdByValue.get(valueId) ?? MAIN_STREAM_ID,
    getValueLaneIndex(state, valueId)
  );
}

export function scaleDuration(durationMs: number, playbackSpeed: number) {
  return durationMs / playbackSpeed;
}

export function pickValueLaneIndex(
  state: VisualTracePlayerState,
  streamId: StreamId
) {
  const previousValueLaneIndex =
    state.previousValueLaneIndexByStream.get(streamId);
  const availableLaneIndexes = [0, 1, 2].filter(
    (valueLaneIndex) => valueLaneIndex !== previousValueLaneIndex
  );
  const valueLaneIndex =
    availableLaneIndexes[
      Math.floor(Math.random() * availableLaneIndexes.length)
    ];

  state.previousValueLaneIndexByStream.set(streamId, valueLaneIndex);

  return valueLaneIndex;
}

export function getValueLaneIndex(
  state: VisualTracePlayerState,
  valueId: string
) {
  return state.valueLaneIndexByValue.get(valueId) ?? 1;
}

export function getTimerStoppedAtMs(
  state: VisualTracePlayerState,
  valueId: string,
  stoppedAtMs: number
) {
  const startedAtMs = state.timerStartedAtMsByValue.get(valueId);

  if (startedAtMs === undefined) {
    return undefined;
  }

  return Math.max(0, stoppedAtMs - startedAtMs);
}

export function getVisualMinStartGapMs(
  source: "demo" | "live",
  liveSourceMinStartGapMs?: number
) {
  return source === "live"
    ? liveSourceMinStartGapMs ?? LIVE_VISUAL_VALUE_MIN_START_GAP_MS
    : DEMO_VISUAL_VALUE_MIN_START_GAP_MS;
}

export function getSourceClockId(streamId: StreamId, source: "demo" | "live") {
  return `${streamId}:${source}`;
}
