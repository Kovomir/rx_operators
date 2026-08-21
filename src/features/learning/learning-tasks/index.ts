import type { PipelineOperatorType } from "@/features/pipeline-editor";

import type { OutputTestTaskDefinition } from "../components/OutputTestTask";
import {
  FILTER_LEARNING_OPERATOR,
  FILTER_TASKS,
  type FilterLearningOperator,
  type FilterOutputTestTaskDefinition,
} from "./filter";
import {
  MAP_LEARNING_OPERATOR,
  MAP_TASKS,
  type MapLearningOperator,
  type MapOutputTestTaskDefinition,
} from "./map";

export type LearningOperator = MapLearningOperator | FilterLearningOperator;

export type LearningTaskDefinition =
  | MapOutputTestTaskDefinition
  | FilterOutputTestTaskDefinition;

export const LEARNING_OPERATORS = [
  MAP_LEARNING_OPERATOR,
  FILTER_LEARNING_OPERATOR,
] satisfies LearningOperator[];

export const TASKS_BY_OPERATOR = {
  map: MAP_TASKS,
  filter: FILTER_TASKS,
} satisfies Record<PipelineOperatorType, OutputTestTaskDefinition[]>;

export const LEARNING_TASK_IDS = Object.values(TASKS_BY_OPERATOR)
  .flat()
  .map((task) => task.id);

export function getLearningTaskOperatorType(taskId: string) {
  return LEARNING_OPERATORS.find((operator) =>
    TASKS_BY_OPERATOR[operator.type].some((task) => task.id === taskId)
  )?.type;
}

export {
  FILTER_LEARNING_OPERATOR,
  FILTER_TASKS,
  MAP_LEARNING_OPERATOR,
  MAP_TASKS,
};
export type {
  FilterLearningOperator,
  FilterOutputTestTaskDefinition,
  MapLearningOperator,
  MapOutputTestTaskDefinition,
};
