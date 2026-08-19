import { ArrowRightIcon } from "lucide-react";

import { cn } from "@/lib/utils";

export function FlowConnector({ muted = false }: { muted?: boolean }) {
  return (
    <div
      className={cn(
        "flex w-10 shrink-0 items-center justify-center",
        muted && "opacity-50"
      )}
      aria-hidden="true"
    >
      <span className="h-px flex-1 bg-border" />
      <ArrowRightIcon className="size-4 text-muted-foreground" />
    </div>
  );
}
