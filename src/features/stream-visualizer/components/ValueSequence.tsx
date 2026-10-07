import type { StreamValue } from "../types";
import { formatDisplayNumber } from "../value-formatting";
import { StreamValueGlyph } from "./StreamValueGlyph";

export type DisplayStreamValue =
  | number
  | Pick<StreamValue, "color" | "shape" | "value" | "emittedAtMs">;

type ValueSequenceProps = {
  label: string;
  values: Array<DisplayStreamValue | StreamValue>;
};

export function ValueSequence({ label, values }: ValueSequenceProps) {
  return (
    <div className="grid w-fit max-w-full gap-1">
      <div className="text-xs font-medium text-muted-foreground">{label}</div>
      <div className="flex min-h-9 w-fit max-w-full flex-wrap items-center gap-2 rounded-md border bg-muted/35 px-2 py-1.5">
        {values.length === 0 ? (
          <span className="px-1.5 text-xs text-muted-foreground">Prázdný</span>
        ) : (
          values.map((value, index) => (
            <ValueBadge key={`${label}-${index}`} value={value} />
          ))
        )}
      </div>
    </div>
  );
}

function ValueBadge({
  value,
}: {
  value: DisplayStreamValue | StreamValue;
}) {
  if (typeof value === "number") {
    return (
      <span className="flex size-7 items-center justify-center rounded-md border bg-background font-mono text-xs font-semibold text-foreground shadow-xs">
        {formatDisplayNumber(value)}
      </span>
    );
  }

  return (
    <span className="grid shrink-0 justify-items-center gap-0.5">
      <svg
        width="40"
        height="40"
        viewBox="-20 -20 40 40"
        className="block size-10"
        aria-label={getStreamValuePreviewLabel(value)}
        role="img"
      >
        <StreamValueGlyph
          streamValue={{
            id: "value-preview",
            color: value.color,
            shape: value.shape,
            value: value.value,
            emittedAtMs: value.emittedAtMs,
          }}
          value={value.value}
        />
      </svg>
      {typeof value.emittedAtMs === "number" && (
        <span className="font-mono text-[10px] leading-none text-muted-foreground">
          {value.emittedAtMs} ms
        </span>
      )}
    </span>
  );
}

function getStreamValuePreviewLabel(
  value: Pick<StreamValue, "color" | "shape" | "value" | "emittedAtMs">
) {
  const baseLabel = `${formatDisplayNumber(value.value)}, ${value.color}, ${value.shape}`;

  if (typeof value.emittedAtMs !== "number") {
    return baseLabel;
  }

  return `${baseLabel}, ${value.emittedAtMs} ms`;
}
