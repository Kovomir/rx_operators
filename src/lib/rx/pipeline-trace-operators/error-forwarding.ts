import { isStreamPipelineError } from "../operator-semantics";
import type { PipelineTraceRecorder } from "../pipeline-trace-recorder";
import type { StreamId } from "../stream-identity";

export function recordForwardedError(
  recorder: PipelineTraceRecorder,
  streamId: StreamId,
  stageId: string,
  error: unknown
) {
  if (!isStreamPipelineError(error)) {
    return;
  }

  recorder.record({
    streamId,
    type: "operator-enter",
    stageId,
    value: error.value,
  });
  recorder.record({
    streamId,
    type: "operator-pass",
    stageId,
    value: error.value,
  });
}
