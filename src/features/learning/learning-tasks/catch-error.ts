import type { PipelineOperatorType } from "@/features/pipeline-editor";
import type { StreamValue } from "@/types/stream";

import type { OutputTestTaskDefinition } from "../components/OutputTestTask";

export type CatchErrorLearningOperator = {
  type: Extract<PipelineOperatorType, "catchError">;
  label: string;
  description: string;
};

export type CatchErrorOutputTestTaskDefinition = OutputTestTaskDefinition & {
  id: "catch-error-terminal-event";
};

export const CATCH_ERROR_LEARNING_OPERATOR: CatchErrorLearningOperator = {
  type: "catchError",
  label: "catchError",
  description: "Zachytí terminální chybu a nahradí stream náhradní hodnotou.",
};

const CATCH_ERROR_TASK_SOURCE_VALUES: StreamValue[] = [
  {
    id: "catch-error-task-source-1",
    shape: "circle",
    color: "red",
    value: 1,
    emittedAtMs: 0,
  },
  {
    id: "catch-error-task-source-2",
    shape: "triangle",
    color: "green",
    value: 2,
    emittedAtMs: 250,
  },
  {
    id: "catch-error-task-source-3",
    shape: "triangle",
    color: "blue",
    value: 3,
    emittedAtMs: 500,
  },
  {
    id: "catch-error-task-source-4",
    shape: "triangle",
    color: "green",
    value: 5,
    emittedAtMs: 750,
  },
  {
    id: "catch-error-task-source-5",
    shape: "triangle",
    color: "red",
    value: 6,
    emittedAtMs: 1000,
  },
  {
    id: "catch-error-task-source-6",
    shape: "square",
    color: "green",
    value: 4,
    emittedAtMs: 1250,
  },
  {
    id: "catch-error-task-source-7",
    shape: "triangle",
    color: "green",
    value: 6,
    emittedAtMs: 1500,
  },
  {
    id: "catch-error-task-source-error",
    kind: "error",
    shape: "square",
    color: "red",
    value: 0,
    emittedAtMs: 1750,
  },
  {
    id: "catch-error-task-source-8",
    kind: "cancelled",
    shape: "triangle",
    color: "green",
    value: 8,
    emittedAtMs: 2000,
  },
  {
    id: "catch-error-task-source-9",
    kind: "cancelled",
    shape: "triangle",
    color: "green",
    value: 10,
    emittedAtMs: 2250,
  },
];

const CATCH_ERROR_TASK_DISPLAY_VALUES: StreamValue[] =
  CATCH_ERROR_TASK_SOURCE_VALUES.map((value) => ({
    ...value,
    emittedAtMs: undefined,
  }));

export const CATCH_ERROR_TASKS: CatchErrorOutputTestTaskDefinition[] = [
  {
    id: "catch-error-terminal-event",
    taskNumber: 1,
    title: "Zachyťte chybu ve streamu",
    description:
      "Propusťte jen zelené trojúhelníky se sudou hodnotou, vynásobte je pěti a chybu nahraďte hodnotou -1.",
    sourceValues: CATCH_ERROR_TASK_SOURCE_VALUES,
    sourceDisplayValues: CATCH_ERROR_TASK_DISPLAY_VALUES,
    expectedOutputValues: [
      {
        shape: "triangle",
        color: "green",
        value: 10,
      },
      {
        shape: "triangle",
        color: "green",
        value: 30,
      },
      {
        shape: "square",
        color: "green",
        value: -1,
      },
    ],
    enabledOperatorTypes: ["filter", "map", "catchError"],
    expectedOperatorTypes: ["filter", "filter", "filter", "map", "catchError"],
    operatorRequirements: [
      {
        type: "filter",
        target: "color",
        allowedColors: ["green"],
      },
      {
        type: "filter",
        target: "shape",
        allowedShapes: ["triangle"],
      },
      {
        type: "filter",
        target: "value",
        allowedValueKinds: ["even"],
      },
      {
        type: "map",
        operation: "multiply",
        operand: 5,
      },
      { type: "catchError", replacementValue: -1 },
    ],
    showSourceValueDetails: true,
    maxOperators: 5,
  },
];
