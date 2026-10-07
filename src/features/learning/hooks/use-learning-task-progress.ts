import { useCallback, useEffect, useState } from "react";

import {
  getCompletedSectionTaskCount,
  getLearningSection,
  getNextIncompleteSectionTaskId,
} from "../learning-tasks";
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
    (sectionId: string) => {
      const section = getLearningSection(sectionId);

      if (!section) {
        return 0;
      }

      return getCompletedSectionTaskCount(section, completedTaskIds);
    },
    [completedTaskIds]
  );

  const getNextIncompleteTaskId = useCallback(
    (sectionId: string) => {
      const section = getLearningSection(sectionId);

      if (!section) {
        return undefined;
      }

      return getNextIncompleteSectionTaskId(section, completedTaskIds);
    },
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
