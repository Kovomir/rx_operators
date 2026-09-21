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

type RuntimeHandle = {
  complete: () => void;
  emit: ManualSourceRuntime["emit"];
};

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
  const runtimeRef = useRef<RuntimeHandle | null>(null);

  const createRuntime = useCallback((): RuntimeHandle => {
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

    return {
      emit: sourceRuntime.emit,
      complete() {
        traceSubscription.unsubscribe();
        outputSubscription.unsubscribe();
        sourceRuntime.complete();
        recorder.complete();
      },
    };
  }, [onOutputValue, onTraceEvent, operators, streamId]);

  const cleanupRuntime = useCallback(
    (runtime: RuntimeHandle | null) => {
      runtime?.complete();
      onRuntimeCleanup();

      if (runtimeRef.current === runtime) {
        runtimeRef.current = null;
      }
    },
    [onRuntimeCleanup]
  );

  const resetRuntime = useCallback(() => {
    cleanupRuntime(runtimeRef.current);
    runtimeRef.current = createRuntime();
  }, [cleanupRuntime, createRuntime]);

  useEffect(() => {
    resetRuntime();

    return () => {
      cleanupRuntime(runtimeRef.current);
    };
  }, [cleanupRuntime, resetRuntime]);

  const emitValue = useCallback(
    (value: StreamValue, source?: PipelineTraceSource) => {
      runtimeRef.current?.emit(value, source);
    },
    []
  );

  return { emitValue, resetRuntime };
}
