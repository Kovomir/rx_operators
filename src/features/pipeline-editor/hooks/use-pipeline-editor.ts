import { useCallback, useMemo } from "react";

import { createDefaultPipelineOperator } from "../operator-defaults";
import type {
  PipelineEditorMode,
  PipelineOperator,
  PipelineOperatorType,
} from "../types";

type UsePipelineEditorArgs = {
  lockedOperatorIds: string[];
  operators: PipelineOperator[];
  onOperatorsChange?: (operators: PipelineOperator[]) => void;
  mode: PipelineEditorMode;
  maxOperators: number;
};

export function usePipelineEditor({
  lockedOperatorIds,
  operators,
  onOperatorsChange,
  mode,
  maxOperators,
}: UsePipelineEditorArgs) {
  const isEditable = mode === "editable";
  const canAddOperator = isEditable && operators.length < maxOperators;
  const lockedOperatorIdSet = useMemo(
    () => new Set(lockedOperatorIds),
    [lockedOperatorIds]
  );

  const isOperatorLocked = useCallback(
    (operatorId: string) => lockedOperatorIdSet.has(operatorId),
    [lockedOperatorIdSet]
  );

  const canInsertOperatorAt = useCallback(
    (insertIndex: number) => {
      const nextOperator = operators[insertIndex];

      return (
        canAddOperator &&
        (nextOperator === undefined || !lockedOperatorIdSet.has(nextOperator.id))
      );
    },
    [canAddOperator, lockedOperatorIdSet, operators]
  );

  const addOperator = useCallback(
    (insertIndex: number, type: PipelineOperatorType) => {
      if (!canInsertOperatorAt(insertIndex)) {
        return;
      }

      const nextOperator = createDefaultPipelineOperator(
        crypto.randomUUID(),
        type
      );
      const nextOperators = [...operators];
      nextOperators.splice(insertIndex, 0, nextOperator);
      onOperatorsChange?.(nextOperators);
    },
    [canInsertOperatorAt, onOperatorsChange, operators]
  );

  const updateOperator = useCallback(
    (updatedOperator: PipelineOperator) => {
      onOperatorsChange?.(
        operators.map((operator) =>
          operator.id === updatedOperator.id ? updatedOperator : operator
        )
      );
    },
    [onOperatorsChange, operators]
  );

  const removeOperator = useCallback(
    (operatorId: string) => {
      if (lockedOperatorIdSet.has(operatorId)) {
        return;
      }

      onOperatorsChange?.(
        operators.filter((operator) => operator.id !== operatorId)
      );
    },
    [lockedOperatorIdSet, onOperatorsChange, operators]
  );

  return {
    addOperator,
    canInsertOperatorAt,
    isEditable,
    isOperatorLocked,
    removeOperator,
    updateOperator,
  };
}
