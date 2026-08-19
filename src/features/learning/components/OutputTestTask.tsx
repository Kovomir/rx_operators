import { useMemo, useState } from "react";
import { CheckCircle2Icon, RotateCcwIcon, XCircleIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  PipelineEditor,
  type PipelineOperator,
} from "@/features/pipeline-editor";
import {
  PipelineVisualizer,
  type StreamValue,
} from "@/features/stream-visualizer";
import { StreamValueGlyph } from "@/features/stream-visualizer/components/StreamValueGlyph";
import { evaluatePipelineOutput } from "@/lib/rx/evaluate-pipeline-output";
import { cn } from "@/lib/utils";

type TestResult = "passed" | "failed" | null;

export type ExpectedOutputValue =
  | number
  | Pick<StreamValue, "color" | "shape" | "value">;

export type OutputTestTaskDefinition = {
  id: string;
  taskNumber: number;
  title: string;
  sourceValues: StreamValue[];
  expectedOutputValues: ExpectedOutputValue[];
  showSourceValueDetails?: boolean;
  initialOperators?: PipelineOperator[];
  lockedOperatorIds?: string[];
  maxOperators: number;
};

type OutputTestTaskProps = {
  task: OutputTestTaskDefinition;
  onSolved: () => void;
};

export function OutputTestTask({ task, onSolved }: OutputTestTaskProps) {
  const [operators, setOperators] = useState<PipelineOperator[]>(() =>
    clonePipelineOperators(task.initialOperators ?? [])
  );
  const [testResult, setTestResult] = useState<TestResult>(null);

  const actualOutputValues = useMemo(
    () => evaluatePipelineOutput(task.sourceValues, operators),
    [operators, task.sourceValues]
  );
  const displayedSourceValues = task.showSourceValueDetails
    ? task.sourceValues
    : task.sourceValues.map((value) => value.value);

  function handleOperatorsChange(nextOperators: PipelineOperator[]) {
    setOperators(nextOperators);
    setTestResult(null);
  }

  function checkOutput() {
    const nextResult = areOutputValuesEqual(
      actualOutputValues,
      task.expectedOutputValues
    )
      ? "passed"
      : "failed";

    setTestResult(nextResult);

    if (nextResult === "passed") {
      onSolved();
    }
  }

  function resetTask() {
    setOperators(clonePipelineOperators(task.initialOperators ?? []));
    setTestResult(null);
  }

  return (
    <div className="grid min-w-0 gap-5">
      <section className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
        <div className="min-w-0">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-normal text-primary">
              Úloha {task.taskNumber}
            </p>
            <h2 className="mt-1 text-sm font-semibold text-foreground">
              {task.title}
            </h2>
          </div>

          <TestResultMessage result={testResult} />

          <div className="mt-4 flex flex-wrap gap-2">
            <Button type="button" onClick={checkOutput}>
              <CheckCircle2Icon />
              Zkontrolovat řešení
            </Button>
            <Button type="button" variant="outline" onClick={resetTask}>
              <RotateCcwIcon />
              Vymazat pipeline
            </Button>
          </div>
        </div>

        <div className="min-w-0 border-l-0 pt-0 lg:border-l lg:pl-4">
          <h3 className="text-sm font-semibold text-foreground">Zadání</h3>
          <div className="mt-3 grid gap-3">
            <ValueSequence label="Vstup" values={displayedSourceValues} />
            <ValueSequence
              label="Očekávaný výstup"
              values={task.expectedOutputValues}
            />
          </div>
        </div>
      </section>

      <PipelineEditor
        lockedOperatorIds={task.lockedOperatorIds}
        operators={operators}
        onOperatorsChange={handleOperatorsChange}
        maxOperators={task.maxOperators}
        mode="editable"
      />

      <PipelineVisualizer
        canEmitLiveValue={false}
        canRandomizeValues={false}
        operators={operators}
        sourceValues={task.sourceValues}
        title="Vizualizace řešení"
      />
    </div>
  );
}

function ValueSequence({
  label,
  values,
}: {
  label: string;
  values: Array<ExpectedOutputValue | StreamValue>;
}) {
  return (
    <div className="grid w-fit max-w-full gap-1">
      <div className="text-xs font-medium text-muted-foreground">{label}</div>
      <div className="flex min-h-9 w-fit max-w-full flex-wrap items-center gap-2 rounded-md border bg-muted/35 px-2 py-1.5">
        {values.length === 0 ? (
          <span className="px-1.5 text-xs text-muted-foreground">
            Prázdný
          </span>
        ) : (
          values.map((value, index) => (
            <ValueBadge key={`${label}-${index}`} value={value} />
          ))
        )}
      </div>
    </div>
  );
}

function ValueBadge({ value }: { value: ExpectedOutputValue | StreamValue }) {
  if (typeof value === "number") {
    return (
      <span className="flex size-7 items-center justify-center rounded-md border bg-background font-mono text-xs font-semibold text-foreground shadow-xs">
        {value}
      </span>
    );
  }

  return (
    <svg
      width="40"
      height="40"
      viewBox="-20 -20 40 40"
      className="block size-10 shrink-0"
      aria-label={`${value.value}, ${value.color}, ${value.shape}`}
      role="img"
    >
      <StreamValueGlyph
        streamValue={{
          id: "task-value-preview",
          color: value.color,
          shape: value.shape,
          value: value.value,
        }}
        value={value.value}
      />
    </svg>
  );
}

function TestResultMessage({ result }: { result: TestResult }) {
  if (result === null) {
    return null;
  }

  const isPassed = result === "passed";

  return (
    <div
      className={cn(
        "mt-4 flex w-fit max-w-full items-start gap-2 rounded-md border px-3 py-2 text-xs leading-5",
        isPassed
          ? "border-emerald-200 bg-emerald-50 text-emerald-900"
          : "border-red-200 bg-red-50 text-red-900"
      )}
    >
      {isPassed ? (
        <CheckCircle2Icon className="mt-0.5 size-4 shrink-0" />
      ) : (
        <XCircleIcon className="mt-0.5 size-4 shrink-0" />
      )}
      <span>
        {isPassed
          ? "Správně. Výstup odpovídá očekávání."
          : "Výstup neodpovídá očekávaným hodnotám."}
      </span>
    </div>
  );
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
        actualValue.shape === expectedValue.shape
      );
    })
  );
}

function clonePipelineOperators(operators: PipelineOperator[]) {
  return operators.map((operator) => {
    switch (operator.type) {
      case "map":
        return {
          ...operator,
          config: { ...operator.config },
        };
      case "filter":
        return {
          ...operator,
          config: {
            ...operator.config,
            allowedColors: [...operator.config.allowedColors],
            allowedShapes: [...operator.config.allowedShapes],
            allowedValueKinds: [...operator.config.allowedValueKinds],
          },
        };
    }
  });
}
