import { useState } from "react";
import {
  BookOpenIcon,
  CheckCircle2Icon,
  ChevronDownIcon,
  ChevronRightIcon,
  CircleIcon,
  FilterIcon,
  PlayIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { PipelineOperatorType } from "@/features/pipeline-editor";
import { cn } from "@/lib/utils";

import type { OutputTestTaskDefinition } from "./OutputTestTask";
import { OutputTestTask } from "./OutputTestTask";
import { TASKS_BY_OPERATOR, type LearningOperator } from "../learning-tasks";

type LearningOperatorGroupProps = {
  completedTaskIds: Set<string>;
  completedTasks: number;
  initialActiveTaskId?: string;
  isExpanded: boolean;
  operator: LearningOperator;
  onGetNextIncompleteTaskId: (
    operatorType: PipelineOperatorType
  ) => string | undefined;
  onMarkTaskCompleted: (taskId: string) => void;
  onToggle: () => void;
};

export function LearningOperatorGroup({
  completedTaskIds,
  completedTasks,
  initialActiveTaskId,
  isExpanded,
  operator,
  onGetNextIncompleteTaskId,
  onMarkTaskCompleted,
  onToggle,
}: LearningOperatorGroupProps) {
  const [activeTaskId, setActiveTaskId] = useState<string | null>(
    initialActiveTaskId ?? null
  );
  const tasks = TASKS_BY_OPERATOR[operator.type];
  const isCompleted = tasks.length > 0 && completedTasks === tasks.length;
  const canContinue = tasks.length > 0 && !isCompleted;

  function handleContinue() {
    const nextTaskId = onGetNextIncompleteTaskId(operator.type);

    if (nextTaskId) {
      setActiveTaskId(nextTaskId);
    }

    if (!isExpanded) {
      onToggle();
    }
  }

  return (
    <article className="min-w-0 overflow-hidden rounded-lg border bg-background shadow-sm">
      <div className="flex w-full min-w-0 items-center gap-3 px-4 py-3 transition-colors hover:bg-muted/45">
        <button
          type="button"
          className="flex min-w-0 flex-1 items-center gap-3 text-left"
          aria-expanded={isExpanded}
          onClick={onToggle}
        >
          <OperatorIcon type={operator.type} />
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-semibold text-foreground">
              {operator.label}
            </span>
            <span className="mt-0.5 block text-xs leading-5 text-muted-foreground">
              {operator.description}
            </span>
          </span>
        </button>

        <span className="flex shrink-0 items-center gap-1.5 rounded-md border bg-muted px-2 py-1">
          <span className="font-mono text-xs text-muted-foreground">
            {completedTasks}/{tasks.length} splněno
          </span>
          {isCompleted && <CompletedStatusIcon />}
          {canContinue && <ContinueTaskButton onContinue={handleContinue} />}
        </span>

        <button
          type="button"
          className="flex size-7 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-muted"
          aria-label={isExpanded ? "Sbalit operátor" : "Rozbalit operátor"}
          onClick={onToggle}
        >
          {isExpanded ? (
            <ChevronDownIcon className="size-4" />
          ) : (
            <ChevronRightIcon className="size-4" />
          )}
        </button>
      </div>

      {isExpanded && (
        <div className="border-t px-4 py-4">
          {tasks.length > 0 ? (
            <TaskWorkspace
              activeTaskId={activeTaskId}
              completedTaskIds={completedTaskIds}
              tasks={tasks}
              onMarkTaskCompleted={onMarkTaskCompleted}
              onSelectTask={setActiveTaskId}
            />
          ) : (
            <EmptyOperatorTasks />
          )}
        </div>
      )}
    </article>
  );
}

type TaskWorkspaceProps = {
  activeTaskId: string | null;
  completedTaskIds: Set<string>;
  tasks: OutputTestTaskDefinition[];
  onMarkTaskCompleted: (taskId: string) => void;
  onSelectTask: (taskId: string) => void;
};

function TaskWorkspace({
  activeTaskId,
  completedTaskIds,
  tasks,
  onMarkTaskCompleted,
  onSelectTask,
}: TaskWorkspaceProps) {
  const activeTask = tasks.find((task) => task.id === activeTaskId);

  return (
    <div className="grid gap-5">
      <div className="grid gap-2">
        {tasks.map((task) => (
          <TaskListRow
            key={task.id}
            isActive={activeTaskId === task.id}
            isCompleted={completedTaskIds.has(task.id)}
            task={task}
            onSelect={() => onSelectTask(task.id)}
          />
        ))}
      </div>

      {activeTask ? (
        <OutputTestTask
          key={activeTask.id}
          task={activeTask}
          onSolved={() => onMarkTaskCompleted(activeTask.id)}
        />
      ) : null}
    </div>
  );
}

function CompletedStatusIcon() {
  return (
    <span
      className="flex size-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700"
      aria-label="Splněno"
    >
      <CheckCircle2Icon className="size-3.5" />
    </span>
  );
}

function ContinueTaskButton({ onContinue }: { onContinue: () => void }) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="size-5 rounded-full bg-primary p-0 text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
            aria-label="Pokračovat"
            onClick={onContinue}
          >
            <PlayIcon className="size-3" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="top" sideOffset={6}>
          Pokračovat
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

type TaskListRowProps = {
  isActive: boolean;
  isCompleted: boolean;
  task: OutputTestTaskDefinition;
  onSelect: () => void;
};

function TaskListRow({
  isActive,
  isCompleted,
  task,
  onSelect,
}: TaskListRowProps) {
  return (
    <button
      type="button"
      className={cn(
        "flex min-h-14 w-full min-w-0 items-center gap-3 rounded-lg border bg-background px-3 py-2 text-left transition-colors hover:bg-muted/45",
        isActive && "border-primary bg-primary/5"
      )}
      onClick={onSelect}
    >
      <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
        <BookOpenIcon className="size-4" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold text-foreground">
          Úloha {task.taskNumber}
        </span>
      </span>
      {isCompleted ? <CompletedStatusIcon /> : <IncompleteStatusIcon />}
    </button>
  );
}

function IncompleteStatusIcon() {
  return (
    <span
      className="flex size-5 shrink-0 items-center justify-center rounded-full bg-muted font-mono text-xs font-semibold text-muted-foreground"
      aria-label="Nesplněno"
    >
      &gt;
    </span>
  );
}

function EmptyOperatorTasks() {
  return (
    <div className="flex min-h-24 items-center gap-3 text-sm text-muted-foreground">
      <CircleIcon className="size-4 shrink-0" />
      Úlohy pro tento operátor budou doplněny později.
    </div>
  );
}

function OperatorIcon({ type }: { type: PipelineOperatorType }) {
  switch (type) {
    case "filter":
      return (
        <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-amber-100 text-amber-700">
          <FilterIcon className="size-4" />
        </span>
      );
    case "map":
      return (
        <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-violet-100 text-violet-700">
          <span className="text-sm font-semibold">f</span>
        </span>
      );
  }
}
