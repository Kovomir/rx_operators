import { tap, type Observable } from "rxjs";

import type { PipelineOperator } from "@/features/pipeline-editor";
import type { StreamValue } from "@/features/stream-visualizer";

import { buildVisualOperator } from "./visual-operators";
import type { VisualRecorder } from "./visual-recorder";

type BuildRuntimePipelineArgs = {
  source$: Observable<StreamValue>;
  operators: PipelineOperator[];
  recorder: VisualRecorder;
};

export function buildRuntimePipeline({
  source$,
  operators,
  recorder,
}: BuildRuntimePipelineArgs): Observable<StreamValue> {
  let stream$ = source$.pipe(
    tap((value) => {
      recorder.record({
        type: "source-next",
        value,
      });
    })
  );

  for (const operator of operators) {
    stream$ = stream$.pipe(buildVisualOperator(operator, recorder));
  }

  return stream$.pipe(
    tap((value) => {
      recorder.record({
        type: "subscriber-next",
        value,
      });
    })
  );
}
