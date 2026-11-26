import type {
  PipelineOperator,
  PipelineOperatorType,
} from "@/features/pipeline-editor";
import type { StreamValue } from "@/features/stream-visualizer";

export type ExpectedOutputValue = number | Omit<StreamValue, "id">;

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
  sourceDisplayValues?: ExpectedOutputValue[];
  expectedOutputValues?: ExpectedOutputValue[];
  validationOutputValues?: ExpectedOutputValue[];
  expectedTapValues?: number[];
  showSourceValueDetails?: boolean;
  initialOperators?: PipelineOperator[];
  enabledOperatorTypes?: PipelineOperatorType[];
  lockedOperatorIds?: string[];
  maxOperators: number;
};
