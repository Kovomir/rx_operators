import type { IntroLearningTaskDefinition, LearningSection } from "./types";
import { LEARNING_OPERATORS, TASKS_BY_OPERATOR } from "./operators";

export const INTRO_LEARNING_TASK_ID = "intro-rxjs-pipeline";

export const INTRO_LEARNING_SECTION_ID = "intro";

export const INTRO_LEARNING_TASK = {
  id: INTRO_LEARNING_TASK_ID,
  kind: "intro",
  taskNumber: 1,
  title: "Úvod do Rx pipeline",
} satisfies IntroLearningTaskDefinition;

export const LEARNING_SECTIONS: LearningSection[] = [
  {
    id: INTRO_LEARNING_SECTION_ID,
    label: "Úvod",
    description: "Základní části Rx pipeline a průchod hodnot streamem.",
    kind: "intro",
    tasks: [INTRO_LEARNING_TASK],
  },
  ...LEARNING_OPERATORS.map((operator) => ({
    id: operator.type,
    label: operator.label,
    description: operator.description,
    kind: "operator" as const,
    operatorType: operator.type,
    operatorTypes: [operator.type],
    tasks: TASKS_BY_OPERATOR[operator.type].map((task) => ({
      ...task,
      kind: "output-test" as const,
    })),
  })),
];

export const LEARNING_TASK_IDS = LEARNING_SECTIONS.flatMap((section) =>
  section.tasks.map((task) => task.id)
);
