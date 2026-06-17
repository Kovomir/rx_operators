import { useState } from "react";

import {
  PipelineEditor,
  type PipelineOperator,
} from "@/features/pipeline-editor";

export function PlaygroundPage() {
  const [operators, setOperators] = useState<PipelineOperator[]>([]);

  return (
    <main className="flex min-w-0 flex-1 flex-col gap-5 overflow-x-hidden p-4 md:p-6">
      <section className="max-w-3xl">
        <h1 className="text-2xl font-semibold tracking-normal text-foreground">
          Playground
        </h1>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Vizualizační playground pro testování různých kombinací parametrů ve volném sandboxu.
        </p>
      </section>

      <PipelineEditor
        operators={operators}
        onOperatorsChange={setOperators}
        mode="editable"
      />
    </main>
  );
}
