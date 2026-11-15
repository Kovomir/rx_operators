import type { StreamValue } from "@/features/stream-visualizer";

import type {
  ExpectedOutputValue,
  OutputTestTaskDefinition,
} from "./output-test-task-types";

export type TestResult = "passed" | "failed";

type GetOutputTestResultArgs = {
  actualOutputValues: StreamValue[];
  actualTapValues: number[];
  task: OutputTestTaskDefinition;
};

export function getOutputTestResult({
  actualOutputValues,
  actualTapValues,
  task,
}: GetOutputTestResultArgs): TestResult {
  const outputValuesForValidation =
    task.validationOutputValues ?? task.expectedOutputValues;
  const hasExpectedOutput = outputValuesForValidation
    ? areOutputValuesEqual(actualOutputValues, outputValuesForValidation)
    : true;
  const hasExpectedTapValues = areNumberArraysEqual(
    actualTapValues,
    task.expectedTapValues
  );

  return hasExpectedOutput && hasExpectedTapValues ? "passed" : "failed";
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
