import { useCallback, useEffect, useState } from "react";

import type { PipelineOperatorType } from "@/features/pipeline-editor";

import { TASKS_BY_OPERATOR } from "../learning-tasks";
import {
  loadCompletedLearningTaskIds,
  saveLearningTaskCompletion,
} from "../task-progress-store";

export function useLearningTaskProgress() {
  const [completedTaskIds, setCompletedTaskIds] = useState<Set<string>>(
    () => new Set()
  );
  const [isProgressLoading, setIsProgressLoading] = useState(true);
  const [progressError, setProgressError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadProgress() {
      setIsProgressLoading(true);
      setProgressError(null);

      try {
        const storedTaskIds = await loadCompletedLearningTaskIds();

        if (!isMounted) {
          return;
        }

        setCompletedTaskIds((currentTaskIds) => {
          const nextTaskIds = new Set(currentTaskIds);
          storedTaskIds.forEach((taskId) => nextTaskIds.add(taskId));
          return nextTaskIds;
        });
      } catch {
        if (isMounted) {
          setProgressError("Nepodařilo se načíst uložený postup.");
        }
      } finally {
        if (isMounted) {
          setIsProgressLoading(false);
        }
      }
    }

    void loadProgress();

    return () => {
      isMounted = false;
    };
  }, []);

  const markTaskCompleted = useCallback(async (taskId: string) => {
    if (completedTaskIds.has(taskId)) {
      return;
    }

    setCompletedTaskIds((currentTaskIds) => {
      if (currentTaskIds.has(taskId)) {
        return currentTaskIds;
      }

      const nextTaskIds = new Set(currentTaskIds);
      nextTaskIds.add(taskId);
      return nextTaskIds;
    });

    const result = await saveLearningTaskCompletion(taskId);

    if (!result.ok) {
      setCompletedTaskIds((currentTaskIds) => {
        const nextTaskIds = new Set(currentTaskIds);
        nextTaskIds.delete(taskId);
        return nextTaskIds;
      });
      setProgressError("Nepodařilo se uložit splněnou úlohu.");
    } else {
      setProgressError(null);
    }
  }, [completedTaskIds]);

  const getCompletedTaskCount = useCallback(
    (operatorType: PipelineOperatorType) =>
      TASKS_BY_OPERATOR[operatorType].filter((task) =>
        completedTaskIds.has(task.id)
      ).length,
    [completedTaskIds]
  );

  const getNextIncompleteTaskId = useCallback(
    (operatorType: PipelineOperatorType) =>
      TASKS_BY_OPERATOR[operatorType].find(
        (task) => !completedTaskIds.has(task.id)
      )?.id,
    [completedTaskIds]
  );

  return {
    completedTaskIds,
    getCompletedTaskCount,
    getNextIncompleteTaskId,
    isProgressLoading,
    markTaskCompleted,
    progressError,
  };
}
