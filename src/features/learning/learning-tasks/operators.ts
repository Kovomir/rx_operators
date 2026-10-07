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
  SKIP_LEARNING_OPERATOR,
  SKIP_TASKS,
  type SkipLearningOperator,
  type SkipOutputTestTaskDefinition,
} from "./skip";
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
  | DistinctUntilChangedLearningOperator;

export type LearningTaskDefinition =
  | MapOutputTestTaskDefinition
  | FilterOutputTestTaskDefinition
  | SkipOutputTestTaskDefinition
  | TakeOutputTestTaskDefinition
  | DistinctUntilChangedOutputTestTaskDefinition;

export const LEARNING_OPERATOR_ORDER = [
  "map",
  "filter",
  "take",
  "skip",
  "distinctUntilChanged",
] satisfies PipelineOperatorType[];

export const LEARNING_OPERATORS = [
  MAP_LEARNING_OPERATOR,
  FILTER_LEARNING_OPERATOR,
  TAKE_LEARNING_OPERATOR,
  SKIP_LEARNING_OPERATOR,
  DISTINCT_UNTIL_CHANGED_LEARNING_OPERATOR,
] satisfies LearningOperator[];

export const TASKS_BY_OPERATOR = {
  map: MAP_TASKS,
  filter: FILTER_TASKS,
  skip: SKIP_TASKS,
  take: TAKE_TASKS,
  distinctUntilChanged: DISTINCT_UNTIL_CHANGED_TASKS,
} satisfies Record<LearningOperator["type"], OutputTestTaskDefinition[]>;

export {
  DISTINCT_UNTIL_CHANGED_LEARNING_OPERATOR,
  DISTINCT_UNTIL_CHANGED_TASKS,
  FILTER_LEARNING_OPERATOR,
  FILTER_TASKS,
  MAP_LEARNING_OPERATOR,
  MAP_TASKS,
  SKIP_LEARNING_OPERATOR,
  SKIP_TASKS,
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
  SkipLearningOperator,
  SkipOutputTestTaskDefinition,
  TakeLearningOperator,
  TakeOutputTestTaskDefinition,
};
