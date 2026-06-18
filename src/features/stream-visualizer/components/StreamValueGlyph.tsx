import type { StreamValue, ValueAnimationStatus } from "../types";
import {
  DROPPED_STREAM_COLOR_STYLES,
  STREAM_COLOR_STYLES,
} from "../constants";

type StreamValueGlyphProps = {
  streamValue: StreamValue;
  value: number;
  status?: ValueAnimationStatus;
};

export function StreamValueGlyph({
  streamValue,
  value,
  status,
}: StreamValueGlyphProps) {
  const isDropped = status === "dropped";
  const colorStyle = isDropped
    ? DROPPED_STREAM_COLOR_STYLES[streamValue.color]
    : STREAM_COLOR_STYLES[streamValue.color];

  return (
    <g>
      <ShapeGlyph streamValue={streamValue} colorStyle={colorStyle} />
      {isDropped && <FilteredOutMark />}

      <text
        textAnchor="middle"
        dominantBaseline="central"
        className="select-none text-[11px] font-semibold"
        fill={colorStyle.text}
      >
        {value}
      </text>
    </g>
  );
}

function FilteredOutMark() {
  return (
    <g className="pointer-events-none">
      <line
        x1="-12"
        y1="12"
        x2="12"
        y2="-12"
        stroke="var(--muted-foreground)"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.7"
      />
    </g>
  );
}

type ShapeGlyphProps = {
  streamValue: StreamValue;
  colorStyle: {
    fill: string;
    stroke: string;
    text: string;
  };
};

function ShapeGlyph({ streamValue, colorStyle }: ShapeGlyphProps) {
  switch (streamValue.shape) {
    case "circle":
      return (
        <circle
          r="16"
          fill={colorStyle.fill}
          stroke={colorStyle.stroke}
          strokeWidth="2"
        />
      );
    case "square":
      return (
        <rect
          x="-15"
          y="-15"
          width="30"
          height="30"
          rx="6"
          fill={colorStyle.fill}
          stroke={colorStyle.stroke}
          strokeWidth="2"
        />
      );
    case "triangle":
      return (
        <path
          d="M 0 -18 L 17 14 L -17 14 Z"
          fill={colorStyle.fill}
          stroke={colorStyle.stroke}
          strokeWidth="2"
          strokeLinejoin="round"
        />
      );
  }
}
