import { useMemo, useState } from "react";
import {
  CheckCircle2Icon,
  PlayIcon,
  RotateCcwIcon,
  XCircleIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  PipelineEditor,
  type PipelineOperator,
  type PipelineOperatorType,
} from "@/features/pipeline-editor";
import {
  PipelineVisualizer,
  type DisplayStreamValue,
  type StreamValue,
  ValueSequence,
} from "@/features/stream-visualizer";
import { evaluatePipelineOutput } from "@/lib/rx/evaluate-pipeline-output";
import { usePipelineScrollSync } from "@/features/pipeline-scroll-sync";
import { cn } from "@/lib/utils";

type TestResult = "passed" | "failed" | null;

export type ExpectedOutputValue = DisplayStreamValue;

export type OutputTestTaskDefinition = {
  id: string;
  taskNumber: number;
  title: string;
  sourceValues: StreamValue[];
  expectedOutputValues: ExpectedOutputValue[];
  expectedOperatorTypes?: PipelineOperatorType[];
  showSourceValueDetails?: boolean;
  initialOperators?: PipelineOperator[];
  enabledOperatorTypes?: PipelineOperatorType[];
  lockedOperatorIds?: string[];
  maxOperators: number;
};

type OutputTestTaskProps = {
  task: OutputTestTaskDefinition;
  onSolved: () => void;
  onContinue?: () => void;
};

export function OutputTestTask({
  task,
  onContinue,
  onSolved,
}: OutputTestTaskProps) {
  const [operators, setOperators] = useState<PipelineOperator[]>(() =>
    clonePipelineOperators(task.initialOperators ?? [])
  );
  const [testResult, setTestResult] = useState<TestResult>(null);
  const pipelineScrollSync = usePipelineScrollSync();
  const [selectedOperatorId, setSelectedOperatorId] = useState<string | null>(
    null
  );
  const [selectedOperatorFocusKey, setSelectedOperatorFocusKey] = useState(0);
  const activeSelectedOperatorId =
    selectedOperatorId &&
    operators.some((operator) => operator.id === selectedOperatorId)
      ? selectedOperatorId
      : null;

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

  function selectOperator(operatorId: string) {
    setSelectedOperatorId(operatorId);
    setSelectedOperatorFocusKey((currentKey) => currentKey + 1);
  }

  function checkOutput() {
    const hasExpectedOutput = areOutputValuesEqual(
      actualOutputValues,
      task.expectedOutputValues
    );
    const hasExpectedOperators = areOperatorTypesEqual(
      operators,
      task.expectedOperatorTypes
    );
    const nextResult =
      hasExpectedOutput && hasExpectedOperators ? "passed" : "failed";

    setTestResult(nextResult);

    if (nextResult === "passed") {
      onSolved();
    }
  }

  function resetTask() {
    setOperators(clonePipelineOperators(task.initialOperators ?? []));
    setTestResult(null);
    setSelectedOperatorId(null);
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

          <TestResultMessage result={testResult} onContinue={onContinue} />

          <div className="mt-4 flex flex-wrap gap-2">
            <Button type="button" onClick={checkOutput}>
              <CheckCircle2Icon />
              Zkontrolovat řešení
            </Button>
            <Button type="button" variant="outline" onClick={resetTask}>
              <RotateCcwIcon />
              Resetovat pipeline
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
        enabledOperatorTypes={task.enabledOperatorTypes}
        lockedOperatorIds={task.lockedOperatorIds}
        operators={operators}
        onOperatorsChange={handleOperatorsChange}
        maxOperators={task.maxOperators}
        mode="editable"
        scrollSync={pipelineScrollSync}
        selectedOperatorId={activeSelectedOperatorId}
        onSelectOperator={selectOperator}
      />

      <PipelineVisualizer
        canEmitLiveValue={false}
        canRandomizeValues={false}
        operators={operators}
        scrollSync={pipelineScrollSync}
        selectedOperatorId={activeSelectedOperatorId}
        selectedOperatorFocusKey={selectedOperatorFocusKey}
        sourceValues={task.sourceValues}
        title="Vizualizace řešení"
      />
    </div>
  );
}

function TestResultMessage({
  onContinue,
  result,
}: {
  result: TestResult;
  onContinue?: () => void;
}) {
  if (result === null) {
    return null;
  }

  const isPassed = result === "passed";

  return (
    <div className="mt-4 flex max-w-full flex-wrap items-center gap-2">
      <div
        className={cn(
          "flex w-fit max-w-full items-start gap-2 rounded-md border px-3 py-2 text-xs leading-5",
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
        <span className="min-w-0">
          {isPassed
            ? "Správně."
            : "Výstup neodpovídá očekávaným hodnotám."}
        </span>
      </div>
      {isPassed && onContinue && (
        <Button type="button" size="sm" onClick={onContinue}>
          <PlayIcon />
          Pokračovat
        </Button>
      )}
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
      case "skip":
        return {
          ...operator,
          config: { ...operator.config },
        };
      case "take":
        return {
          ...operator,
          config: { ...operator.config },
        };
      case "distinctUntilChanged":
        return {
          ...operator,
          config: {},
        };
    }
  });
}
