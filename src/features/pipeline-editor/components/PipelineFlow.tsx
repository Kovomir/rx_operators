import { useEffect, useRef, type UIEvent } from "react";

import type { PipelineScrollSyncController } from "@/features/pipeline-scroll-sync";

import type { PipelineOperator, PipelineOperatorType } from "../types";
import { EndpointNode } from "./EndpointNode";
import { FlowConnector } from "./FlowConnector";
import { InsertSlot } from "./InsertSlot";
import { OperatorNode } from "./OperatorNode";

type PipelineFlowProps = {
  enabledOperatorTypes: PipelineOperatorType[];
  operators: PipelineOperator[];
  isEditable: boolean;
  canInsertOperatorAt: (insertIndex: number) => boolean;
  isOperatorLocked: (operatorId: string) => boolean;
  onAddOperator: (insertIndex: number, type: PipelineOperatorType) => void;
  onUpdateOperator: (operator: PipelineOperator) => void;
  onRemoveOperator: (operatorId: string) => void;
  scrollSync?: PipelineScrollSyncController;
};

export function PipelineFlow({
  enabledOperatorTypes,
  operators,
  isEditable,
  canInsertOperatorAt,
  isOperatorLocked,
  onAddOperator,
  onUpdateOperator,
  onRemoveOperator,
  scrollSync,
}: PipelineFlowProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollSync?.register("editor", scrollContainerRef.current);

    return () => {
      scrollSync?.register("editor", null);
    };
  }, [scrollSync]);

  function handleScroll(event: UIEvent<HTMLDivElement>) {
    scrollSync?.syncScrollLeft("editor", event.currentTarget.scrollLeft);
  }

  return (
    <div
      ref={scrollContainerRef}
      className="max-w-full overflow-x-auto"
      onScroll={handleScroll}
    >
      <div className="flex min-h-60 min-w-max items-center gap-1.5 px-3 py-5">
        <EndpointNode variant="source" />

        {isEditable ? (
          <InsertSlot
            enabledOperatorTypes={enabledOperatorTypes}
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
                enabledOperatorTypes={enabledOperatorTypes}
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
