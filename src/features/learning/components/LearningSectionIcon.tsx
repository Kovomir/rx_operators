import { BookOpenIcon } from "lucide-react";

import { OperatorIcon } from "@/features/pipeline-editor";

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

  return <OperatorIcon size="md" type={section.operatorType} />;
}
