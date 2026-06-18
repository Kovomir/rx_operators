import {
  ArrowRightIcon,
  FilterIcon,
  FlagIcon,
  PlusIcon,
  RadioIcon,
  Trash2Icon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

import {
  FILTER_TARGET_LABELS,
  getOperatorCatalogItem,
  getOperatorExpressionPreview,
  OPERATOR_CATALOG,
  STREAM_COLOR_LABELS,
  STREAM_SHAPE_LABELS,
  STREAM_VALUE_KIND_LABELS,
} from "../operator-catalog";
import { createDefaultPipelineOperator } from "../operator-defaults";
import type {
  FilterPipelineOperator,
  FilterTarget,
  MapOperation,
  MapPipelineOperator,
  PipelineEditorMode,
  PipelineOperator,
  PipelineOperatorType,
  StreamColor,
  StreamShape,
  StreamValueKind,
} from "../types";

type PipelineEditorProps = {
  operators: PipelineOperator[];
  onOperatorsChange?: (operators: PipelineOperator[]) => void;
  mode?: PipelineEditorMode;
  maxOperators?: number;
  className?: string;
};

type SelectOption<TValue extends string | number> = {
  value: TValue;
  label: string;
};

const DEFAULT_MAX_OPERATORS = 6;

const MAP_OPERATION_OPTIONS: SelectOption<MapOperation>[] = [
  { value: "add", label: "+" },
  { value: "subtract", label: "-" },
  { value: "multiply", label: "*" },
];

const MAP_OPERAND_OPTIONS: SelectOption<number>[] = Array.from(
  { length: 11 },
  (_, value) => ({
    value,
    label: String(value),
  })
);

const FILTER_TARGET_OPTIONS: SelectOption<FilterTarget>[] = [
  { value: "color", label: "Barva" },
  { value: "shape", label: "Tvar" },
  { value: "value", label: "Hodnota" },
];

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

    const nextOperator = createDefaultPipelineOperator(
      crypto.randomUUID(),
      type
    );
    const nextOperators = [...operators];
    nextOperators.splice(insertIndex, 0, nextOperator);
    onOperatorsChange?.(nextOperators);
  }

  function updateOperator(updatedOperator: PipelineOperator) {
    onOperatorsChange?.(
      operators.map((operator) =>
        operator.id === updatedOperator.id ? updatedOperator : operator
      )
    );
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
            Skládejte vlastní řetězce operátorů a nastavujte jejich parametry.
          </p>
        </div>

        <div className="flex shrink-0 items-center">
          <div className="rounded-md border bg-muted px-2 py-1 text-xs text-muted-foreground">
            {operators.length}/{maxOperators}
          </div>
        </div>
      </div>

      <div className="max-w-full overflow-x-auto scroll-smooth">
        <div className="flex min-h-72 min-w-max items-center gap-3 px-5 py-8">
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
                onChange={updateOperator}
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
  variant: "source" | "subscriber";
};

function EndpointNode({ variant }: EndpointNodeProps) {
  const isSource = variant === "source";

  return (
    <div className="flex h-36 w-40 shrink-0 flex-col justify-between rounded-lg border bg-card p-3 text-card-foreground shadow-sm">
      <div className="flex items-center gap-2">
        <span
          className={cn(
            "flex size-8 items-center justify-center rounded-md",
            isSource
              ? "bg-sky-100 text-sky-700"
              : "bg-emerald-100 text-emerald-700"
          )}
        >
          {isSource ? (
            <RadioIcon className="size-4" />
          ) : (
            <FlagIcon className="size-4" />
          )}
        </span>
        <span className="text-sm font-semibold">
          {isSource ? "Source" : "Subscriber"}
        </span>
      </div>
      <p className="text-xs leading-5 text-muted-foreground">
        {isSource ? "Vstupní hodnoty" : "Výstup pipeline"}
      </p>
    </div>
  );
}

type OperatorNodeProps = {
  operator: PipelineOperator;
  editable: boolean;
  onChange: (operator: PipelineOperator) => void;
  onRemove: () => void;
};

function OperatorNode({
  operator,
  editable,
  onChange,
  onRemove,
}: OperatorNodeProps) {
  const catalogItem = getOperatorCatalogItem(operator.type);

  return (
    <div className="flex h-48 w-64 shrink-0 flex-col justify-between rounded-lg border bg-card p-3 text-card-foreground shadow-sm">
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
            aria-label={`Odebrat operátor ${
              catalogItem?.label ?? operator.type
            }`}
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

type OperatorConfigControlsProps = {
  operator: PipelineOperator;
  disabled: boolean;
  onChange: (operator: PipelineOperator) => void;
};

function OperatorConfigControls({
  operator,
  disabled,
  onChange,
}: OperatorConfigControlsProps) {
  switch (operator.type) {
    case "map":
      return (
        <MapConfigControls
          operator={operator}
          disabled={disabled}
          onChange={onChange}
        />
      );
    case "filter":
      return (
        <FilterConfigControls
          operator={operator}
          disabled={disabled}
          onChange={onChange}
        />
      );
  }
}

type MapConfigControlsProps = {
  operator: MapPipelineOperator;
  disabled: boolean;
  onChange: (operator: PipelineOperator) => void;
};

function MapConfigControls({
  operator,
  disabled,
  onChange,
}: MapConfigControlsProps) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_5rem] gap-2">
      <label className="grid gap-1 text-xs text-muted-foreground">
        Operace
        <Select
          value={operator.config.operation}
          disabled={disabled}
          onValueChange={(operation) =>
            onChange({
              ...operator,
              config: {
                ...operator.config,
                operation: operation as MapOperation,
              },
            })
          }
        >
          <SelectTrigger className="w-full text-xs font-normal">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {MAP_OPERATION_OPTIONS.map((option) => (
              <SelectItem
                key={option.value}
                value={option.value}
                className="text-xs"
              >
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </label>

      <label className="grid gap-1 text-xs text-muted-foreground">
        Číslo
        <Select
          value={String(operator.config.operand)}
          disabled={disabled}
          onValueChange={(operand) =>
            onChange({
              ...operator,
              config: {
                ...operator.config,
                operand: Number(operand),
              },
            })
          }
        >
          <SelectTrigger className="w-full text-xs font-normal">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {MAP_OPERAND_OPTIONS.map((option) => (
              <SelectItem
                key={option.value}
                value={String(option.value)}
                className="text-xs"
              >
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </label>
    </div>
  );
}

type FilterConfigControlsProps = {
  operator: FilterPipelineOperator;
  disabled: boolean;
  onChange: (operator: PipelineOperator) => void;
};

function FilterConfigControls({
  operator,
  disabled,
  onChange,
}: FilterConfigControlsProps) {
  const summary = getFilterSelectionSummary(operator);

  return (
    <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] gap-2">
      <label className="grid gap-1 text-xs text-muted-foreground">
        Typ
        <Select
          value={operator.config.target}
          disabled={disabled}
          onValueChange={(target) =>
            onChange({
              ...operator,
              config: {
                ...operator.config,
                target: target as FilterTarget,
              },
            })
          }
        >
          <SelectTrigger className="w-full text-xs font-normal">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {FILTER_TARGET_OPTIONS.map((option) => (
              <SelectItem
                key={option.value}
                value={option.value}
                className="text-xs"
              >
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </label>

      <div className="grid gap-1 text-xs text-muted-foreground">
        Hodnoty
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant="outline"
              size="default"
              className="h-8 min-w-0 justify-between px-2 text-xs font-normal"
              disabled={disabled}
            >
              <span className="min-w-0 truncate">{summary}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-52 text-xs">
            <DropdownMenuLabel>
              {FILTER_TARGET_LABELS[operator.config.target]}
            </DropdownMenuLabel>
            <FilterChoiceItems operator={operator} onChange={onChange} />
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

type FilterChoiceItemsProps = {
  operator: FilterPipelineOperator;
  onChange: (operator: PipelineOperator) => void;
};

function FilterChoiceItems({ operator, onChange }: FilterChoiceItemsProps) {
  switch (operator.config.target) {
    case "color":
      return (
        <>
          {Object.entries(STREAM_COLOR_LABELS).map(([color, label]) => (
            <DropdownMenuCheckboxItem
              key={color}
              checked={operator.config.allowedColors.includes(
                color as StreamColor
              )}
              onSelect={(event) => event.preventDefault()}
              onCheckedChange={(checked) =>
                onChange({
                  ...operator,
                  config: {
                    ...operator.config,
                    allowedColors: updateSelection(
                      operator.config.allowedColors,
                      color as StreamColor,
                      checked
                    ),
                  },
                })
              }
            >
              {label}
            </DropdownMenuCheckboxItem>
          ))}
        </>
      );
    case "shape":
      return (
        <>
          {Object.entries(STREAM_SHAPE_LABELS).map(([shape, label]) => (
            <DropdownMenuCheckboxItem
              key={shape}
              checked={operator.config.allowedShapes.includes(
                shape as StreamShape
              )}
              onSelect={(event) => event.preventDefault()}
              onCheckedChange={(checked) =>
                onChange({
                  ...operator,
                  config: {
                    ...operator.config,
                    allowedShapes: updateSelection(
                      operator.config.allowedShapes,
                      shape as StreamShape,
                      checked
                    ),
                  },
                })
              }
            >
              {label}
            </DropdownMenuCheckboxItem>
          ))}
        </>
      );
    case "value":
      return (
        <>
          {Object.entries(STREAM_VALUE_KIND_LABELS).map(([kind, label]) => (
            <DropdownMenuCheckboxItem
              key={kind}
              checked={operator.config.allowedValueKinds.includes(
                kind as StreamValueKind
              )}
              onSelect={(event) => event.preventDefault()}
              onCheckedChange={(checked) =>
                onChange({
                  ...operator,
                  config: {
                    ...operator.config,
                    allowedValueKinds: updateSelection(
                      operator.config.allowedValueKinds,
                      kind as StreamValueKind,
                      checked
                    ),
                  },
                })
              }
            >
              {label}
            </DropdownMenuCheckboxItem>
          ))}
        </>
      );
  }
}

type InsertSlotProps = {
  disabled: boolean;
  onAddOperator: (type: PipelineOperatorType) => void;
};

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
  switch (type) {
    case "filter":
      return (
        <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-amber-100 text-amber-700">
          <FilterIcon className="size-4" />
        </span>
      );
    case "map":
      return (
        <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-violet-100 text-violet-700">
          <span className="text-sm font-semibold">f</span>
        </span>
      );
  }
}

function getFilterSelectionSummary(operator: FilterPipelineOperator) {
  switch (operator.config.target) {
    case "color":
      return summarizeSelection(
        operator.config.allowedColors,
        STREAM_COLOR_LABELS
      );
    case "shape":
      return summarizeSelection(
        operator.config.allowedShapes,
        STREAM_SHAPE_LABELS
      );
    case "value":
      return summarizeSelection(
        operator.config.allowedValueKinds,
        STREAM_VALUE_KIND_LABELS
      );
  }
}

function summarizeSelection<TValue extends string>(
  values: TValue[],
  labels: Record<TValue, string>
) {
  if (values.length === 0) {
    return "Nic";
  }

  if (values.length === Object.keys(labels).length) {
    return "Vše";
  }

  return values.map((value) => labels[value]).join(", ");
}

function updateSelection<TValue>(
  values: TValue[],
  value: TValue,
  checked: boolean | "indeterminate"
) {
  if (checked === true) {
    return values.includes(value) ? values : [...values, value];
  }

  return values.filter((currentValue) => currentValue !== value);
}
