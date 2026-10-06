import { useState } from "react";
import {
  BookOpenIcon,
  CheckCircle2Icon,
  ChevronDownIcon,
  ChevronRightIcon,
  ExternalLinkIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  PipelineEditor,
  type PipelineOperator,
} from "@/features/pipeline-editor";
import { usePipelineScrollSync } from "@/features/pipeline-scroll-sync";
import {
  PipelineVisualizer,
} from "@/features/stream-visualizer";
import { cn } from "@/lib/utils";

import { INTRO_LEARNING_TASK_ID } from "../learning-tasks";
import {
  type IntroLearningText,
  INTRO_LEARNING_STEPS,
  INTRO_SOURCE_VALUES,
} from "./intro-learning-content";

const INTRO_MAP_OPERATOR_ID = "intro-map-double";

const INTRO_OPERATORS: PipelineOperator[] = [
  {
    id: INTRO_MAP_OPERATOR_ID,
    type: "map",
    config: {
      operation: "multiply",
      operand: 2,
    },
  },
];

type IntroLearningTaskProps = {
  isCompleted: boolean;
  isExpanded: boolean;
  onMarkTaskCompleted: (taskId: string) => void;
  onToggle: () => void;
};

export function IntroLearningTask({
  isCompleted,
  isExpanded,
  onMarkTaskCompleted,
  onToggle,
}: IntroLearningTaskProps) {
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const pipelineScrollSync = usePipelineScrollSync();
  const activeStep = INTRO_LEARNING_STEPS[activeStepIndex];
  const isLastStep = activeStepIndex === INTRO_LEARNING_STEPS.length - 1;
  const highlightedStageId = getHighlightedStageId(
    activeStep.highlightedElement
  );

  function selectStep(nextStepIndex: number) {
    setActiveStepIndex(nextStepIndex);
  }

  function goToPreviousStep() {
    selectStep(Math.max(0, activeStepIndex - 1));
  }

  function goToNextStep() {
    if (isLastStep) {
      onMarkTaskCompleted(INTRO_LEARNING_TASK_ID);
      return;
    }

    selectStep(activeStepIndex + 1);
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
          <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
            <BookOpenIcon className="size-4" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-semibold text-foreground">
              Úvod do Rx pipeline
            </span>
            <span className="mt-0.5 block text-xs leading-5 text-muted-foreground">
              Krátké seznámení se streamem, zdrojem, operátorem a odběratelem.
            </span>
          </span>
        </button>

        <span className="flex shrink-0 items-center gap-1.5 rounded-md border bg-muted px-2 py-1">
          <span className="font-mono text-xs text-muted-foreground">
            {isCompleted ? "1/1 splněno" : "0/1 splněno"}
          </span>
          {isCompleted && (
            <span
              className="flex size-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700"
              aria-label="Splněno"
            >
              <CheckCircle2Icon className="size-3.5" />
            </span>
          )}
        </span>

        <button
          type="button"
          className="flex size-7 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-muted"
          aria-label={isExpanded ? "Sbalit úvod" : "Rozbalit úvod"}
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
        <div className="grid gap-5 border-t px-4 py-4 lg:grid-cols-[minmax(300px,0.38fr)_minmax(0,0.62fr)]">
          <section className="grid min-w-0 content-start gap-4">
            <div>
              <h2 className="text-base font-semibold text-foreground">
                {activeStep.title}
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-foreground">
                {activeStep.summary}
              </p>
              <div className="mt-4 divide-y">
                {activeStep.points.map((point) => (
                  <div
                    key={point.label}
                    className="grid gap-1 py-3 first:pt-0 last:pb-0"
                  >
                    <p className="text-sm font-semibold text-primary">
                      {point.label}
                    </p>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">
                      <IntroText value={point.text} />
                    </p>
                  </div>
                ))}
                {activeStep.codeExample && (
                  <div className="grid gap-2 border-t py-3 last:pb-0">
                    <p className="text-sm font-semibold text-primary">
                      Ukázka kódu
                    </p>
                    <pre className="max-w-full overflow-x-auto rounded-md border bg-muted px-3 py-2 text-xs leading-6 text-foreground">
                      <code>{activeStep.codeExample}</code>
                    </pre>
                  </div>
                )}
              </div>
            </div>

            <div className="grid gap-3 border-t pt-4">
              {activeStep.resources && (
                <div className="grid gap-1.5">
                  <div className="text-sm font-semibold tracking-normal text-primary">
                    Další zdroje
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {activeStep.resources.map((resource) => (
                      <a
                        key={resource.href}
                        href={resource.href}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex h-7 items-center gap-1.5 rounded-md border bg-background px-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                      >
                        {resource.label}
                        <ExternalLinkIcon className="size-3" />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              <div
                className={cn(
                  "flex flex-wrap gap-2",
                  activeStep.resources && "border-t pt-3"
                )}
              >
                <Button
                  type="button"
                  variant="outline"
                  disabled={activeStepIndex === 0}
                  onClick={goToPreviousStep}
                >
                  Zpět
                </Button>
                <Button type="button" onClick={goToNextStep}>
                  {isLastStep ? "Dokončit úvod" : "Další krok"}
                </Button>
              </div>
            </div>
          </section>

          <section className="grid min-w-0 gap-4">
            <PipelineEditor
              enabledOperatorTypes={["map"]}
              highlightedElement={activeStep.highlightedElement}
              lockedOperatorIds={[INTRO_MAP_OPERATOR_ID]}
              maxOperators={1}
              mode="readonly"
              operators={INTRO_OPERATORS}
              scrollSync={pipelineScrollSync}
              showDisabledInsertSlots
            />

            <PipelineVisualizer
              canEmitLiveValue={false}
              canRandomizeValues={false}
              operators={INTRO_OPERATORS}
              restartKey={activeStepIndex}
              scrollSync={pipelineScrollSync}
              selectedOperatorId={highlightedStageId}
              sourceValues={INTRO_SOURCE_VALUES}
              title="Vizualizace úvodu"
            />
          </section>

          <div className="flex flex-wrap gap-1.5 lg:col-span-2">
            {INTRO_LEARNING_STEPS.map((step, index) => (
              <button
                key={step.title}
                type="button"
                className={cn(
                  "h-2.5 w-8 rounded-full bg-muted transition-colors",
                  index === activeStepIndex && "bg-primary"
                )}
                aria-label={`Přejít na krok ${index + 1}`}
                onClick={() => selectStep(index)}
              />
            ))}
          </div>
        </div>
      )}
    </article>
  );
}

function getHighlightedStageId(
  highlightedElement: (typeof INTRO_LEARNING_STEPS)[number]["highlightedElement"]
) {
  switch (highlightedElement) {
    case "source":
      return "source";
    case "subscriber":
      return "subscriber";
    case "first-operator":
      return INTRO_MAP_OPERATOR_ID;
    default:
      return undefined;
  }
}

function IntroText({ value }: { value: IntroLearningText }) {
  if (typeof value === "string") {
    return value;
  }

  return value.map((part, index) => {
    if (!part.href) {
      return <span key={`${part.text}-${index}`}>{part.text}</span>;
    }

    return (
      <a
        key={part.href}
        href={part.href}
        target="_blank"
        rel="noreferrer"
        className="font-medium text-primary hover:underline"
      >
        {part.text}
      </a>
    );
  });
}
