import type { StreamValue } from "@/types/stream";

import { formatStreamValueLabel } from "../value-formatting";
import { StreamValueGlyph } from "./StreamValueGlyph";

type ValueSequenceProps = {
  getCaption?: (value: StreamValue) => string | undefined;
  label: string;
  values: StreamValue[];
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
          values.map((value) => (
            <ValueBadge
              key={value.id}
              value={value}
              caption={getCaption?.(value)}
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
  value: StreamValue;
}) {
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
