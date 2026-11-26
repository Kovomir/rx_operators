import { useMemo, useState } from "react";
import {
  CheckCircle2Icon,
  PlayIcon,
  RotateCcwIcon,
  XCircleIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { InfoBox } from "@/components/ui/info-box";
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
import type {
  ExpectedOutputValue,
  OutputTestTaskDefinition,
} from "./output-test-task-types";
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
  const taskLabel = `${task.taskLabelPrefix ?? "Úloha"} ${task.taskNumber}`;
  const isChallengeTask = task.taskLabelPrefix === "Výzva";

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
      <section className="grid min-w-0 gap-4 rounded-lg border bg-primary/5 p-4 dark:bg-primary/10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
        <div className="min-w-0">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-normal text-primary">
              {taskLabel}
            </p>
            {isChallengeTask && (
              <p className="mt-1 text-sm leading-6 text-foreground">
                Vyřešte složitější úlohu.
              </p>
            )}
            {task.title && (
              <h2 className="mt-1 text-base font-semibold text-foreground">
                {task.title}
              </h2>
            )}
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

        <div className="min-w-0 border-t pt-4 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-4">
          <h3 className="text-sm font-semibold text-foreground">Zadání</h3>
          <div className="mt-3 grid gap-3">
            {task.inputSummary && (
              <TaskSummaryLine label="Vstup" value={task.inputSummary} />
            )}
            {task.outputSummary && (
              <TaskSummaryLine label="Výstup" value={task.outputSummary} />
            )}
            {!task.inputSummary && (
              <TaskValueSequence label="Vstup" values={sourceValuesForDisplay} />
            )}
            {(task.expectedOutputValues || task.expectedTapValues) && (
              <div className="flex flex-wrap items-start gap-x-6 gap-y-3">
                {task.expectedOutputValues && (
                  <TaskValueSequence
                    label="Očekávaný výstup"
                    values={task.expectedOutputValues}
                  />
                )}
                {task.expectedTapValues && (
                  <ValueSequence
                    label="Očekávaný výpis v konzoli"
                    values={task.expectedTapValues}
                  />
                )}
              </div>
            )}
            {task.expectedTapValues && (
                <InfoBox>
                  Konzoli otevřete pomocí{" "}
                  <kbd className="rounded border border-primary/20 bg-background/80 px-1.5 py-0.5 font-mono text-[11px] font-medium text-foreground shadow-xs">
                    Ctrl + Shift + I
                  </kbd>{" "}
                  nebo klávesy{" "}
                  <kbd className="rounded border border-primary/20 bg-background/80 px-1.5 py-0.5 font-mono text-[11px] font-medium text-foreground shadow-xs">
                    F12
                  </kbd>
                  .
                </InfoBox>
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
        showSubscriberOutput
        sourceValues={task.sourceValues}
        title="Vizualizace řešení"
      />
    </div>
  );
}

function TaskValueSequence({
  label,
  values,
}: {
  label: string;
  values: ExpectedOutputValue[];
}) {
  return (
    <ValueSequence
      label={label}
      values={values.map((value, index) => {
        if (typeof value === "number") {
          return value;
        }

        const { color, shape, value: number, kind, emittedAtMs } = value;
        return { id: String(index), color, shape, value: number, kind, emittedAtMs };
      })}
      getCaption={({ emittedAtMs }) =>
        emittedAtMs === undefined ? undefined : `${emittedAtMs} ms`
      }
    />
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
    <div className="rounded-md border bg-card px-3 py-2 text-sm leading-6 text-card-foreground">
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
