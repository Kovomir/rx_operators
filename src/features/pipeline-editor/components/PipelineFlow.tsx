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
  highlightedElement?: PipelineEditorHighlightedElement;
  canInsertOperatorAt: (insertIndex: number) => boolean;
  isOperatorLocked: (operatorId: string) => boolean;
  showDisabledInsertSlots?: boolean;
  onAddOperator: (insertIndex: number, type: PipelineOperatorType) => void;
  onUpdateOperator: (operator: PipelineOperator) => void;
  onRemoveOperator: (operatorId: string) => void;
  scrollSync?: PipelineScrollSyncController;
  selectedOperatorId?: string | null;
  onSelectOperator?: (operatorId: string) => void;
};

export type PipelineEditorHighlightedElement =
  | "source"
  | "first-insert-slot"
  | "first-operator"
  | "subscriber";

export function PipelineFlow({
  enabledOperatorTypes,
  operators,
  isEditable,
  highlightedElement,
  canInsertOperatorAt,
  isOperatorLocked,
  showDisabledInsertSlots,
  onAddOperator,
  onUpdateOperator,
  onRemoveOperator,
  scrollSync,
  selectedOperatorId,
  onSelectOperator,
}: PipelineFlowProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const showsInsertSlots = isEditable || showDisabledInsertSlots;

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
        <EndpointNode
          highlighted={highlightedElement === "source"}
          variant="source"
        />

        {showsInsertSlots ? (
          <InsertSlot
            enabledOperatorTypes={enabledOperatorTypes}
            disabled={!isEditable || !canInsertOperatorAt(0)}
            highlighted={highlightedElement === "first-insert-slot"}
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
              highlighted={
                highlightedElement === "first-operator" && index === 0
              }
              removable={!isOperatorLocked(operator.id)}
              selected={operator.id === selectedOperatorId}
              onChange={onUpdateOperator}
              onRemove={() => onRemoveOperator(operator.id)}
              onSelect={() => onSelectOperator?.(operator.id)}
            />

            {showsInsertSlots ? (
              <InsertSlot
                enabledOperatorTypes={enabledOperatorTypes}
                disabled={!isEditable || !canInsertOperatorAt(index + 1)}
                onAddOperator={(type) => onAddOperator(index + 1, type)}
              />
            ) : index < operators.length - 1 ? (
              <FlowConnector />
            ) : null}
          </div>
        ))}

        <EndpointNode
          highlighted={highlightedElement === "subscriber"}
          variant="subscriber"
        />
      </div>
    </div>
  );
}
