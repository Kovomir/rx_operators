import { filter, from, map, type Observable } from "rxjs";

import type { PipelineOperator } from "@/features/pipeline-editor";

import type { StreamValue } from "../types";

import { applyMapOperator, passesFilterOperator } from "./apply-operator";

export function buildRxPipeline(
  sourceValues: StreamValue[],
  operators: PipelineOperator[]
): Observable<StreamValue> {
  let stream$: Observable<StreamValue> = from(sourceValues);

  for (const operator of operators) {
    switch (operator.type) {
      case "map":
        stream$ = stream$.pipe(map((streamValue) => applyMapOperator(streamValue, operator)));
        break;
      case "filter":
        stream$ = stream$.pipe(
          filter((streamValue) => passesFilterOperator(streamValue, operator))
        );
        break;
    }
  }

  return stream$;
}
