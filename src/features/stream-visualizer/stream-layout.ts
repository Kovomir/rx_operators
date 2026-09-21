import { STREAM_LANE_GAP, TRACK_Y } from "./constants";
import { MAIN_STREAM_ID, type StreamId } from "@/lib/rx/stream-identity";
import type { StreamLane } from "./types";

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
