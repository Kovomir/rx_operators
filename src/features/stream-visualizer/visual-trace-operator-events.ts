import type { PipelineTraceEvent } from "@/lib/rx/pipeline-trace";

import {
  DROP_DURATION_MS,
  MAP_PULSE_MS,
  OPERATOR_PAUSE_MS,
} from "./constants";
import type { StagePosition, StreamLane, StreamValue } from "./types";
import {
  getTimerStoppedAtMs,
  getValueLaneIndex,
  getValueStreamY,
  pickValueLaneIndex,
  reserveValueVisualTime,
  scaleDuration,
} from "./visual-trace-player-state";
import type {
  VisualTracePlayerAction,
  VisualTracePlayerState,
} from "./visual-trace-player-types";

const SOURCE_APPEAR_DURATION_MS = 500;
const PASS_RESET_DURATION_MS = 435;
const REMOVE_DROPPED_VALUE_DELAY_MS = 645;

type OperatorCreateEvent = Extract<PipelineTraceEvent, { type: "operator-create" }>;
type OperatorMapEvent = Extract<PipelineTraceEvent, { type: "operator-map" }>;
type OperatorPassEvent = Extract<PipelineTraceEvent, { type: "operator-pass" }>;
type OperatorTapEvent = Extract<PipelineTraceEvent, { type: "operator-tap" }>;
type OperatorDropEvent = Extract<PipelineTraceEvent, { type: "operator-drop" }>;

export function playOperatorCreateEvent({
  elapsedMs,
  event,
  playbackSpeed,
  runId,
  stagePositionById,
  state,
  streamLanes,
}: {
  elapsedMs: number;
  event: OperatorCreateEvent;
  playbackSpeed: number;
  runId: number;
  stagePositionById: Map<string, StagePosition>;
  state: VisualTracePlayerState;
  streamLanes: StreamLane[];
}): VisualTracePlayerAction[] {
  const operatorPosition = stagePositionById.get(event.stageId);

  if (!operatorPosition) {
    return [];
  }

  const transitionDurationMs = scaleDuration(
    SOURCE_APPEAR_DURATION_MS,
    playbackSpeed
  );
  const sourceValueId = event.sourceValue?.id;
  const reservedValueId = sourceValueId ?? event.value.id;
  const startAtMs = reserveValueVisualTime(
    state,
    reservedValueId,
    transitionDurationMs,
    elapsedMs
  );
  const valueLaneIndex = sourceValueId
    ? getValueLaneIndex(state, sourceValueId)
    : pickValueLaneIndex(state, event.streamId);

  state.streamIdByValue.set(event.value.id, event.streamId);
  state.valueLaneIndexByValue.set(event.value.id, valueLaneIndex);
  state.visualClockByValue.set(
    event.value.id,
    Math.max(
      state.visualClockByValue.get(event.value.id) ?? elapsedMs,
      state.visualClockByValue.get(reservedValueId) ?? startAtMs
    )
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
        status: "passed",
        x: operatorPosition.x,
        y: getValueStreamY(state, streamLanes, event.value.id),
        opacity: 1,
        scale: 1.08,
        transitionDurationMs,
      },
    },
  ];
}

export function playOperatorMapEvent({
  elapsedMs,
  event,
  playbackSpeed,
  state,
}: {
  elapsedMs: number;
  event: OperatorMapEvent;
  playbackSpeed: number;
  state: VisualTracePlayerState;
}): VisualTracePlayerAction[] {
  const pulseDurationMs = scaleDuration(MAP_PULSE_MS, playbackSpeed);
  const pauseDurationMs = scaleDuration(OPERATOR_PAUSE_MS, playbackSpeed);
  const visualValueId = state.visualClockByValue.has(event.after.id)
    ? event.after.id
    : event.before.id;
  const startAtMs = reserveValueVisualTime(
    state,
    visualValueId,
    pulseDurationMs + pauseDurationMs,
    elapsedMs
  );

  state.streamIdByValue.set(event.after.id, event.streamId);
  state.valueLaneIndexByValue.set(
    event.after.id,
    getValueLaneIndex(state, event.before.id)
  );
  state.visualClockByValue.set(
    event.after.id,
    state.visualClockByValue.get(visualValueId) ?? startAtMs
  );

  return [
    {
      type: "update-value",
      atMs: startAtMs,
      valueId: visualValueId,
      update: {
        id: event.after.id,
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

export function playOperatorPassEvent({
  elapsedMs,
  event,
  playbackSpeed,
  stagePositionById,
  state,
}: {
  elapsedMs: number;
  event: OperatorPassEvent;
  playbackSpeed: number;
  stagePositionById: Map<string, StagePosition>;
  state: VisualTracePlayerState;
}): VisualTracePlayerAction[] {
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
              state,
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

export function playOperatorTapEvent({
  elapsedMs,
  event,
  playbackSpeed,
  state,
}: {
  elapsedMs: number;
  event: OperatorTapEvent;
  playbackSpeed: number;
  state: VisualTracePlayerState;
}): VisualTracePlayerAction[] {
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

export function playOperatorDropEvent({
  elapsedMs,
  event,
  playbackSpeed,
  state,
}: {
  elapsedMs: number;
  event: OperatorDropEvent;
  playbackSpeed: number;
  state: VisualTracePlayerState;
}): VisualTracePlayerAction[] {
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

function getTimerFadeActions({
  atMs,
  playbackSpeed,
  state,
  value,
}: {
  atMs: number;
  playbackSpeed: number;
  state: VisualTracePlayerState;
  value: StreamValue;
}): VisualTracePlayerAction[] {
  if (value.timerDurationMs === undefined) {
    return [];
  }

  const timerFadeDurationMs = scaleDuration(MAP_PULSE_MS, playbackSpeed);
  const hiddenTimerValue = {
    ...value,
    timerFadeDurationMs,
    timerOpacity: 0,
    timerStoppedAtMs: value.timerDurationMs,
  };

  state.hiddenTimerByValue.set(value.id, hiddenTimerValue);

  return [
    {
      type: "update-value",
      atMs,
      valueId: value.id,
      update: {
        streamValue: hiddenTimerValue,
      },
    },
  ];
}
