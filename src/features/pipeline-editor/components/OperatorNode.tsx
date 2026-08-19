import { Trash2Icon } from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  getOperatorCatalogItem,
  getOperatorExpressionPreview,
} from "../operator-catalog";
import type { PipelineOperator } from "../types";
import { OperatorConfigControls } from "./OperatorConfigControls";
import { OperatorIcon } from "./OperatorIcon";

type OperatorNodeProps = {
  operator: PipelineOperator;
  editable: boolean;
  removable: boolean;
  onChange: (operator: PipelineOperator) => void;
  onRemove: () => void;
};

export function OperatorNode({
  operator,
  editable,
  removable,
  onChange,
  onRemove,
}: OperatorNodeProps) {
  const catalogItem = getOperatorCatalogItem(operator.type);
  const operatorLabel = catalogItem?.label ?? operator.type;

  return (
    <div className="flex h-48 w-64 shrink-0 flex-col justify-between rounded-lg border bg-card p-3 text-card-foreground shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <OperatorIcon type={operator.type} />
          <div className="min-w-0">
            <div className="truncate text-sm font-semibold">
              {operatorLabel}
            </div>
            <div className="mt-0.5 text-xs text-muted-foreground">
              Operátor
            </div>
          </div>
        </div>

        {editable && removable && (
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="text-muted-foreground hover:text-destructive"
            aria-label={`Odebrat operátor ${operatorLabel}`}
            onClick={onRemove}
          >
            <Trash2Icon />
          </Button>
        )}
      </div>

      <OperatorConfigControls
        operator={operator}
        disabled={!editable}
        onChange={onChange}
      />

      <code className="w-fit rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground">
        {getOperatorExpressionPreview(operator)}
      </code>
    </div>
  );
}
