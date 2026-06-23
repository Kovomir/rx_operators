import { Subject, type Observable } from "rxjs";

import type { StreamValue } from "@/features/stream-visualizer";

export type VisualEvent =
  | {
      type: "source-next";
      value: StreamValue;
    }
  | {
      type: "operator-enter";
      stageId: string;
      value: StreamValue;
    }
  | {
      type: "operator-map";
      stageId: string;
      before: StreamValue;
      after: StreamValue;
    }
  | {
      type: "operator-pass";
      stageId: string;
      value: StreamValue;
    }
  | {
      type: "operator-drop";
      stageId: string;
      value: StreamValue;
    }
  | {
      type: "subscriber-next";
      value: StreamValue;
    };

export type VisualRecorder = {
  events$: Observable<VisualEvent>;
  record: (event: VisualEvent) => void;
  complete: () => void;
};

export function createVisualRecorder(): VisualRecorder {
  const eventsSubject = new Subject<VisualEvent>();

  return {
    events$: eventsSubject.asObservable(),
    record(event) {
      eventsSubject.next(event);
    },
    complete() {
      eventsSubject.complete();
    },
  };
}
