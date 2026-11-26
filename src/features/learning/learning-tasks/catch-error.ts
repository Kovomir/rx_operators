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
  description: "Ošetření chyb.",
};

const CATCH_ERROR_TASK_SOURCE_VALUES: StreamValue[] = [
  {
    id: "catch-error-task-source-1",
    shape: "circle",
    color: "red",
    value: 1,
  },
  {
    id: "catch-error-task-source-2",
    shape: "triangle",
    color: "green",
    value: 2,
  },
  {
    id: "catch-error-task-source-3",
    shape: "triangle",
    color: "blue",
    value: 3,
  },
  {
    id: "catch-error-task-source-4",
    shape: "triangle",
    color: "green",
    value: 5,
  },
  {
    id: "catch-error-task-source-5",
    shape: "triangle",
    color: "red",
    value: 6,
  },
  {
    id: "catch-error-task-source-6",
    shape: "square",
    color: "green",
    value: 4,
  },
  {
    id: "catch-error-task-source-7",
    shape: "triangle",
    color: "green",
    value: 6,
  },
  {
    id: "catch-error-task-source-error",
    kind: "error",
    shape: "square",
    color: "red",
    value: 0,
  },
  {
    id: "catch-error-task-source-8",
    kind: "cancelled",
    shape: "triangle",
    color: "green",
    value: 8,
  },
  {
    id: "catch-error-task-source-9",
    kind: "cancelled",
    shape: "triangle",
    color: "green",
    value: 10,
  },
];

export const CATCH_ERROR_TASKS: CatchErrorOutputTestTaskDefinition[] = [
  {
    id: "catch-error-terminal-event",
    taskNumber: 1,
    title: "Zachyťte chybu ve streamu",
    sourceValues: CATCH_ERROR_TASK_SOURCE_VALUES,
    expectedOutputValues: [
      {
        id: "catch-error-terminal-event-output-1",
        shape: "triangle",
        color: "green",
        value: 10,
      },
      {
        id: "catch-error-terminal-event-output-2",
        shape: "triangle",
        color: "green",
        value: 30,
      },
      {
        id: "catch-error-terminal-event-output-3",
        shape: "square",
        color: "green",
        value: -1,
      },
    ],
    enabledOperatorTypes: ["filter", "map", "catchError"],
    maxOperators: 5,
  },
];
