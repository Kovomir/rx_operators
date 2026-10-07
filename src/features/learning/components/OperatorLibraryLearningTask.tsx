import { Button } from "@/components/ui/button";
import { OperatorLibraryEntryContent } from "@/features/operator-library/components/OperatorLibraryEntryContent";

import type { OperatorLibraryLearningTaskDefinition } from "../learning-tasks";

type OperatorLibraryLearningTaskProps = {
  task: OperatorLibraryLearningTaskDefinition;
  onSolved: () => void;
};

export function OperatorLibraryLearningTask({
  task,
  onSolved,
}: OperatorLibraryLearningTaskProps) {
  return (
    <div className="grid min-w-0 gap-5">
      <OperatorLibraryEntryContent operator={task.operator} />

      <div className="flex flex-wrap gap-2 border-t pt-4">
        <Button type="button" onClick={onSolved}>
          Dokončit
        </Button>
      </div>
    </div>
  );
}
