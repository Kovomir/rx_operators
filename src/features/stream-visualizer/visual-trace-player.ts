import type { PipelineTraceEvent } from "@/lib/rx/pipeline-trace";
import { MAIN_STREAM_ID, type StreamId } from "@/lib/rx/stream-identity";

import {
  DEMO_VISUAL_VALUE_START_GAP_MS,
  DROP_DURATION_MS,
  LIVE_VISUAL_VALUE_START_GAP_MS,
  MAP_PULSE_MS,
  MOVE_DURATION_MS,
  OPERATOR_PAUSE_MS,
} from "./constants";
import {
  SOURCE_STAGE_ID,
  SUBSCRIBER_STAGE_ID,
} from "./pipeline-layout";
import { getStreamY } from "./stream-layout";
import type {
  LiveVisualValue,
  StagePosition,
  StreamLane,
} from "./types";
import { reserveVisualWindow } from "./visual-scheduling";

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

type VisualTracePlayerArgs = {
  playbackSpeed: number;
  runId: number;
  stagePositionById: Map<string, StagePosition>;
  streamLanes: StreamLane[];
};

type VisualTracePlayerState = {
  nextStartClockByStream: Map<string, number>;
  streamIdByValue: Map<string, StreamId>;
  visualClockByValue: Map<string, number>;
};

const SOURCE_APPEAR_DURATION_MS = 280;
const PASS_RESET_DURATION_MS = 240;
const REMOVE_DROPPED_VALUE_DELAY_MS = 360;

export function createVisualTracePlayer({
  playbackSpeed,
  runId,
  stagePositionById,
  streamLanes,
}: VisualTracePlayerArgs) {
  const state: VisualTracePlayerState = {
    nextStartClockByStream: new Map(),
    streamIdByValue: new Map(),
    visualClockByValue: new Map(),
  };

  return {
    play(event: PipelineTraceEvent, elapsedMs: number): VisualTracePlayerAction[] {
      return playTraceEvent({
        elapsedMs,
        event,
        playbackSpeed,
        runId,
        stagePositionById,
        state,
        streamLanes,
      });
    },
    removeValue(valueId: string) {
      state.visualClockByValue.delete(valueId);
      state.streamIdByValue.delete(valueId);
    },
  };
}

type PlayTraceEventArgs = {
  elapsedMs: number;
  event: PipelineTraceEvent;
  playbackSpeed: number;
  runId: number;
  stagePositionById: Map<string, StagePosition>;
  state: VisualTracePlayerState;
  streamLanes: StreamLane[];
};

function playTraceEvent({
  elapsedMs,
  event,
  playbackSpeed,
  runId,
  stagePositionById,
  state,
  streamLanes,
}: PlayTraceEventArgs): VisualTracePlayerAction[] {
  switch (event.type) {
    case "source-next": {
      const sourcePosition = stagePositionById.get(SOURCE_STAGE_ID);

      if (!sourcePosition) {
        return [];
      }

      const transitionDurationMs = scaleDuration(
        SOURCE_APPEAR_DURATION_MS,
        playbackSpeed
      );
      const streamStartGapMs = scaleDuration(
        getVisualStartGapMs(event.source),
        playbackSpeed
      );
      const { delayMs } = reserveVisualWindow(
        state.nextStartClockByStream,
        getSourceClockId(event.streamId, event.source),
        streamStartGapMs,
        elapsedMs
      );
      const startAtMs = elapsedMs + delayMs;
      const y = getStreamY(streamLanes, event.streamId);

      state.streamIdByValue.set(event.value.id, event.streamId);
      state.visualClockByValue.set(
        event.value.id,
        startAtMs + transitionDurationMs
      );

      return [
        {
          type: "upsert-value",
          atMs: startAtMs,
          value: {
            id: event.value.id,
            animationKey: `${runId}:${event.value.id}`,
            streamId: event.streamId,
            streamValue: event.value,
            displayValue: event.value.value,
            status: "moving",
            x: sourcePosition.x,
            y,
            opacity: 1,
            scale: 1,
            transitionDurationMs,
          },
        },
      ];
    }
    case "operator-enter": {
      const operatorPosition = stagePositionById.get(event.stageId);

      if (!operatorPosition) {
        return [];
      }

      const transitionDurationMs = scaleDuration(MOVE_DURATION_MS, playbackSpeed);
      const startAtMs = reserveValueVisualTime(
        state,
        event.value.id,
        transitionDurationMs,
        elapsedMs
      );

      state.streamIdByValue.set(event.value.id, event.streamId);

      return [
        {
          type: "update-value",
          atMs: startAtMs,
          valueId: event.value.id,
          update: {
            displayValue: event.value.value,
            status: "moving",
            x: operatorPosition.x,
            y: getValueStreamY(state, streamLanes, event.value.id),
            opacity: 1,
            scale: 1,
            transitionDurationMs,
          },
        },
      ];
    }
    case "operator-map": {
      const pulseDurationMs = scaleDuration(MAP_PULSE_MS, playbackSpeed);
      const pauseDurationMs = scaleDuration(OPERATOR_PAUSE_MS, playbackSpeed);
      const startAtMs = reserveValueVisualTime(
        state,
        event.after.id,
        pulseDurationMs + pauseDurationMs,
        elapsedMs
      );

      state.streamIdByValue.set(event.after.id, event.streamId);

      return [
        {
          type: "update-value",
          atMs: startAtMs,
          valueId: event.after.id,
          update: {
            streamValue: event.after,
            displayValue: event.after.value,
            status: "mapped",
            scale: 1.16,
            transitionDurationMs: pulseDurationMs,
          },
        },
        {
          type: "update-value",
          atMs: startAtMs + pulseDurationMs,
          valueId: event.after.id,
          update: {
            scale: 1,
            transitionDurationMs: pauseDurationMs,
          },
        },
      ];
    }
    case "operator-pass": {
      const pauseDurationMs = scaleDuration(OPERATOR_PAUSE_MS, playbackSpeed);
      const resetDurationMs = scaleDuration(PASS_RESET_DURATION_MS, playbackSpeed);
      const startAtMs = reserveValueVisualTime(
        state,
        event.value.id,
        pauseDurationMs + resetDurationMs,
        elapsedMs
      );

      state.streamIdByValue.set(event.value.id, event.streamId);

      return [
        {
          type: "update-value",
          atMs: startAtMs,
          valueId: event.value.id,
          update: {
            status: "passed",
            scale: 1.08,
            transitionDurationMs: pauseDurationMs,
          },
        },
        {
          type: "update-value",
          atMs: startAtMs + pauseDurationMs,
          valueId: event.value.id,
          update: {
            scale: 1,
            transitionDurationMs: resetDurationMs,
          },
        },
      ];
    }
    case "operator-drop": {
      const pauseDurationMs = scaleDuration(OPERATOR_PAUSE_MS, playbackSpeed);
      const dropDurationMs = scaleDuration(DROP_DURATION_MS, playbackSpeed);
      const removeDelayMs = scaleDuration(
        REMOVE_DROPPED_VALUE_DELAY_MS,
        playbackSpeed
      );
      const startAtMs = reserveValueVisualTime(
        state,
        event.value.id,
        pauseDurationMs + dropDurationMs,
        elapsedMs
      );

      state.streamIdByValue.set(event.value.id, event.streamId);

      return [
        {
          type: "update-value",
          atMs: startAtMs,
          valueId: event.value.id,
          update: {
            status: "dropped",
            scale: 0.9,
            transitionDurationMs: pauseDurationMs,
          },
        },
        {
          type: "update-value",
          atMs: startAtMs + pauseDurationMs,
          valueId: event.value.id,
          update: {
            opacity: 0,
            scale: 0.75,
            transitionDurationMs: dropDurationMs,
          },
        },
        {
          type: "remove-value",
          atMs: startAtMs + pauseDurationMs + dropDurationMs + removeDelayMs,
          valueId: event.value.id,
        },
      ];
    }
    case "subscriber-next": {
      const subscriberPosition = stagePositionById.get(SUBSCRIBER_STAGE_ID);

      if (!subscriberPosition) {
        return [];
      }

      const moveDurationMs = scaleDuration(MOVE_DURATION_MS, playbackSpeed);
      const pulseDurationMs = scaleDuration(MAP_PULSE_MS, playbackSpeed);
      const pauseDurationMs = scaleDuration(OPERATOR_PAUSE_MS, playbackSpeed);
      const startAtMs = reserveValueVisualTime(
        state,
        event.value.id,
        moveDurationMs + pulseDurationMs + pauseDurationMs,
        elapsedMs
      );

      state.streamIdByValue.set(event.value.id, event.streamId);

      return [
        {
          type: "update-value",
          atMs: startAtMs,
          valueId: event.value.id,
          update: {
            streamValue: event.value,
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
            status: "completed",
            scale: 1.14,
            transitionDurationMs: pulseDurationMs,
          },
        },
        {
          type: "update-value",
          atMs: startAtMs + moveDurationMs + pulseDurationMs,
          valueId: event.value.id,
          update: {
            scale: 1,
            transitionDurationMs: pauseDurationMs,
          },
        },
      ];
    }
  }
}

function reserveValueVisualTime(
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

function getValueStreamY(
  state: VisualTracePlayerState,
  streamLanes: StreamLane[],
  valueId: string
) {
  return getStreamY(
    streamLanes,
    state.streamIdByValue.get(valueId) ?? MAIN_STREAM_ID
  );
}

function scaleDuration(durationMs: number, playbackSpeed: number) {
  return durationMs / playbackSpeed;
}

function getVisualStartGapMs(source: "demo" | "live") {
  return source === "live"
    ? LIVE_VISUAL_VALUE_START_GAP_MS
    : DEMO_VISUAL_VALUE_START_GAP_MS;
}

function getSourceClockId(streamId: StreamId, source: "demo" | "live") {
  return `${streamId}:${source}`;
}
