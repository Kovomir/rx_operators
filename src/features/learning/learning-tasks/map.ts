import type { PipelineOperatorType } from "@/features/pipeline-editor";
import type { StreamValue } from "@/features/stream-visualizer";

import type { OutputTestTaskDefinition } from "../components/OutputTestTask";

export type MapLearningOperator = {
  type: Extract<PipelineOperatorType, "map">;
  label: string;
  description: string;
};

export type MapOutputTestTaskDefinition = OutputTestTaskDefinition & {
  id: "map-output" | "map-constant-minus-five";
};

export const MAP_LEARNING_OPERATOR: MapLearningOperator = {
  type: "map",
  label: "map",
  description: "Transformace každé hodnoty ve streamu.",
};

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

export const MAP_TASKS: MapOutputTestTaskDefinition[] = [
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
