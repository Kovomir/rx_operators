import { Observable, type OperatorFunction } from "rxjs";

import type {
  DebounceTimePipelineOperator,
  DelayPipelineOperator,
} from "@/features/pipeline-editor";
import type { StreamValue } from "@/types/stream";

import type { PipelineTraceRecorder } from "../pipeline-trace-recorder";
import type { StreamId } from "../stream-identity";
import { recordForwardedError } from "./error-forwarding";

export function tracedDebounceTime(
  operator: DebounceTimePipelineOperator,
  recorder: PipelineTraceRecorder,
  streamId: StreamId
): OperatorFunction<StreamValue, StreamValue> {
  return (source$) =>
    new Observable<StreamValue>((subscriber) => {
      let pendingValue: StreamValue | null = null;
      let pendingDueAtMs: number | null = null;
      let pendingTimeoutId: ReturnType<typeof setTimeout> | null = null;

      function clearPendingTimeout() {
        if (pendingTimeoutId !== null) {
          clearTimeout(pendingTimeoutId);
          pendingTimeoutId = null;
        }
      }

      function emitPendingValue() {
        if (!pendingValue || subscriber.closed) {
          return;
        }

        const value = {
          ...pendingValue,
          emittedAtMs:
            (pendingValue.emittedAtMs ?? 0) + operator.config.durationMs,
        };
        pendingValue = null;
        pendingDueAtMs = null;
        pendingTimeoutId = null;

        recorder.record({
          streamId,
          type: "operator-pass",
          stageId: operator.id,
          value,
        });

        subscriber.next(value);
      }

      function emitElapsedPendingValue() {
        if (
          pendingValue &&
          pendingDueAtMs !== null &&
          getCurrentTimeMs() >= pendingDueAtMs
        ) {
          clearPendingTimeout();
          emitPendingValue();
        }
      }

      const subscription = source$.subscribe({
        next(value) {
          emitElapsedPendingValue();

          recorder.record({
            streamId,
            type: "operator-enter",
            stageId: operator.id,
            value,
          });

          if (pendingValue) {
            recorder.record({
              streamId,
              type: "operator-drop",
              stageId: operator.id,
              value: pendingValue,
            });
          }

          clearPendingTimeout();
          pendingValue = value;
          pendingDueAtMs = getCurrentTimeMs() + operator.config.durationMs;
          pendingTimeoutId = setTimeout(
            emitPendingValue,
            operator.config.durationMs
          );
        },
        error(error: unknown) {
          clearPendingTimeout();
          recordForwardedError(recorder, streamId, operator.id, error);
          subscriber.error(error);
        },
        complete() {
          clearPendingTimeout();
          emitPendingValue();
          subscriber.complete();
        },
      });

      return () => {
        clearPendingTimeout();
        subscription.unsubscribe();
      };
    });
}

export function tracedDelay(
  operator: DelayPipelineOperator,
  recorder: PipelineTraceRecorder,
  streamId: StreamId
): OperatorFunction<StreamValue, StreamValue> {
  return (source$) =>
    new Observable<StreamValue>((subscriber) => {
      const pendingTimeoutIds = new Set<ReturnType<typeof setTimeout>>();
      let isSourceComplete = false;

      function completeWhenReady() {
        if (isSourceComplete && pendingTimeoutIds.size === 0) {
          subscriber.complete();
        }
      }

      const subscription = source$.subscribe({
        next(value) {
          recorder.record({
            streamId,
            type: "operator-enter",
            stageId: operator.id,
            value,
          });

          const timeoutId = setTimeout(() => {
            pendingTimeoutIds.delete(timeoutId);

            if (subscriber.closed) {
              return;
            }

            const delayedValue = {
              ...value,
              emittedAtMs: (value.emittedAtMs ?? 0) + operator.config.durationMs,
            };

            recorder.record({
              streamId,
              type: "operator-pass",
              stageId: operator.id,
              value: delayedValue,
            });

            subscriber.next(delayedValue);
            completeWhenReady();
          }, operator.config.durationMs);

          pendingTimeoutIds.add(timeoutId);
        },
        error(error: unknown) {
          for (const timeoutId of pendingTimeoutIds) {
            clearTimeout(timeoutId);
          }

          pendingTimeoutIds.clear();
          recordForwardedError(recorder, streamId, operator.id, error);
          subscriber.error(error);
        },
        complete() {
          isSourceComplete = true;
          completeWhenReady();
        },
      });

      return () => {
        for (const timeoutId of pendingTimeoutIds) {
          clearTimeout(timeoutId);
        }

        pendingTimeoutIds.clear();
        subscription.unsubscribe();
      };
    });
}

function getCurrentTimeMs() {
  return typeof performance === "undefined" ? Date.now() : performance.now();
}
