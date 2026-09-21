import { cn } from "@/lib/utils";

import { usePipelineEditor } from "../hooks/use-pipeline-editor";
import type {
  PipelineEditorMode,
  PipelineOperator,
  PipelineOperatorType,
} from "../types";
import { PipelineEditorHeader } from "./PipelineEditorHeader";
import { PipelineFlow } from "./PipelineFlow";

type PipelineEditorProps = {
  enabledOperatorTypes?: PipelineOperatorType[];
  lockedOperatorIds?: string[];
  operators: PipelineOperator[];
  onOperatorsChange?: (operators: PipelineOperator[]) => void;
  mode?: PipelineEditorMode;
  maxOperators?: number;
  className?: string;
};

const DEFAULT_MAX_OPERATORS = 6;
const DEFAULT_ENABLED_OPERATOR_TYPES: PipelineOperatorType[] = ["map", "filter"];

export function PipelineEditor({
  enabledOperatorTypes = DEFAULT_ENABLED_OPERATOR_TYPES,
  lockedOperatorIds = [],
  operators,
  onOperatorsChange,
  mode = "editable",
  maxOperators = DEFAULT_MAX_OPERATORS,
  className,
}: PipelineEditorProps) {
  const {
    addOperator,
    canInsertOperatorAt,
    isEditable,
    isOperatorLocked,
    removeOperator,
    updateOperator,
  } = usePipelineEditor({
    lockedOperatorIds,
    operators,
    onOperatorsChange,
    mode,
    maxOperators,
  });

  return (
    <div
      className={cn(
        "min-w-0 max-w-full overflow-hidden rounded-lg border bg-background shadow-sm",
        className
      )}
    >
      <PipelineEditorHeader
        operatorCount={operators.length}
        maxOperators={maxOperators}
      />
      <PipelineFlow
        enabledOperatorTypes={enabledOperatorTypes}
        operators={operators}
        isEditable={isEditable}
        canInsertOperatorAt={canInsertOperatorAt}
        isOperatorLocked={isOperatorLocked}
        onAddOperator={addOperator}
        onUpdateOperator={updateOperator}
        onRemoveOperator={removeOperator}
      />
    </div>
  );
}
