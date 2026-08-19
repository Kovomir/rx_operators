import { useState } from "react";

import type { PipelineOperatorType } from "@/features/pipeline-editor";

import { TASKS_BY_OPERATOR } from "../learning-tasks";

export function useLearningTaskProgress() {
  const [completedTaskIds, setCompletedTaskIds] = useState<Set<string>>(
    () => new Set()
  );

  function markTaskCompleted(taskId: string) {
    setCompletedTaskIds((currentTaskIds) => {
      if (currentTaskIds.has(taskId)) {
        return currentTaskIds;
      }

      const nextTaskIds = new Set(currentTaskIds);
      nextTaskIds.add(taskId);
      return nextTaskIds;
    });
  }

  function getCompletedTaskCount(operatorType: PipelineOperatorType) {
    return TASKS_BY_OPERATOR[operatorType].filter((task) =>
      completedTaskIds.has(task.id)
    ).length;
  }

  function getNextIncompleteTaskId(operatorType: PipelineOperatorType) {
    return TASKS_BY_OPERATOR[operatorType].find(
      (task) => !completedTaskIds.has(task.id)
    )?.id;
  }

  return {
    completedTaskIds,
    getCompletedTaskCount,
    getNextIncompleteTaskId,
    markTaskCompleted,
  };
}
