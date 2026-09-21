import type { PipelineOperatorType } from "@/features/pipeline-editor";
import type { StreamValue } from "@/types/stream";

import type { OutputTestTaskDefinition } from "../components/OutputTestTask";

export type SkipLearningOperator = {
  type: Extract<PipelineOperatorType, "skip">;
  label: string;
  description: string;
};

export type SkipOutputTestTaskDefinition = OutputTestTaskDefinition & {
  id: "skip-noisy-start" | "skip-all-values";
};

export const SKIP_LEARNING_OPERATOR: SkipLearningOperator = {
  type: "skip",
  label: "skip",
  description: "Přeskočení počátečních hodnot streamu.",
};

const SKIP_FIRST_VALUES_SOURCE_VALUES: StreamValue[] = [
  { id: "skip-first-task-source-1", shape: "circle", color: "red", value: 1 },
  { id: "skip-first-task-source-2", shape: "square", color: "blue", value: 2 },
  {
    id: "skip-first-task-source-3",
    shape: "triangle",
    color: "green",
    value: 3,
  },
  { id: "skip-first-task-source-4", shape: "circle", color: "blue", value: 4 },
  { id: "skip-first-task-source-5", shape: "square", color: "green", value: 5 },
];

const SKIP_NOISY_START_SOURCE_VALUES: StreamValue[] = [
  { id: "skip-noisy-task-source-1", shape: "circle", color: "red", value: 99 },
  { id: "skip-noisy-task-source-2", shape: "square", color: "red", value: 42 },
  {
    id: "skip-noisy-task-source-3",
    shape: "triangle",
    color: "blue",
    value: 7,
  },
  { id: "skip-noisy-task-source-4", shape: "circle", color: "green", value: 8 },
  {
    id: "skip-noisy-task-source-5",
    shape: "square",
    color: "blue",
    value: 9,
  },
  {
    id: "skip-noisy-task-source-6",
    shape: "triangle",
    color: "green",
    value: 10,
  },
];

export const SKIP_TASKS: SkipOutputTestTaskDefinition[] = [
  {
    id: "skip-noisy-start",
    taskNumber: 1,
    title: "Odfiltrujte počáteční šum streamu",
    sourceValues: SKIP_FIRST_VALUES_SOURCE_VALUES,
    expectedOutputValues: [3, 4, 5],
    enabledOperatorTypes: ["skip"],
    maxOperators: 1,
  },
  {
    id: "skip-all-values",
    taskNumber: 2,
    title: "Zajistěte, aby nic neprošlo",
    sourceValues: SKIP_NOISY_START_SOURCE_VALUES,
    expectedOutputValues: [],
    enabledOperatorTypes: ["skip"],
    maxOperators: 1,
  },
];
