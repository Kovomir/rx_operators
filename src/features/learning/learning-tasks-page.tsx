import { type ReactNode } from "react";
import { useLocation } from "react-router-dom";

import { OperatorSearchList } from "@/components/operator-search-list";
import { LoadingState } from "@/components/ui/loading-state";

import { LearningTaskGroup } from "./components/LearningTaskGroup";
import {
  useLearningTaskNavigation,
  type LearningTasksNavigationState,
} from "./hooks/use-learning-task-navigation";
import { useLearningTaskProgress } from "./hooks/use-learning-task-progress";
import { LEARNING_SECTIONS } from "./learning-tasks";

type LearningSearchItem = {
  id: string;
  label: string;
  searchText?: string;
  render: () => ReactNode;
};

export function LearningTasksPage() {
  const location = useLocation();
  const navigationState = location.state as LearningTasksNavigationState | null;
  const {
    completedTaskIds,
    getCompletedTaskCount,
    getNextIncompleteTaskId,
    isProgressLoading,
    markTaskCompleted,
    progressError,
  } = useLearningTaskProgress();
  const {
    activeSectionId,
    activeTaskId,
    handleTaskSolved,
    selectTask,
    toggleSection,
  } = useLearningTaskNavigation({
    completedTaskIds,
    markTaskCompleted: (taskId) => void markTaskCompleted(taskId),
    navigationState,
  });

  const learningSearchItems: LearningSearchItem[] = LEARNING_SECTIONS.map(
    (section) => ({
      id: section.id,
      label: section.label,
      searchText: `${section.description} ${section.operatorTypes?.join(" ") ?? ""}`,
      render: () => {
        const isExpanded = activeSectionId === section.id;

        return (
          <LearningTaskGroup
            activeTaskId={isExpanded ? activeTaskId : null}
            completedTaskIds={completedTaskIds}
            completedTasks={getCompletedTaskCount(section.id)}
            isExpanded={isExpanded}
            section={section}
            onGetNextIncompleteTaskId={getNextIncompleteTaskId}
            onMarkTaskCompleted={markTaskCompleted}
            onSelectTask={selectTask}
            onTaskSolved={handleTaskSolved}
            onToggle={() => toggleSection(section.id)}
          />
        );
      },
    })
  );

  return (
    <main className="flex min-w-0 flex-1 flex-col gap-5 overflow-x-hidden p-4 md:p-6">
      <section className="max-w-3xl">
        <h1 className="text-2xl font-semibold tracking-normal text-foreground">
          Výukové úlohy
        </h1>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Vyberte část výuky a řešte navazující úlohy.
        </p>
      </section>

      <ProgressSyncError errorMessage={progressError} />

      {isProgressLoading ? (
        <LoadingState label="Načítání úloh" />
      ) : (
        <OperatorSearchList
          operators={learningSearchItems}
          placeholder="Hledat úlohu nebo operátor"
          ariaLabel="Hledat úlohu nebo operátor"
          renderOperator={(item) => <div key={item.id}>{item.render()}</div>}
        />
      )}
    </main>
  );
}

function ProgressSyncError({
  errorMessage,
}: {
  errorMessage: string | null;
}) {
  if (!errorMessage) {
    return null;
  }

  return (
    <div className="w-fit rounded-md border bg-muted/45 px-3 py-2 text-xs text-muted-foreground">
      {errorMessage}
    </div>
  );
}
