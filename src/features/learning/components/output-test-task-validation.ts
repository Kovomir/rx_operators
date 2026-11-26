import type { StreamValue } from "@/types/stream";

import type { OutputTestTaskDefinition } from "./output-test-task-types";

export type TestResult = "passed" | "failed";

type GetOutputTestResultArgs = {
  actualOutputValues: StreamValue[];
  actualTapValues: StreamValue[];
  task: OutputTestTaskDefinition;
};

export function getOutputTestResult({
  actualOutputValues,
  actualTapValues,
  task,
}: GetOutputTestResultArgs): TestResult {
  const hasExpectedOutput = areStreamValuesEqual(
    actualOutputValues,
    task.expectedOutputValues
  );
  const hasExpectedTapValues =
    !task.expectedTapValues ||
    areStreamValuesEqual(actualTapValues, task.expectedTapValues);

  return hasExpectedOutput && hasExpectedTapValues ? "passed" : "failed";
}

function areStreamValuesEqual(
  actualValues: StreamValue[],
  expectedValues: StreamValue[]
) {
  return (
    actualValues.length === expectedValues.length &&
    actualValues.every((actualValue, index) => {
      const expectedValue = expectedValues[index];

      return (
        actualValue.value === expectedValue.value &&
        actualValue.color === expectedValue.color &&
        actualValue.shape === expectedValue.shape &&
        (expectedValue.emittedAtMs === undefined ||
          actualValue.emittedAtMs === expectedValue.emittedAtMs)
      );
    })
  );
}
