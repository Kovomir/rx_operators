import type { PipelineOperatorType } from "@/features/pipeline-editor";

import type { OutputTestTaskDefinition } from "../components/OutputTestTask";
import {
  FILTER_LEARNING_OPERATOR,
  FILTER_TASKS,
  type FilterLearningOperator,
  type FilterOutputTestTaskDefinition,
} from "./filter";
import {
  DISTINCT_UNTIL_CHANGED_LEARNING_OPERATOR,
  DISTINCT_UNTIL_CHANGED_TASKS,
  type DistinctUntilChangedLearningOperator,
  type DistinctUntilChangedOutputTestTaskDefinition,
} from "./distinct-until-changed";
import {
  MAP_LEARNING_OPERATOR,
  MAP_TASKS,
  type MapLearningOperator,
  type MapOutputTestTaskDefinition,
} from "./map";
import {
  SCAN_LEARNING_OPERATOR,
  SCAN_TASKS,
  type ScanLearningOperator,
  type ScanOutputTestTaskDefinition,
} from "./scan";
import {
  SKIP_LEARNING_OPERATOR,
  SKIP_TASKS,
  type SkipLearningOperator,
  type SkipOutputTestTaskDefinition,
} from "./skip";
import {
  START_WITH_LEARNING_OPERATOR,
  START_WITH_TASKS,
  type StartWithLearningOperator,
  type StartWithOutputTestTaskDefinition,
} from "./start-with";
import {
  TAP_LEARNING_OPERATOR,
  TAP_TASKS,
  type TapLearningOperator,
  type TapOutputTestTaskDefinition,
} from "./tap";
import {
  TAKE_LEARNING_OPERATOR,
  TAKE_TASKS,
  type TakeLearningOperator,
  type TakeOutputTestTaskDefinition,
} from "./take";

export type LearningOperator =
  | MapLearningOperator
  | FilterLearningOperator
  | SkipLearningOperator
  | TakeLearningOperator
  | DistinctUntilChangedLearningOperator
  | TapLearningOperator
  | StartWithLearningOperator
  | ScanLearningOperator;

export type LearningTaskDefinition =
  | MapOutputTestTaskDefinition
  | FilterOutputTestTaskDefinition
  | SkipOutputTestTaskDefinition
  | TakeOutputTestTaskDefinition
  | DistinctUntilChangedOutputTestTaskDefinition
  | TapOutputTestTaskDefinition
  | StartWithOutputTestTaskDefinition
  | ScanOutputTestTaskDefinition;

export const LEARNING_OPERATOR_ORDER = [
  "map",
  "filter",
  "take",
  "skip",
  "distinctUntilChanged",
  "tap",
  "startWith",
  "scan",
] satisfies PipelineOperatorType[];

export const LEARNING_OPERATORS = [
  MAP_LEARNING_OPERATOR,
  FILTER_LEARNING_OPERATOR,
  TAKE_LEARNING_OPERATOR,
  SKIP_LEARNING_OPERATOR,
  DISTINCT_UNTIL_CHANGED_LEARNING_OPERATOR,
  TAP_LEARNING_OPERATOR,
  START_WITH_LEARNING_OPERATOR,
  SCAN_LEARNING_OPERATOR,
] satisfies LearningOperator[];

export const TASKS_BY_OPERATOR = {
  map: MAP_TASKS,
  filter: FILTER_TASKS,
  skip: SKIP_TASKS,
  take: TAKE_TASKS,
  distinctUntilChanged: DISTINCT_UNTIL_CHANGED_TASKS,
  tap: TAP_TASKS,
  startWith: START_WITH_TASKS,
  scan: SCAN_TASKS,
} satisfies Record<LearningOperator["type"], OutputTestTaskDefinition[]>;

export {
  DISTINCT_UNTIL_CHANGED_LEARNING_OPERATOR,
  DISTINCT_UNTIL_CHANGED_TASKS,
  FILTER_LEARNING_OPERATOR,
  FILTER_TASKS,
  MAP_LEARNING_OPERATOR,
  MAP_TASKS,
  SCAN_LEARNING_OPERATOR,
  SCAN_TASKS,
  SKIP_LEARNING_OPERATOR,
  SKIP_TASKS,
  START_WITH_LEARNING_OPERATOR,
  START_WITH_TASKS,
  TAP_LEARNING_OPERATOR,
  TAP_TASKS,
  TAKE_LEARNING_OPERATOR,
  TAKE_TASKS,
};
export type {
  DistinctUntilChangedLearningOperator,
  DistinctUntilChangedOutputTestTaskDefinition,
  FilterLearningOperator,
  FilterOutputTestTaskDefinition,
  MapLearningOperator,
  MapOutputTestTaskDefinition,
  ScanLearningOperator,
  ScanOutputTestTaskDefinition,
  SkipLearningOperator,
  SkipOutputTestTaskDefinition,
  StartWithLearningOperator,
  StartWithOutputTestTaskDefinition,
  TapLearningOperator,
  TapOutputTestTaskDefinition,
  TakeLearningOperator,
  TakeOutputTestTaskDefinition,
};
