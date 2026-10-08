import type { FilterTarget, MapOperation } from "../../types";

export type SelectOption<TValue extends string | number> = {
  value: TValue;
  label: string;
};

export const MAP_OPERATION_OPTIONS: SelectOption<MapOperation>[] = [
  { value: "add", label: "+" },
  { value: "subtract", label: "-" },
  { value: "multiply", label: "*" },
];

export const MAP_OPERAND_OPTIONS: SelectOption<number>[] = createNumberOptions(
  0,
  10
);

export const FILTER_TARGET_OPTIONS: SelectOption<FilterTarget>[] = [
  { value: "color", label: "Barva" },
  { value: "shape", label: "Tvar" },
  { value: "value", label: "Hodnota" },
];

export const SKIP_COUNT_OPTIONS: SelectOption<number>[] = createNumberOptions(
  1,
  10
);

export const TAKE_COUNT_OPTIONS: SelectOption<number>[] = createNumberOptions(
  0,
  10
);

export const START_WITH_VALUE_OPTIONS: SelectOption<number>[] =
  createNumberOptions(0, 10);

export const TIME_DURATION_OPTIONS: SelectOption<number>[] = [
  { value: 300, label: "300 ms" },
  { value: 500, label: "500 ms" },
  { value: 800, label: "800 ms" },
  { value: 1000, label: "1000 ms" },
];

export const DELAY_DURATION_OPTIONS: SelectOption<number>[] = [
  { value: 1000, label: "1000 ms" },
  { value: 3000, label: "3000 ms" },
  { value: 5000, label: "5000 ms" },
  { value: 9999, label: "9999 ms" },
];

function createNumberOptions(min: number, max: number): SelectOption<number>[] {
  return Array.from({ length: max - min + 1 }, (_, index) => {
    const value = min + index;

    return {
      value,
      label: String(value),
    };
  });
}
