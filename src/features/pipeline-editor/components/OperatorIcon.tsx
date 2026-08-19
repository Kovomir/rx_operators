import { FilterIcon } from "lucide-react";

import type { PipelineOperatorType } from "../types";

export function OperatorIcon({ type }: { type: PipelineOperatorType }) {
  switch (type) {
    case "filter":
      return (
        <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-amber-100 text-amber-700">
          <FilterIcon className="size-4" />
        </span>
      );
    case "map":
      return (
        <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-violet-100 text-violet-700">
          <span className="text-sm font-semibold">f</span>
        </span>
      );
  }
}
