import type { PipelineOperatorType } from "@/features/pipeline-editor";
import type { StreamValue } from "@/types/stream";

import type { OutputTestTaskDefinition } from "../components/OutputTestTask";

const ALL_CHALLENGE_OPERATOR_TYPES = [
  "map",
  "filter",
  "take",
  "skip",
  "distinctUntilChanged",
  "tap",
  "startWith",
  "scan",
  "delay",
  "debounceTime",
  "catchError",
] satisfies PipelineOperatorType[];

const DEBOUNCE_BEFORE_DISTINCT_SOURCE_VALUES: StreamValue[] = [
  {
    id: "challenge-debounce-before-distinct-source-1",
    shape: "circle",
    color: "red",
    value: 2,
    emittedAtMs: 0,
  },
  {
    id: "challenge-debounce-before-distinct-source-2",
    shape: "square",
    color: "blue",
    value: 2,
    emittedAtMs: 400,
  },
  {
    id: "challenge-debounce-before-distinct-source-3",
    shape: "triangle",
    color: "green",
    value: 3,
    emittedAtMs: 800,
  },
];

export const CHALLENGE_TASKS: OutputTestTaskDefinition[] = [
  {
    id: "challenge-debounce-before-distinct",
    taskNumber: 1,
    taskLabelPrefix: "Výzva",
    difficulty: "easy",
    title: "",
    sourceValues: DEBOUNCE_BEFORE_DISTINCT_SOURCE_VALUES,
    expectedOutputValues: [
      {
        shape: "triangle",
        color: "green",
        value: 30,
        emittedAtMs: 1300,
      },
    ],
    enabledOperatorTypes: ALL_CHALLENGE_OPERATOR_TYPES,
    showSourceValueDetails: true,
    maxOperators: 3,
  },
];
