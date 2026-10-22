import { useCallback, useEffect, useRef } from "react";

import type { PipelineOperator } from "@/features/pipeline-editor";
import {
  createPipelineRuntime,
  type PipelineRuntime,
} from "@/lib/rx/pipeline-runtime";
import type { PipelineTraceEvent } from "@/lib/rx/pipeline-trace";

import type { StreamValue } from "../types";

type UsePipelineRuntimeArgs = {
  operators: PipelineOperator[];
  onTraceEvent: (event: PipelineTraceEvent) => void;
  onRuntimeCleanup: () => void;
};

export function usePipelineRuntime({
  operators,
  onTraceEvent,
  onRuntimeCleanup,
}: UsePipelineRuntimeArgs) {
  const runtimeRef = useRef<PipelineRuntime | null>(null);

  const cleanupRuntime = useCallback(() => {
    runtimeRef.current?.dispose();
    runtimeRef.current = null;
    onRuntimeCleanup();
  }, [onRuntimeCleanup]);

  const resetRuntime = useCallback(
    (sourceValues: StreamValue[] = []) => {
      cleanupRuntime();
      runtimeRef.current = createPipelineRuntime({
        operators,
        sourceValues,
        realtime: true,
        onTraceEvent,
      });
    },
    [cleanupRuntime, onTraceEvent, operators]
  );

  useEffect(() => {
    resetRuntime();

    return cleanupRuntime;
  }, [cleanupRuntime, resetRuntime]);

  const emitValue = useCallback((value: StreamValue) => {
    runtimeRef.current?.emit(value);
  }, []);

  return { emitValue, resetRuntime };
}
