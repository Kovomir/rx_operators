import type { DelayPipelineOperator } from "@/features/pipeline-editor";
import type { StreamValue } from "@/types/stream";

const DELAY_OPERATOR_LIBRARY_DURATION_MS = 9999;

export type DelayOperatorLibraryEntry = {
  type: "delay";
  label: string;
  description: string;
  summary: string;
  usage: string[];
  exampleCode: string;
  resources: DelayOperatorResourceLink[];
  visualizerTitle: string;
  visualizerDescription: string;
  operators: DelayPipelineOperator[];
  sourceValues: StreamValue[];
};

export type DelayOperatorResourceLink = {
  label: string;
  href: string;
};

export const DELAY_OPERATOR_LIBRARY_ENTRY: DelayOperatorLibraryEntry = {
  type: "delay",
  label: "delay",
  description: "Odloží každou hodnotu o nastavený čas.",
  summary:
    "Operátor delay neposuzuje obsah hodnot a žádnou hodnotu nezahazuje. Každou emisi jen pozdrží o nastavený čas a potom ji pošle dál ve stejném pořadí.",
  usage: [
    "Používá se, když má stream reagovat později, ale hodnoty se nemají ztratit.",
    "Zachovává pořadí hodnot a jejich relativní rozestupy.",
    "Na rozdíl od debounceTime propustí všechny hodnoty, jen je časově posune.",
  ],
  exampleCode: `source$.pipe(
  delay(${DELAY_OPERATOR_LIBRARY_DURATION_MS}) // Každou hodnotu odloží o 9999 ms
).subscribe(value => {
  console.log(value);
});`,
  resources: [
    {
      label: "RxJS dokumentace",
      href: "https://rxjs.dev/api/operators/delay",
    },
    {
      label: "ReactiveX dokumentace",
      href: "https://reactivex.io/documentation/operators/delay.html",
    },
  ],
  visualizerTitle: "Ukázka delay",
  visualizerDescription:
    "Delay nechá každou hodnotu čekat u operátoru 9999 ms a potom ji beze změny pošle dál.",
  operators: [
    {
      id: "library-delay-9999",
      type: "delay",
      config: {
        durationMs: DELAY_OPERATOR_LIBRARY_DURATION_MS,
      },
    },
  ],
  sourceValues: [
    {
      id: "library-delay-1",
      shape: "circle",
      color: "red",
      value: 1,
      emittedAtMs: 0,
    },
    {
      id: "library-delay-2",
      shape: "square",
      color: "blue",
      value: 2,
      emittedAtMs: 450,
    },
    {
      id: "library-delay-3",
      shape: "triangle",
      color: "green",
      value: 3,
      emittedAtMs: 900,
    },
  ],
};
