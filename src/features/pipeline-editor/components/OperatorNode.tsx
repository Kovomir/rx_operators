import { Trash2Icon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
  selected?: boolean;
  onChange: (operator: PipelineOperator) => void;
  onRemove: () => void;
  onSelect?: () => void;
};

export function OperatorNode({
  operator,
  editable,
  removable,
  selected,
  onChange,
  onRemove,
  onSelect,
}: OperatorNodeProps) {
  const catalogItem = getOperatorCatalogItem(operator.type);
  const operatorLabel = catalogItem?.label ?? operator.type;

  return (
    <div
      className={cn(
        "flex h-44 w-48 shrink-0 cursor-pointer flex-col justify-between rounded-md border bg-card p-2.5 text-card-foreground shadow-sm outline-none transition-colors",
        "hover:border-primary/35 hover:bg-primary/5 focus-visible:ring-2 focus-visible:ring-ring",
        selected && "border-primary bg-primary/5 ring-2 ring-primary/20"
      )}
      role="button"
      tabIndex={0}
      aria-pressed={selected}
      onClick={onSelect}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onSelect?.();
        }
      }}
    >
      <div className="flex items-start justify-between gap-1.5">
        <div className="flex min-w-0 items-center gap-1.5">
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
            onClick={(event) => {
              event.stopPropagation();
              onRemove();
            }}
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

      <code className="block max-w-full truncate rounded-md bg-muted px-1.5 py-1 text-xs text-muted-foreground">
        {getOperatorExpressionPreview(operator)}
      </code>
    </div>
  );
}
