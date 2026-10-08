import { useEffect, useMemo, useState } from "react";

import type { StreamValue, ValueAnimationStatus } from "../types";
import {
  DROPPED_STREAM_COLOR_STYLES,
  STREAM_COLOR_STYLES,
} from "../constants";
import { formatDisplayNumber } from "../value-formatting";

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
  const isTapped = status === "tapped";
  const colorStyle = isDropped
    ? DROPPED_STREAM_COLOR_STYLES[streamValue.color]
    : STREAM_COLOR_STYLES[streamValue.color];
  const hasTimer = streamValue.timerDurationMs !== undefined;
  const displayValue = formatDisplayNumber(value);

  return (
    <g>
      {streamValue.label ? (
        <TextValueGlyph
          label={streamValue.label}
          timerDurationMs={streamValue.timerDurationMs}
          timerFadeDurationMs={streamValue.timerFadeDurationMs}
          timerOpacity={streamValue.timerOpacity}
          timerShowCompleteMark={streamValue.timerShowCompleteMark}
          timerStoppedAtMs={streamValue.timerStoppedAtMs}
          colorStyle={colorStyle}
        />
      ) : (
        <ShapeGlyph streamValue={streamValue} colorStyle={colorStyle} />
      )}
      {isTapped && <TapEffectMark />}
      {isDropped && <FilteredOutMark />}

      {!streamValue.label && (
        <text
          textAnchor="middle"
          dominantBaseline="central"
          className="select-none text-[11px] font-semibold"
          fill={colorStyle.text}
        >
          {displayValue}
        </text>
      )}
      {!streamValue.label && hasTimer && (
        <ShapeTimerOverlay streamValue={streamValue} />
      )}
    </g>
  );
}

function ShapeTimerOverlay({ streamValue }: { streamValue: StreamValue }) {
  const timer = useGlyphTimer(
    streamValue.timerDurationMs,
    streamValue.timerStoppedAtMs
  );

  if (!timer) {
    return null;
  }

  return (
    <>
      <text
        y="28"
        textAnchor="middle"
        dominantBaseline="central"
        className="select-none font-mono text-[9px] font-medium"
        fill="var(--muted-foreground)"
        style={{
          opacity: streamValue.timerOpacity ?? 1,
          transition: `opacity ${streamValue.timerFadeDurationMs ?? 0}ms ease-in-out`,
        }}
      >
        {timer.text}
      </text>
      {(streamValue.timerShowCompleteMark ?? true) && timer.isComplete && (
        <TimerCompleteMark width={30} />
      )}
    </>
  );
}

function TextValueGlyph({
  colorStyle,
  label,
  timerDurationMs,
  timerFadeDurationMs = 0,
  timerOpacity = 1,
  timerShowCompleteMark = true,
  timerStoppedAtMs,
}: {
  colorStyle: {
    fill: string;
    stroke: string;
    text: string;
  };
  label: string;
  timerDurationMs?: number;
  timerFadeDurationMs?: number;
  timerOpacity?: number;
  timerShowCompleteMark?: boolean;
  timerStoppedAtMs?: number;
}) {
  const displayLabel = label.length > 16 ? `${label.slice(0, 15)}...` : label;
  const width = Math.max(42, Math.min(132, displayLabel.length * 8 + 22));
  const timer = useGlyphTimer(timerDurationMs, timerStoppedAtMs);
  const timerText = timer?.text;
  const height = timerText ? 42 : 32;

  return (
    <g>
      <rect
        x={-width / 2}
        y={-height / 2}
        width={width}
        height={height}
        rx="7"
        fill={colorStyle.fill}
        stroke={colorStyle.stroke}
        strokeWidth="2"
      />
      <text
        textAnchor="middle"
        dominantBaseline={timerText ? "auto" : "central"}
        y={timerText ? -3 : undefined}
        className="select-none font-mono text-[11px] font-semibold"
        fill={colorStyle.text}
      >
        {displayLabel}
      </text>
      {timerText && (
        <text
          y="12"
          textAnchor="middle"
          dominantBaseline="central"
          className="select-none font-mono text-[9px] font-medium"
          fill="var(--muted-foreground)"
          style={{
            opacity: timerOpacity,
            transition: `opacity ${timerFadeDurationMs}ms ease-in-out`,
          }}
        >
          {timerText}
        </text>
      )}
      {timerShowCompleteMark && timer?.isComplete && (
        <TimerCompleteMark width={width} />
      )}
    </g>
  );
}

function TimerCompleteMark({
  width,
}: {
  width: number;
}) {
  const checkX = width / 2 + 6;

  return (
    <g className="pointer-events-none">
      <circle
        cx={checkX}
        cy="0"
        r="8"
        fill="#dcfce7"
        stroke="#22c55e"
        strokeWidth="1.5"
      />
      <path
        d={`M ${checkX - 4} 0 L ${checkX - 1} 3 L ${checkX + 5} -4`}
        fill="none"
        stroke="#15803d"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
  );
}

function useGlyphTimer(timerDurationMs?: number, timerStoppedAtMs?: number) {
  const [elapsedMs, setElapsedMs] = useState(0);
  const startedAtMs = useMemo(() => getCurrentTimeMs(), []);

  useEffect(() => {
    if (!timerDurationMs) {
      return;
    }

    if (timerStoppedAtMs !== undefined) {
      return;
    }

    const intervalId = window.setInterval(() => {
      const nextElapsedMs = getCurrentTimeMs() - startedAtMs;
      setElapsedMs(Math.min(timerDurationMs, nextElapsedMs));

      if (nextElapsedMs >= timerDurationMs) {
        window.clearInterval(intervalId);
      }
    }, 50);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [startedAtMs, timerDurationMs, timerStoppedAtMs]);

  if (!timerDurationMs) {
    return null;
  }

  const cappedElapsedMs = Math.min(
    timerStoppedAtMs ?? elapsedMs,
    timerDurationMs
  );

  return {
    isComplete: cappedElapsedMs >= timerDurationMs,
    text: `${Math.round(cappedElapsedMs)} ms`,
  };
}

function getCurrentTimeMs() {
  return typeof performance === "undefined" ? Date.now() : performance.now();
}

function TapEffectMark() {
  return (
    <g className="pointer-events-none">
      <circle
        r="22"
        fill="none"
        stroke="var(--primary)"
        strokeWidth="2"
        strokeDasharray="3 4"
        opacity="0.8"
      />
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
