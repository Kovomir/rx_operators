import type { PipelineOperatorType } from "@/features/pipeline-editor";
import type { StreamValue } from "@/types/stream";

import type { OutputTestTaskDefinition } from "../components/OutputTestTask";

export type StartWithLearningOperator = {
  type: Extract<PipelineOperatorType, "startWith">;
  label: string;
  description: string;
};

export type StartWithOutputTestTaskDefinition = OutputTestTaskDefinition & {
  id: "start-with-initial-value" | "start-with-filter-and-map";
};

export const START_WITH_LEARNING_OPERATOR: StartWithLearningOperator = {
  type: "startWith",
  label: "startWith",
  description: "Přidání počáteční hodnoty do streamu.",
};

const START_WITH_INITIAL_SOURCE_VALUES: StreamValue[] = [
  { id: "start-with-initial-task-source-2", shape: "square", color: "blue", value: 2 },
  {
    id: "start-with-initial-task-source-3",
    shape: "triangle",
    color: "green",
    value: 3,
  },
  { id: "start-with-initial-task-source-4", shape: "circle", color: "red", value: 4 },
];

const START_WITH_FILTER_SOURCE_VALUES: StreamValue[] = [
  {
    id: "start-with-filter-task-source-2",
    shape: "square",
    color: "blue",
    value: 2,
  },
  {
    id: "start-with-filter-task-source-3",
    shape: "triangle",
    color: "green",
    value: 3,
  },
  {
    id: "start-with-filter-task-source-4",
    shape: "circle",
    color: "red",
    value: 4,
  },
];

export const START_WITH_TASKS: StartWithOutputTestTaskDefinition[] = [
  {
    id: "start-with-initial-value",
    taskNumber: 1,
    title: "Použijte operátor startWith",
    sourceValues: START_WITH_INITIAL_SOURCE_VALUES,
    expectedOutputValues: [1, 2, 3, 4],
    enabledOperatorTypes: ["startWith"],
    expectedOperatorTypes: ["startWith"],
    maxOperators: 1,
  },
  {
    id: "start-with-filter-and-map",
    taskNumber: 2,
    title: "Použijte operátor startWith",
    sourceValues: START_WITH_FILTER_SOURCE_VALUES,
    expectedOutputValues: [10, 30],
    enabledOperatorTypes: ["startWith", "filter", "map"],
    expectedOperatorTypes: ["startWith", "filter", "map"],
    maxOperators: 3,
  },
];
