import type { PipelineOperator } from "@/features/pipeline-editor";
import type { StreamValue } from "@/types/stream";

import {
  applyDebounceTimeOperator,
  createCatchErrorReplacementValue,
  createErrorStreamValue,
  applyDelayOperator,
  applyMapOperator,
  applyDistinctUntilChangedOperator,
  applyScanOperator,
  applySkipOperator,
  applyStartWithOperator,
  applyTakeOperator,
  passesFilterOperator,
} from "./operator-semantics";

type PipelineEvaluationState = {
  errorValue: StreamValue | null;
  values: StreamValue[];
};

export function evaluatePipelineOutput(
  sourceValues: StreamValue[],
  operators: PipelineOperator[]
): StreamValue[] {
  return evaluatePipeline(sourceValues, operators).values;
}

export function evaluatePipelineTapValues(
  sourceValues: StreamValue[],
  operators: PipelineOperator[]
): number[] {
  const tapValues: number[] = [];
  let state = createInitialEvaluationState(sourceValues);

  for (const operator of operators) {
    if (operator.type === "tap") {
      tapValues.push(...state.values.map((value) => value.value));
    }

    state = applyPipelineOperator(state, operator);
  }

  return tapValues;
}

function evaluatePipeline(
  sourceValues: StreamValue[],
  operators: PipelineOperator[]
): PipelineEvaluationState {
  return operators.reduce(
    (state, operator) => applyPipelineOperator(state, operator),
    createInitialEvaluationState(sourceValues)
  );
}

function createInitialEvaluationState(
  sourceValues: StreamValue[]
): PipelineEvaluationState {
  const values: StreamValue[] = [];

  for (const value of sourceValues) {
    if (value.kind === "cancelled") {
      continue;
    }

    if (value.kind === "error") {
      return {
        errorValue: value,
        values,
      };
    }

    values.push(value);
  }

  return {
    errorValue: null,
    values,
  };
}

function applyPipelineOperator(
  state: PipelineEvaluationState,
  operator: PipelineOperator
): PipelineEvaluationState {
  if (state.errorValue) {
    if (operator.type !== "catchError") {
      return state;
    }

    return {
      errorValue: null,
      values: [
        ...state.values,
        createCatchErrorReplacementValue(operator, state.errorValue),
      ],
    };
  }

  switch (operator.type) {
    case "map":
      return applyMapOperatorToState(state.values, operator);
    case "filter":
      return {
        errorValue: null,
        values: state.values.filter((value) =>
          passesFilterOperator(value, operator)
        ),
      };
    case "skip":
      return {
        errorValue: null,
        values: applySkipOperator(state.values, operator),
      };
    case "take":
      return {
        errorValue: null,
        values: applyTakeOperator(state.values, operator),
      };
    case "distinctUntilChanged":
      return {
        errorValue: null,
        values: applyDistinctUntilChangedOperator(state.values),
      };
    case "tap":
      return state;
    case "startWith":
      return {
        errorValue: null,
        values: applyStartWithOperator(state.values, operator),
      };
    case "scan":
      return {
        errorValue: null,
        values: applyScanOperator(state.values),
      };
    case "debounceTime":
      return {
        errorValue: null,
        values: applyDebounceTimeOperator(state.values, operator),
      };
    case "catchError":
      return state;
    case "delay":
      return {
        errorValue: null,
        values: applyDelayOperator(state.values, operator),
      };
  }
}

function applyMapOperatorToState(
  values: StreamValue[],
  operator: Extract<PipelineOperator, { type: "map" }>
): PipelineEvaluationState {
  const nextValues: StreamValue[] = [];

  for (const value of values) {
    try {
      nextValues.push(applyMapOperator(value, operator));
    } catch {
      return {
        errorValue: createErrorStreamValue(value, operator.id),
        values: nextValues,
      };
    }
  }

  return {
    errorValue: null,
    values: nextValues,
  };
}
