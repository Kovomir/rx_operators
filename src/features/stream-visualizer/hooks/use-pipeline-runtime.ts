import { useCallback, useEffect, useRef } from "react";

import type { PipelineOperator } from "@/features/pipeline-editor";
import { buildRuntimePipeline } from "@/lib/rx/build-runtime-pipeline";
import type {
  PipelineTraceEvent,
  PipelineTraceSource,
} from "@/lib/rx/pipeline-trace";
import { createPipelineTraceRecorder } from "@/lib/rx/pipeline-trace-recorder";
import { MAIN_STREAM_ID, type StreamId } from "@/lib/rx/stream-identity";
import {
  createManualSourceRuntime,
  type ManualSourceRuntime,
} from "@/lib/rx/source-runtime";

import type { StreamValue } from "../types";

type UsePipelineRuntimeArgs = {
  operators: PipelineOperator[];
  streamId?: StreamId;
  onOutputValue: (value: StreamValue) => void;
  onTraceEvent: (event: PipelineTraceEvent) => void;
  onRuntimeCleanup: () => void;
};

export function usePipelineRuntime({
  operators,
  streamId = MAIN_STREAM_ID,
  onOutputValue,
  onTraceEvent,
  onRuntimeCleanup,
}: UsePipelineRuntimeArgs) {
  const sourceRuntimeRef = useRef<ManualSourceRuntime | null>(null);

  useEffect(() => {
    const recorder = createPipelineTraceRecorder();
    const sourceRuntime = createManualSourceRuntime();
    const traceSubscription = recorder.events$.subscribe(onTraceEvent);
    const outputSubscription = buildRuntimePipeline({
      source$: sourceRuntime.source$,
      operators,
      recorder,
      streamId,
    }).subscribe({
      next: onOutputValue,
    });

    sourceRuntimeRef.current = sourceRuntime;

    return () => {
      traceSubscription.unsubscribe();
      outputSubscription.unsubscribe();
      sourceRuntime.complete();
      recorder.complete();
      onRuntimeCleanup();

      if (sourceRuntimeRef.current === sourceRuntime) {
        sourceRuntimeRef.current = null;
      }
    };
  }, [onOutputValue, onRuntimeCleanup, onTraceEvent, operators, streamId]);

  const emitValue = useCallback(
    (value: StreamValue, source?: PipelineTraceSource) => {
      sourceRuntimeRef.current?.emit(value, source);
    },
    []
  );

  return { emitValue };
}
