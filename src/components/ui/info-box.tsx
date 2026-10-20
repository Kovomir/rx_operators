import type { ReactNode } from "react";
import { InfoIcon } from "lucide-react";

import { cn } from "@/lib/utils";

type InfoBoxProps = {
  children: ReactNode;
  className?: string;
};

export function InfoBox({ children, className }: InfoBoxProps) {
  return (
    <div
      role="note"
      className={cn(
        "flex w-fit max-w-full items-start gap-2 rounded-md border border-primary/20 bg-primary/5 px-3 py-2 text-xs leading-5 text-muted-foreground",
        className
      )}
    >
      <InfoIcon className="mt-0.5 size-4 shrink-0 text-primary" />
      <div>{children}</div>
    </div>
  );
}
