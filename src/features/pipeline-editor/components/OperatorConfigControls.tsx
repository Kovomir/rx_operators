import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
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

import {
  FILTER_TARGET_LABELS,
  STREAM_COLOR_LABELS,
  STREAM_SHAPE_LABELS,
  STREAM_VALUE_KIND_LABELS,
} from "../operator-catalog";
import type {
  FilterPipelineOperator,
  FilterTarget,
  MapOperation,
  MapPipelineOperator,
  PipelineOperator,
  StreamColor,
  StreamShape,
  StreamValueKind,
} from "../types";

type OperatorConfigControlsProps = {
  operator: PipelineOperator;
  disabled: boolean;
  onChange: (operator: PipelineOperator) => void;
};

type SelectOption<TValue extends string | number> = {
  value: TValue;
  label: string;
};

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

export function OperatorConfigControls({
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
    <div className="grid grid-cols-[minmax(0,1fr)_3.75rem] gap-1.5">
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
    <div className="grid grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] gap-1.5">
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
