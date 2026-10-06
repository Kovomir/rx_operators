import {
  STREAM_LANE_GAP,
  STREAM_VALUE_LANE_OFFSET_Y,
  TRACK_Y,
} from "./constants";
import { MAIN_STREAM_ID, type StreamId } from "@/lib/rx/stream-identity";
import type { StreamLane } from "./types";

const STREAM_VALUE_LANE_OFFSETS = [-1, 0, 1] as const;

export function buildStreamLanes(
  streamIds: StreamId[] = [MAIN_STREAM_ID]
): StreamLane[] {
  const centeredOffset = (streamIds.length - 1) / 2;

  return streamIds.map((streamId, index) => ({
    streamId,
    index,
    y: TRACK_Y + (index - centeredOffset) * STREAM_LANE_GAP,
  }));
}

export function getStreamY(
  streamLanes: StreamLane[],
  streamId: StreamId
): number {
  return (
    streamLanes.find((streamLane) => streamLane.streamId === streamId)?.y ??
    TRACK_Y
  );
}

export function getStreamValueY(
  streamLanes: StreamLane[],
  streamId: StreamId,
  valueLaneIndex: number
): number {
  const laneOffset =
    STREAM_VALUE_LANE_OFFSETS[
      Math.abs(valueLaneIndex) % STREAM_VALUE_LANE_OFFSETS.length
    ];

  return getStreamY(streamLanes, streamId) + laneOffset * STREAM_VALUE_LANE_OFFSET_Y;
}
