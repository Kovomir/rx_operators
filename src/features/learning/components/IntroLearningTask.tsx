import { useState } from "react";

import {
  PipelineEditor,
  type PipelineOperator,
} from "@/features/pipeline-editor";
import { usePipelineScrollSync } from "@/features/pipeline-scroll-sync";
import {
  PipelineVisualizer,
} from "@/features/stream-visualizer";
import { cn } from "@/lib/utils";

import { IntroLearningStepPanel } from "./IntroLearningStepPanel";
import {
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
  onSolved: () => void;
};

export function IntroLearningTask({ onSolved }: IntroLearningTaskProps) {
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
      onSolved();
      return;
    }

    selectStep(activeStepIndex + 1);
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(300px,0.38fr)_minmax(0,0.62fr)]">
      <IntroLearningStepPanel
        activeStep={activeStep}
        activeStepIndex={activeStepIndex}
        isLastStep={isLastStep}
        onNextStep={goToNextStep}
        onPreviousStep={goToPreviousStep}
      />

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
