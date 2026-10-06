import { ChevronsRightIcon } from "lucide-react";

import { cn } from "@/lib/utils";

export function FlowConnector({
  muted = false,
  className,
}: {
  arrow?: boolean;
  muted?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex h-8 w-7 shrink-0 items-center justify-center text-muted-foreground/45",
        muted && "text-muted-foreground/25",
        className
      )}
      aria-hidden="true"
    >
      <ChevronsRightIcon className="size-4 shrink-0 stroke-[1.85]" />
    </div>
  );
}
