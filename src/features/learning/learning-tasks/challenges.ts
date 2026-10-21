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

const FIRST_LIMIT_MARKERS_SOURCE_VALUES: StreamValue[] = [
  {
    id: "challenge-first-limit-marker-source-1",
    shape: "circle",
    color: "red",
    value: 3,
  },
  {
    id: "challenge-first-limit-marker-source-2",
    shape: "square",
    color: "blue",
    value: 2,
  },
  {
    id: "challenge-first-limit-marker-source-3",
    shape: "triangle",
    color: "red",
    value: 4,
  },
  {
    id: "challenge-first-limit-marker-source-4",
    shape: "circle",
    color: "green",
    value: 1,
  },
  {
    id: "challenge-first-limit-marker-source-5",
    shape: "square",
    color: "green",
    value: 5,
  },
  {
    id: "challenge-first-limit-marker-source-6",
    shape: "triangle",
    color: "green",
    value: 2,
  },
];

const SKIP_AFTER_CALCULATION_SOURCE_VALUES: StreamValue[] = [
  {
    id: "challenge-skip-after-calculation-source-1",
    shape: "circle",
    color: "red",
    value: 1,
  },
  {
    id: "challenge-skip-after-calculation-source-2",
    shape: "square",
    color: "blue",
    value: 2,
  },
  {
    id: "challenge-skip-after-calculation-source-3",
    shape: "triangle",
    color: "green",
    value: 3,
  },
  {
    id: "challenge-skip-after-calculation-source-4",
    shape: "circle",
    color: "blue",
    value: 4,
  },
  {
    id: "challenge-skip-after-calculation-source-5",
    shape: "square",
    color: "red",
    value: 5,
  },
];

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

const IMMEDIATE_INITIAL_DELAYED_DATA_SOURCE_VALUES: StreamValue[] = [
  {
    id: "challenge-immediate-initial-source-1",
    shape: "circle",
    color: "red",
    value: 1,
    emittedAtMs: 0,
  },
  {
    id: "challenge-immediate-initial-source-2",
    shape: "square",
    color: "blue",
    value: 2,
    emittedAtMs: 250,
  },
  {
    id: "challenge-immediate-initial-source-3",
    shape: "triangle",
    color: "green",
    value: 3,
    emittedAtMs: 500,
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
  {
    id: "challenge-immediate-initial-delayed-data",
    taskNumber: 2,
    taskLabelPrefix: "Výzva",
    difficulty: "easy",
    title: "",
    sourceValues: IMMEDIATE_INITIAL_DELAYED_DATA_SOURCE_VALUES,
    expectedOutputValues: [
      {
        shape: "circle",
        color: "green",
        value: 10,
        emittedAtMs: 0,
      },
      {
        shape: "circle",
        color: "red",
        value: 2,
        emittedAtMs: 1000,
      },
      {
        shape: "square",
        color: "blue",
        value: 4,
        emittedAtMs: 1250,
      },
      {
        shape: "triangle",
        color: "green",
        value: 6,
        emittedAtMs: 1500,
      },
    ],
    enabledOperatorTypes: ALL_CHALLENGE_OPERATOR_TYPES,
    showSourceValueDetails: true,
    maxOperators: 3,
  },
  {
    id: "challenge-first-limit-markers",
    taskNumber: 3,
    taskLabelPrefix: "Výzva",
    difficulty: "medium",
    title: "",
    sourceValues: FIRST_LIMIT_MARKERS_SOURCE_VALUES,
    expectedOutputValues: [
      {
        shape: "circle",
        color: "green",
        value: 10,
      },
      {
        shape: "square",
        color: "green",
        value: 15,
      },
    ],
    enabledOperatorTypes: ALL_CHALLENGE_OPERATOR_TYPES,
    showSourceValueDetails: true,
    maxOperators: 3,
  },
  {
    id: "challenge-skip-after-calculation",
    taskNumber: 4,
    taskLabelPrefix: "Výzva",
    difficulty: "medium",
    title: "",
    sourceValues: SKIP_AFTER_CALCULATION_SOURCE_VALUES,
    expectedOutputValues: [
      {
        shape: "triangle",
        color: "green",
        value: 12,
      },
      {
        shape: "circle",
        color: "blue",
        value: 20,
      },
    ],
    enabledOperatorTypes: ALL_CHALLENGE_OPERATOR_TYPES,
    showSourceValueDetails: true,
    maxOperators: 4,
  },
];
