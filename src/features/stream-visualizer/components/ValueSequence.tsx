import type { StreamValue } from "../types";
import { formatDisplayNumber, formatStreamValueLabel } from "../value-formatting";
import { StreamValueGlyph } from "./StreamValueGlyph";

type ValueSequenceProps = {
  getCaption?: (value: StreamValue) => string | undefined;
  label: string;
  values: (number | StreamValue)[];
};

export function ValueSequence({
  getCaption,
  label,
  values,
}: ValueSequenceProps) {
  return (
    <div className="grid w-fit max-w-full gap-1">
      <div className="text-xs font-medium text-muted-foreground">{label}</div>
      <div className="flex min-h-9 w-fit max-w-full flex-wrap items-center gap-2 rounded-md border bg-card px-2 py-1.5">
        {values.length === 0 ? (
          <span className="px-1.5 text-xs text-muted-foreground">Prázdný</span>
        ) : (
          values.map((value, index) => (
            <ValueBadge
              key={index}
              value={value}
              caption={typeof value === "number" ? undefined : getCaption?.(value)}
            />
          ))
        )}
      </div>
    </div>
  );
}

function ValueBadge({
  caption,
  value,
}: {
  caption?: string;
  value: number | StreamValue;
}) {
  if (typeof value === "number") {
    return (
      <span className="flex size-7 items-center justify-center rounded-md border bg-muted font-mono text-xs font-semibold text-foreground shadow-xs dark:bg-background">
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
        aria-label={formatStreamValueLabel(value, caption)}
        role="img"
      >
        <StreamValueGlyph streamValue={value} value={value.value} />
      </svg>
      {caption && (
        <span className="font-mono text-[10px] leading-none text-muted-foreground">
          {caption}
        </span>
      )}
    </span>
  );
}
