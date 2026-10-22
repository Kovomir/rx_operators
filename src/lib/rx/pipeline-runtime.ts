import { VirtualTimeScheduler } from "rxjs";

import type { PipelineOperator } from "@/features/pipeline-editor";
import type { StreamValue } from "@/types/stream";

import { buildRuntimePipeline } from "./build-runtime-pipeline";
import type { PipelineTraceEvent } from "./pipeline-trace";
import { createPipelineTraceRecorder } from "./pipeline-trace-recorder";
import { createManualSourceRuntime } from "./source-runtime";

type PipelineRuntimeOptions = {
  operators: PipelineOperator[];
  sourceValues?: StreamValue[];
  onTraceEvent?: (event: PipelineTraceEvent) => void;
  onOutputValue?: (value: StreamValue) => void;
  realtime?: boolean;
  logTapValues?: boolean;
};

export type PipelineRuntime = ReturnType<typeof createPipelineRuntime>;

export function createPipelineRuntime({
  operators,
  sourceValues = [],
  onTraceEvent,
  onOutputValue,
  realtime = false,
  logTapValues = true,
}: PipelineRuntimeOptions) {
  const scheduler = new VirtualTimeScheduler();
  const recorder = createPipelineTraceRecorder(() => scheduler.now());
  const source = createManualSourceRuntime();
  const startedAtMs = performance.now();
  let disposed = false;
  let wakeup: ReturnType<typeof setTimeout> | undefined;

  const traceSubscription = recorder.events$.subscribe(onTraceEvent);
  const outputSubscription = buildRuntimePipeline({
    source$: source.source$,
    operators,
    recorder,
    scheduler,
    logTapValues,
  }).subscribe({ next: onOutputValue, error: () => undefined });

  for (const value of sourceValues) {
    scheduler.schedule(() => {
      if (value.kind === "cancelled") {
        recorder.record({
          type: "source-cancelled",
          source: "demo",
          value,
        });
      } else if (value.kind === "error") {
        source.emitError(value, "demo");
      } else {
        source.emit(value, "demo");
      }
    }, Math.max(0, value.emittedAtMs ?? 0));
  }

  function advanceToNow() {
    const timeMs = Math.max(scheduler.frame, performance.now() - startedAtMs);
    scheduler.maxFrames = timeMs;
    scheduler.flush();
    scheduler.frame = timeMs;
  }

  function scheduleWakeup() {
    clearTimeout(wakeup);
    wakeup = undefined;

    const nextDueAtMs = scheduler.actions[0]?.delay;
    if (disposed || !realtime || nextDueAtMs === undefined) {
      return;
    }

    // Browser timers only wake the simulation. Queued actions retain their
    // original logical times even after a busy or background tab catches up.
    const delayMs = Math.max(0, nextDueAtMs - (performance.now() - startedAtMs));
    wakeup = setTimeout(() => {
      if (!disposed) {
        advanceToNow();
        scheduleWakeup();
      }
    }, delayMs);
  }

  scheduleWakeup();

  return {
    emit(value: StreamValue) {
      if (disposed) {
        return;
      }

      if (realtime) {
        advanceToNow();
      }

      source.emit({ ...value, emittedAtMs: scheduler.now() });
      scheduleWakeup();
    },
    flush() {
      if (!disposed) {
        scheduler.maxFrames = Infinity;
        scheduler.flush();
      }
    },
    dispose() {
      disposed = true;
      clearTimeout(wakeup);
      traceSubscription.unsubscribe();
      outputSubscription.unsubscribe();
      for (const action of [...scheduler.actions]) {
        action.unsubscribe();
      }
      source.complete();
      recorder.complete();
    },
  };
}
