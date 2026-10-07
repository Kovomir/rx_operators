import { FilterIcon, PauseIcon, SkipForwardIcon, TerminalIcon } from "lucide-react";

import { cn } from "@/lib/utils";

import type { PipelineOperatorType } from "../types";

type OperatorIconSize = "sm" | "md";

type OperatorIconProps = {
  size?: OperatorIconSize;
  type: PipelineOperatorType;
};

const OPERATOR_ICON_SIZE_CLASSES = {
  sm: "size-8",
  md: "size-9",
} satisfies Record<OperatorIconSize, string>;

export function OperatorIcon({ size = "sm", type }: OperatorIconProps) {
  const className = cn(
    "flex shrink-0 items-center justify-center rounded-md",
    OPERATOR_ICON_SIZE_CLASSES[size]
  );

  switch (type) {
    case "filter":
      return (
        <span className={cn(className, "bg-amber-100 text-amber-700")}>
          <FilterIcon className="size-4" />
        </span>
      );
    case "map":
      return (
        <span className={cn(className, "bg-violet-100 text-violet-700")}>
          <span className="text-sm font-semibold">f</span>
        </span>
      );
    case "skip":
      return (
        <span className={cn(className, "bg-sky-100 text-sky-700")}>
          <SkipForwardIcon className="size-4" />
        </span>
      );
    case "take":
      return (
        <span className={cn(className, "bg-emerald-100 text-emerald-700")}>
          <PauseIcon className="size-4" />
        </span>
      );
    case "distinctUntilChanged":
      return (
        <span className={cn(className, "bg-rose-100 text-rose-700")}>
          <span className="text-xs font-semibold">!=</span>
        </span>
      );
    case "tap":
      return (
        <span className={cn(className, "bg-orange-100 text-orange-700")}>
          <TerminalIcon className="size-4" />
        </span>
      );
  }
}
