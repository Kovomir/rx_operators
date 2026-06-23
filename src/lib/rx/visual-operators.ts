import { Observable, type OperatorFunction } from "rxjs";

import type {
  FilterPipelineOperator,
  MapPipelineOperator,
  PipelineOperator,
} from "@/features/pipeline-editor";
import type { StreamValue } from "@/features/stream-visualizer";

import {
  applyMapOperator,
  passesFilterOperator,
} from "./operator-semantics";
import type { VisualRecorder } from "./visual-recorder";

export function buildVisualOperator(
  operator: PipelineOperator,
  recorder: VisualRecorder
): OperatorFunction<StreamValue, StreamValue> {
  switch (operator.type) {
    case "map":
      return visualMap(operator, recorder);
    case "filter":
      return visualFilter(operator, recorder);
  }
}

function visualMap(
  operator: MapPipelineOperator,
  recorder: VisualRecorder
): OperatorFunction<StreamValue, StreamValue> {
  return (source$) =>
    new Observable<StreamValue>((subscriber) => {
      const subscription = source$.subscribe({
        next(value) {
          recorder.record({
            type: "operator-enter",
            stageId: operator.id,
            value,
          });

          const mappedValue = applyMapOperator(value, operator);

          recorder.record({
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

function visualFilter(
  operator: FilterPipelineOperator,
  recorder: VisualRecorder
): OperatorFunction<StreamValue, StreamValue> {
  return (source$) =>
    new Observable<StreamValue>((subscriber) => {
      const subscription = source$.subscribe({
        next(value) {
          recorder.record({
            type: "operator-enter",
            stageId: operator.id,
            value,
          });

          if (passesFilterOperator(value, operator)) {
            recorder.record({
              type: "operator-pass",
              stageId: operator.id,
              value,
            });
            subscriber.next(value);
            return;
          }

          recorder.record({
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
