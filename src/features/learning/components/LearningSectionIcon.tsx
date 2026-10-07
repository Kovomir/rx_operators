import {
  BookOpenIcon,
  FilterIcon,
  PauseIcon,
  SkipForwardIcon,
} from "lucide-react";

import type { PipelineOperatorType } from "@/features/pipeline-editor";

import type { LearningSection } from "../learning-tasks";

export function LearningSectionIcon({
  section,
}: {
  section: LearningSection;
}) {
  if (!section.operatorType) {
    return (
      <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
        <BookOpenIcon className="size-4" />
      </span>
    );
  }

  return <OperatorIcon type={section.operatorType} />;
}

function OperatorIcon({ type }: { type: PipelineOperatorType }) {
  switch (type) {
    case "filter":
      return (
        <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-amber-100 text-amber-700">
          <FilterIcon className="size-4" />
        </span>
      );
    case "map":
      return (
        <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-violet-100 text-violet-700">
          <span className="text-sm font-semibold">f</span>
        </span>
      );
    case "skip":
      return (
        <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-sky-100 text-sky-700">
          <SkipForwardIcon className="size-4" />
        </span>
      );
    case "take":
      return (
        <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-emerald-100 text-emerald-700">
          <PauseIcon className="size-4" />
        </span>
      );
  }
}
