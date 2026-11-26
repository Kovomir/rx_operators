import type {
  PipelineOperator,
  PipelineOperatorType,
} from "@/features/pipeline-editor";
import type { StreamValue } from "@/types/stream";

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
  expectedOutputValues?: StreamValue[];
  expectedTapValues?: StreamValue[];
  validateOutputAppearance?: boolean;
  showEmissionTimes?: boolean;
  initialOperators?: PipelineOperator[];
  enabledOperatorTypes?: PipelineOperatorType[];
  lockedOperatorIds?: string[];
  maxOperators: number;
};
