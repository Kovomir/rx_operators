import { useEffect, useRef } from "react";
import { CircleIcon } from "lucide-react";

import { LearningTaskGroupHeader } from "./LearningTaskGroupHeader";
import { LearningTaskItem } from "./LearningTaskItem";
import type { LearningSection, LearningSectionTask } from "../learning-tasks";

type LearningTaskGroupProps = {
  activeTaskId: string | null;
  completedTaskIds: Set<string>;
  completedTasks: number;
  isExpanded: boolean;
  nextSectionFirstTaskId?: string;
  nextSectionId?: string;
  section: LearningSection;
  onGetNextIncompleteTaskId: (sectionId: string) => string | undefined;
  onMarkTaskCompleted: (taskId: string) => void;
  onSelectTask: (sectionId: string, taskId: string) => void;
  onTaskSolved: (task: LearningSectionTask) => void;
  onToggle: () => void;
};

export function LearningTaskGroup({
  activeTaskId,
  completedTaskIds,
  completedTasks,
  isExpanded,
  nextSectionFirstTaskId,
  nextSectionId,
  section,
  onGetNextIncompleteTaskId,
  onMarkTaskCompleted,
  onSelectTask,
  onTaskSolved,
  onToggle,
}: LearningTaskGroupProps) {
  const groupRef = useRef<HTMLElement>(null);
  const isCompleted =
    section.tasks.length > 0 && completedTasks === section.tasks.length;
  const canContinue = section.tasks.length > 0 && !isCompleted;

  useEffect(() => {
    if (!isExpanded || activeTaskId) {
      return;
    }

    groupRef.current?.scrollIntoView({
      block: "start",
      behavior: "smooth",
    });
  }, [activeTaskId, isExpanded]);

  function handleContinue() {
    const nextTaskId = onGetNextIncompleteTaskId(section.id);

    if (nextTaskId) {
      onSelectTask(section.id, nextTaskId);
    }

    if (!isExpanded) {
      onToggle();
    }
  }

  return (
    <article
      ref={groupRef}
      className="min-w-0 scroll-mt-20 overflow-hidden rounded-lg border bg-background shadow-sm"
    >
      <LearningTaskGroupHeader
        canContinue={canContinue}
        completedTasks={completedTasks}
        isCompleted={isCompleted}
        isExpanded={isExpanded}
        section={section}
        onContinue={handleContinue}
        onToggle={onToggle}
      />

      {isExpanded && (
        <div className="border-t px-4 py-4">
          {section.tasks.length > 0 ? (
            <TaskWorkspace
              activeTaskId={activeTaskId}
              completedTaskIds={completedTaskIds}
              nextSectionFirstTaskId={nextSectionFirstTaskId}
              nextSectionId={nextSectionId}
              section={section}
              onMarkTaskCompleted={onMarkTaskCompleted}
              onSelectTask={onSelectTask}
              onTaskSolved={onTaskSolved}
            />
          ) : (
            <EmptySectionTasks />
          )}
        </div>
      )}
    </article>
  );
}

type TaskWorkspaceProps = {
  activeTaskId: string | null;
  completedTaskIds: Set<string>;
  nextSectionFirstTaskId?: string;
  nextSectionId?: string;
  section: LearningSection;
  onMarkTaskCompleted: (taskId: string) => void;
  onSelectTask: (sectionId: string, taskId: string) => void;
  onTaskSolved: (task: LearningSectionTask) => void;
};

function TaskWorkspace({
  activeTaskId,
  completedTaskIds,
  nextSectionFirstTaskId,
  nextSectionId,
  section,
  onMarkTaskCompleted,
  onSelectTask,
  onTaskSolved,
}: TaskWorkspaceProps) {
  return (
    <div className="grid gap-2">
      {section.tasks.map((task, taskIndex) => {
        const nextTask = section.tasks[taskIndex + 1];
        const nextTaskTarget = nextTask
          ? { sectionId: section.id, taskId: nextTask.id }
          : getNextSectionTaskTarget(nextSectionId, nextSectionFirstTaskId);

        return (
          <LearningTaskItem
            key={task.id}
            isActive={activeTaskId === task.id}
            isCompleted={completedTaskIds.has(task.id)}
            nextTaskTarget={nextTaskTarget}
            sectionId={section.id}
            task={task}
            onMarkTaskCompleted={onMarkTaskCompleted}
            onSelectTask={onSelectTask}
            onTaskSolved={onTaskSolved}
          />
        );
      })}
    </div>
  );
}

function getNextSectionTaskTarget(
  sectionId: string | undefined,
  taskId: string | undefined
) {
  if (!sectionId || !taskId) {
    return undefined;
  }

  return { sectionId, taskId };
}

function EmptySectionTasks() {
  return (
    <div className="flex min-h-24 items-center gap-3 text-sm text-muted-foreground">
      <CircleIcon className="size-4 shrink-0" />
      Úlohy pro tuto sekci budou doplněny později.
    </div>
  );
}
