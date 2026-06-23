import {
  DEFAULT_STREAM_VALUE_COUNT,
  STREAM_COLORS,
  STREAM_SHAPES,
} from "./constants";
import type { StreamValue } from "./types";

export function createDefaultStreamValues(
  count = DEFAULT_STREAM_VALUE_COUNT
): StreamValue[] {
  return Array.from({ length: count }, () => ({
    id: crypto.randomUUID(),
    shape: pickRandom(STREAM_SHAPES),
    color: pickRandom(STREAM_COLORS),
    value: Math.floor(Math.random() * 11),
  }));
}

function pickRandom<TValue>(values: TValue[]) {
  return values[Math.floor(Math.random() * values.length)];
}
