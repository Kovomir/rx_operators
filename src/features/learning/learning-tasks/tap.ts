import type { PipelineOperatorType } from "@/features/pipeline-editor";
import type { StreamValue } from "@/types/stream";

import type { OutputTestTaskDefinition } from "../components/OutputTestTask";

export type TapLearningOperator = {
  type: Extract<PipelineOperatorType, "tap">;
  label: string;
  description: string;
};

export type TapOutputTestTaskDefinition = OutputTestTaskDefinition & {
  id:
    | "tap-log-values"
    | "tap-after-filter"
    | "tap-before-map";
};

export const TAP_LEARNING_OPERATOR: TapLearningOperator = {
  type: "tap",
  label: "tap",
  description: "Vedlejší efekt bez změny hodnot streamu.",
};

const TAP_LOG_VALUES_SOURCE_VALUES: StreamValue[] = [
  { id: "tap-log-task-source-1", shape: "circle", color: "red", value: 1 },
  { id: "tap-log-task-source-2", shape: "square", color: "blue", value: 2 },
  { id: "tap-log-task-source-3", shape: "triangle", color: "green", value: 3 },
];

const TAP_FILTER_SOURCE_VALUES: StreamValue[] = [
  { id: "tap-filter-task-source-1", shape: "circle", color: "red", value: 1 },
  { id: "tap-filter-task-source-2", shape: "square", color: "blue", value: 2 },
  {
    id: "tap-filter-task-source-3",
    shape: "triangle",
    color: "green",
    value: 3,
  },
  { id: "tap-filter-task-source-4", shape: "circle", color: "blue", value: 4 },
  { id: "tap-filter-task-source-5", shape: "square", color: "red", value: 5 },
  {
    id: "tap-filter-task-source-6",
    shape: "triangle",
    color: "green",
    value: 6,
  },
];

const TAP_BEFORE_MAP_SOURCE_VALUES: StreamValue[] = [
  { id: "tap-map-task-source-1", shape: "circle", color: "red", value: 1 },
  { id: "tap-map-task-source-2", shape: "square", color: "blue", value: 2 },
  { id: "tap-map-task-source-3", shape: "triangle", color: "green", value: 3 },
];

export const TAP_TASKS: TapOutputTestTaskDefinition[] = [
  {
    id: "tap-log-values",
    taskNumber: 1,
    title: "Použijte operátor tap",
    sourceValues: TAP_LOG_VALUES_SOURCE_VALUES,
    expectedOutputValues: [1, 2, 3],
    expectedTapValues: [1, 2, 3],
    enabledOperatorTypes: ["tap"],
    expectedOperatorTypes: ["tap"],
    maxOperators: 1,
  },
  {
    id: "tap-after-filter",
    taskNumber: 2,
    title: "Použijte operátor tap",
    sourceValues: TAP_FILTER_SOURCE_VALUES,
    expectedOutputValues: [2, 4, 6],
    expectedTapValues: [2, 4, 6],
    enabledOperatorTypes: ["filter", "tap"],
    expectedOperatorTypes: ["filter", "tap"],
    maxOperators: 2,
  },
  {
    id: "tap-before-map",
    taskNumber: 3,
    title: "Použijte operátor tap",
    sourceValues: TAP_BEFORE_MAP_SOURCE_VALUES,
    expectedOutputValues: [10, 20, 30],
    expectedTapValues: [1, 2, 3],
    enabledOperatorTypes: ["tap", "map"],
    expectedOperatorTypes: ["tap", "map"],
    maxOperators: 2,
  },
];
