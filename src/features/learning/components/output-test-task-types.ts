import type {
  PipelineOperator,
  PipelineOperatorType,
} from "@/features/pipeline-editor";
import type {
  DisplayStreamValue,
  StreamValue,
} from "@/features/stream-visualizer";

export type ExpectedOutputValue = DisplayStreamValue;

export type PipelineOperatorRequirement =
  | {
      type: "filter";
      target: "color" | "shape" | "value";
      allowedColors?: string[];
      allowedShapes?: string[];
      allowedValueKinds?: string[];
    }
  | {
      type: "map";
      operation: "add" | "subtract" | "multiply";
      operand: number;
    }
  | {
      type: "debounceTime";
      durationMs: number;
    }
  | {
      type: "catchError";
      replacementValue: number;
    };

export type OutputTestTaskDefinition = {
  id: string;
  taskNumber: number;
  title: string;
  taskType?: "output" | "behavior";
  description?: string;
  inputSummary?: string;
  outputSummary?: string;
  sourceValues: StreamValue[];
  sourceDisplayValues?: Array<DisplayStreamValue | StreamValue>;
  expectedOutputValues?: ExpectedOutputValue[];
  expectedOutputLabel?: string;
  validationOutputValues?: ExpectedOutputValue[];
  expectedOperatorTypes?: PipelineOperatorType[];
  operatorRequirements?: PipelineOperatorRequirement[];
  expectedTapValues?: number[];
  expectedTapValuesLabel?: string;
  showSourceValueDetails?: boolean;
  initialOperators?: PipelineOperator[];
  enabledOperatorTypes?: PipelineOperatorType[];
  lockedOperatorIds?: string[];
  maxOperators: number;
};
