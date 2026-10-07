import { OPERATOR_LIBRARY } from "@/features/operator-library";

import { LEARNING_OPERATORS, TASKS_BY_OPERATOR } from "./operators";
import type {
  IntroLearningTaskDefinition,
  LearningSection,
  OperatorLibraryLearningTaskDefinition,
} from "./types";

export const INTRO_LEARNING_TASK_ID = "intro-rxjs-pipeline";

export const INTRO_LEARNING_SECTION_ID = "intro";

export const INTRO_LEARNING_TASK = {
  id: INTRO_LEARNING_TASK_ID,
  kind: "intro",
  taskNumber: 1,
  title: "Úvod do Rx pipeline",
} satisfies IntroLearningTaskDefinition;

const OPERATOR_LIBRARY_BY_TYPE = new Map(
  OPERATOR_LIBRARY.map((operator) => [operator.type, operator])
);

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
    tasks: [
      createOperatorLibraryTask(operator.type),
      ...TASKS_BY_OPERATOR[operator.type].map((task) => ({
        ...task,
        kind: "output-test" as const,
      })),
    ],
  })),
];

export const LEARNING_TASK_IDS = LEARNING_SECTIONS.flatMap((section) =>
  section.tasks.map((task) => task.id)
);

function createOperatorLibraryTask(
  operatorType: (typeof LEARNING_OPERATORS)[number]["type"]
): OperatorLibraryLearningTaskDefinition {
  const operator = OPERATOR_LIBRARY_BY_TYPE.get(operatorType);

  if (!operator) {
    throw new Error(`Missing operator library entry for ${operatorType}`);
  }

  return {
    id: `${operatorType}-operator-library-task`,
    kind: "operator-library",
    taskNumber: 1,
    title: `Představení operátoru ${operator.label}`,
    operator,
  };
}
