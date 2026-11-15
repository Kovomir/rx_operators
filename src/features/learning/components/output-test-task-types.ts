import type {
  PipelineOperator,
  PipelineOperatorType,
} from "@/features/pipeline-editor";
import type {
  DisplayStreamValue,
  StreamValue,
} from "@/features/stream-visualizer";

export type ExpectedOutputValue = DisplayStreamValue;

export type OutputTestTaskDefinition = {
  id: string;
  taskNumber: number;
  taskLabelPrefix?: string;
  difficulty?: "easy" | "medium" | "hard";
  title: string;
  taskType?: "output" | "behavior";
  inputSummary?: string;
  outputSummary?: string;
  sourceValues: StreamValue[];
  sourceDisplayValues?: Array<DisplayStreamValue | StreamValue>;
  expectedOutputValues?: ExpectedOutputValue[];
  validationOutputValues?: ExpectedOutputValue[];
  expectedTapValues?: number[];
  showSourceValueDetails?: boolean;
  initialOperators?: PipelineOperator[];
  enabledOperatorTypes?: PipelineOperatorType[];
  lockedOperatorIds?: string[];
  maxOperators: number;
};
