import {Observable, type OperatorFunction, type SchedulerLike, type Subscription,} from "rxjs";

import type {DebounceTimePipelineOperator, DelayPipelineOperator,} from "@/features/pipeline-editor";
import type {StreamValue} from "@/types/stream";

import type {PipelineTraceRecorder} from "../pipeline-trace-recorder";
import type {StreamId} from "@/types/stream.ts";
import {recordForwardedError} from "./error-forwarding";

export function tracedDebounceTime(
  operator: DebounceTimePipelineOperator,
  recorder: PipelineTraceRecorder,
  streamId: StreamId,
  scheduler: SchedulerLike
): OperatorFunction<StreamValue, StreamValue> {
  return (source$) =>
    new Observable<StreamValue>((subscriber) => {
      let pendingValue: StreamValue | null = null;
      let pendingDueAtMs: number | null = null;
      let pendingAction: Subscription | undefined;

      function cancelPendingEmission() {
        pendingAction?.unsubscribe();
        pendingAction = undefined;
      }

      function emitPendingValue() {
        if (!pendingValue || subscriber.closed) {
          return;
        }

        const value = {
          ...pendingValue,
          emittedAtMs: scheduler.now(),
        };
        pendingValue = null;
        pendingDueAtMs = null;
        pendingAction = undefined;

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
          scheduler.now() >= pendingDueAtMs
        ) {
          cancelPendingEmission();
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

          cancelPendingEmission();
          pendingValue = value;
          pendingDueAtMs = scheduler.now() + operator.config.durationMs;
          pendingAction = scheduler.schedule(
            emitPendingValue,
            operator.config.durationMs
          );
        },
        error(error: unknown) {
          cancelPendingEmission();
          recordForwardedError(recorder, streamId, operator.id, error);
          subscriber.error(error);
        },
        complete() {
          cancelPendingEmission();
          emitPendingValue();
          subscriber.complete();
        },
      });

      return () => {
        cancelPendingEmission();
        subscription.unsubscribe();
      };
    });
}

export function tracedDelay(
  operator: DelayPipelineOperator,
  recorder: PipelineTraceRecorder,
  streamId: StreamId,
  scheduler: SchedulerLike
): OperatorFunction<StreamValue, StreamValue> {
  return (source$) =>
    new Observable<StreamValue>((subscriber) => {
      const pendingActions = new Set<Subscription>();
      let isSourceComplete = false;

      function completeWhenReady() {
        if (isSourceComplete && pendingActions.size === 0) {
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

          const action = scheduler.schedule(() => {
            pendingActions.delete(action);

            if (subscriber.closed) {
              return;
            }

            const delayedValue = {
              ...value,
              emittedAtMs: scheduler.now(),
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

          pendingActions.add(action);
        },
        error(error: unknown) {
          for (const action of pendingActions) {
            action.unsubscribe();
          }

          pendingActions.clear();
          recordForwardedError(recorder, streamId, operator.id, error);
          subscriber.error(error);
        },
        complete() {
          isSourceComplete = true;
          completeWhenReady();
        },
      });

      return () => {
        for (const action of pendingActions) {
          action.unsubscribe();
        }

        pendingActions.clear();
        subscription.unsubscribe();
      };
    });
}
