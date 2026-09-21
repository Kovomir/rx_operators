import type { PipelineOperatorType } from "@/features/pipeline-editor";
import type { StreamValue } from "@/types/stream";

import type { OutputTestTaskDefinition } from "../components/OutputTestTask";

export type FilterLearningOperator = {
  type: Extract<PipelineOperatorType, "filter">;
  label: string;
  description: string;
};

export type FilterOutputTestTaskDefinition = OutputTestTaskDefinition & {
  id:
    | "filter-even-values"
    | "filter-even-green-triangles"
    | "filter-empty-after-map";
};

export const FILTER_LEARNING_OPERATOR: FilterLearningOperator = {
  type: "filter",
  label: "filter",
  description: "Filtrování hodnot podle podmínky.",
};

const FILTER_VALUE_TASK_SOURCE_VALUES: StreamValue[] = [
  { id: "filter-value-task-source-1", shape: "circle", color: "red", value: 1 },
  { id: "filter-value-task-source-2", shape: "square", color: "blue", value: 2 },
  {
    id: "filter-value-task-source-3",
    shape: "triangle",
    color: "green",
    value: 3,
  },
  { id: "filter-value-task-source-4", shape: "circle", color: "blue", value: 4 },
  { id: "filter-value-task-source-5", shape: "square", color: "red", value: 5 },
  {
    id: "filter-value-task-source-6",
    shape: "triangle",
    color: "green",
    value: 6,
  },
];

const FILTER_COLOR_TASK_SOURCE_VALUES: StreamValue[] = [
  { id: "filter-color-task-source-1", shape: "circle", color: "blue", value: 2 },
  {
    id: "filter-color-task-source-2",
    shape: "triangle",
    color: "green",
    value: 4,
  },
  { id: "filter-color-task-source-3", shape: "square", color: "green", value: 6 },
  { id: "filter-color-task-source-4", shape: "triangle", color: "red", value: 8 },
  {
    id: "filter-color-task-source-5",
    shape: "triangle",
    color: "green",
    value: 10,
  },
  {
    id: "filter-color-task-source-6",
    shape: "triangle",
    color: "green",
    value: 11,
  },
];

const FILTER_EMPTY_AFTER_MAP_TASK_SOURCE_VALUES: StreamValue[] = [
  {
    id: "filter-empty-after-map-task-source-1",
    shape: "circle",
    color: "red",
    value: 1,
  },
  {
    id: "filter-empty-after-map-task-source-2",
    shape: "square",
    color: "blue",
    value: 2,
  },
  {
    id: "filter-empty-after-map-task-source-3",
    shape: "triangle",
    color: "green",
    value: 3,
  },
  {
    id: "filter-empty-after-map-task-source-4",
    shape: "circle",
    color: "blue",
    value: 4,
  },
];

export const FILTER_TASKS: FilterOutputTestTaskDefinition[] = [
  {
    id: "filter-even-values",
    taskNumber: 1,
    title: "Filtrujte hodnoty pomocí filter",
    sourceValues: FILTER_VALUE_TASK_SOURCE_VALUES,
    expectedOutputValues: [2, 4, 6],
    enabledOperatorTypes: ["filter"],
    maxOperators: 1,
  },
  {
    id: "filter-even-green-triangles",
    taskNumber: 2,
    title: "Filtrujte hodnoty pomocí filter",
    sourceValues: FILTER_COLOR_TASK_SOURCE_VALUES,
    expectedOutputValues: [
      { shape: "triangle", color: "green", value: 4 },
      { shape: "triangle", color: "green", value: 10 },
    ],
    showSourceValueDetails: true,
    enabledOperatorTypes: ["filter"],
    maxOperators: 3,
  },
  {
    id: "filter-empty-after-map",
    taskNumber: 3,
    title: "Zajistěte, aby nic neprošlo",
    sourceValues: FILTER_EMPTY_AFTER_MAP_TASK_SOURCE_VALUES,
    expectedOutputValues: [],
    enabledOperatorTypes: ["filter"],
    maxOperators: 1,
  },
];
