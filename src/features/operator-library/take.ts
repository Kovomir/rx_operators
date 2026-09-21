import type { TakePipelineOperator } from "@/features/pipeline-editor";
import type { StreamValue } from "@/types/stream";

export type TakeOperatorLibraryEntry = {
  type: "take";
  label: string;
  description: string;
  summary: string;
  usage: string[];
  exampleCode: string;
  resources: TakeOperatorResourceLink[];
  visualizerTitle: string;
  visualizerDescription: string;
  operators: TakePipelineOperator[];
  sourceValues: StreamValue[];
};

export type TakeOperatorResourceLink = {
  label: string;
  href: string;
};

export const TAKE_OPERATOR_LIBRARY_ENTRY: TakeOperatorLibraryEntry = {
  type: "take",
  label: "take",
  description: "Výběr prvních hodnot ze streamu.",
  summary:
    "Operátor take propustí zadaný počet prvních hodnot ze streamu a další hodnoty už do výstupu nepustí. Hodí se ve chvíli, kdy stačí získat jen úvodní část sekvence.",
  usage: [
    "Používá se, když je potřeba zpracovat pouze omezený počet prvních hodnot.",
    "Počet propuštěných hodnot je pevně daný parametrem operátoru.",
    "Po dosažení zadaného počtu už další hodnoty nepokračují k subscriberovi.",
  ],
  exampleCode: `source$.pipe(
  take(3) // Propustí první tři hodnoty
).subscribe(value => {
  console.log(value);
});`,
  resources: [
    {
      label: "RxJS dokumentace",
      href: "https://rxjs.dev/api/operators/take",
    },
    {
      label: "ReactiveX dokumentace",
      href: "https://reactivex.io/documentation/operators/take.html",
    },
    {
      label: "RxMarbles diagram",
      href: "https://rxmarbles.com/#take",
    },
  ],
  visualizerTitle: "Ukázka take",
  visualizerDescription:
    "Take propustí první tři hodnoty. Další hodnoty už do výstupu nepokračují.",
  operators: [
    {
      id: "library-take-three",
      type: "take",
      config: {
        count: 3,
      },
    },
  ],
  sourceValues: [
    { id: "library-take-1", shape: "circle", color: "red", value: 1 },
    { id: "library-take-2", shape: "square", color: "blue", value: 2 },
    { id: "library-take-3", shape: "triangle", color: "green", value: 3 },
    { id: "library-take-4", shape: "circle", color: "blue", value: 4 },
    { id: "library-take-5", shape: "square", color: "green", value: 5 },
    { id: "library-take-6", shape: "triangle", color: "red", value: 6 },
  ],
};
