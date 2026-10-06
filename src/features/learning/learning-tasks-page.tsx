import { type ReactNode, useState } from "react";
import { useLocation } from "react-router-dom";

import { OperatorSearchList } from "@/components/operator-search-list";
import { LoadingState } from "@/components/ui/loading-state";
import type { PipelineOperatorType } from "@/features/pipeline-editor";

import { IntroLearningTask } from "./components/IntroLearningTask";
import { LearningOperatorGroup } from "./components/LearningOperatorGroup";
import { useLearningTaskProgress } from "./hooks/use-learning-task-progress";
import {
  INTRO_LEARNING_TASK_ID,
  LEARNING_OPERATORS,
  TASKS_BY_OPERATOR,
} from "./learning-tasks";

export type LearningTasksNavigationState = {
  activeOperatorType?: PipelineOperatorType;
  activeTaskId?: string;
};

type LearningSearchItem = {
  id: string;
  label: string;
  searchText?: string;
  render: () => ReactNode;
};

type ExpandedLearningItem = typeof INTRO_LEARNING_TASK_ID | PipelineOperatorType;

export function LearningTasksPage() {
  const location = useLocation();
  const navigationState = location.state as LearningTasksNavigationState | null;
  const [expandedLearningItem, setExpandedLearningItem] =
    useState<ExpandedLearningItem | null>(
      navigationState?.activeOperatorType ?? INTRO_LEARNING_TASK_ID
    );
  const [introCompletionTaskId, setIntroCompletionTaskId] = useState<
    string | null
  >(null);
  const {
    completedTaskIds,
    getCompletedTaskCount,
    getNextIncompleteTaskId,
    isProgressLoading,
    markTaskCompleted,
    progressError,
  } = useLearningTaskProgress();

  function toggleIntroTask() {
    setIntroCompletionTaskId(null);
    setExpandedLearningItem((currentItem) =>
      currentItem === INTRO_LEARNING_TASK_ID ? null : INTRO_LEARNING_TASK_ID
    );
  }

  function toggleOperator(operatorType: PipelineOperatorType) {
    setIntroCompletionTaskId(null);
    setExpandedLearningItem((currentItem) =>
      currentItem === operatorType ? null : operatorType
    );
  }

  function completeIntroTask(taskId: string) {
    void markTaskCompleted(taskId);
    setIntroCompletionTaskId(TASKS_BY_OPERATOR.map[0]?.id ?? null);
    setExpandedLearningItem("map");
  }

  const leadingLearningItems: LearningSearchItem[] = [
    {
      id: INTRO_LEARNING_TASK_ID,
      label: "Úvod",
      searchText:
        "krátké seznámení se streamem, zdrojem, operátorem a odběratelem",
      render: () => (
        <IntroLearningTask
          isCompleted={completedTaskIds.has(INTRO_LEARNING_TASK_ID)}
          isExpanded={expandedLearningItem === INTRO_LEARNING_TASK_ID}
          onMarkTaskCompleted={completeIntroTask}
          onToggle={toggleIntroTask}
        />
      ),
    },
  ];
  const operatorLearningItems: LearningSearchItem[] = LEARNING_OPERATORS.map(
    (operator) => ({
      id: operator.type,
      label: operator.label,
      searchText: operator.description,
      render: () => {
        const isExpanded = expandedLearningItem === operator.type;
        const initialActiveTaskId =
          navigationState?.activeOperatorType === operator.type
            ? navigationState.activeTaskId
            : operator.type === "map"
              ? introCompletionTaskId ?? undefined
              : undefined;

        return (
          <LearningOperatorGroup
            key={`${operator.type}-${initialActiveTaskId ?? "default"}`}
            completedTaskIds={completedTaskIds}
            completedTasks={getCompletedTaskCount(operator.type)}
            initialActiveTaskId={initialActiveTaskId}
            isExpanded={isExpanded}
            operator={operator}
            onGetNextIncompleteTaskId={getNextIncompleteTaskId}
            onMarkTaskCompleted={markTaskCompleted}
            onToggle={() => toggleOperator(operator.type)}
          />
        );
      },
    })
  );
  const trailingLearningItems: LearningSearchItem[] = [];
  const learningSearchItems = [
    ...leadingLearningItems,
    ...operatorLearningItems,
    ...trailingLearningItems,
  ];

  return (
    <main className="flex min-w-0 flex-1 flex-col gap-5 overflow-x-hidden p-4 md:p-6">
      <section className="max-w-3xl">
        <h1 className="text-2xl font-semibold tracking-normal text-foreground">
          Výukové úlohy
        </h1>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Vyberte operátor a řešte výukové úlohy.
        </p>
      </section>

      <ProgressSyncError errorMessage={progressError} />

      {isProgressLoading ? (
        <LoadingState label="Načítání úloh" />
      ) : (
        <OperatorSearchList
          operators={learningSearchItems}
          placeholder="Hledat operátor"
          ariaLabel="Hledat operátor"
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
