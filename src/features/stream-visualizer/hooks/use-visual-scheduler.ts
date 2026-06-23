import { useCallback, useEffect, useRef, useState } from "react";

import type { VisualEvent } from "@/lib/rx/visual-recorder";

import {
  DROP_DURATION_MS,
  LANE_COUNT,
  LANE_GAP,
  MAP_PULSE_MS,
  MOVE_DURATION_MS,
  OPERATOR_PAUSE_MS,
  TRACK_Y,
} from "../constants";
import type { PlaybackSpeed } from "../playback";
import {
  SOURCE_STAGE_ID,
  SUBSCRIBER_STAGE_ID,
} from "../pipeline-layout";
import type { LiveVisualValue, StagePosition } from "../types";

type UseVisualSchedulerArgs = {
  playbackSpeed: PlaybackSpeed;
  stagePositionById: Map<string, StagePosition>;
};

const SOURCE_APPEAR_DURATION_MS = 140;
const PASS_RESET_DURATION_MS = 120;
const REMOVE_DROPPED_VALUE_DELAY_MS = 180;

export function useVisualScheduler({
  playbackSpeed,
  stagePositionById,
}: UseVisualSchedulerArgs) {
  const [visualValues, setVisualValues] = useState<LiveVisualValue[]>([]);
  const scheduledTimeoutsRef = useRef<number[]>([]);
  const visualClockByValueRef = useRef<Map<string, number>>(new Map());
  const laneByValueRef = useRef<Map<string, number>>(new Map());
  const emissionIndexRef = useRef(0);
  const playbackSpeedRef = useRef(playbackSpeed);

  useEffect(() => {
    playbackSpeedRef.current = playbackSpeed;
  }, [playbackSpeed]);

  const clearScheduledTimeouts = useCallback(() => {
    for (const timeoutId of scheduledTimeoutsRef.current) {
      window.clearTimeout(timeoutId);
    }

    scheduledTimeoutsRef.current = [];
  }, []);

  const scheduleTimeout = useCallback(
    (callback: () => void, delayMs: number) => {
      const timeoutId = window.setTimeout(callback, Math.max(0, delayMs));
      scheduledTimeoutsRef.current.push(timeoutId);
    },
    []
  );

  const getScaledDuration = useCallback((durationMs: number) => {
    return durationMs / playbackSpeedRef.current;
  }, []);

  const resetVisualValues = useCallback(() => {
    clearScheduledTimeouts();
    visualClockByValueRef.current.clear();
    laneByValueRef.current.clear();
    emissionIndexRef.current = 0;
    setVisualValues([]);
  }, [clearScheduledTimeouts]);

  const updateVisualValue = useCallback(
    (valueId: string, update: Partial<LiveVisualValue>) => {
      setVisualValues((currentValues) =>
        currentValues.map((visualValue) =>
          visualValue.id === valueId
            ? { ...visualValue, ...update }
            : visualValue
        )
      );
    },
    []
  );

  const removeVisualValue = useCallback((valueId: string) => {
    setVisualValues((currentValues) =>
      currentValues.filter((visualValue) => visualValue.id !== valueId)
    );
    visualClockByValueRef.current.delete(valueId);
    laneByValueRef.current.delete(valueId);
  }, []);

  const reserveVisualTime = useCallback((valueId: string, durationMs: number) => {
    const now = performance.now();
    const currentValueTime = visualClockByValueRef.current.get(valueId) ?? now;
    const startTime = Math.max(now, currentValueTime);

    visualClockByValueRef.current.set(valueId, startTime + durationMs);

    return startTime - now;
  }, []);

  const reserveCompoundVisualTime = useCallback(
    (valueId: string, durationMs: number) => {
      const now = performance.now();
      const currentValueTime = visualClockByValueRef.current.get(valueId) ?? now;
      const startTime = Math.max(now, currentValueTime);

      visualClockByValueRef.current.set(valueId, startTime + durationMs);

      return startTime - now;
    },
    []
  );

  const getValueLaneY = useCallback((valueId: string) => {
    return laneByValueRef.current.get(valueId) ?? TRACK_Y;
  }, []);

  const handleVisualEvent = useCallback(
    (event: VisualEvent) => {
      switch (event.type) {
        case "source-next": {
          const sourcePosition = stagePositionById.get(SOURCE_STAGE_ID);

          if (!sourcePosition) {
            return;
          }

          const transitionDurationMs = getScaledDuration(
            SOURCE_APPEAR_DURATION_MS
          );
          const y = getLaneY(emissionIndexRef.current);
          emissionIndexRef.current += 1;
          laneByValueRef.current.set(event.value.id, y);
          visualClockByValueRef.current.set(
            event.value.id,
            performance.now() + transitionDurationMs
          );

          setVisualValues((currentValues) => [
            ...currentValues.filter(
              (visualValue) => visualValue.id !== event.value.id
            ),
            {
              id: event.value.id,
              streamValue: event.value,
              displayValue: event.value.value,
              status: "moving",
              x: sourcePosition.x,
              y,
              opacity: 1,
              scale: 1,
              transitionDurationMs,
            },
          ]);
          break;
        }
        case "operator-enter": {
          const operatorPosition = stagePositionById.get(event.stageId);

          if (!operatorPosition) {
            return;
          }

          const transitionDurationMs = getScaledDuration(MOVE_DURATION_MS);
          const delayMs = reserveVisualTime(
            event.value.id,
            transitionDurationMs
          );

          scheduleTimeout(() => {
            updateVisualValue(event.value.id, {
              displayValue: event.value.value,
              status: "moving",
              x: operatorPosition.x,
              y: getValueLaneY(event.value.id),
              opacity: 1,
              scale: 1,
              transitionDurationMs,
            });
          }, delayMs);
          break;
        }
        case "operator-map": {
          const pulseDurationMs = getScaledDuration(MAP_PULSE_MS);
          const pauseDurationMs = getScaledDuration(OPERATOR_PAUSE_MS);
          const totalDurationMs = pulseDurationMs + pauseDurationMs;
          const delayMs = reserveCompoundVisualTime(
            event.after.id,
            totalDurationMs
          );

          scheduleTimeout(() => {
            updateVisualValue(event.after.id, {
              streamValue: event.after,
              displayValue: event.after.value,
              status: "mapped",
              scale: 1.16,
              transitionDurationMs: pulseDurationMs,
            });
          }, delayMs);
          scheduleTimeout(() => {
            updateVisualValue(event.after.id, {
              scale: 1,
              transitionDurationMs: pauseDurationMs,
            });
          }, delayMs + pulseDurationMs);
          break;
        }
        case "operator-pass": {
          const pauseDurationMs = getScaledDuration(OPERATOR_PAUSE_MS);
          const resetDurationMs = getScaledDuration(PASS_RESET_DURATION_MS);
          const totalDurationMs = pauseDurationMs + resetDurationMs;
          const delayMs = reserveCompoundVisualTime(
            event.value.id,
            totalDurationMs
          );

          scheduleTimeout(() => {
            updateVisualValue(event.value.id, {
              status: "passed",
              scale: 1.08,
              transitionDurationMs: pauseDurationMs,
            });
          }, delayMs);
          scheduleTimeout(() => {
            updateVisualValue(event.value.id, {
              scale: 1,
              transitionDurationMs: resetDurationMs,
            });
          }, delayMs + pauseDurationMs);
          break;
        }
        case "operator-drop": {
          const pauseDurationMs = getScaledDuration(OPERATOR_PAUSE_MS);
          const dropDurationMs = getScaledDuration(DROP_DURATION_MS);
          const removeDelayMs = getScaledDuration(REMOVE_DROPPED_VALUE_DELAY_MS);
          const totalDurationMs = pauseDurationMs + dropDurationMs;
          const delayMs = reserveCompoundVisualTime(
            event.value.id,
            totalDurationMs
          );

          scheduleTimeout(() => {
            updateVisualValue(event.value.id, {
              status: "dropped",
              scale: 0.9,
              transitionDurationMs: pauseDurationMs,
            });
          }, delayMs);
          scheduleTimeout(() => {
            updateVisualValue(event.value.id, {
              opacity: 0,
              scale: 0.75,
              transitionDurationMs: dropDurationMs,
            });
          }, delayMs + pauseDurationMs);
          scheduleTimeout(() => {
            removeVisualValue(event.value.id);
          }, delayMs + pauseDurationMs + dropDurationMs + removeDelayMs);
          break;
        }
        case "subscriber-next": {
          const subscriberPosition = stagePositionById.get(SUBSCRIBER_STAGE_ID);

          if (!subscriberPosition) {
            return;
          }

          const moveDurationMs = getScaledDuration(MOVE_DURATION_MS);
          const pulseDurationMs = getScaledDuration(MAP_PULSE_MS);
          const pauseDurationMs = getScaledDuration(OPERATOR_PAUSE_MS);
          const totalDurationMs =
            moveDurationMs + pulseDurationMs + pauseDurationMs;
          const delayMs = reserveCompoundVisualTime(
            event.value.id,
            totalDurationMs
          );

          scheduleTimeout(() => {
            updateVisualValue(event.value.id, {
              streamValue: event.value,
              displayValue: event.value.value,
              status: "moving",
              x: subscriberPosition.x,
              y: getValueLaneY(event.value.id),
              opacity: 1,
              scale: 1,
              transitionDurationMs: moveDurationMs,
            });
          }, delayMs);
          scheduleTimeout(() => {
            updateVisualValue(event.value.id, {
              status: "completed",
              scale: 1.14,
              transitionDurationMs: pulseDurationMs,
            });
          }, delayMs + moveDurationMs);
          scheduleTimeout(() => {
            updateVisualValue(event.value.id, {
              scale: 1,
              transitionDurationMs: pauseDurationMs,
            });
          }, delayMs + moveDurationMs + pulseDurationMs);
          break;
        }
      }
    },
    [
      getScaledDuration,
      getValueLaneY,
      removeVisualValue,
      reserveCompoundVisualTime,
      reserveVisualTime,
      scheduleTimeout,
      stagePositionById,
      updateVisualValue,
    ]
  );

  return {
    visualValues,
    clearScheduledTimeouts,
    getScaledDuration,
    handleVisualEvent,
    resetVisualValues,
    scheduleTimeout,
  };
}

function getLaneY(valueIndex: number) {
  const lane = valueIndex % LANE_COUNT;
  const centeredLane = lane - (LANE_COUNT - 1) / 2;
  return TRACK_Y + centeredLane * LANE_GAP;
}
