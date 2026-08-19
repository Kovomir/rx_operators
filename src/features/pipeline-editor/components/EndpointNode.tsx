import { FlagIcon, RadioIcon } from "lucide-react";

import { cn } from "@/lib/utils";

type EndpointNodeProps = {
  variant: "source" | "subscriber";
};

export function EndpointNode({ variant }: EndpointNodeProps) {
  const isSource = variant === "source";

  return (
    <div className="flex h-36 w-40 shrink-0 flex-col justify-between rounded-lg border bg-card p-3 text-card-foreground shadow-sm">
      <div className="flex items-center gap-2">
        <span
          className={cn(
            "flex size-8 items-center justify-center rounded-md",
            isSource
              ? "bg-sky-100 text-sky-700"
              : "bg-emerald-100 text-emerald-700"
          )}
        >
          {isSource ? (
            <RadioIcon className="size-4" />
          ) : (
            <FlagIcon className="size-4" />
          )}
        </span>
        <span className="text-sm font-semibold">
          {isSource ? "Source" : "Subscriber"}
        </span>
      </div>
      <p className="text-xs leading-5 text-muted-foreground">
        {isSource ? "Vstupní hodnoty" : "Výstup pipeline"}
      </p>
    </div>
  );
}
