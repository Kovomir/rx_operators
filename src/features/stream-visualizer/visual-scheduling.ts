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
