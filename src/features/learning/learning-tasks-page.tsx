import { useState } from "react";

import { LoadingState } from "@/components/ui/loading-state";
import type { PipelineOperatorType } from "@/features/pipeline-editor";

import { LearningOperatorGroup } from "./components/LearningOperatorGroup";
import { useLearningTaskProgress } from "./hooks/use-learning-task-progress";
import { LEARNING_OPERATORS } from "./learning-tasks";

export function LearningTasksPage() {
  const [expandedOperator, setExpandedOperator] =
    useState<PipelineOperatorType | null>(null);
  const {
    completedTaskIds,
    getCompletedTaskCount,
    getNextIncompleteTaskId,
    isProgressLoading,
    markTaskCompleted,
    progressError,
  } = useLearningTaskProgress();

  function toggleOperator(operatorType: PipelineOperatorType) {
    setExpandedOperator((currentOperator) =>
      currentOperator === operatorType ? null : operatorType
    );
  }

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
        <section className="grid min-w-0 gap-3">
          {LEARNING_OPERATORS.map((operator) => {
            const isExpanded = expandedOperator === operator.type;

            return (
              <LearningOperatorGroup
                key={operator.type}
                completedTaskIds={completedTaskIds}
                completedTasks={getCompletedTaskCount(operator.type)}
                isExpanded={isExpanded}
                operator={operator}
                onGetNextIncompleteTaskId={getNextIncompleteTaskId}
                onMarkTaskCompleted={markTaskCompleted}
                onToggle={() => toggleOperator(operator.type)}
              />
            );
          })}
        </section>
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
