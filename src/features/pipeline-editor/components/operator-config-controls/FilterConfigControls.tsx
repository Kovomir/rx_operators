import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  FILTER_TARGET_LABELS,
  STREAM_COLOR_LABELS,
  STREAM_SHAPE_LABELS,
  STREAM_VALUE_KIND_LABELS,
} from "../../operator-catalog";
import type {
  FilterPipelineOperator,
  FilterTarget,
  PipelineOperator,
  StreamColor,
  StreamShape,
  StreamValueKind,
} from "../../types";
import { FILTER_TARGET_OPTIONS } from "./options";
import { SelectField } from "./SelectField";

type FilterConfigControlsProps = {
  operator: FilterPipelineOperator;
  disabled: boolean;
  onChange: (operator: PipelineOperator) => void;
};

export function FilterConfigControls({
  operator,
  disabled,
  onChange,
}: FilterConfigControlsProps) {
  const summary = getFilterSelectionSummary(operator);

  return (
    <div className="grid grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] gap-1.5">
      <SelectField
        label="Typ"
        value={operator.config.target}
        options={FILTER_TARGET_OPTIONS}
        disabled={disabled}
        onValueChange={(target: FilterTarget) =>
          onChange({
            ...operator,
            config: {
              ...operator.config,
              target,
            },
          })
        }
      />

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
