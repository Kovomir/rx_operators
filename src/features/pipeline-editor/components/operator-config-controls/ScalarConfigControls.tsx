import type {
  DebounceTimePipelineOperator,
  DelayPipelineOperator,
  MapOperation,
  MapPipelineOperator,
  PipelineOperator,
  SkipPipelineOperator,
  StartWithPipelineOperator,
  TakePipelineOperator,
} from "../../types";
import {
  DELAY_DURATION_OPTIONS,
  MAP_OPERAND_OPTIONS,
  MAP_OPERATION_OPTIONS,
  SKIP_COUNT_OPTIONS,
  START_WITH_VALUE_OPTIONS,
  TAKE_COUNT_OPTIONS,
  TIME_DURATION_OPTIONS,
} from "./options";
import { SelectField } from "./SelectField";

type ConfigControlProps<TOperator extends PipelineOperator> = {
  operator: TOperator;
  disabled: boolean;
  onChange: (operator: PipelineOperator) => void;
};

export function MapConfigControls({
  operator,
  disabled,
  onChange,
}: ConfigControlProps<MapPipelineOperator>) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_3.75rem] gap-1.5">
      <SelectField
        label="Operace"
        value={operator.config.operation}
        options={MAP_OPERATION_OPTIONS}
        disabled={disabled}
        onValueChange={(operation: MapOperation) =>
          onChange({
            ...operator,
            config: {
              ...operator.config,
              operation,
            },
          })
        }
      />
      <SelectField
        label="Číslo"
        value={operator.config.operand}
        options={MAP_OPERAND_OPTIONS}
        disabled={disabled}
        onValueChange={(operand) =>
          onChange({
            ...operator,
            config: {
              ...operator.config,
              operand,
            },
          })
        }
      />
    </div>
  );
}

export function SkipConfigControls({
  operator,
  disabled,
  onChange,
}: ConfigControlProps<SkipPipelineOperator>) {
  return (
    <SelectField
      label="Počet"
      value={operator.config.count}
      options={SKIP_COUNT_OPTIONS}
      disabled={disabled}
      onValueChange={(count) =>
        onChange({ ...operator, config: { ...operator.config, count } })
      }
    />
  );
}

export function TakeConfigControls({
  operator,
  disabled,
  onChange,
}: ConfigControlProps<TakePipelineOperator>) {
  return (
    <SelectField
      label="Počet"
      value={operator.config.count}
      options={TAKE_COUNT_OPTIONS}
      disabled={disabled}
      onValueChange={(count) =>
        onChange({ ...operator, config: { ...operator.config, count } })
      }
    />
  );
}

export function StartWithConfigControls({
  operator,
  disabled,
  onChange,
}: ConfigControlProps<StartWithPipelineOperator>) {
  return (
    <SelectField
      label="Hodnota"
      value={operator.config.value}
      options={START_WITH_VALUE_OPTIONS}
      disabled={disabled}
      onValueChange={(value) =>
        onChange({ ...operator, config: { ...operator.config, value } })
      }
    />
  );
}

export function DebounceTimeConfigControls({
  operator,
  disabled,
  onChange,
}: ConfigControlProps<DebounceTimePipelineOperator>) {
  return (
    <SelectField
      label="Interval"
      value={operator.config.durationMs}
      options={TIME_DURATION_OPTIONS}
      disabled={disabled}
      onValueChange={(durationMs) =>
        onChange({ ...operator, config: { ...operator.config, durationMs } })
      }
    />
  );
}

export function DelayConfigControls({
  operator,
  disabled,
  onChange,
}: ConfigControlProps<DelayPipelineOperator>) {
  return (
    <SelectField
      label="Zpoždění"
      value={operator.config.durationMs}
      options={DELAY_DURATION_OPTIONS}
      disabled={disabled}
      onValueChange={(durationMs) =>
        onChange({ ...operator, config: { ...operator.config, durationMs } })
      }
    />
  );
}

export function NoConfigControls({ label }: { label: string }) {
  return (
    <div className="rounded-md border border-dashed px-2 py-2 text-xs text-muted-foreground">
      {label}
    </div>
  );
}
