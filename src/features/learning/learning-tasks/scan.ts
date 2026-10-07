import type { PipelineOperatorType } from "@/features/pipeline-editor";
import type { StreamValue } from "@/types/stream";

import type { OutputTestTaskDefinition } from "../components/OutputTestTask";

export type ScanLearningOperator = {
  type: Extract<PipelineOperatorType, "scan">;
  label: string;
  description: string;
};

export type ScanOutputTestTaskDefinition = OutputTestTaskDefinition & {
  id: "scan-running-sum" | "scan-even-values" | "scan-after-skip";
};

export const SCAN_LEARNING_OPERATOR: ScanLearningOperator = {
  type: "scan",
  label: "scan",
  description: "Průběžná akumulace hodnot streamu.",
};

const SCAN_RUNNING_SUM_SOURCE_VALUES: StreamValue[] = [
  { id: "scan-sum-task-source-1", shape: "circle", color: "red", value: 1 },
  { id: "scan-sum-task-source-2", shape: "square", color: "blue", value: 2 },
  { id: "scan-sum-task-source-3", shape: "triangle", color: "green", value: 3 },
  { id: "scan-sum-task-source-4", shape: "circle", color: "blue", value: 4 },
];

const SCAN_EVEN_SOURCE_VALUES: StreamValue[] = [
  { id: "scan-even-task-source-1", shape: "circle", color: "red", value: 1 },
  { id: "scan-even-task-source-2", shape: "square", color: "blue", value: 2 },
  {
    id: "scan-even-task-source-3",
    shape: "triangle",
    color: "green",
    value: 3,
  },
  { id: "scan-even-task-source-4", shape: "circle", color: "blue", value: 4 },
  { id: "scan-even-task-source-5", shape: "square", color: "red", value: 5 },
  {
    id: "scan-even-task-source-6",
    shape: "triangle",
    color: "green",
    value: 6,
  },
];

const SCAN_AFTER_SKIP_SOURCE_VALUES: StreamValue[] = [
  { id: "scan-skip-task-source-1", shape: "circle", color: "red", value: 1 },
  { id: "scan-skip-task-source-2", shape: "square", color: "blue", value: 2 },
  {
    id: "scan-skip-task-source-3",
    shape: "triangle",
    color: "green",
    value: 3,
  },
  { id: "scan-skip-task-source-4", shape: "circle", color: "blue", value: 4 },
  { id: "scan-skip-task-source-5", shape: "square", color: "red", value: 5 },
];

export const SCAN_TASKS: ScanOutputTestTaskDefinition[] = [
  {
    id: "scan-running-sum",
    taskNumber: 1,
    title: "Použijte operátor scan",
    sourceValues: SCAN_RUNNING_SUM_SOURCE_VALUES,
    expectedOutputValues: [1, 3, 6, 10],
    enabledOperatorTypes: ["scan"],
    expectedOperatorTypes: ["scan"],
    maxOperators: 1,
  },
  {
    id: "scan-even-values",
    taskNumber: 2,
    title: "Použijte operátor scan",
    sourceValues: SCAN_EVEN_SOURCE_VALUES,
    expectedOutputValues: [2, 6, 12],
    enabledOperatorTypes: ["filter", "scan"],
    expectedOperatorTypes: ["filter", "scan"],
    maxOperators: 2,
  },
  {
    id: "scan-after-skip",
    taskNumber: 3,
    title: "Použijte operátor scan",
    sourceValues: SCAN_AFTER_SKIP_SOURCE_VALUES,
    expectedOutputValues: [3, 7, 12],
    enabledOperatorTypes: ["skip", "scan"],
    expectedOperatorTypes: ["skip", "scan"],
    maxOperators: 2,
  },
];
