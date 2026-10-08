import {
  Code2Icon,
  ExternalLinkIcon,
  ListChecksIcon,
} from "lucide-react";

import { PipelineVisualizer } from "@/features/stream-visualizer";
import type { StreamValue } from "@/types/stream";

import {
  DEBOUNCE_TIME_DEMO_DURATION_MS,
  type OperatorLibraryEntry,
} from "..";

const OPERATOR_LIBRARY_PLAYBACK_SPEED = 0.5;
const EMPTY_SOURCE_VALUES: StreamValue[] = [];

type OperatorLibraryEntryContentProps = {
  operator: OperatorLibraryEntry;
};

export function OperatorLibraryEntryContent({
  operator,
}: OperatorLibraryEntryContentProps) {
  const isDebounceTime = operator.type === "debounceTime";

  return (
    <div className="grid gap-5">
      <OperatorExplanation operator={operator} />
      <PipelineVisualizer
        autoRunSourceValues={!isDebounceTime}
        canEmitLiveValue={isDebounceTime}
        canRandomizeValues={false}
        defaultPlaybackSpeed={OPERATOR_LIBRARY_PLAYBACK_SPEED}
        description={operator.visualizerDescription}
        liveSourceMinStartGapMs={isDebounceTime ? 0 : undefined}
        liveValueTimerDurationMs={
          isDebounceTime ? DEBOUNCE_TIME_DEMO_DURATION_MS : undefined
        }
        operators={operator.operators}
        placeLiveValueButtonUnderDescription={isDebounceTime}
        sourceValues={isDebounceTime ? EMPTY_SOURCE_VALUES : operator.sourceValues}
        title={operator.visualizerTitle}
      />
    </div>
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
      <div className="mt-3 grid gap-1.5">
        <div className="text-xs font-semibold uppercase tracking-normal text-muted-foreground">
          Další zdroje
        </div>
        <div className="flex flex-wrap gap-2">
          {operator.resources.map((resource) => (
            <a
              key={resource.href}
              href={resource.href}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-7 items-center gap-1.5 rounded-md border bg-background px-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {resource.label}
              <ExternalLinkIcon className="size-3" />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
