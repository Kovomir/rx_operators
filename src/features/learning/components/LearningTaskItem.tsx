import { useEffect, useRef } from "react";
import { BookOpenIcon, TargetIcon } from "lucide-react";

import { cn } from "@/lib/utils";

import { IntroLearningTask } from "./IntroLearningTask";
import { OperatorLibraryLearningTask } from "./OperatorLibraryLearningTask";
import { OutputTestTask } from "./OutputTestTask";
import {
  CompletedStatusIcon,
  IncompleteStatusIcon,
} from "./LearningTaskStatus";
import type { LearningSectionTask } from "../learning-tasks";

const DIFFICULTY_LABELS = {
  easy: "snadná",
  medium: "střední",
  hard: "těžká",
} as const;

type LearningTaskItemProps = {
  isActive: boolean;
  isCompleted: boolean;
  nextTaskTarget?: {
    sectionId: string;
    taskId: string;
  };
  sectionId: string;
  task: LearningSectionTask;
  onMarkTaskCompleted: (taskId: string) => void;
  onSelectTask: (sectionId: string, taskId: string) => void;
  onTaskSolved: (task: LearningSectionTask) => void;
};

export function LearningTaskItem({
  isActive,
  isCompleted,
  nextTaskTarget,
  onMarkTaskCompleted,
  onSelectTask,
  onTaskSolved,
  sectionId,
  task,
}: LearningTaskItemProps) {
  const taskRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isActive) {
      return;
    }

    taskRef.current?.scrollIntoView({
      block: "start",
      behavior: "smooth",
    });
  }, [isActive]);

  function selectTask() {
    onSelectTask(sectionId, task.id);
    window.requestAnimationFrame(() => {
      taskRef.current?.scrollIntoView({
        block: "start",
        behavior: "smooth",
      });
    });
  }

  function selectNextTask() {
    if (nextTaskTarget) {
      onSelectTask(nextTaskTarget.sectionId, nextTaskTarget.taskId);
    }
  }

  function solveAndSelectNextTask() {
    onTaskSolved(task);
    selectNextTask();
  }

  const TaskIcon = task.kind === "output-test" ? TargetIcon : BookOpenIcon;
  const taskLabelPrefix =
    task.kind === "output-test" ? task.taskLabelPrefix ?? "Úloha" : "Úloha";
  const taskLabel =
    task.kind === "operator-library"
      ? "Představení operátoru"
      : `${taskLabelPrefix} ${task.taskNumber}`;
  const taskDifficulty =
    task.kind === "output-test" ? task.difficulty : undefined;

  return (
    <div ref={taskRef} className="min-w-0 scroll-mt-20">
      <button
        type="button"
        className={cn(
          "flex min-h-14 w-full min-w-0 items-center gap-3 rounded-lg border bg-background px-3 py-2 text-left transition-colors hover:bg-muted/45",
          isActive && "rounded-b-none border-primary bg-primary/5"
        )}
        aria-expanded={isActive}
        onClick={selectTask}
      >
        <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
          <TaskIcon className="size-4" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-semibold text-foreground">
            {taskLabel}
            {taskDifficulty && (
              <span className="ml-2 inline-flex rounded-md border bg-muted px-1.5 py-0.5 text-[0.6875rem] font-medium text-muted-foreground">
                {DIFFICULTY_LABELS[taskDifficulty]}
              </span>
            )}
          </span>
          {task.title && (
            <span className="mt-0.5 block text-xs leading-5 text-muted-foreground">
              {task.title}
            </span>
          )}
        </span>
        {isCompleted ? <CompletedStatusIcon /> : <IncompleteStatusIcon />}
      </button>

      {isActive && (
        <div className="rounded-b-lg border border-t-0 border-primary bg-background px-3 py-4 md:px-4">
          <LearningTaskContent
            task={task}
            onContinueToNextTask={nextTaskTarget ? selectNextTask : undefined}
            onMarkTaskCompleted={onMarkTaskCompleted}
            onTaskSolved={solveAndSelectNextTask}
          />
        </div>
      )}
    </div>
  );
}

function LearningTaskContent({
  onMarkTaskCompleted,
  onContinueToNextTask,
  onTaskSolved,
  task,
}: {
  task: LearningSectionTask;
  onMarkTaskCompleted: (taskId: string) => void;
  onContinueToNextTask?: () => void;
  onTaskSolved: (task: LearningSectionTask) => void;
}) {
  switch (task.kind) {
    case "intro":
      return <IntroLearningTask onSolved={() => onTaskSolved(task)} />;
    case "operator-library":
      return (
        <OperatorLibraryLearningTask
          key={task.id}
          task={task}
          onSolved={() => onTaskSolved(task)}
        />
      );
    case "output-test":
      return (
        <OutputTestTask
          key={task.id}
          task={task}
          onSolved={() => onMarkTaskCompleted(task.id)}
          onContinue={onContinueToNextTask}
        />
      );
  }
}
