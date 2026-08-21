import type { PipelineOperator } from "@/features/pipeline-editor";
import type { PipelineOperatorType } from "@/features/pipeline-editor";
import type { StreamValue } from "@/features/stream-visualizer";

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

const FILTER_EMPTY_INITIAL_MAP_OPERATOR_ID = "filter-empty-initial-map";
const FILTER_EMPTY_INITIAL_OPERATORS: PipelineOperator[] = [
  {
    id: FILTER_EMPTY_INITIAL_MAP_OPERATOR_ID,
    type: "map",
    config: {
      operation: "multiply",
      operand: 2,
    },
  },
];

export const FILTER_TASKS: FilterOutputTestTaskDefinition[] = [
  {
    id: "filter-even-values",
    taskNumber: 1,
    title: "Filtrujte hodnoty pomocí filter",
    sourceValues: FILTER_VALUE_TASK_SOURCE_VALUES,
    expectedOutputValues: [2, 4, 6],
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
    maxOperators: 3,
  },
  {
    id: "filter-empty-after-map",
    taskNumber: 3,
    title: "Zkombinujte map a filter",
    sourceValues: FILTER_EMPTY_AFTER_MAP_TASK_SOURCE_VALUES,
    expectedOutputValues: [],
    initialOperators: FILTER_EMPTY_INITIAL_OPERATORS,
    lockedOperatorIds: [FILTER_EMPTY_INITIAL_MAP_OPERATOR_ID],
    maxOperators: 2,
  },
];
