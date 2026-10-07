import { ExternalLinkIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import type {
  IntroLearningStep,
  IntroLearningText,
} from "./intro-learning-content";

type IntroLearningStepPanelProps = {
  activeStep: IntroLearningStep;
  activeStepIndex: number;
  isLastStep: boolean;
  onNextStep: () => void;
  onPreviousStep: () => void;
};

export function IntroLearningStepPanel({
  activeStep,
  activeStepIndex,
  isLastStep,
  onNextStep,
  onPreviousStep,
}: IntroLearningStepPanelProps) {
  return (
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
              <p className="text-sm font-semibold text-primary">Ukázka kódu</p>
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
            onClick={onPreviousStep}
          >
            Zpět
          </Button>
          <Button type="button" onClick={onNextStep}>
            {isLastStep ? "Dokončit úvod" : "Další krok"}
          </Button>
        </div>
      </div>
    </section>
  );
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
