import {
  ArrowRightIcon,
  FilterIcon, FlagIcon,
  PlusIcon,
  RadioIcon,
  Trash2Icon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

import {
  getOperatorCatalogItem,
  OPERATOR_CATALOG,
} from "../operator-catalog";
import type {
  PipelineEditorMode,
  PipelineOperator,
  PipelineOperatorType,
} from "../types";

type PipelineEditorProps = {
  operators: PipelineOperator[]
  onOperatorsChange?: (operators: PipelineOperator[]) => void
  mode?: PipelineEditorMode
  maxOperators?: number
  className?: string
}

const DEFAULT_MAX_OPERATORS = 6;

export function PipelineEditor({
  operators,
  onOperatorsChange,
  mode = "editable",
  maxOperators = DEFAULT_MAX_OPERATORS,
  className,
}: PipelineEditorProps) {
  const isEditable = mode === "editable";
  const canAddOperator = isEditable && operators.length < maxOperators;

  function addOperator(insertIndex: number, type: PipelineOperatorType) {
    if (!canAddOperator) {
      return;
    }

    const nextOperator: PipelineOperator = {
      id: createOperatorId(type),
      type,
    };

    const nextOperators = [...operators];
    nextOperators.splice(insertIndex, 0, nextOperator);
    onOperatorsChange?.(nextOperators);
  }

  function removeOperator(operatorId: string) {
    onOperatorsChange?.(
      operators.filter((operator) => operator.id !== operatorId)
    );
  }

  return (
    <div
      className={cn(
        "min-w-0 max-w-full overflow-hidden rounded-lg border bg-background shadow-sm",
        className
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b px-4 py-3">
        <div className="min-w-0">
          <h2 className="text-sm font-semibold text-foreground">
            Rx pipeline
          </h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Skládejte vlastní řetězce operátorů.
          </p>
        </div>

        <div className="flex shrink-0 items-center">
          <div className="rounded-md border bg-muted px-2 py-1 text-xs text-muted-foreground">
            {operators.length}/{maxOperators}
          </div>
        </div>
      </div>

      <div className="max-w-full overflow-x-auto scroll-smooth">
        <div className="flex min-h-64 min-w-max items-center gap-3 px-5 py-8">
          <EndpointNode variant="source" />

          {isEditable ? (
            <InsertSlot
              disabled={!canAddOperator}
              onAddOperator={(type) => addOperator(0, type)}
            />
          ) : (
            <FlowConnector />
          )}

          {operators.map((operator, index) => (
            <div key={operator.id} className="flex items-center gap-3">
              <OperatorNode
                operator={operator}
                editable={isEditable}
                onRemove={() => removeOperator(operator.id)}
              />

              {isEditable ? (
                <InsertSlot
                  disabled={!canAddOperator}
                  onAddOperator={(type) => addOperator(index + 1, type)}
                />
              ) : index < operators.length - 1 ? (
                <FlowConnector />
              ) : null}
            </div>
          ))}

          <EndpointNode variant="subscriber" />
        </div>
      </div>
    </div>
  );
}

type EndpointNodeProps = {
  variant: "source" | "subscriber"
}

function EndpointNode({ variant }: EndpointNodeProps) {
  const isSource = variant === "source";

  return (
    <div
      className="flex h-28 w-40 shrink-0 flex-col justify-between rounded-lg border bg-card p-3 text-card-foreground shadow-sm">
      <div className="flex items-center gap-2">
        {isSource ? (
          <span
            className={cn(
              "flex size-8 items-center justify-center rounded-md bg-sky-100 text-sky-700"
            )}>
          <RadioIcon className="size-4"/>
        </span>
        ) : (
          <span
            className={cn(
              "flex size-8 items-center justify-center rounded-md bg-sky-100 text-sky-700"
            )}>
          <FlagIcon className="size-4"/>
        </span>
        )}
        <span className="text-sm font-semibold">
          {isSource ? "Source" : "Subscriber"}
        </span>
      </div>
      <p className="text-xs leading-5 text-muted-foreground">
        {isSource ? "Vstup" : "Výstup"}
      </p>
    </div>
  );
}

type OperatorNodeProps = {
  operator: PipelineOperator
  editable: boolean
  onRemove: () => void
}

function OperatorNode({ operator, editable, onRemove }: OperatorNodeProps) {
  const catalogItem = getOperatorCatalogItem(operator.type);

  return (
    <div className="flex h-32 w-48 shrink-0 flex-col justify-between rounded-lg border bg-card p-3 text-card-foreground shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <OperatorIcon type={operator.type} />
          <div className="min-w-0">
            <div className="truncate text-sm font-semibold">
              {catalogItem?.label ?? operator.type}
            </div>
              <div className="mt-0.5 text-xs text-muted-foreground">
                Operátor
              </div>
          </div>
        </div>

        {editable && (
          <Button
            type="button"
              variant="ghost"
              size="icon-sm"
              className="text-muted-foreground hover:text-destructive"
              aria-label={`Odebrat operátor ${catalogItem?.label ?? operator.type}`}
              onClick={onRemove}
            >
            <Trash2Icon />
          </Button>
        )}
      </div>

      <div>
        <code className="rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground">
          {catalogItem?.expressionPreview}
        </code>
        <p className="mt-2 line-clamp-2 text-xs leading-5 text-muted-foreground">
          {catalogItem?.description}
        </p>
      </div>
    </div>
  );
}

type InsertSlotProps = {
  disabled: boolean
  onAddOperator: (type: PipelineOperatorType) => void
}

function InsertSlot({ disabled, onAddOperator }: InsertSlotProps) {
  return (
    <div className="flex shrink-0 items-center gap-3">
      <FlowConnector muted />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="outline"
            size="icon-lg"
            className="rounded-full border-dashed bg-background shadow-sm"
            aria-label="Přidat operátor"
            disabled={disabled}
          >
            <PlusIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          side="top"
          align="center"
          sideOffset={10}
          className="w-80 p-2"
        >
          <DropdownMenuLabel>Přidat operátor</DropdownMenuLabel>
          <div className="grid gap-1">
            {OPERATOR_CATALOG.map((operator) => (
              <DropdownMenuItem
                key={operator.type}
                className="items-start gap-3 p-2"
                onSelect={() => onAddOperator(operator.type)}
              >
                <OperatorIcon type={operator.type} />
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold">
                    {operator.label}
                  </span>
                  <span className="mt-0.5 block text-xs leading-5 text-muted-foreground">
                    {operator.description}
                  </span>
                </span>
                <code className="rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground">
                  {operator.expressionPreview}
                </code>
              </DropdownMenuItem>
            ))}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
      <FlowConnector muted />
    </div>
  );
}

function FlowConnector({ muted = false }: { muted?: boolean }) {
  return (
    <div
      className={cn(
        "flex w-10 shrink-0 items-center justify-center",
        muted && "opacity-50"
      )}
      aria-hidden="true"
    >
      <span className="h-px flex-1 bg-border" />
      <ArrowRightIcon className="size-4 text-muted-foreground" />
    </div>
  );
}

function OperatorIcon({ type }: { type: PipelineOperatorType }) {
  if (type === "filter") {
    return (
      <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-amber-100 text-amber-700">
        <FilterIcon className="size-4" />
      </span>
    );
  }

  return (
    <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-violet-100 text-violet-700">
      <span className="text-sm font-semibold">f</span>
    </span>
  );
}

function createOperatorId(type: PipelineOperatorType) {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${type}-${crypto.randomUUID()}`;
  }

  return `${type}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
