import { cn } from "@/lib/utils";

export function FlowConnector({
  arrow = true,
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
        "flex h-10 w-10 shrink-0 items-center text-muted-foreground/45",
        muted && "text-muted-foreground/25",
        className
      )}
      aria-hidden="true"
    >
      <span className="h-px flex-1 rounded-full bg-current" />
      {arrow ? (
        <span className="-ml-1 size-2 rotate-45 border-t border-r border-current" />
      ) : null}
    </div>
  );
}
