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

const TAP_FILTER_OUTPUT_VALUES = TAP_FILTER_SOURCE_VALUES.filter(
  ({ value }) => value % 2 === 0
);

export const TAP_TASKS: TapOutputTestTaskDefinition[] = [
  {
    id: "tap-log-values",
    taskNumber: 1,
    title: "Použijte operátor tap",
    sourceValues: TAP_LOG_VALUES_SOURCE_VALUES,
    expectedOutputValues: TAP_LOG_VALUES_SOURCE_VALUES,
    expectedTapValues: TAP_LOG_VALUES_SOURCE_VALUES,
    validateOutputAppearance: false,
    enabledOperatorTypes: ["tap"],
    maxOperators: 1,
  },
  {
    id: "tap-after-filter",
    taskNumber: 2,
    title: "Použijte operátor tap",
    sourceValues: TAP_FILTER_SOURCE_VALUES,
    expectedOutputValues: TAP_FILTER_OUTPUT_VALUES,
    expectedTapValues: TAP_FILTER_OUTPUT_VALUES,
    validateOutputAppearance: false,
    enabledOperatorTypes: ["filter", "tap"],
    maxOperators: 2,
  },
  {
    id: "tap-before-map",
    taskNumber: 3,
    title: "Použijte operátor tap",
    sourceValues: TAP_BEFORE_MAP_SOURCE_VALUES,
    expectedOutputValues: TAP_BEFORE_MAP_SOURCE_VALUES.map((value) => ({
      ...value,
      value: value.value * 10,
    })),
    expectedTapValues: TAP_BEFORE_MAP_SOURCE_VALUES,
    validateOutputAppearance: false,
    enabledOperatorTypes: ["tap", "map"],
    maxOperators: 2,
  },
];
