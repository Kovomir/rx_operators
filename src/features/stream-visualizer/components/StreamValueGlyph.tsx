import type { StreamValue } from "../types";
import { STREAM_COLOR_STYLES } from "../constants";

type StreamValueGlyphProps = {
  streamValue: StreamValue;
  value: number;
};

export function StreamValueGlyph({
  streamValue,
  value,
}: StreamValueGlyphProps) {
  const colorStyle = STREAM_COLOR_STYLES[streamValue.color];

  return (
    <g>
      <ShapeGlyph streamValue={streamValue} />

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

function ShapeGlyph({ streamValue }: { streamValue: StreamValue }) {
  const colorStyle = STREAM_COLOR_STYLES[streamValue.color];

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
