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

const RELEVANT_EVEN_SUBTOTALS_SOURCE_VALUES: StreamValue[] = [
  {
    id: "challenge-even-subtotals-source-1",
    shape: "circle",
    color: "red",
    value: 99,
  },
  {
    id: "challenge-even-subtotals-source-2",
    shape: "square",
    color: "blue",
    value: 2,
  },
  {
    id: "challenge-even-subtotals-source-3",
    shape: "triangle",
    color: "green",
    value: 0,
  },
  {
    id: "challenge-even-subtotals-source-4",
    shape: "circle",
    color: "blue",
    value: 2,
  },
  {
    id: "challenge-even-subtotals-source-5",
    shape: "square",
    color: "red",
    value: 1,
  },
  {
    id: "challenge-even-subtotals-source-6",
    shape: "triangle",
    color: "green",
    value: 1,
  },
  {
    id: "challenge-even-subtotals-source-7",
    shape: "circle",
    color: "red",
    value: 0,
  },
  {
    id: "challenge-even-subtotals-source-8",
    shape: "square",
    color: "blue",
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

const ERROR_RECOVERY_WITHOUT_DUPLICATE_STATE_SOURCE_VALUES: StreamValue[] = [
  {
    id: "challenge-error-recovery-source-1",
    shape: "circle",
    color: "red",
    value: 1,
  },
  {
    id: "challenge-error-recovery-source-2",
    shape: "square",
    color: "blue",
    value: 2,
  },
  {
    id: "challenge-error-recovery-source-3",
    shape: "triangle",
    color: "green",
    value: 3,
  },
  {
    id: "challenge-error-recovery-source-error",
    kind: "error",
    shape: "square",
    color: "red",
    value: 0,
  },
];

const DISTINCT_RUNNING_TOTALS_SOURCE_VALUES: StreamValue[] = [
  {
    id: "challenge-distinct-running-totals-source-1",
    shape: "circle",
    color: "red",
    value: 2,
  },
  {
    id: "challenge-distinct-running-totals-source-2",
    shape: "square",
    color: "blue",
    value: 0,
  },
  {
    id: "challenge-distinct-running-totals-source-3",
    shape: "triangle",
    color: "green",
    value: 3,
  },
  {
    id: "challenge-distinct-running-totals-source-4",
    shape: "square",
    color: "red",
    value: 0,
  },
  {
    id: "challenge-distinct-running-totals-source-5",
    shape: "circle",
    color: "blue",
    value: 0,
  },
  {
    id: "challenge-distinct-running-totals-source-6",
    shape: "square",
    color: "blue",
    value: 4,
  },
];

const TRANSFORM_ERROR_REPLACEMENT_SOURCE_VALUES: StreamValue[] = [
  {
    id: "challenge-transform-error-replacement-source-1",
    shape: "circle",
    color: "red",
    value: 2,
  },
  {
    id: "challenge-transform-error-replacement-source-2",
    shape: "square",
    color: "blue",
    value: 4,
  },
  {
    id: "challenge-transform-error-replacement-source-error",
    kind: "error",
    shape: "triangle",
    color: "red",
    value: 0,
  },
];

const CLEANED_EVEN_VALUES_SOURCE_VALUES: StreamValue[] = [
  {
    id: "challenge-cleaned-even-values-source-1",
    shape: "circle",
    color: "red",
    value: 1,
  },
  {
    id: "challenge-cleaned-even-values-source-2",
    shape: "square",
    color: "blue",
    value: 1,
  },
  {
    id: "challenge-cleaned-even-values-source-3",
    shape: "triangle",
    color: "green",
    value: 2,
  },
  {
    id: "challenge-cleaned-even-values-source-4",
    shape: "circle",
    color: "red",
    value: 2,
  },
  {
    id: "challenge-cleaned-even-values-source-5",
    shape: "square",
    color: "blue",
    value: 3,
  },
  {
    id: "challenge-cleaned-even-values-source-6",
    shape: "triangle",
    color: "red",
    value: 4,
  },
  {
    id: "challenge-cleaned-even-values-source-7",
    shape: "square",
    color: "green",
    value: 4,
  },
  {
    id: "challenge-cleaned-even-values-source-8",
    shape: "circle",
    color: "blue",
    value: 6,
  },
  {
    id: "challenge-cleaned-even-values-source-9",
    shape: "triangle",
    color: "green",
    value: 7,
  },
  {
    id: "challenge-cleaned-even-values-source-10",
    shape: "square",
    color: "red",
    value: 8,
  },
];

const STABLE_SENSOR_READINGS_SOURCE_VALUES: StreamValue[] = [
  {
    id: "challenge-stable-sensor-readings-source-1",
    shape: "circle",
    color: "red",
    value: 9,
    emittedAtMs: 0,
  },
  {
    id: "challenge-stable-sensor-readings-source-2",
    shape: "square",
    color: "blue",
    value: 8,
    emittedAtMs: 200,
  },
  {
    id: "challenge-stable-sensor-readings-source-3",
    shape: "circle",
    color: "red",
    value: 5,
    emittedAtMs: 1200,
  },
  {
    id: "challenge-stable-sensor-readings-source-4",
    shape: "triangle",
    color: "green",
    value: 6,
    emittedAtMs: 1400,
  },
  {
    id: "challenge-stable-sensor-readings-source-5",
    shape: "square",
    color: "blue",
    value: 7,
    emittedAtMs: 1600,
  },
  {
    id: "challenge-stable-sensor-readings-source-6",
    shape: "circle",
    color: "green",
    value: 4,
    emittedAtMs: 2600,
  },
  {
    id: "challenge-stable-sensor-readings-source-7",
    shape: "triangle",
    color: "red",
    value: 8,
    emittedAtMs: 2800,
  },
  {
    id: "challenge-stable-sensor-readings-source-8",
    shape: "circle",
    color: "blue",
    value: 3,
    emittedAtMs: 3800,
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
    id: "challenge-distinct-running-totals",
    taskNumber: 3,
    taskLabelPrefix: "Výzva",
    difficulty: "easy",
    title: "",
    sourceValues: DISTINCT_RUNNING_TOTALS_SOURCE_VALUES,
    expectedOutputValues: [
      {
        shape: "circle",
        color: "red",
        value: 2,
      },
      {
        shape: "triangle",
        color: "green",
        value: 5,
      },
      {
        shape: "square",
        color: "blue",
        value: 9,
      },
    ],
    enabledOperatorTypes: ALL_CHALLENGE_OPERATOR_TYPES,
    showSourceValueDetails: true,
    maxOperators: 2,
  },
  {
    id: "challenge-transform-error-replacement",
    taskNumber: 4,
    taskLabelPrefix: "Výzva",
    difficulty: "easy",
    title: "",
    sourceValues: TRANSFORM_ERROR_REPLACEMENT_SOURCE_VALUES,
    expectedOutputValues: [
      {
        shape: "circle",
        color: "red",
        value: 3,
      },
      {
        shape: "square",
        color: "blue",
        value: 5,
      },
      {
        shape: "triangle",
        color: "green",
        value: 0,
      },
    ],
    enabledOperatorTypes: ALL_CHALLENGE_OPERATOR_TYPES,
    showSourceValueDetails: true,
    maxOperators: 2,
  },
  {
    id: "challenge-first-limit-markers",
    taskNumber: 5,
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
    taskNumber: 6,
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
  {
    id: "challenge-cleaned-even-values",
    taskNumber: 7,
    taskLabelPrefix: "Výzva",
    difficulty: "medium",
    title: "",
    sourceValues: CLEANED_EVEN_VALUES_SOURCE_VALUES,
    expectedOutputValues: [
      {
        shape: "triangle",
        color: "green",
        value: 6,
      },
      {
        shape: "triangle",
        color: "red",
        value: 12,
      },
      {
        shape: "circle",
        color: "blue",
        value: 18,
      },
    ],
    enabledOperatorTypes: ALL_CHALLENGE_OPERATOR_TYPES,
    showSourceValueDetails: true,
    maxOperators: 4,
  },
  {
    id: "challenge-stable-sensor-readings",
    taskNumber: 8,
    taskLabelPrefix: "Výzva",
    difficulty: "medium",
    title: "",
    sourceValues: STABLE_SENSOR_READINGS_SOURCE_VALUES,
    expectedOutputValues: [
      {
        shape: "square",
        color: "blue",
        value: 14,
        emittedAtMs: 2100,
      },
      {
        shape: "triangle",
        color: "red",
        value: 16,
        emittedAtMs: 3300,
      },
    ],
    enabledOperatorTypes: ALL_CHALLENGE_OPERATOR_TYPES,
    showSourceValueDetails: true,
    maxOperators: 4,
  },
  {
    id: "challenge-error-recovery-without-duplicate-state",
    taskNumber: 9,
    taskLabelPrefix: "Výzva",
    difficulty: "hard",
    title: "",
    sourceValues: ERROR_RECOVERY_WITHOUT_DUPLICATE_STATE_SOURCE_VALUES,
    expectedOutputValues: [
      {
        shape: "circle",
        color: "green",
        value: 10,
      },
      {
        shape: "circle",
        color: "red",
        value: 12,
      },
      {
        shape: "square",
        color: "blue",
        value: 16,
      },
      {
        shape: "triangle",
        color: "green",
        value: 22,
      },
    ],
    enabledOperatorTypes: ALL_CHALLENGE_OPERATOR_TYPES,
    showSourceValueDetails: true,
    maxOperators: 5,
  },
  {
    id: "challenge-relevant-even-subtotals",
    taskNumber: 10,
    taskLabelPrefix: "Výzva",
    difficulty: "hard",
    title: "",
    sourceValues: RELEVANT_EVEN_SUBTOTALS_SOURCE_VALUES,
    expectedOutputValues: [
      {
        shape: "square",
        color: "blue",
        value: 2,
      },
      {
        shape: "circle",
        color: "blue",
        value: 4,
      },
      {
        shape: "triangle",
        color: "green",
        value: 6,
      },
    ],
    enabledOperatorTypes: ALL_CHALLENGE_OPERATOR_TYPES,
    showSourceValueDetails: true,
    maxOperators: 5,
  },
];
