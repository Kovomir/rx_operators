import { Subject, type Observable } from "rxjs";

import {
  type PipelineTraceEvent,
  type PipelineTraceEventInput,
  withPipelineTraceMetadata,
} from "./pipeline-trace";

export type PipelineTraceRecorder = {
  events$: Observable<PipelineTraceEvent>;
  record: (event: PipelineTraceEventInput) => void;
  complete: () => void;
};

export function createPipelineTraceRecorder(): PipelineTraceRecorder {
  const eventsSubject = new Subject<PipelineTraceEvent>();
  let nextSequence = 0;

  return {
    events$: eventsSubject.asObservable(),
    record(event) {
      eventsSubject.next(
        withPipelineTraceMetadata(event, nextSequence, getCurrentTimeMs())
      );
      nextSequence += 1;
    },
    complete() {
      eventsSubject.complete();
    },
  };
}

function getCurrentTimeMs() {
  return typeof performance === "undefined" ? Date.now() : performance.now();
}
