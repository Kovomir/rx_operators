import { Observable, type OperatorFunction } from "rxjs";

import type {
  DebounceTimePipelineOperator,
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
  applyDistinctUntilChangedOperator,
  applyScanStep,
  createStartWithValue,
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
  }
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
        pendingTimeoutId = null;

        recorder.record({
          streamId,
          type: "operator-pass",
          stageId: operator.id,
          value,
        });

        subscriber.next(value);
      }

      const subscription = source$.subscribe({
        next(value) {
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
          pendingTimeoutId = setTimeout(
            emitPendingValue,
            operator.config.durationMs
          );
        },
        error(error: unknown) {
          clearPendingTimeout();
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
