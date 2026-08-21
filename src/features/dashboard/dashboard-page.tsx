import {
  ArrowRightIcon,
  CheckCircle2Icon,
  GraduationCapIcon,
  LibraryIcon,
  PlayIcon,
} from "lucide-react";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { LoadingState } from "@/components/ui/loading-state";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { PipelineOperatorType } from "@/features/pipeline-editor";
import { cn } from "@/lib/utils";

import { useLearningTaskProgress } from "../learning/hooks/use-learning-task-progress";
import {
  LEARNING_OPERATOR_ORDER,
  LEARNING_OPERATORS,
  TASKS_BY_OPERATOR,
} from "../learning/learning-tasks";
import type { LearningTasksNavigationState } from "../learning/learning-tasks-page";

type ContinueTarget = {
  completedTasks: number;
  operatorType: PipelineOperatorType;
  taskId: string;
  totalTasks: number;
};

export function DashboardPage() {
  const navigate = useNavigate();
  const {
    completedTaskIds,
    getCompletedTaskCount,
    getNextIncompleteTaskId,
    isProgressLoading,
    progressError,
  } = useLearningTaskProgress();

  const continueTarget = useMemo(
    () =>
      getLearningContinueTarget(
        getCompletedTaskCount,
        getNextIncompleteTaskId
      ),
    [getCompletedTaskCount, getNextIncompleteTaskId]
  );

  const completedTaskCount = completedTaskIds.size;
  const totalTaskCount = useMemo(
    () => Object.values(TASKS_BY_OPERATOR).flat().length,
    []
  );
  const allTasksCompleted =
    totalTaskCount > 0 && completedTaskCount >= totalTaskCount;

  function openLearningTasks() {
    if (!continueTarget) {
      navigate("/challenges");
      return;
    }

    const state: LearningTasksNavigationState = {
      activeOperatorType: continueTarget.operatorType,
      activeTaskId: continueTarget.taskId,
    };

    navigate("/challenges", { state });
  }

  return (
    <main className="flex min-w-0 flex-1 flex-col gap-6 overflow-x-hidden p-4 md:p-6">
      <section className="max-w-4xl">
        <h1 className="text-4xl font-semibold tracking-normal text-foreground md:text-5xl">
          Vítejte zpět
        </h1>
      </section>

      <ProgressSyncError errorMessage={progressError} />

      {isProgressLoading ? (
        <LoadingState label="Načítání dashboardu" />
      ) : (
        <section className="grid min-w-0 gap-4 lg:grid-cols-2">
          <LearningProgressCard
            allTasksCompleted={allTasksCompleted}
            continueTarget={continueTarget}
            onOpenLearningTasks={openLearningTasks}
          />

          <DashboardLinkCard
            description="Sestavte si vlastní pipeline a sledujte vliv operátorů v reálném čase."
            icon={PlayIcon}
            title="Playground"
            onOpen={() => navigate("/playground")}
          />

          <DashboardLinkCard
            description="Představení operátorů a jejich příkladů použití s vizualizací."
            icon={LibraryIcon}
            title="Knihovna operátorů"
            onOpen={() => navigate("/operators")}
          />
        </section>
      )}
    </main>
  );
}

function LearningProgressCard({
  allTasksCompleted,
  continueTarget,
  onOpenLearningTasks,
}: {
  allTasksCompleted: boolean;
  continueTarget: ContinueTarget | null;
  onOpenLearningTasks: () => void;
}) {
  const operator = continueTarget
    ? LEARNING_OPERATORS.find((item) => item.type === continueTarget.operatorType)
    : undefined;
  const progressLabel = continueTarget
    ? `${continueTarget.completedTasks}/${continueTarget.totalTasks} splněno`
    : "Všechny úlohy splněny";

  return (
    <article className="grid min-w-0 gap-5 rounded-lg border bg-background p-5 shadow-sm lg:row-span-2">
      <div className="grid min-w-0 gap-5">
        <div className="flex min-w-0 items-start gap-3">
          <span
            className={cn(
              "flex size-10 shrink-0 items-center justify-center rounded-md",
              "bg-primary/10 text-primary"
            )}
          >
            <GraduationCapIcon className="size-5" />
          </span>
        <div className="min-w-0">
          <h2 className="text-lg font-semibold text-foreground">
            Pokračujte ve výukových úlohách
          </h2>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            {allTasksCompleted
              ? "Máte splněné všechny dostupné úlohy. Můžete si je znovu projít."
              : "Navážete přesně tam, kde jste ve výuce skončili."}
          </p>
        </div>
      </div>

      <div className="grid gap-4 rounded-md border bg-muted/35 p-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
        <div className="grid min-w-0 gap-3">
          <div className="flex min-w-0 items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-normal text-muted-foreground">
              {allTasksCompleted ? "Stav výuky" : "Další operátor"}
            </p>
            <p className="mt-1 text-2xl font-semibold text-foreground">
              {operator?.label ?? "Hotovo"}
            </p>
          </div>
        </div>

        <div className="h-2 overflow-hidden rounded-full bg-background">
          <div
            className="h-full rounded-full bg-primary"
            style={{
              width: continueTarget
                ? `${(continueTarget.completedTasks / continueTarget.totalTasks) * 100}%`
                : "100%",
            }}
          />
        </div>

          <p className="text-sm font-medium text-muted-foreground">
            {progressLabel}
          </p>
        </div>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                size="icon"
                className={cn(
                  "mx-2 size-16 justify-self-end rounded-full shadow-sm sm:mx-4 sm:self-center",
                  allTasksCompleted &&
                    "bg-emerald-100 text-emerald-700 hover:bg-emerald-100 hover:text-emerald-700"
                )}
                aria-label={allTasksCompleted ? "Procvičovat" : "Pokračovat"}
                onClick={onOpenLearningTasks}
              >
                {allTasksCompleted ? (
                  <CheckCircle2Icon className="size-8" />
                ) : (
                  <PlayIcon className="size-7" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left" sideOffset={8}>
              {allTasksCompleted ? "Procvičovat" : "Pokračovat"}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      </div>
    </article>
  );
}

function DashboardLinkCard({
  description,
  icon: Icon,
  title,
  onOpen,
}: {
  description: string;
  icon: typeof PlayIcon;
  title: string;
  onOpen: () => void;
}) {
  return (
    <article className="grid min-w-0 gap-4 rounded-lg border bg-background p-5 shadow-sm">
      <div className="flex min-w-0 items-start gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
          <Icon className="size-5" />
        </span>
        <div className="min-w-0">
          <h2 className="text-base font-semibold text-foreground">{title}</h2>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            {description}
          </p>
        </div>
      </div>

      <Button type="button" variant="outline" className="w-fit" onClick={onOpen}>
        Otevřít
        <ArrowRightIcon />
      </Button>
    </article>
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

function getLearningContinueTarget(
  getCompletedTaskCount: (operatorType: PipelineOperatorType) => number,
  getNextIncompleteTaskId: (
    operatorType: PipelineOperatorType
  ) => string | undefined
): ContinueTarget | null {
  for (const operatorType of LEARNING_OPERATOR_ORDER) {
    const taskId = getNextIncompleteTaskId(operatorType);

    if (!taskId) {
      continue;
    }

    return {
      completedTasks: getCompletedTaskCount(operatorType),
      operatorType,
      taskId,
      totalTasks: TASKS_BY_OPERATOR[operatorType].length,
    };
  }

  return null;
}
