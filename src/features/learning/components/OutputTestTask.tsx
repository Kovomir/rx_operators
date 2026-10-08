import { useMemo, useState } from "react";
import {
  CheckCircle2Icon,
  PlayIcon,
  RotateCcwIcon,
  XCircleIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { PipelineEditor, type PipelineOperator } from "@/features/pipeline-editor";
import {
  PipelineVisualizer,
  ValueSequence,
} from "@/features/stream-visualizer";
import {
  evaluatePipelineOutput,
  evaluatePipelineTapValues,
} from "@/lib/rx/evaluate-pipeline-output";
import { usePipelineScrollSync } from "@/features/pipeline-scroll-sync";
import { cn } from "@/lib/utils";
import { clonePipelineOperators } from "./pipeline-operator-clone";
import type { OutputTestTaskDefinition } from "./output-test-task-types";
import {
  getOutputTestResult,
  type TestResult,
} from "./output-test-task-validation";

export type { OutputTestTaskDefinition } from "./output-test-task-types";

type NullableTestResult = TestResult | null;

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
  const [testResult, setTestResult] = useState<NullableTestResult>(null);
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
  const actualTapValues = useMemo(
    () => evaluatePipelineTapValues(task.sourceValues, operators),
    [operators, task.sourceValues]
  );
  const displayedSourceValues = task.showSourceValueDetails
    ? task.sourceValues
    : task.sourceValues.map((value) => value.value);
  const sourceValuesForDisplay =
    task.sourceDisplayValues ?? displayedSourceValues;

  function handleOperatorsChange(nextOperators: PipelineOperator[]) {
    setOperators(nextOperators);
    setTestResult(null);
  }

  function selectOperator(operatorId: string) {
    setSelectedOperatorId(operatorId);
    setSelectedOperatorFocusKey((currentKey) => currentKey + 1);
  }

  function checkOutput() {
    const nextResult = getOutputTestResult({
      actualOutputValues,
      actualTapValues,
      operators,
      task,
    });

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

          <TestResultMessage
            result={testResult}
            failureMessage={
              task.taskType === "behavior"
                ? "Pipeline zatím nesplňuje požadované chování."
                : undefined
            }
            onContinue={onContinue}
          />

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
            {task.description && (
              <p className="text-sm leading-6 text-muted-foreground">
                {task.description}
              </p>
            )}
            {task.inputSummary && (
              <TaskSummaryLine label="Vstup" value={task.inputSummary} />
            )}
            {task.outputSummary && (
              <TaskSummaryLine label="Výstup" value={task.outputSummary} />
            )}
            {!task.inputSummary && (
              <ValueSequence label="Vstup" values={sourceValuesForDisplay} />
            )}
            {task.expectedOutputValues && (
              <ValueSequence
                label={task.expectedOutputLabel ?? "Očekávaný výstup"}
                values={task.expectedOutputValues}
              />
            )}
            {task.expectedTapValues && (
              <ValueSequence
                label={task.expectedTapValuesLabel ?? "Výpis tap(console.log)"}
                values={task.expectedTapValues}
              />
            )}
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

function TaskSummaryLine({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-md border bg-muted/35 px-3 py-2 text-sm leading-6 text-foreground">
      <span className="font-semibold">{label}:</span>{" "}
      <span className="text-muted-foreground">{value}</span>
    </div>
  );
}

function TestResultMessage({
  failureMessage,
  onContinue,
  result,
}: {
  failureMessage?: string;
  result: NullableTestResult;
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
            : failureMessage ?? "Výstup neodpovídá očekávaným hodnotám."}
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
