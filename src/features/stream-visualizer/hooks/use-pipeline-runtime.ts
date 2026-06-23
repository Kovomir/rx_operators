import { useCallback, useEffect, useRef } from "react";

import type { PipelineOperator } from "@/features/pipeline-editor";
import { buildRuntimePipeline } from "@/lib/rx/build-runtime-pipeline";
import {
  createManualSourceRuntime,
  type ManualSourceRuntime,
} from "@/lib/rx/source-runtime";
import {
  createVisualRecorder,
  type VisualEvent,
} from "@/lib/rx/visual-recorder";

import type { StreamValue } from "../types";

type UsePipelineRuntimeArgs = {
  operators: PipelineOperator[];
  onOutputValue: (value: StreamValue) => void;
  onVisualEvent: (event: VisualEvent) => void;
  onRuntimeCleanup: () => void;
};

export function usePipelineRuntime({
  operators,
  onOutputValue,
  onVisualEvent,
  onRuntimeCleanup,
}: UsePipelineRuntimeArgs) {
  const sourceRuntimeRef = useRef<ManualSourceRuntime | null>(null);

  useEffect(() => {
    const recorder = createVisualRecorder();
    const sourceRuntime = createManualSourceRuntime();
    const visualSubscription = recorder.events$.subscribe(onVisualEvent);
    const outputSubscription = buildRuntimePipeline({
      source$: sourceRuntime.source$,
      operators,
      recorder,
    }).subscribe({
      next: onOutputValue,
    });

    sourceRuntimeRef.current = sourceRuntime;

    return () => {
      visualSubscription.unsubscribe();
      outputSubscription.unsubscribe();
      sourceRuntime.complete();
      recorder.complete();
      onRuntimeCleanup();

      if (sourceRuntimeRef.current === sourceRuntime) {
        sourceRuntimeRef.current = null;
      }
    };
  }, [onOutputValue, onRuntimeCleanup, onVisualEvent, operators]);

  const emitValue = useCallback((value: StreamValue) => {
    sourceRuntimeRef.current?.emit(value);
  }, []);

  return { emitValue };
}
