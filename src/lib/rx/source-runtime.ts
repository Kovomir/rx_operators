import { Subject } from "rxjs";

import type { StreamValue } from "@/types/stream";

import type { PipelineTraceSource } from "./pipeline-trace";

export type SourceEmission = {
  source: PipelineTraceSource;
  value: StreamValue;
};

export type ManualSourceRuntime = {
  source$: Subject<SourceEmission>;
  emit: (value: StreamValue, source?: PipelineTraceSource) => void;
  complete: () => void;
};

export function createManualSourceRuntime(): ManualSourceRuntime {
  const source$ = new Subject<SourceEmission>();

  return {
    source$,
    emit(value, source = "live") {
      source$.next({ source, value });
    },
    complete() {
      source$.complete();
    },
  };
}
