import { map, tap, type Observable } from "rxjs";

import type { PipelineOperator } from "@/features/pipeline-editor";
import type { StreamValue } from "@/types/stream";

import type { PipelineTraceRecorder } from "./pipeline-trace-recorder";
import { buildTracedOperator } from "./pipeline-trace-operators";
import { MAIN_STREAM_ID, type StreamId } from "./stream-identity";
import type { SourceEmission } from "./source-runtime";

type BuildRuntimePipelineArgs = {
  source$: Observable<SourceEmission>;
  operators: PipelineOperator[];
  recorder: PipelineTraceRecorder;
  streamId?: StreamId;
};

export function buildRuntimePipeline({
  source$,
  operators,
  recorder,
  streamId = MAIN_STREAM_ID,
}: BuildRuntimePipelineArgs): Observable<StreamValue> {
  let stream$ = source$.pipe(
    tap((emission) => {
      recorder.record({
        streamId,
        source: emission.source,
        type: "source-next",
        value: emission.value,
      });
    }),
    map((emission) => emission.value)
  );

  for (const operator of operators) {
    stream$ = stream$.pipe(buildTracedOperator(operator, recorder, streamId));
  }

  return stream$.pipe(
    tap((value) => {
      recorder.record({
        streamId,
        type: "subscriber-next",
        value,
      });
    })
  );
}
