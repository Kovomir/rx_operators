import { CheckCircle2Icon, GraduationCapIcon, PlayIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

import type { LearningTaskTarget } from "@/features/learning/learning-tasks";

type LearningProgressCardProps = {
  allTasksCompleted: boolean;
  continueTarget: LearningTaskTarget | null;
  onOpenLearningTasks: () => void;
};

export function LearningProgressCard({
  allTasksCompleted,
  continueTarget,
  onOpenLearningTasks,
}: LearningProgressCardProps) {
  const progressLabel = continueTarget
    ? `${continueTarget.completedTasks}/${continueTarget.totalTasks} splněno`
    : "Všechny úlohy splněny";

  return (
    <article className="grid min-w-0 gap-5 rounded-lg border bg-background p-5 shadow-sm lg:row-span-2">
      <div className="grid min-w-0 gap-5">
        <div className="flex min-w-0 items-start gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
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
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-normal text-muted-foreground">
                {allTasksCompleted ? "Stav výuky" : "Další část"}
              </p>
              <p className="mt-1 text-2xl font-semibold text-foreground">
                {continueTarget?.section.label ?? "Hotovo"}
              </p>
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
