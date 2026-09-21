import { Observable, type OperatorFunction } from "rxjs";

import type {
  FilterPipelineOperator,
  MapPipelineOperator,
  PipelineOperator,
} from "@/features/pipeline-editor";
import type { StreamValue } from "@/types/stream";

import {
  applyMapOperator,
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
