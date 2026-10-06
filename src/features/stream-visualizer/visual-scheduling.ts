export type VisualWindowReservation = {
  delayMs: number;
  endTimeMs: number;
  startTimeMs: number;
};

export function reserveVisualWindow(
  clockById: Map<string, number>,
  id: string,
  durationMs: number,
  nowMs: number
): VisualWindowReservation {
  const currentTimeMs = clockById.get(id) ?? nowMs;
  const startTimeMs = Math.max(nowMs, currentTimeMs);
  const endTimeMs = startTimeMs + durationMs;

  clockById.set(id, endTimeMs);

  return {
    delayMs: startTimeMs - nowMs,
    endTimeMs,
    startTimeMs,
  };
}

export function reserveOrderedVisualStart(
  nextStartById: Map<string, number>,
  id: string,
  minStartGapMs: number,
  nowMs: number
): VisualWindowReservation {
  const startTimeMs = Math.max(nowMs, nextStartById.get(id) ?? nowMs);
  const endTimeMs = startTimeMs + minStartGapMs;

  nextStartById.set(id, endTimeMs);

  return {
    delayMs: startTimeMs - nowMs,
    endTimeMs,
    startTimeMs,
  };
}
