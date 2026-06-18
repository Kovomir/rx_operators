import type { StreamColor, StreamShape } from "@/features/pipeline-editor";

export const DEFAULT_STREAM_VALUE_COUNT = 10;

export const EMIT_GAP_MS = 420;
export const MOVE_DURATION_MS = 560;
export const OPERATOR_PAUSE_MS = 220;
export const MAP_PULSE_MS = 180;
export const DROP_DURATION_MS = 320;

export const SVG_HEIGHT = 440;
export const SVG_PADDING_X = 72;
export const STAGE_SPACING = 220;
export const TRACK_Y = 268;
export const LANE_COUNT = 5;
export const LANE_GAP = 50;

export const STREAM_COLOR_STYLES: Record<
  StreamColor,
  { fill: string; stroke: string; text: string }
> = {
  red: {
    fill: "#fee2e2",
    stroke: "#ef4444",
    text: "#7f1d1d",
  },
  blue: {
    fill: "#dbeafe",
    stroke: "#3b82f6",
    text: "#1e3a8a",
  },
  green: {
    fill: "#dcfce7",
    stroke: "#22c55e",
    text: "#14532d",
  },
};

export const DROPPED_STREAM_COLOR_STYLES: typeof STREAM_COLOR_STYLES = {
  red: {
    fill: "#e4d8d8",
    stroke: "#a86b6b",
    text: "#684343",
  },
  blue: {
    fill: "#d4ddeb",
    stroke: "#6485b7",
    text: "#3b4f72",
  },
  green: {
    fill: "#d7ded9",
    stroke: "#6d9274",
    text: "#405b46",
  },
};

export const STREAM_SHAPES: StreamShape[] = ["circle", "square", "triangle"];
export const STREAM_COLORS: StreamColor[] = ["red", "blue", "green"];
