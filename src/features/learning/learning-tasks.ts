import type {
  PipelineOperator,
  PipelineOperatorType,
} from "@/features/pipeline-editor";
import type { StreamValue } from "@/features/stream-visualizer";

import type { OutputTestTaskDefinition } from "./components/OutputTestTask";

export type LearningOperator = {
  type: PipelineOperatorType;
  label: string;
  description: string;
};

export const LEARNING_OPERATORS: LearningOperator[] = [
  {
    type: "map",
    label: "map",
    description: "Transformace každé hodnoty ve streamu.",
  },
  {
    type: "filter",
    label: "filter",
    description: "Filtrování hodnot podle podmínky.",
  },
];

const MAP_TASK_SOURCE_VALUES: StreamValue[] = [
  { id: "map-task-source-1", shape: "circle", color: "red", value: 1 },
  { id: "map-task-source-2", shape: "square", color: "blue", value: 3 },
  { id: "map-task-source-3", shape: "triangle", color: "green", value: 5 },
  { id: "map-task-source-4", shape: "circle", color: "blue", value: 7 },
];

const MAP_CONSTANT_TASK_SOURCE_VALUES: StreamValue[] = [
  { id: "map-constant-task-source-1", shape: "circle", color: "red", value: 2 },
  { id: "map-constant-task-source-2", shape: "square", color: "blue", value: 4 },
  {
    id: "map-constant-task-source-3",
    shape: "triangle",
    color: "green",
    value: 6,
  },
  {
    id: "map-constant-task-source-4",
    shape: "circle",
    color: "blue",
    value: 8,
  },
];

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

const MAP_TASKS: OutputTestTaskDefinition[] = [
  {
    id: "map-output",
    taskNumber: 1,
    title: "Transformujte hodnoty pomocí map",
    sourceValues: MAP_TASK_SOURCE_VALUES,
    expectedOutputValues: [3, 5, 7, 9],
    maxOperators: 1,
  },
  {
    id: "map-constant-minus-five",
    taskNumber: 2,
    title: "Transformujte hodnoty pomocí map",
    sourceValues: MAP_CONSTANT_TASK_SOURCE_VALUES,
    expectedOutputValues: [-5, -5, -5, -5],
    maxOperators: 2,
  },
];

const FILTER_TASKS: OutputTestTaskDefinition[] = [
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

export const TASKS_BY_OPERATOR: Record<
  PipelineOperatorType,
  OutputTestTaskDefinition[]
> = {
  map: MAP_TASKS,
  filter: FILTER_TASKS,
};
