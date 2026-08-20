import { LoaderCircleIcon } from "lucide-react";

import { cn } from "@/lib/utils";

type LoadingStateProps = {
  className?: string;
  iconClassName?: string;
  label?: string;
};

function LoadingState({
  className,
  iconClassName,
  label = "Načítání",
}: LoadingStateProps) {
  return (
    <div
      className={cn("flex min-h-40 items-center justify-center", className)}
      aria-label={label}
      role="status"
    >
      <LoaderCircleIcon
        className={cn("size-7 animate-spin text-muted-foreground", iconClassName)}
      />
    </div>
  );
}

export { LoadingState };
