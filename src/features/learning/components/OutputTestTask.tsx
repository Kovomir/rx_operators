import { useMemo, useState } from "react";
import {
  ArrowRightIcon,
  CheckCircle2Icon,
  PlayIcon,
  PlusIcon,
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
import { evaluatePipeline } from "@/lib/rx/evaluate-pipeline-output";
import { usePipelineScrollSync } from "@/features/pipeline-scroll-sync";
import { cn } from "@/lib/utils";
import type { StreamValue } from "@/types/stream";
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

  const { outputValues: actualOutputValues, tapValues: actualTapValues } = useMemo(
    () => evaluatePipeline(task.sourceValues, operators),
    [operators, task.sourceValues]
  );
  const getTimeCaption = task.showEmissionTimes ? formatEmissionTime : undefined;
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
    <div className="grid min-w-0 gap-3">
      <section className="grid min-h-[134px] min-w-0 gap-3 rounded-lg border bg-primary/5 px-3 py-2.5 sm:px-4 dark:bg-primary/10 xl:grid-cols-[20rem_minmax(0,1fr)]">
        <div className="min-w-0 xl:col-start-2 xl:row-start-1 xl:border-l xl:pl-3">
          <h3 className="text-sm font-semibold text-foreground">Zadání</h3>
          <div className="mt-1.5 flex min-w-0 flex-col items-start gap-2 sm:flex-row sm:gap-3">
            <div className="grid min-w-0 gap-1">
              <ValueSequence
                label="Vstup"
                values={task.sourceValues}
                getCaption={getTimeCaption}
              />
              {task.inputSummary && (
                <p className="text-xs text-muted-foreground">{task.inputSummary}</p>
              )}
            </div>
            <ArrowRightIcon
              aria-hidden="true"
              className="ml-2 size-4 shrink-0 rotate-90 text-muted-foreground sm:mt-8 sm:ml-0 sm:rotate-0"
            />
            <div className="flex min-w-0 flex-wrap items-start gap-2 sm:gap-3">
              <div className="grid min-w-0 gap-1">
                <ValueSequence
                  label="Očekávaný výstup"
                  values={task.expectedOutputValues}
                  getCaption={getTimeCaption}
                />
                {task.outputSummary && (
                  <p className="text-xs text-muted-foreground">
                    {task.outputSummary}
                  </p>
                )}
              </div>
              {task.expectedTapValues && (
                <div className="flex min-w-0 items-start gap-2 sm:gap-3">
                  <PlusIcon
                    aria-hidden="true"
                    className="mt-8 size-4 shrink-0 text-muted-foreground"
                  />
                  <ValueSequence
                    label="Očekávaný výpis v konzoli"
                    values={task.expectedTapValues}
                  />
                </div>
              )}
            </div>
          </div>
          {task.expectedTapValues && (
            <InfoBox className="mt-2 px-2 py-1">
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

        <div className="min-w-0 border-t pt-2.5 xl:col-start-1 xl:row-start-1 xl:self-center xl:border-t-0 xl:pt-0">
          <p className="text-xs font-semibold uppercase tracking-normal text-primary">
            {taskLabel}
          </p>
          {isChallengeTask && (
            <p className="mt-0.5 text-sm text-foreground">
              Vyřešte složitější úlohu.
            </p>
          )}
          {task.title && (
            <h2 className="mt-0.5 text-sm font-semibold text-foreground">
              {task.title}
            </h2>
          )}
          <div className="mt-2 flex flex-wrap gap-2">
            <Button type="button" size="sm" onClick={checkOutput}>
              <CheckCircle2Icon />
              Zkontrolovat řešení
            </Button>
            <Button type="button" size="sm" variant="outline" onClick={resetTask}>
              <RotateCcwIcon />
              Resetovat pipeline
            </Button>
          </div>
          <TestResultMessage
            result={testResult}
            onContinue={onContinue}
          />
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

function formatEmissionTime({ emittedAtMs }: StreamValue) {
  return emittedAtMs === undefined ? undefined : `${emittedAtMs} ms`;
}

const resultBadgeClassName =
  "flex w-fit max-w-full items-start gap-1.5 rounded-md border px-2 py-1 text-xs leading-5";

function TestResultMessage({
  onContinue,
  result,
}: {
  result: NullableTestResult;
  onContinue?: () => void;
}) {
  const isPassed = result === "passed";
  const isFailed = result === "failed";

  return (
    <div className="mt-2 grid grid-cols-[minmax(0,1fr)] items-start">
      <div
        role={isFailed ? "status" : undefined}
        className={cn(
          resultBadgeClassName,
          "col-start-1 row-start-1 border-red-200 bg-red-50 text-red-900",
          !isFailed && "invisible"
        )}
      >
        <XCircleIcon className="mt-0.5 size-4 shrink-0" />
        <span className="min-w-0">Řešení není správné.</span>
      </div>
      <div
        className={cn(
          "col-start-1 row-start-1 flex flex-wrap items-center gap-2",
          !isPassed && "invisible"
        )}
      >
        <div
          role={isPassed ? "status" : undefined}
          className={cn(
            resultBadgeClassName,
            "border-emerald-200 bg-emerald-50 text-emerald-900"
          )}
        >
          <CheckCircle2Icon className="mt-0.5 size-4 shrink-0" />
          Správně.
        </div>
        {onContinue && (
          <Button type="button" size="sm" onClick={onContinue}>
            <PlayIcon />
            Pokračovat
          </Button>
        )}
      </div>
    </div>
  );
}
