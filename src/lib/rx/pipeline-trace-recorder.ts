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

export function createPipelineTraceRecorder(
  now: () => number
): PipelineTraceRecorder {
  const eventsSubject = new Subject<PipelineTraceEvent>();
  let nextSequence = 0;

  return {
    events$: eventsSubject.asObservable(),
    record(event) {
      eventsSubject.next(
        withPipelineTraceMetadata(event, nextSequence, now())
      );
      nextSequence += 1;
    },
    complete() {
      eventsSubject.complete();
    },
  };
}
