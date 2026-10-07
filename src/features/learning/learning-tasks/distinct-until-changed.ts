import type { PipelineOperatorType } from "@/features/pipeline-editor";
import type { StreamValue } from "@/types/stream";

import type { OutputTestTaskDefinition } from "../components/OutputTestTask";

export type DistinctUntilChangedLearningOperator = {
  type: Extract<PipelineOperatorType, "distinctUntilChanged">;
  label: string;
  description: string;
};

export type DistinctUntilChangedOutputTestTaskDefinition =
  OutputTestTaskDefinition & {
    id:
      | "distinct-until-changed-neighbor-duplicates"
      | "distinct-until-changed-filter-even-values"
      | "distinct-until-changed-map-before-compare";
  };

export const DISTINCT_UNTIL_CHANGED_LEARNING_OPERATOR: DistinctUntilChangedLearningOperator =
  {
    type: "distinctUntilChanged",
    label: "distinctUntilChanged",
    description: "Odstranění pouze sousedních duplicit.",
  };

const DISTINCT_NEIGHBOR_DUPLICATES_SOURCE_VALUES: StreamValue[] = [
  {
    id: "distinct-neighbor-task-source-1",
    shape: "circle",
    color: "red",
    value: 1,
  },
  {
    id: "distinct-neighbor-task-source-2",
    shape: "square",
    color: "red",
    value: 1,
  },
  {
    id: "distinct-neighbor-task-source-3",
    shape: "triangle",
    color: "blue",
    value: 2,
  },
  {
    id: "distinct-neighbor-task-source-4",
    shape: "circle",
    color: "blue",
    value: 2,
  },
  {
    id: "distinct-neighbor-task-source-5",
    shape: "square",
    color: "green",
    value: 2,
  },
  {
    id: "distinct-neighbor-task-source-6",
    shape: "triangle",
    color: "green",
    value: 3,
  },
  {
    id: "distinct-neighbor-task-source-7",
    shape: "circle",
    color: "red",
    value: 1,
  },
  {
    id: "distinct-neighbor-task-source-8",
    shape: "square",
    color: "red",
    value: 1,
  },
];

const DISTINCT_FILTER_SOURCE_VALUES: StreamValue[] = [
  { id: "distinct-filter-task-source-1", shape: "circle", color: "red", value: 1 },
  { id: "distinct-filter-task-source-2", shape: "square", color: "red", value: 1 },
  {
    id: "distinct-filter-task-source-3",
    shape: "triangle",
    color: "blue",
    value: 2,
  },
  {
    id: "distinct-filter-task-source-4",
    shape: "circle",
    color: "blue",
    value: 2,
  },
  {
    id: "distinct-filter-task-source-5",
    shape: "square",
    color: "green",
    value: 3,
  },
  {
    id: "distinct-filter-task-source-6",
    shape: "triangle",
    color: "green",
    value: 3,
  },
  { id: "distinct-filter-task-source-7", shape: "circle", color: "red", value: 4 },
  { id: "distinct-filter-task-source-8", shape: "square", color: "red", value: 4 },
];

const DISTINCT_MAP_SOURCE_VALUES: StreamValue[] = [
  { id: "distinct-map-task-source-1", shape: "circle", color: "red", value: 1 },
  { id: "distinct-map-task-source-2", shape: "square", color: "red", value: 1 },
  {
    id: "distinct-map-task-source-3",
    shape: "triangle",
    color: "blue",
    value: 2,
  },
  { id: "distinct-map-task-source-4", shape: "circle", color: "blue", value: 2 },
  {
    id: "distinct-map-task-source-5",
    shape: "square",
    color: "green",
    value: 3,
  },
  {
    id: "distinct-map-task-source-6",
    shape: "triangle",
    color: "green",
    value: 3,
  },
];

export const DISTINCT_UNTIL_CHANGED_TASKS: DistinctUntilChangedOutputTestTaskDefinition[] =
  [
    {
      id: "distinct-until-changed-neighbor-duplicates",
      taskNumber: 1,
      title: "Použijte operátor distinctUntilChanged",
      sourceValues: DISTINCT_NEIGHBOR_DUPLICATES_SOURCE_VALUES,
      expectedOutputValues: [1, 2, 3, 1],
      enabledOperatorTypes: ["distinctUntilChanged"],
      expectedOperatorTypes: ["distinctUntilChanged"],
      maxOperators: 1,
    },
    {
      id: "distinct-until-changed-filter-even-values",
      taskNumber: 2,
      title: "Použijte operátor distinctUntilChanged",
      sourceValues: DISTINCT_FILTER_SOURCE_VALUES,
      expectedOutputValues: [2, 4],
      enabledOperatorTypes: ["filter", "distinctUntilChanged"],
      expectedOperatorTypes: ["filter", "distinctUntilChanged"],
      maxOperators: 2,
    },
    {
      id: "distinct-until-changed-map-before-compare",
      taskNumber: 3,
      title: "Použijte operátor distinctUntilChanged",
      sourceValues: DISTINCT_MAP_SOURCE_VALUES,
      expectedOutputValues: [10, 20, 30],
      enabledOperatorTypes: ["map", "distinctUntilChanged"],
      expectedOperatorTypes: ["map", "distinctUntilChanged"],
      maxOperators: 2,
    },
  ];
