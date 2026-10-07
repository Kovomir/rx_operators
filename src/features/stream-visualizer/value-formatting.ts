const MAX_DISPLAY_NUMBER = 999;
const MIN_DISPLAY_NUMBER = -999;

export function formatDisplayNumber(value: number) {
  if (value > MAX_DISPLAY_NUMBER) {
    return `+${MAX_DISPLAY_NUMBER}`;
  }

  if (value < MIN_DISPLAY_NUMBER) {
    return String(MIN_DISPLAY_NUMBER);
  }

  return String(value);
}
