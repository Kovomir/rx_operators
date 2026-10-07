import { type ReactNode } from "react";
import {
  ChevronDownIcon,
  ChevronRightIcon,
  LibraryIcon,
  PlayIcon,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { LearningSectionIcon } from "./LearningSectionIcon";
import { CompletedStatusIcon } from "./LearningTaskStatus";
import type { LearningSection } from "../learning-tasks";

type LearningTaskGroupHeaderProps = {
  canContinue: boolean;
  completedTasks: number;
  isCompleted: boolean;
  isExpanded: boolean;
  section: LearningSection;
  onContinue: () => void;
  onToggle: () => void;
};

export function LearningTaskGroupHeader({
  canContinue,
  completedTasks,
  isCompleted,
  isExpanded,
  onContinue,
  onToggle,
  section,
}: LearningTaskGroupHeaderProps) {
  const navigate = useNavigate();

  return (
    <div className="flex w-full min-w-0 items-center gap-3 px-4 py-3 transition-colors hover:bg-muted/45">
      <button
        type="button"
        className="flex min-w-0 flex-1 items-center gap-3 text-left"
        aria-expanded={isExpanded}
        onClick={onToggle}
      >
        <LearningSectionIcon section={section} />
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-semibold text-foreground">
            {section.label}
          </span>
          <span className="mt-0.5 block text-xs leading-5 text-muted-foreground">
            {section.description}
          </span>
        </span>
      </button>

      <span className="flex shrink-0 items-center gap-1.5 rounded-md border bg-muted px-2 py-1">
        <span className="font-mono text-xs text-muted-foreground">
          {completedTasks}/{section.tasks.length} splněno
        </span>
        {isCompleted && <CompletedStatusIcon />}
        {canContinue && <ContinueTaskButton onContinue={onContinue} />}
      </span>

      {section.operatorType && (
        <RelatedPageButton
          label="Knihovna"
          icon={<LibraryIcon className="size-4" />}
          onClick={() =>
            navigate("/operators", {
              state: { activeOperatorType: section.operatorType },
            })
          }
        />
      )}

      <button
        type="button"
        className="flex size-7 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-muted"
        aria-label={isExpanded ? "Sbalit sekci" : "Rozbalit sekci"}
        onClick={onToggle}
      >
        {isExpanded ? (
          <ChevronDownIcon className="size-4" />
        ) : (
          <ChevronRightIcon className="size-4" />
        )}
      </button>
    </div>
  );
}

function RelatedPageButton({
  icon,
  label,
  onClick,
}: {
  icon: ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label={label}
            onClick={onClick}
          >
            {icon}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="top" sideOffset={6}>
          {label}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
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
