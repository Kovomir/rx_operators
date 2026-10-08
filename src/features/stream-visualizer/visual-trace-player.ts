import type { PipelineTraceEvent } from "@/lib/rx/pipeline-trace";
import { MAIN_STREAM_ID, type StreamId } from "@/lib/rx/stream-identity";

import {
  DEMO_VISUAL_VALUE_MIN_START_GAP_MS,
  DROP_DURATION_MS,
  LIVE_VISUAL_VALUE_MIN_START_GAP_MS,
  MAP_PULSE_MS,
  MOVE_DURATION_MS,
  OPERATOR_PAUSE_MS,
} from "./constants";
import {
  SOURCE_STAGE_ID,
  SUBSCRIBER_STAGE_ID,
} from "./pipeline-layout";
import { getStreamValueY } from "./stream-layout";
import type {
  LiveVisualValue,
  StagePosition,
  StreamLane,
  StreamValue,
} from "./types";
import {
  reserveOrderedVisualStart,
  reserveVisualWindow,
} from "./visual-scheduling";

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
  liveSourceMinStartGapMs?: number;
  playbackSpeed: number;
  runId: number;
  stagePositionById: Map<string, StagePosition>;
  streamLanes: StreamLane[];
};

type VisualTracePlayerState = {
  delayTimerEndAtMsByValue: Map<string, number>;
  nextSourceStartByStream: Map<string, number>;
  previousValueLaneIndexByStream: Map<StreamId, number>;
  timerStartedAtMsByValue: Map<string, number>;
  valueLaneIndexByValue: Map<string, number>;
  streamIdByValue: Map<string, StreamId>;
  visualClockByValue: Map<string, number>;
};

const SOURCE_APPEAR_DURATION_MS = 500;
const PASS_RESET_DURATION_MS = 435;
const REMOVE_DROPPED_VALUE_DELAY_MS = 645;

export function createVisualTracePlayer({
  liveSourceMinStartGapMs,
  playbackSpeed,
  runId,
  stagePositionById,
  streamLanes,
}: VisualTracePlayerArgs) {
  const state: VisualTracePlayerState = {
    delayTimerEndAtMsByValue: new Map(),
    nextSourceStartByStream: new Map(),
    previousValueLaneIndexByStream: new Map(),
    timerStartedAtMsByValue: new Map(),
    valueLaneIndexByValue: new Map(),
    streamIdByValue: new Map(),
    visualClockByValue: new Map(),
  };

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
      state.delayTimerEndAtMsByValue.delete(valueId);
      state.timerStartedAtMsByValue.delete(valueId);
      state.visualClockByValue.delete(valueId);
      state.streamIdByValue.delete(valueId);
      state.valueLaneIndexByValue.delete(valueId);
    },
  };
}

type PlayTraceEventArgs = {
  elapsedMs: number;
  event: PipelineTraceEvent;
  liveSourceMinStartGapMs?: number;
  playbackSpeed: number;
  runId: number;
  stagePositionById: Map<string, StagePosition>;
  state: VisualTracePlayerState;
  streamLanes: StreamLane[];
};

function playTraceEvent({
  elapsedMs,
  event,
  liveSourceMinStartGapMs,
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
      const minStartGapMs = scaleDuration(
        getVisualMinStartGapMs(event.source, liveSourceMinStartGapMs),
        playbackSpeed
      );
      const { delayMs } = reserveOrderedVisualStart(
        state.nextSourceStartByStream,
        getSourceClockId(event.streamId, event.source),
        minStartGapMs,
        elapsedMs
      );
      const startAtMs = elapsedMs + delayMs;
      const valueLaneIndex = pickValueLaneIndex(state, event.streamId);
      const y = getStreamValueY(streamLanes, event.streamId, valueLaneIndex);

      state.streamIdByValue.set(event.value.id, event.streamId);
      state.valueLaneIndexByValue.set(event.value.id, valueLaneIndex);
      if (event.value.timerDurationMs !== undefined) {
        state.timerStartedAtMsByValue.set(event.value.id, event.occurredAtMs);
      }

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
      const delayDurationMs =
        operatorPosition.operator?.type === "delay"
          ? operatorPosition.operator.config.durationMs
          : undefined;
      const delayTimerStartAtMs = startAtMs + transitionDurationMs;

      state.streamIdByValue.set(event.value.id, event.streamId);
      if (delayDurationMs !== undefined) {
        state.delayTimerEndAtMsByValue.set(
          event.value.id,
          delayTimerStartAtMs + delayDurationMs
        );
      }

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
        ...(delayDurationMs === undefined
          ? []
          : [
              {
                type: "update-value" as const,
                atMs: delayTimerStartAtMs,
                valueId: event.value.id,
                update: {
                  streamValue: {
                    ...event.value,
                    timerDurationMs: delayDurationMs,
                    timerFadeDurationMs: scaleDuration(
                      MAP_PULSE_MS,
                      playbackSpeed
                    ),
                    timerShowCompleteMark: false,
                  },
                },
              },
            ]),
      ];
    }
    case "operator-create": {
      const operatorPosition = stagePositionById.get(event.stageId);

      if (!operatorPosition) {
        return [];
      }

      const transitionDurationMs = scaleDuration(
        SOURCE_APPEAR_DURATION_MS,
        playbackSpeed
      );
      const startAtMs = reserveValueVisualTime(
        state,
        event.value.id,
        transitionDurationMs,
        elapsedMs
      );
      const valueLaneIndex = pickValueLaneIndex(state, event.streamId);
      const y = getStreamValueY(streamLanes, event.streamId, valueLaneIndex);

      state.streamIdByValue.set(event.value.id, event.streamId);
      state.valueLaneIndexByValue.set(event.value.id, valueLaneIndex);

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
            status: "passed",
            x: operatorPosition.x,
            y,
            opacity: 1,
            scale: 1.08,
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
      state.valueLaneIndexByValue.set(
        event.after.id,
        getValueLaneIndex(state, event.before.id)
      );

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
      const timerFadeDurationMs = scaleDuration(MAP_PULSE_MS, playbackSpeed);
      const operator = stagePositionById.get(event.stageId)?.operator;
      const delayDurationMs =
        operator?.type === "delay" ? operator.config.durationMs : undefined;
      const isDelayOperator = delayDurationMs !== undefined;
      const earliestStartAtMs = isDelayOperator
        ? Math.max(
            elapsedMs,
            state.delayTimerEndAtMsByValue.get(event.value.id) ?? elapsedMs
          ) + timerFadeDurationMs
        : elapsedMs;
      const startAtMs = reserveValueVisualTime(
        state,
        event.value.id,
        pauseDurationMs + resetDurationMs,
        earliestStartAtMs
      );

      state.streamIdByValue.set(event.value.id, event.streamId);

      return [
        ...(isDelayOperator
          ? [
              {
                type: "update-value" as const,
                atMs: earliestStartAtMs - timerFadeDurationMs,
                valueId: event.value.id,
                update: {
                  streamValue: {
                    ...event.value,
                    timerDurationMs: delayDurationMs,
                    timerFadeDurationMs,
                    timerOpacity: 0,
                    timerShowCompleteMark: false,
                    timerStoppedAtMs: delayDurationMs,
                  },
                },
              },
            ]
          : []),
        ...(!isDelayOperator
          ? getTimerFadeActions({
              atMs: startAtMs,
              playbackSpeed,
              value: event.value,
            })
          : []),
        {
          type: "update-value",
          atMs: startAtMs,
          valueId: event.value.id,
          update: {
            ...(isDelayOperator ? { streamValue: event.value } : {}),
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
    case "operator-tap": {
      const pulseDurationMs = scaleDuration(MAP_PULSE_MS, playbackSpeed);
      const pauseDurationMs = scaleDuration(OPERATOR_PAUSE_MS, playbackSpeed);
      const startAtMs = reserveValueVisualTime(
        state,
        event.value.id,
        pulseDurationMs + pauseDurationMs,
        elapsedMs
      );

      state.streamIdByValue.set(event.value.id, event.streamId);

      return [
        {
          type: "update-value",
          atMs: startAtMs,
          valueId: event.value.id,
          update: {
            status: "tapped",
            scale: 1.2,
            transitionDurationMs: pulseDurationMs,
          },
        },
        {
          type: "update-value",
          atMs: startAtMs + pulseDurationMs,
          valueId: event.value.id,
          update: {
            scale: 1,
            transitionDurationMs: pauseDurationMs,
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
      const timerStoppedAtMs = getTimerStoppedAtMs(
        state,
        event.value.id,
        event.occurredAtMs
      );

      state.streamIdByValue.set(event.value.id, event.streamId);

      return [
        ...(timerStoppedAtMs === undefined
          ? []
          : [
              {
                type: "update-value" as const,
                atMs: elapsedMs,
                valueId: event.value.id,
                update: {
                  streamValue: {
                    ...event.value,
                    timerStoppedAtMs,
                  },
                },
              },
            ]),
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

function getTimerFadeActions({
  atMs,
  playbackSpeed,
  value,
}: {
  atMs: number;
  playbackSpeed: number;
  value: StreamValue;
}): VisualTracePlayerAction[] {
  if (value.timerDurationMs === undefined) {
    return [];
  }

  const timerFadeDurationMs = scaleDuration(MAP_PULSE_MS, playbackSpeed);

  return [
    {
      type: "update-value",
      atMs,
      valueId: value.id,
      update: {
        streamValue: {
          ...value,
          timerFadeDurationMs,
          timerOpacity: 0,
          timerStoppedAtMs: value.timerDurationMs,
        },
      },
    },
  ];
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
  return getStreamValueY(
    streamLanes,
    state.streamIdByValue.get(valueId) ?? MAIN_STREAM_ID,
    getValueLaneIndex(state, valueId)
  );
}

function scaleDuration(durationMs: number, playbackSpeed: number) {
  return durationMs / playbackSpeed;
}

function pickValueLaneIndex(
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

function getValueLaneIndex(state: VisualTracePlayerState, valueId: string) {
  return state.valueLaneIndexByValue.get(valueId) ?? 1;
}

function getTimerStoppedAtMs(
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

function getVisualMinStartGapMs(
  source: "demo" | "live",
  liveSourceMinStartGapMs?: number
) {
  return source === "live"
    ? liveSourceMinStartGapMs ?? LIVE_VISUAL_VALUE_MIN_START_GAP_MS
    : DEMO_VISUAL_VALUE_MIN_START_GAP_MS;
}

function getSourceClockId(streamId: StreamId, source: "demo" | "live") {
  return `${streamId}:${source}`;
}
