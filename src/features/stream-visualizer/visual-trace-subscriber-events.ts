import type { PipelineTraceEvent } from "@/lib/rx/pipeline-trace";

import {
  MOVE_DURATION_MS,
  SUBSCRIBER_RECEIVE_DURATION_MS,
} from "./constants";
import { SUBSCRIBER_STAGE_ID } from "./pipeline-layout";
import type { StagePosition, StreamLane } from "./types";
import {
  getValueStreamY,
  reserveValueVisualTime,
  scaleDuration,
} from "./visual-trace-player-state";
import type {
  VisualTracePlayerAction,
  VisualTracePlayerState,
} from "./visual-trace-player-types";

type SubscriberNextEvent = Extract<PipelineTraceEvent, { type: "subscriber-next" }>;

export function playSubscriberNextEvent({
  elapsedMs,
  event,
  playbackSpeed,
  stagePositionById,
  state,
  streamLanes,
}: {
  elapsedMs: number;
  event: SubscriberNextEvent;
  playbackSpeed: number;
  stagePositionById: Map<string, StagePosition>;
  state: VisualTracePlayerState;
  streamLanes: StreamLane[];
}): VisualTracePlayerAction[] {
  const subscriberPosition = stagePositionById.get(SUBSCRIBER_STAGE_ID);

  if (!subscriberPosition) {
    return [];
  }

  const moveDurationMs = scaleDuration(MOVE_DURATION_MS, playbackSpeed);
  const receiveDurationMs = scaleDuration(
    SUBSCRIBER_RECEIVE_DURATION_MS,
    playbackSpeed
  );
  const startAtMs = reserveValueVisualTime(
    state,
    event.value.id,
    moveDurationMs,
    elapsedMs
  );

  state.streamIdByValue.set(event.value.id, event.streamId);
  const streamValue =
    state.hiddenTimerByValue.get(event.value.id) ?? event.value;

  return [
    {
      type: "update-value",
      atMs: startAtMs,
      valueId: event.value.id,
      update: {
        streamValue,
        displayValue: event.value.value,
        status: "moving",
        x: subscriberPosition.x,
        y: getValueStreamY(state, streamLanes, event.value.id),
        opacity: 1,
        scale: 1,
        transitionDurationMs: moveDurationMs,
      },
    },
    {
      type: "update-value",
      atMs: startAtMs + moveDurationMs,
      valueId: event.value.id,
      update: {
        opacity: 0,
        scale: 1.3,
        transitionDurationMs: receiveDurationMs,
      },
    },
    {
      type: "remove-value",
      atMs: startAtMs + moveDurationMs + receiveDurationMs,
      valueId: event.value.id,
    },
  ];
}
