import type { StreamValue } from "@/types/stream";

import type { OutputTestTaskDefinition } from "./output-test-task-types";

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
  const hasExpectedOutput = task.expectedOutputValues
    ? areOutputValuesEqual(
        actualOutputValues,
        task.expectedOutputValues,
        task.validateOutputAppearance ?? true
      )
    : true;
  const hasExpectedTapValues = areNumberArraysEqual(
    actualTapValues,
    task.expectedTapValues?.map(({ value }) => value)
  );

  return hasExpectedOutput && hasExpectedTapValues ? "passed" : "failed";
}

function areOutputValuesEqual(
  actualValues: StreamValue[],
  expectedValues: StreamValue[],
  validateAppearance: boolean
) {
  return (
    actualValues.length === expectedValues.length &&
    actualValues.every((actualValue, index) => {
      const expectedValue = expectedValues[index];

      if (expectedValue === undefined) {
        return false;
      }

      return (
        actualValue.value === expectedValue.value &&
        (!validateAppearance ||
          (actualValue.color === expectedValue.color &&
            actualValue.shape === expectedValue.shape)) &&
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
