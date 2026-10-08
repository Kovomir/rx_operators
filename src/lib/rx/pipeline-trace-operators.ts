import type { OperatorFunction } from "rxjs";

import type { PipelineOperator } from "@/features/pipeline-editor";
import type { StreamValue } from "@/types/stream";

import {
  tracedDistinctUntilChanged,
  tracedFilter,
  tracedMap,
  tracedScan,
  tracedSkip,
  tracedStartWith,
  tracedTake,
  tracedTap,
} from "./pipeline-trace-operators/basic";
import { tracedCatchError } from "./pipeline-trace-operators/catch-error";
import {
  tracedDebounceTime,
  tracedDelay,
} from "./pipeline-trace-operators/timing";
import type { PipelineTraceRecorder } from "./pipeline-trace-recorder";
import type { StreamId } from "./stream-identity";

export function buildTracedOperator(
  operator: PipelineOperator,
  recorder: PipelineTraceRecorder,
  streamId: StreamId
): OperatorFunction<StreamValue, StreamValue> {
  switch (operator.type) {
    case "map":
      return tracedMap(operator, recorder, streamId);
    case "filter":
      return tracedFilter(operator, recorder, streamId);
    case "skip":
      return tracedSkip(operator, recorder, streamId);
    case "take":
      return tracedTake(operator, recorder, streamId);
    case "distinctUntilChanged":
      return tracedDistinctUntilChanged(operator, recorder, streamId);
    case "tap":
      return tracedTap(operator, recorder, streamId);
    case "startWith":
      return tracedStartWith(operator, recorder, streamId);
    case "scan":
      return tracedScan(operator, recorder, streamId);
    case "debounceTime":
      return tracedDebounceTime(operator, recorder, streamId);
    case "catchError":
      return tracedCatchError(operator, recorder, streamId);
    case "delay":
      return tracedDelay(operator, recorder, streamId);
  }
}
