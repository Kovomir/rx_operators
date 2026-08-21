import { useState } from "react";
import {
  ChevronDownIcon,
  ChevronRightIcon,
  Code2Icon,
  FilterIcon,
  ListChecksIcon,
} from "lucide-react";

import { OperatorSearchList } from "@/components/operator-search-list";
import type { PipelineOperatorType } from "@/features/pipeline-editor";
import { PipelineVisualizer } from "@/features/stream-visualizer";
import { cn } from "@/lib/utils";

import {
  OPERATOR_LIBRARY,
  type OperatorLibraryEntry,
} from "./operator-library";

export function OperatorLibraryPage() {
  const [expandedOperator, setExpandedOperator] =
    useState<PipelineOperatorType | null>("map");

  function toggleOperator(operatorType: PipelineOperatorType) {
    setExpandedOperator((currentOperator) =>
      currentOperator === operatorType ? null : operatorType
    );
  }

  return (
    <main className="flex min-w-0 flex-1 flex-col gap-5 overflow-x-hidden p-4 md:p-6">
      <section className="max-w-3xl">
        <h1 className="text-2xl font-semibold tracking-normal text-foreground">
          Knihovna operátorů
        </h1>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Přehled základních RxJS operátorů s krátkým vysvětlením a vizuální
          ukázkou.
        </p>
      </section>

      <OperatorSearchList
        operators={OPERATOR_LIBRARY}
        placeholder="Hledat operátor"
        ariaLabel="Hledat operátor"
        renderOperator={(operator) => (
          <OperatorLibraryGroup
            key={operator.type}
            isExpanded={expandedOperator === operator.type}
            operator={operator}
            onToggle={() => toggleOperator(operator.type)}
          />
        )}
      />
    </main>
  );
}

type OperatorLibraryGroupProps = {
  isExpanded: boolean;
  operator: OperatorLibraryEntry;
  onToggle: () => void;
};

function OperatorLibraryGroup({
  isExpanded,
  operator,
  onToggle,
}: OperatorLibraryGroupProps) {
  return (
    <article className="min-w-0 overflow-hidden rounded-lg border bg-background shadow-sm">
      <div className="flex w-full min-w-0 items-center gap-3 px-4 py-3 transition-colors hover:bg-muted/45">
        <button
          type="button"
          className="flex min-w-0 flex-1 items-center gap-3 text-left"
          aria-expanded={isExpanded}
          onClick={onToggle}
        >
          <OperatorIcon type={operator.type} />
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-semibold text-foreground">
              {operator.label}
            </span>
            <span className="mt-0.5 block text-xs leading-5 text-muted-foreground">
              {operator.description}
            </span>
          </span>
        </button>

        <button
          type="button"
          className="flex size-7 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-muted"
          aria-label={isExpanded ? "Sbalit operátor" : "Rozbalit operátor"}
          onClick={onToggle}
        >
          {isExpanded ? (
            <ChevronDownIcon className="size-4" />
          ) : (
            <ChevronRightIcon className="size-4" />
          )}
        </button>
      </div>

      {isExpanded && (
        <div className="grid gap-5 border-t px-4 py-4">
          <OperatorExplanation operator={operator} />
          <PipelineVisualizer
            canEmitLiveValue={false}
            canRandomizeValues={false}
            description={operator.visualizerDescription}
            operators={operator.operators}
            sourceValues={operator.sourceValues}
            title={operator.visualizerTitle}
          />
        </div>
      )}
    </article>
  );
}

function OperatorExplanation({
  operator,
}: {
  operator: OperatorLibraryEntry;
}) {
  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,0.7fr)] lg:gap-16">
      <div className="min-w-0">
        <p className="text-sm leading-6 text-foreground">{operator.summary}</p>

        <div className="mt-4 grid gap-2 rounded-md border bg-muted/35 p-3">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-normal text-muted-foreground">
            <ListChecksIcon className="size-4" />
            Použití
          </div>
          <ul className="grid gap-2 text-sm leading-6 text-muted-foreground">
            {operator.usage.map((item) => (
              <li key={item} className="flex gap-2">
                <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <OperatorExample operator={operator} />
    </div>
  );
}

function OperatorExample({ operator }: { operator: OperatorLibraryEntry }) {
  return (
    <div className="min-w-0">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-normal text-muted-foreground">
        <Code2Icon className="size-4" />
        Ukázka kódu
      </div>
      <pre className="mt-2 w-fit max-w-full min-w-0 whitespace-pre-wrap break-words rounded-md border bg-muted px-3 py-2 text-xs leading-6 text-foreground">
        <code>{operator.exampleCode}</code>
      </pre>
    </div>
  );
}

function OperatorIcon({ type }: { type: PipelineOperatorType }) {
  return (
    <span
      className={cn(
        "flex size-9 shrink-0 items-center justify-center rounded-md",
        type === "filter"
          ? "bg-amber-100 text-amber-700"
          : "bg-violet-100 text-violet-700"
      )}
    >
      {type === "filter" ? (
        <FilterIcon className="size-4" />
      ) : (
        <span className="text-sm font-semibold">f</span>
      )}
    </span>
  );
}
