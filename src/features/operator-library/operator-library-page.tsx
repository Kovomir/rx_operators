import { type ReactNode, useEffect, useRef, useState } from "react";
import {
  ChevronDownIcon,
  ChevronRightIcon,
  GraduationCapIcon,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

import { OperatorSearchList } from "@/components/operator-search-list";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  OperatorIcon,
  type PipelineOperatorType,
} from "@/features/pipeline-editor";

import { OPERATOR_LIBRARY, type OperatorLibraryEntry } from ".";
import { OperatorLibraryEntryContent } from "./components/OperatorLibraryEntryContent";

type OperatorLibraryNavigationState = {
  activeOperatorType?: PipelineOperatorType;
};

export function OperatorLibraryPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const navigationState = location.state as OperatorLibraryNavigationState | null;
  const [expandedOperator, setExpandedOperator] =
    useState<PipelineOperatorType | null>(
      navigationState?.activeOperatorType ?? "map"
    );

  function toggleOperator(operatorType: PipelineOperatorType) {
    setExpandedOperator((currentOperator) =>
      currentOperator === operatorType ? null : operatorType
    );
  }

  return (
    <main className="flex min-w-0 flex-1 flex-col gap-5 overflow-x-hidden p-4 md:p-6">
      <section className="max-w-3xl">
        <h1 className="text-2xl font-semibold tracking-normal text-foreground">
          Knihovna operátorů
        </h1>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Knihovna základních Rx operátorů. Zjistěte, co jednotlivé operátory
          dělají a jaké mají typické použití.
        </p>
      </section>

      <OperatorSearchList
        operators={OPERATOR_LIBRARY}
        placeholder="Hledat operátor"
        ariaLabel="Hledat operátor"
        renderOperator={(operator) => (
          <OperatorLibraryGroup
            key={operator.type}
            isExpanded={expandedOperator === operator.type}
            operator={operator}
            onOpenLearningTasks={() =>
              navigate("/challenges", {
                state: { activeOperatorType: operator.type },
              })
            }
            onToggle={() => toggleOperator(operator.type)}
          />
        )}
      />
    </main>
  );
}

type OperatorLibraryGroupProps = {
  isExpanded: boolean;
  operator: OperatorLibraryEntry;
  onOpenLearningTasks: () => void;
  onToggle: () => void;
};

function OperatorLibraryGroup({
  isExpanded,
  operator,
  onOpenLearningTasks,
  onToggle,
}: OperatorLibraryGroupProps) {
  const groupRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!isExpanded) {
      return;
    }

    groupRef.current?.scrollIntoView({
      block: "start",
      behavior: "smooth",
    });
  }, [isExpanded]);

  return (
    <article
      ref={groupRef}
      className="min-w-0 scroll-mt-20 overflow-hidden rounded-lg border bg-background shadow-sm"
    >
      <div className="flex w-full min-w-0 items-center gap-3 px-4 py-3 transition-colors hover:bg-muted/45">
        <button
          type="button"
          className="flex min-w-0 flex-1 items-center gap-3 text-left"
          aria-expanded={isExpanded}
          onClick={onToggle}
        >
          <OperatorIcon size="md" type={operator.type} />
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-semibold text-foreground">
              {operator.label}
            </span>
            <span className="mt-0.5 block text-xs leading-5 text-muted-foreground">
              {operator.description}
            </span>
          </span>
        </button>

        <RelatedPageButton
          label="Úlohy"
          icon={<GraduationCapIcon className="size-4" />}
          onClick={onOpenLearningTasks}
        />

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
          <OperatorLibraryEntryContent operator={operator} />
        </div>
      )}
    </article>
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
