import { useState } from "react";

import {
  getNextIncompleteLearningTaskTarget,
  INTRO_LEARNING_SECTION_ID,
  type LearningSectionTask,
} from "../learning-tasks";

export type LearningTasksNavigationState = {
  activeSectionId?: string;
  activeOperatorType?: string;
  activeTaskId?: string;
};

type UseLearningTaskNavigationArgs = {
  completedTaskIds: Set<string>;
  markTaskCompleted: (taskId: string) => void;
  navigationState: LearningTasksNavigationState | null;
};

export function useLearningTaskNavigation({
  completedTaskIds,
  markTaskCompleted,
  navigationState,
}: UseLearningTaskNavigationArgs) {
  const initialSectionId =
    navigationState?.activeSectionId ??
    navigationState?.activeOperatorType ??
    INTRO_LEARNING_SECTION_ID;
  const [activeSectionId, setActiveSectionId] = useState<string | null>(
    initialSectionId
  );
  const [activeTaskId, setActiveTaskId] = useState<string | null>(
    navigationState?.activeTaskId ?? null
  );

  function toggleSection(sectionId: string) {
    setActiveSectionId((currentSectionId) =>
      currentSectionId === sectionId ? null : sectionId
    );
  }

  function selectTask(sectionId: string, taskId: string) {
    setActiveSectionId(sectionId);
    setActiveTaskId(taskId);
  }

  function openNextIncompleteTask(completedTaskId: string) {
    const nextTarget = getNextIncompleteLearningTaskTarget(completedTaskIds, {
      completedTaskId,
    });

    if (!nextTarget) {
      return;
    }

    setActiveSectionId(nextTarget.section.id);
    setActiveTaskId(nextTarget.task.id);
  }

  function handleTaskSolved(task: LearningSectionTask) {
    markTaskCompleted(task.id);

    if (task.kind === "intro") {
      openNextIncompleteTask(task.id);
    }
  }

  return {
    activeSectionId,
    activeTaskId,
    handleTaskSolved,
    selectTask,
    toggleSection,
  };
}
