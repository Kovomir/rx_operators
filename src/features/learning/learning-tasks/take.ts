import type { PipelineOperatorType } from "@/features/pipeline-editor";
import type { StreamValue } from "@/types/stream";

import type { OutputTestTaskDefinition } from "../components/OutputTestTask";

export type TakeLearningOperator = {
  type: Extract<PipelineOperatorType, "take">;
  label: string;
  description: string;
};

export type TakeOutputTestTaskDefinition = OutputTestTaskDefinition & {
  id: "take-first-two-values" | "take-no-values";
};

export const TAKE_LEARNING_OPERATOR: TakeLearningOperator = {
  type: "take",
  label: "take",
  description: "Výběr pouze počátečních hodnot streamu.",
};

const TAKE_FIRST_VALUES_SOURCE_VALUES: StreamValue[] = [
  { id: "take-first-task-source-1", shape: "circle", color: "red", value: 1 },
  { id: "take-first-task-source-2", shape: "square", color: "blue", value: 2 },
  {
    id: "take-first-task-source-3",
    shape: "triangle",
    color: "green",
    value: 3,
  },
  { id: "take-first-task-source-4", shape: "circle", color: "blue", value: 4 },
  { id: "take-first-task-source-5", shape: "square", color: "green", value: 5 },
];

const TAKE_SIGNAL_SOURCE_VALUES: StreamValue[] = [
  { id: "take-signal-task-source-1", shape: "circle", color: "red", value: 7 },
  { id: "take-signal-task-source-2", shape: "square", color: "blue", value: 8 },
  {
    id: "take-signal-task-source-3",
    shape: "triangle",
    color: "green",
    value: 9,
  },
  { id: "take-signal-task-source-4", shape: "circle", color: "red", value: 42 },
  {
    id: "take-signal-task-source-5",
    shape: "square",
    color: "blue",
    value: 99,
  },
  {
    id: "take-signal-task-source-6",
    shape: "triangle",
    color: "green",
    value: 100,
  },
];

export const TAKE_TASKS: TakeOutputTestTaskDefinition[] = [
  {
    id: "take-first-two-values",
    taskNumber: 1,
    title: "Vezměte pouze dvě počáteční hodnoty",
    sourceValues: TAKE_FIRST_VALUES_SOURCE_VALUES,
    expectedOutputValues: [1, 2],
    enabledOperatorTypes: ["take"],
    maxOperators: 1,
  },
  {
    id: "take-no-values",
    taskNumber: 2,
    title: "Zajistěte, aby nic neprošlo",
    sourceValues: TAKE_SIGNAL_SOURCE_VALUES,
    expectedOutputValues: [],
    enabledOperatorTypes: ["take"],
    maxOperators: 1,
  },
];
