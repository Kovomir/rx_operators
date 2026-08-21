import type { PipelineOperator, PipelineOperatorType } from "../types";
import { EndpointNode } from "./EndpointNode";
import { FlowConnector } from "./FlowConnector";
import { InsertSlot } from "./InsertSlot";
import { OperatorNode } from "./OperatorNode";

type PipelineFlowProps = {
  operators: PipelineOperator[];
  isEditable: boolean;
  canInsertOperatorAt: (insertIndex: number) => boolean;
  isOperatorLocked: (operatorId: string) => boolean;
  onAddOperator: (insertIndex: number, type: PipelineOperatorType) => void;
  onUpdateOperator: (operator: PipelineOperator) => void;
  onRemoveOperator: (operatorId: string) => void;
};

export function PipelineFlow({
  operators,
  isEditable,
  canInsertOperatorAt,
  isOperatorLocked,
  onAddOperator,
  onUpdateOperator,
  onRemoveOperator,
}: PipelineFlowProps) {
  return (
    <div className="max-w-full overflow-x-auto scroll-smooth">
      <div className="flex min-h-60 min-w-max items-center gap-1.5 px-3 py-5">
        <EndpointNode variant="source" />

        {isEditable ? (
          <InsertSlot
            disabled={!canInsertOperatorAt(0)}
            onAddOperator={(type) => onAddOperator(0, type)}
          />
        ) : (
          <FlowConnector />
        )}

        {operators.map((operator, index) => (
          <div key={operator.id} className="flex items-center gap-1.5">
            <OperatorNode
              operator={operator}
              editable={isEditable}
              removable={!isOperatorLocked(operator.id)}
              onChange={onUpdateOperator}
              onRemove={() => onRemoveOperator(operator.id)}
            />

            {isEditable ? (
              <InsertSlot
                disabled={!canInsertOperatorAt(index + 1)}
                onAddOperator={(type) => onAddOperator(index + 1, type)}
              />
            ) : index < operators.length - 1 ? (
              <FlowConnector />
            ) : null}
          </div>
        ))}

        <EndpointNode variant="subscriber" />
      </div>
    </div>
  );
}
