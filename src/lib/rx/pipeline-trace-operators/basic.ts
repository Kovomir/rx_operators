import { Observable, type OperatorFunction } from "rxjs";

import type {
  DistinctUntilChangedPipelineOperator,
  FilterPipelineOperator,
  MapPipelineOperator,
  ScanPipelineOperator,
  SkipPipelineOperator,
  StartWithPipelineOperator,
  TapPipelineOperator,
  TakePipelineOperator,
} from "@/features/pipeline-editor";
import type { StreamValue } from "@/types/stream";

import {
  applyDistinctUntilChangedOperator,
  applyMapOperator,
  applyScanStep,
  createErrorStreamValue,
  createStartWithValue,
  doesMapOperatorThrow,
  passesFilterOperator,
} from "../operator-semantics";
import type { PipelineTraceRecorder } from "../pipeline-trace-recorder";
import type { StreamId } from "../stream-identity";
import { recordForwardedError } from "./error-forwarding";

export function tracedMap(
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

export function tracedFilter(
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

export function tracedSkip(
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

export function tracedTake(
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

export function tracedDistinctUntilChanged(
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

export function tracedTap(
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

export function tracedStartWith(
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

export function tracedScan(
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
