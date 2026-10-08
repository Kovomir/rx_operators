import type { PipelineTraceEvent } from "@/lib/rx/pipeline-trace";

import {
  MAP_PULSE_MS,
  MOVE_DURATION_MS,
} from "./constants";
import {
  SOURCE_STAGE_ID,
} from "./pipeline-layout";
import { getStreamValueY } from "./stream-layout";
import type { StagePosition, StreamLane } from "./types";
import { reserveOrderedVisualStart } from "./visual-scheduling";
import {
  getSourceClockId,
  getValueStreamY,
  getVisualMinStartGapMs,
  pickValueLaneIndex,
  reserveValueVisualTime,
  scaleDuration,
} from "./visual-trace-player-state";
import type {
  VisualTracePlayerAction,
  VisualTracePlayerState,
} from "./visual-trace-player-types";

const SOURCE_APPEAR_DURATION_MS = 500;

type SourceNextEvent = Extract<PipelineTraceEvent, { type: "source-next" }>;
type OperatorEnterEvent = Extract<PipelineTraceEvent, { type: "operator-enter" }>;

export function playSourceNextEvent({
  elapsedMs,
  event,
  liveSourceMinStartGapMs,
  playbackSpeed,
  runId,
  stagePositionById,
  state,
  streamLanes,
}: {
  elapsedMs: number;
  event: SourceNextEvent;
  liveSourceMinStartGapMs?: number;
  playbackSpeed: number;
  runId: number;
  stagePositionById: Map<string, StagePosition>;
  state: VisualTracePlayerState;
  streamLanes: StreamLane[];
}): VisualTracePlayerAction[] {
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

export function playOperatorEnterEvent({
  elapsedMs,
  event,
  playbackSpeed,
  stagePositionById,
  state,
  streamLanes,
}: {
  elapsedMs: number;
  event: OperatorEnterEvent;
  playbackSpeed: number;
  stagePositionById: Map<string, StagePosition>;
  state: VisualTracePlayerState;
  streamLanes: StreamLane[];
}): VisualTracePlayerAction[] {
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
