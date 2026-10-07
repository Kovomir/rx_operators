import { CheckCircle2Icon } from "lucide-react";

export function CompletedStatusIcon() {
  return (
    <span
      className="flex size-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700"
      aria-label="Splněno"
    >
      <CheckCircle2Icon className="size-3.5" />
    </span>
  );
}

export function IncompleteStatusIcon() {
  return (
    <span
      className="flex size-5 shrink-0 items-center justify-center rounded-full bg-muted font-mono text-xs font-semibold text-muted-foreground"
      aria-label="Nesplněno"
    >
      &gt;
    </span>
  );
}
