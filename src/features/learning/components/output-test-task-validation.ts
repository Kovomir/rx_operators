import type {
  PipelineOperator,
  PipelineOperatorType,
} from "@/features/pipeline-editor";
import type { StreamValue } from "@/features/stream-visualizer";

import type {
  ExpectedOutputValue,
  OutputTestTaskDefinition,
  PipelineOperatorRequirement,
} from "./output-test-task-types";

export type TestResult = "passed" | "failed";

type GetOutputTestResultArgs = {
  actualOutputValues: StreamValue[];
  actualTapValues: number[];
  operators: PipelineOperator[];
  task: OutputTestTaskDefinition;
};

export function getOutputTestResult({
  actualOutputValues,
  actualTapValues,
  operators,
  task,
}: GetOutputTestResultArgs): TestResult {
  const outputValuesForValidation =
    task.validationOutputValues ?? task.expectedOutputValues;
  const hasExpectedOutput = outputValuesForValidation
    ? areOutputValuesEqual(actualOutputValues, outputValuesForValidation)
    : true;
  const hasExpectedOperators = areOperatorTypesEqual(
    operators,
    task.expectedOperatorTypes
  );
  const hasExpectedOperatorRequirements = doOperatorsSatisfyRequirements(
    operators,
    task.operatorRequirements
  );
  const hasExpectedTapValues = areNumberArraysEqual(
    actualTapValues,
    task.expectedTapValues
  );

  return hasExpectedOutput &&
    hasExpectedOperators &&
    hasExpectedOperatorRequirements &&
    hasExpectedTapValues
    ? "passed"
    : "failed";
}

function areOutputValuesEqual(
  actualValues: StreamValue[],
  expectedValues: ExpectedOutputValue[]
) {
  return (
    actualValues.length === expectedValues.length &&
    actualValues.every((actualValue, index) => {
      const expectedValue = expectedValues[index];

      if (expectedValue === undefined) {
        return false;
      }

      if (typeof expectedValue === "number") {
        return actualValue.value === expectedValue;
      }

      return (
        actualValue.value === expectedValue.value &&
        actualValue.color === expectedValue.color &&
        actualValue.shape === expectedValue.shape &&
        (typeof expectedValue.emittedAtMs !== "number" ||
          actualValue.emittedAtMs === expectedValue.emittedAtMs)
      );
    })
  );
}

function areOperatorTypesEqual(
  operators: PipelineOperator[],
  expectedOperatorTypes: PipelineOperatorType[] | undefined
) {
  if (!expectedOperatorTypes) {
    return true;
  }

  return (
    operators.length === expectedOperatorTypes.length &&
    operators.every(
      (operator, index) => operator.type === expectedOperatorTypes[index]
    )
  );
}

function doOperatorsSatisfyRequirements(
  operators: PipelineOperator[],
  requirements: PipelineOperatorRequirement[] | undefined
) {
  if (!requirements) {
    return true;
  }

  return requirements.every((requirement) =>
    operators.some((operator) => {
      switch (requirement.type) {
        case "filter":
          return (
            operator.type === "filter" &&
            operator.config.target === requirement.target &&
            areStringArraysEqual(
              operator.config.allowedColors,
              requirement.allowedColors
            ) &&
            areStringArraysEqual(
              operator.config.allowedShapes,
              requirement.allowedShapes
            ) &&
            areStringArraysEqual(
              operator.config.allowedValueKinds,
              requirement.allowedValueKinds
            )
          );
        case "map":
          return (
            operator.type === "map" &&
            operator.config.operation === requirement.operation &&
            operator.config.operand === requirement.operand
          );
        case "debounceTime":
          return (
            operator.type === "debounceTime" &&
            operator.config.durationMs === requirement.durationMs
          );
        case "catchError":
          return (
            operator.type === "catchError" &&
            operator.config.replacementValue === requirement.replacementValue
          );
      }
    })
  );
}

function areStringArraysEqual(
  actualValues: string[],
  expectedValues: string[] | undefined
) {
  if (!expectedValues) {
    return true;
  }

  return (
    actualValues.length === expectedValues.length &&
    actualValues.every(
      (actualValue, index) => actualValue === expectedValues[index]
    )
  );
}

function areNumberArraysEqual(
  actualValues: number[],
  expectedValues: number[] | undefined
) {
  if (!expectedValues) {
    return true;
  }

  return (
    actualValues.length === expectedValues.length &&
    actualValues.every((actualValue, index) => actualValue === expectedValues[index])
  );
}
