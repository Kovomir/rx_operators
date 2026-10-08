import { Observable, type OperatorFunction } from "rxjs";

import type {
  DebounceTimePipelineOperator,
  CatchErrorPipelineOperator,
  DelayPipelineOperator,
  DistinctUntilChangedPipelineOperator,
  FilterPipelineOperator,
  MapPipelineOperator,
  PipelineOperator,
  ScanPipelineOperator,
  SkipPipelineOperator,
  StartWithPipelineOperator,
  TapPipelineOperator,
  TakePipelineOperator,
} from "@/features/pipeline-editor";
import type { StreamValue } from "@/types/stream";

import {
  applyMapOperator,
  createCatchErrorReplacementValue,
  createErrorStreamValue,
  applyDistinctUntilChangedOperator,
  applyScanStep,
  createStartWithValue,
  doesMapOperatorThrow,
  isStreamPipelineError,
  passesFilterOperator,
} from "./operator-semantics";
import type { PipelineTraceRecorder } from "./pipeline-trace-recorder";
import type { StreamId } from "./stream-identity";

export function buildTracedOperator(
  operator: PipelineOperator,
  recorder: PipelineTraceRecorder,
  streamId: StreamId
): OperatorFunction<StreamValue, StreamValue> {
  switch (operator.type) {
    case "map":
      return tracedMap(operator, recorder, streamId);
    case "filter":
      return tracedFilter(operator, recorder, streamId);
    case "skip":
      return tracedSkip(operator, recorder, streamId);
    case "take":
      return tracedTake(operator, recorder, streamId);
    case "distinctUntilChanged":
      return tracedDistinctUntilChanged(operator, recorder, streamId);
    case "tap":
      return tracedTap(operator, recorder, streamId);
    case "startWith":
      return tracedStartWith(operator, recorder, streamId);
    case "scan":
      return tracedScan(operator, recorder, streamId);
    case "debounceTime":
      return tracedDebounceTime(operator, recorder, streamId);
    case "catchError":
      return tracedCatchError(operator, recorder, streamId);
    case "delay":
      return tracedDelay(operator, recorder, streamId);
  }
}

function recordForwardedError(
  recorder: PipelineTraceRecorder,
  streamId: StreamId,
  stageId: string,
  error: unknown
) {
  if (!isStreamPipelineError(error)) {
    return;
  }

  recorder.record({
    streamId,
    type: "operator-enter",
    stageId,
    value: error.value,
  });
  recorder.record({
    streamId,
    type: "operator-pass",
    stageId,
    value: error.value,
  });
}

function tracedMap(
  operator: MapPipelineOperator,
  recorder: PipelineTraceRecorder,
  streamId: StreamId
): OperatorFunction<StreamValue, StreamValue> {
  return (source$) =>
    new Observable<StreamValue>((subscriber) => {
      const subscription = source$.subscribe({
        next(value) {
          recorder.record({
            streamId,
            type: "operator-enter",
            stageId: operator.id,
            value,
          });

          if (doesMapOperatorThrow(value, operator)) {
            const errorValue = createErrorStreamValue(value, operator.id);

            recorder.record({
              streamId,
              type: "operator-map",
              stageId: operator.id,
              before: value,
              after: errorValue,
            });

            subscriber.error({
              kind: "stream-error",
              value: errorValue,
            });
            return;
          }

          const mappedValue = applyMapOperator(value, operator);

          recorder.record({
            streamId,
            type: "operator-map",
            stageId: operator.id,
            before: value,
            after: mappedValue,
          });

          subscriber.next(mappedValue);
        },
        error(error: unknown) {
          recordForwardedError(recorder, streamId, operator.id, error);
          subscriber.error(error);
        },
        complete() {
          subscriber.complete();
        },
      });

      return () => subscription.unsubscribe();
    });
}

function tracedFilter(
  operator: FilterPipelineOperator,
  recorder: PipelineTraceRecorder,
  streamId: StreamId
): OperatorFunction<StreamValue, StreamValue> {
  return (source$) =>
    new Observable<StreamValue>((subscriber) => {
      const subscription = source$.subscribe({
        next(value) {
          recorder.record({
            streamId,
            type: "operator-enter",
            stageId: operator.id,
            value,
          });

          if (passesFilterOperator(value, operator)) {
            recorder.record({
              streamId,
              type: "operator-pass",
              stageId: operator.id,
              value,
            });
            subscriber.next(value);
            return;
          }

          recorder.record({
            streamId,
            type: "operator-drop",
            stageId: operator.id,
            value,
          });
        },
        error(error: unknown) {
          recordForwardedError(recorder, streamId, operator.id, error);
          subscriber.error(error);
        },
        complete() {
          subscriber.complete();
        },
      });

      return () => subscription.unsubscribe();
    });
}

function tracedSkip(
  operator: SkipPipelineOperator,
  recorder: PipelineTraceRecorder,
  streamId: StreamId
): OperatorFunction<StreamValue, StreamValue> {
  return (source$) =>
    new Observable<StreamValue>((subscriber) => {
      let skippedValueCount = 0;

      const subscription = source$.subscribe({
        next(value) {
          recorder.record({
            streamId,
            type: "operator-enter",
            stageId: operator.id,
            value,
          });

          if (skippedValueCount < operator.config.count) {
            skippedValueCount += 1;
            recorder.record({
              streamId,
              type: "operator-drop",
              stageId: operator.id,
              value,
            });
            return;
          }

          recorder.record({
            streamId,
            type: "operator-pass",
            stageId: operator.id,
            value,
          });
          subscriber.next(value);
        },
        error(error: unknown) {
          recordForwardedError(recorder, streamId, operator.id, error);
          subscriber.error(error);
        },
        complete() {
          subscriber.complete();
        },
      });

      return () => subscription.unsubscribe();
    });
}

function tracedTake(
  operator: TakePipelineOperator,
  recorder: PipelineTraceRecorder,
  streamId: StreamId
): OperatorFunction<StreamValue, StreamValue> {
  return (source$) =>
    new Observable<StreamValue>((subscriber) => {
      let takenValueCount = 0;

      const subscription = source$.subscribe({
        next(value) {
          recorder.record({
            streamId,
            type: "operator-enter",
            stageId: operator.id,
            value,
          });

          if (takenValueCount < operator.config.count) {
            takenValueCount += 1;
            recorder.record({
              streamId,
              type: "operator-pass",
              stageId: operator.id,
              value,
            });
            subscriber.next(value);
            return;
          }

          recorder.record({
            streamId,
            type: "operator-drop",
            stageId: operator.id,
            value,
          });
        },
        error(error: unknown) {
          recordForwardedError(recorder, streamId, operator.id, error);
          subscriber.error(error);
        },
        complete() {
          subscriber.complete();
        },
      });

      return () => subscription.unsubscribe();
    });
}

function tracedDistinctUntilChanged(
  operator: DistinctUntilChangedPipelineOperator,
  recorder: PipelineTraceRecorder,
  streamId: StreamId
): OperatorFunction<StreamValue, StreamValue> {
  return (source$) =>
    new Observable<StreamValue>((subscriber) => {
      let previousValue: StreamValue | null = null;

      const subscription = source$.subscribe({
        next(value) {
          recorder.record({
            streamId,
            type: "operator-enter",
            stageId: operator.id,
            value,
          });

          const [nextValue] = applyDistinctUntilChangedOperator(
            previousValue ? [previousValue, value] : [value]
          ).slice(-1);

          if (!previousValue || nextValue === value) {
            previousValue = value;
            recorder.record({
              streamId,
              type: "operator-pass",
              stageId: operator.id,
              value,
            });
            subscriber.next(value);
            return;
          }

          recorder.record({
            streamId,
            type: "operator-drop",
            stageId: operator.id,
            value,
          });
        },
        error(error: unknown) {
          recordForwardedError(recorder, streamId, operator.id, error);
          subscriber.error(error);
        },
        complete() {
          subscriber.complete();
        },
      });

      return () => subscription.unsubscribe();
    });
}

function tracedTap(
  operator: TapPipelineOperator,
  recorder: PipelineTraceRecorder,
  streamId: StreamId
): OperatorFunction<StreamValue, StreamValue> {
  return (source$) =>
    new Observable<StreamValue>((subscriber) => {
      const subscription = source$.subscribe({
        next(value) {
          recorder.record({
            streamId,
            type: "operator-enter",
            stageId: operator.id,
            value,
          });

          if (operator.config.effect === "consoleLog") {
            console.log(value.value);
          }

          recorder.record({
            streamId,
            type: "operator-tap",
            stageId: operator.id,
            value,
          });

          subscriber.next(value);
        },
        error(error: unknown) {
          recordForwardedError(recorder, streamId, operator.id, error);
          subscriber.error(error);
        },
        complete() {
          subscriber.complete();
        },
      });

      return () => subscription.unsubscribe();
    });
}

function tracedStartWith(
  operator: StartWithPipelineOperator,
  recorder: PipelineTraceRecorder,
  streamId: StreamId
): OperatorFunction<StreamValue, StreamValue> {
  return (source$) =>
    new Observable<StreamValue>((subscriber) => {
      const initialValue = createStartWithValue(operator);

      recorder.record({
        streamId,
        type: "operator-create",
        stageId: operator.id,
        value: initialValue,
      });
      subscriber.next(initialValue);

      const subscription = source$.subscribe({
        next(value) {
          recorder.record({
            streamId,
            type: "operator-enter",
            stageId: operator.id,
            value,
          });
          recorder.record({
            streamId,
            type: "operator-pass",
            stageId: operator.id,
            value,
          });
          subscriber.next(value);
        },
        error(error: unknown) {
          recordForwardedError(recorder, streamId, operator.id, error);
          subscriber.error(error);
        },
        complete() {
          subscriber.complete();
        },
      });

      return () => subscription.unsubscribe();
    });
}

function tracedScan(
  operator: ScanPipelineOperator,
  recorder: PipelineTraceRecorder,
  streamId: StreamId
): OperatorFunction<StreamValue, StreamValue> {
  return (source$) =>
    new Observable<StreamValue>((subscriber) => {
      let accumulator = 0;

      const subscription = source$.subscribe({
        next(value) {
          recorder.record({
            streamId,
            type: "operator-enter",
            stageId: operator.id,
            value,
          });

          const scanStep = applyScanStep(value, accumulator);
          accumulator = scanStep.accumulator;

          recorder.record({
            streamId,
            type: "operator-map",
            stageId: operator.id,
            before: value,
            after: scanStep.value,
          });

          subscriber.next(scanStep.value);
        },
        error(error: unknown) {
          recordForwardedError(recorder, streamId, operator.id, error);
          subscriber.error(error);
        },
        complete() {
          subscriber.complete();
        },
      });

      return () => subscription.unsubscribe();
    });
}

function tracedDebounceTime(
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

function tracedCatchError(
  operator: CatchErrorPipelineOperator,
  recorder: PipelineTraceRecorder,
  streamId: StreamId
): OperatorFunction<StreamValue, StreamValue> {
  return (source$) =>
    new Observable<StreamValue>((subscriber) => {
      const subscription = source$.subscribe({
        next(value) {
          recorder.record({
            streamId,
            type: "operator-enter",
            stageId: operator.id,
            value,
          });
          recorder.record({
            streamId,
            type: "operator-pass",
            stageId: operator.id,
            value,
          });
          subscriber.next(value);
        },
        error(error: unknown) {
          const errorValue = isStreamPipelineError(error)
            ? error.value
            : createErrorStreamValue(
                {
                  id: `${operator.id}-unknown-error`,
                  kind: "error",
                  shape: "circle",
                  color: "red",
                  value: 0,
                },
                operator.id
              );
          const replacementValue = createCatchErrorReplacementValue(
            operator,
            errorValue
          );

          recorder.record({
            streamId,
            type: "operator-enter",
            stageId: operator.id,
            value: errorValue,
          });
          recorder.record({
            streamId,
            type: "operator-drop",
            stageId: operator.id,
            value: errorValue,
          });
          recorder.record({
            streamId,
            type: "operator-create",
            stageId: operator.id,
            sourceValue: errorValue,
            value: replacementValue,
          });

          subscriber.next(replacementValue);
          subscriber.complete();
        },
        complete() {
          subscriber.complete();
        },
      });

      return () => subscription.unsubscribe();
    });
}

function getCurrentTimeMs() {
  return typeof performance === "undefined" ? Date.now() : performance.now();
}

function tracedDelay(
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
