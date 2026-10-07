import { LibraryIcon, PlayIcon, SaveIcon } from "lucide-react";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

import { LoadingState } from "@/components/ui/loading-state";

import { DashboardLinkCard } from "./components/DashboardLinkCard";
import { LearningProgressCard } from "./components/LearningProgressCard";
import { useLearningTaskProgress } from "../learning/hooks/use-learning-task-progress";
import type { LearningTasksNavigationState } from "../learning/hooks/use-learning-task-navigation";
import {
  getNextIncompleteLearningTaskTarget,
  LEARNING_TASK_IDS,
} from "../learning/learning-tasks";

export function DashboardPage() {
  const navigate = useNavigate();
  const {
    completedTaskIds,
    isProgressLoading,
    progressError,
  } = useLearningTaskProgress();

  const continueTarget = useMemo(
    () => getNextIncompleteLearningTaskTarget(completedTaskIds),
    [completedTaskIds]
  );

  const completedTaskCount = completedTaskIds.size;
  const totalTaskCount = LEARNING_TASK_IDS.length;
  const allTasksCompleted =
    totalTaskCount > 0 && completedTaskCount >= totalTaskCount;

  function openLearningTasks() {
    if (!continueTarget) {
      navigate("/challenges");
      return;
    }

    const state: LearningTasksNavigationState = {
      activeSectionId: continueTarget.section.id,
      activeTaskId: continueTarget.task.id,
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
            description="Vraťte se k rozpracovaným pipeline uloženým z playgroundu."
            icon={SaveIcon}
            title="Uložené projekty"
            onOpen={() => navigate("/saved")}
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
