import { Subject } from "rxjs";

import type { StreamValue } from "@/features/stream-visualizer";

export type ManualSourceRuntime = {
  source$: Subject<StreamValue>;
  emit: (value: StreamValue) => void;
  complete: () => void;
};

export function createManualSourceRuntime(): ManualSourceRuntime {
  const source$ = new Subject<StreamValue>();

  return {
    source$,
    emit(value) {
      source$.next(value);
    },
    complete() {
      source$.complete();
    },
  };
}
