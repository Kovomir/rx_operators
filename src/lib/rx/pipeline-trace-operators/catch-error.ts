import { Observable, type OperatorFunction } from "rxjs";

import type { CatchErrorPipelineOperator } from "@/features/pipeline-editor";
import type { StreamValue } from "@/types/stream";

import {
  createCatchErrorReplacementValue,
  createErrorStreamValue,
  isStreamPipelineError,
} from "../operator-semantics";
import type { PipelineTraceRecorder } from "../pipeline-trace-recorder";
import type { StreamId } from "../stream-identity";

export function tracedCatchError(
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
