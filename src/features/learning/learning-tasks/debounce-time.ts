import type { PipelineOperatorType } from "@/features/pipeline-editor";
import type { StreamValue } from "@/types/stream";

import type { OutputTestTaskDefinition } from "../components/OutputTestTask";

export type DebounceTimeLearningOperator = {
  type: Extract<PipelineOperatorType, "debounceTime">;
  label: string;
  description: string;
};

export type DebounceTimeOutputTestTaskDefinition = OutputTestTaskDefinition & {
  id: "debounce-time-rapid-series";
};

export const DEBOUNCE_TIME_LEARNING_OPERATOR: DebounceTimeLearningOperator = {
  type: "debounceTime",
  label: "debounceTime",
  description: "Propustí poslední hodnotu po klidové pauze ve streamu.",
};

const DEBOUNCE_TIME_RAPID_SERIES_SOURCE_VALUES: StreamValue[] = [
  {
    id: "debounce-time-rapid-series-task-source-1",
    shape: "circle",
    color: "red",
    value: 1,
    emittedAtMs: 0,
  },
  {
    id: "debounce-time-rapid-series-task-source-2",
    shape: "square",
    color: "blue",
    value: 2,
    emittedAtMs: 250,
  },
  {
    id: "debounce-time-rapid-series-task-source-3",
    shape: "triangle",
    color: "green",
    value: 3,
    emittedAtMs: 550,
  },
  {
    id: "debounce-time-rapid-series-task-source-4",
    shape: "circle",
    color: "blue",
    value: 4,
    emittedAtMs: 850,
  },
];

export const DEBOUNCE_TIME_TASKS: DebounceTimeOutputTestTaskDefinition[] = [
  {
    id: "debounce-time-rapid-series",
    taskNumber: 1,
    title: "Zajistěte minimální rozestup",
    taskType: "behavior",
    inputSummary: "hodnoty přicházejí v rychlé sérii",
    outputSummary:
      "mezi výstupními hodnotami nesmí být menší rozestup než 1 sekunda",
    sourceValues: DEBOUNCE_TIME_RAPID_SERIES_SOURCE_VALUES,
    validationOutputValues: [
      { color: "blue", shape: "circle", value: 4, emittedAtMs: 1850 },
    ],
    enabledOperatorTypes: ["debounceTime"],
    expectedOperatorTypes: ["debounceTime"],
    operatorRequirements: [{ type: "debounceTime", durationMs: 1000 }],
    maxOperators: 1,
  },
];
