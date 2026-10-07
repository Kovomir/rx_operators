import type { PipelineOperatorType } from "@/features/pipeline-editor";
import type { StreamValue } from "@/types/stream";

import type { OutputTestTaskDefinition } from "../components/OutputTestTask";

export type DelayLearningOperator = {
  type: Extract<PipelineOperatorType, "delay">;
  label: string;
  description: string;
};

export type DelayOutputTestTaskDefinition = OutputTestTaskDefinition & {
  id: "delay-one-second" | "delay-start-with";
};

export const DELAY_LEARNING_OPERATOR: DelayLearningOperator = {
  type: "delay",
  label: "delay",
  description: "Odloží každou hodnotu o nastavený čas.",
};

const DELAY_ONE_SECOND_SOURCE_VALUES: StreamValue[] = [
  {
    id: "delay-one-second-task-source-1",
    shape: "circle",
    color: "red",
    value: 1,
    emittedAtMs: 0,
  },
  {
    id: "delay-one-second-task-source-2",
    shape: "square",
    color: "blue",
    value: 2,
    emittedAtMs: 250,
  },
  {
    id: "delay-one-second-task-source-3",
    shape: "triangle",
    color: "green",
    value: 3,
    emittedAtMs: 900,
  },
];

const DELAY_START_WITH_SOURCE_VALUES: StreamValue[] = [
  {
    id: "delay-start-task-source-1",
    shape: "circle",
    color: "red",
    value: 2,
    emittedAtMs: 400,
  },
  {
    id: "delay-start-task-source-2",
    shape: "square",
    color: "blue",
    value: 3,
    emittedAtMs: 900,
  },
];

export const DELAY_TASKS: DelayOutputTestTaskDefinition[] = [
  {
    id: "delay-one-second",
    taskNumber: 1,
    title: "Použijte operátor delay",
    sourceValues: DELAY_ONE_SECOND_SOURCE_VALUES,
    expectedOutputValues: [
      { color: "red", shape: "circle", value: 1, emittedAtMs: 1000 },
      { color: "blue", shape: "square", value: 2, emittedAtMs: 1250 },
      { color: "green", shape: "triangle", value: 3, emittedAtMs: 1900 },
    ],
    enabledOperatorTypes: ["delay"],
    expectedOperatorTypes: ["delay"],
    showSourceValueDetails: true,
    maxOperators: 1,
  },
  {
    id: "delay-start-with",
    taskNumber: 2,
    title: "Použijte operátor delay",
    sourceValues: DELAY_START_WITH_SOURCE_VALUES,
    expectedOutputValues: [
      { color: "green", shape: "circle", value: 0, emittedAtMs: 1000 },
      { color: "red", shape: "circle", value: 2, emittedAtMs: 1400 },
      { color: "blue", shape: "square", value: 3, emittedAtMs: 1900 },
    ],
    enabledOperatorTypes: ["startWith", "delay"],
    expectedOperatorTypes: ["startWith", "delay"],
    showSourceValueDetails: true,
    maxOperators: 2,
  },
];
