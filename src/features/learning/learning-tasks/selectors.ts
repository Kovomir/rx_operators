import { LEARNING_SECTIONS } from "./sections";
import type { LearningSection, LearningTaskTarget } from "./types";

export function getLearningTaskOperatorType(taskId: string) {
  return getLearningTaskSection(taskId)?.operatorType;
}

export function getLearningTaskSection(taskId: string) {
  return LEARNING_SECTIONS.find((section) =>
    section.tasks.some((task) => task.id === taskId)
  );
}

export function getLearningSection(sectionId: string) {
  return LEARNING_SECTIONS.find((section) => section.id === sectionId);
}

export function getCompletedSectionTaskCount(
  section: LearningSection,
  completedTaskIds: Set<string>
) {
  return section.tasks.filter((task) => completedTaskIds.has(task.id)).length;
}

export function getNextIncompleteSectionTaskId(
  section: LearningSection,
  completedTaskIds: Set<string>
) {
  return section.tasks.find((task) => !completedTaskIds.has(task.id))?.id;
}

export function getNextIncompleteLearningTaskTarget(
  completedTaskIds: Set<string>,
  options?: {
    completedTaskId?: string;
  }
): LearningTaskTarget | null {
  const effectiveCompletedTaskIds = new Set(completedTaskIds);

  if (options?.completedTaskId) {
    effectiveCompletedTaskIds.add(options.completedTaskId);
  }

  for (const section of LEARNING_SECTIONS) {
    const task = section.tasks.find(
      (sectionTask) => !effectiveCompletedTaskIds.has(sectionTask.id)
    );

    if (!task) {
      continue;
    }

    return {
      completedTasks: getCompletedSectionTaskCount(
        section,
        effectiveCompletedTaskIds
      ),
      section,
      task,
      totalTasks: section.tasks.length,
    };
  }

  return null;
}
