import type { PipelineTraceEvent } from "@/lib/rx/pipeline-trace";

import {
  playOperatorCreateEvent,
  playOperatorDropEvent,
  playOperatorMapEvent,
  playOperatorPassEvent,
  playOperatorTapEvent,
} from "./visual-trace-operator-events";
import {
  createVisualTracePlayerState,
  removeVisualTracePlayerValue,
} from "./visual-trace-player-state";
import type {
  PlayTraceEventArgs,
  VisualTracePlayerAction,
  VisualTracePlayerArgs,
} from "./visual-trace-player-types";
import {
  playOperatorEnterEvent,
  playSourceCancelledEvent,
  playSourceErrorEvent,
  playSourceNextEvent,
} from "./visual-trace-source-events";
import { playSubscriberNextEvent } from "./visual-trace-subscriber-events";

export type { VisualTracePlayerAction } from "./visual-trace-player-types";

export function createVisualTracePlayer({
  liveSourceMinStartGapMs,
  playbackSpeed,
  runId,
  stagePositionById,
  streamLanes,
}: VisualTracePlayerArgs) {
  const state = createVisualTracePlayerState();

  return {
    play(event: PipelineTraceEvent, elapsedMs: number): VisualTracePlayerAction[] {
      return playTraceEvent({
        elapsedMs,
        event,
        liveSourceMinStartGapMs,
        playbackSpeed,
        runId,
        stagePositionById,
        state,
        streamLanes,
      });
    },
    removeValue(valueId: string) {
      removeVisualTracePlayerValue(state, valueId);
    },
  };
}

function playTraceEvent(args: PlayTraceEventArgs): VisualTracePlayerAction[] {
  switch (args.event.type) {
    case "source-next":
      return playSourceNextEvent({ ...args, event: args.event });
    case "source-error":
      return playSourceErrorEvent({ ...args, event: args.event });
    case "source-cancelled":
      return playSourceCancelledEvent({ ...args, event: args.event });
    case "operator-enter":
      return playOperatorEnterEvent({ ...args, event: args.event });
    case "operator-create":
      return playOperatorCreateEvent({ ...args, event: args.event });
    case "operator-map":
      return playOperatorMapEvent({ ...args, event: args.event });
    case "operator-pass":
      return playOperatorPassEvent({ ...args, event: args.event });
    case "operator-tap":
      return playOperatorTapEvent({ ...args, event: args.event });
    case "operator-drop":
      return playOperatorDropEvent({ ...args, event: args.event });
    case "subscriber-next":
      return playSubscriberNextEvent({ ...args, event: args.event });
  }
}
