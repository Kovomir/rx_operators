import type { PipelineOperator } from "../types";
import { FilterConfigControls } from "./operator-config-controls/FilterConfigControls";
import {
  DebounceTimeConfigControls,
  DelayConfigControls,
  MapConfigControls,
  NoConfigControls,
  SkipConfigControls,
  StartWithConfigControls,
  TakeConfigControls,
} from "./operator-config-controls/ScalarConfigControls";

type OperatorConfigControlsProps = {
  operator: PipelineOperator;
  disabled: boolean;
  onChange: (operator: PipelineOperator) => void;
};

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
    case "skip":
      return (
        <SkipConfigControls
          operator={operator}
          disabled={disabled}
          onChange={onChange}
        />
      );
    case "take":
      return (
        <TakeConfigControls
          operator={operator}
          disabled={disabled}
          onChange={onChange}
        />
      );
    case "distinctUntilChanged":
      return <NoConfigControls label="prev !== curr" />;
    case "tap":
      return <NoConfigControls label="console.log" />;
    case "startWith":
      return (
        <StartWithConfigControls
          operator={operator}
          disabled={disabled}
          onChange={onChange}
        />
      );
    case "scan":
      return <NoConfigControls label="acc + value" />;
    case "debounceTime":
      return (
        <DebounceTimeConfigControls
          operator={operator}
          disabled={disabled}
          onChange={onChange}
        />
      );
    case "catchError":
      return (
        <NoConfigControls label={`náhrada ${operator.config.replacementValue}`} />
      );
    case "delay":
      return (
        <DelayConfigControls
          operator={operator}
          disabled={disabled}
          onChange={onChange}
        />
      );
  }
}
