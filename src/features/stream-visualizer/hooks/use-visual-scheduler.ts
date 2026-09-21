import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";

import type { PipelineTraceEvent } from "@/lib/rx/pipeline-trace";

import type { PlaybackSpeed } from "../playback";
import type { LiveVisualValue, StagePosition, StreamLane } from "../types";
import {
  createVisualTracePlayer,
  type VisualTracePlayerAction,
} from "../visual-trace-player";

type UseVisualSchedulerArgs = {
  playbackSpeed: PlaybackSpeed;
  stagePositionById: Map<string, StagePosition>;
  streamLanes: StreamLane[];
};

export function useVisualScheduler({
  playbackSpeed,
  stagePositionById,
  streamLanes,
}: UseVisualSchedulerArgs) {
  const [visualValues, setVisualValues] = useState<LiveVisualValue[]>([]);
  const scheduledTimeoutsRef = useRef<number[]>([]);
  const runIdRef = useRef(0);
  const runStartedAtMsRef = useRef(getAnimationNowMs());
  const playerRef = useRef<ReturnType<typeof createVisualTracePlayer> | null>(
    null
  );

  const clearScheduledTimeouts = useCallback(() => {
    for (const timeoutId of scheduledTimeoutsRef.current) {
      window.clearTimeout(timeoutId);
    }

    scheduledTimeoutsRef.current = [];
  }, []);

  const createPlayer = useCallback(
    () =>
      createVisualTracePlayer({
        playbackSpeed,
        runId: runIdRef.current,
        stagePositionById,
        streamLanes,
      }),
    [playbackSpeed, stagePositionById, streamLanes]
  );

  useEffect(() => {
    playerRef.current = createPlayer();
    runStartedAtMsRef.current = getAnimationNowMs();
  }, [createPlayer]);

  const resetVisualValues = useCallback(() => {
    clearScheduledTimeouts();
    runIdRef.current += 1;
    runStartedAtMsRef.current = getAnimationNowMs();
    playerRef.current = createPlayer();
    setVisualValues([]);
  }, [clearScheduledTimeouts, createPlayer]);

  const scheduleAction = useCallback((action: VisualTracePlayerAction) => {
    const elapsedMs = getAnimationNowMs() - runStartedAtMsRef.current;
    const delayMs = Math.max(0, action.atMs - elapsedMs);
    const timeoutId = window.setTimeout(() => {
      applyVisualAction(action, setVisualValues);

      if (action.type === "remove-value") {
        playerRef.current?.removeValue(action.valueId);
      }
    }, delayMs);

    scheduledTimeoutsRef.current.push(timeoutId);
  }, []);

  const handleTraceEvent = useCallback(
    (event: PipelineTraceEvent) => {
      if (!playerRef.current) {
        playerRef.current = createPlayer();
        runStartedAtMsRef.current = getAnimationNowMs();
      }

      const elapsedMs = getAnimationNowMs() - runStartedAtMsRef.current;
      const actions = playerRef.current.play(event, elapsedMs);

      for (const action of actions) {
        scheduleAction(action);
      }
    },
    [createPlayer, scheduleAction]
  );

  return {
    visualValues,
    clearScheduledTimeouts,
    handleTraceEvent,
    resetVisualValues,
  };
}

function applyVisualAction(
  action: VisualTracePlayerAction,
  setVisualValues: Dispatch<SetStateAction<LiveVisualValue[]>>
) {
  switch (action.type) {
    case "upsert-value":
      setVisualValues((currentValues) => [
        ...currentValues.filter(
          (visualValue) => visualValue.id !== action.value.id
        ),
        action.value,
      ]);
      break;
    case "update-value":
      setVisualValues((currentValues) =>
        currentValues.map((visualValue) =>
          visualValue.id === action.valueId
            ? { ...visualValue, ...action.update }
            : visualValue
        )
      );
      break;
    case "remove-value":
      setVisualValues((currentValues) =>
        currentValues.filter((visualValue) => visualValue.id !== action.valueId)
      );
      break;
  }
}

function getAnimationNowMs() {
  return performance.now();
}
