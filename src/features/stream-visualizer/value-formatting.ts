import type { StreamValue } from "./types";

const MAX_DISPLAY_NUMBER = 999;
const MIN_DISPLAY_NUMBER = -999;
export const ERROR_VALUE_LABEL = "ERR";

export function formatDisplayNumber(value: number) {
  if (value > MAX_DISPLAY_NUMBER) {
    return `+${MAX_DISPLAY_NUMBER}`;
  }

  if (value < MIN_DISPLAY_NUMBER) {
    return String(MIN_DISPLAY_NUMBER);
  }

  return String(value);
}

export function formatStreamValueLabel(value: StreamValue, caption?: string) {
  const displayValue = value.kind === "error"
    ? ERROR_VALUE_LABEL
    : formatDisplayNumber(value.value);
  const label = `${displayValue}, ${value.color}, ${value.shape}`;
  return caption ? `${label}, ${caption}` : label;
}
