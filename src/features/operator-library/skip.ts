import type { SkipPipelineOperator } from "@/features/pipeline-editor";
import type { StreamValue } from "@/types/stream";

export type SkipOperatorLibraryEntry = {
  type: "skip";
  label: string;
  description: string;
  summary: string;
  usage: string[];
  exampleCode: string;
  resources: SkipOperatorResourceLink[];
  visualizerTitle: string;
  visualizerDescription: string;
  operators: SkipPipelineOperator[];
  sourceValues: StreamValue[];
};

export type SkipOperatorResourceLink = {
  label: string;
  href: string;
};

export const SKIP_OPERATOR_LIBRARY_ENTRY: SkipOperatorLibraryEntry = {
  type: "skip",
  label: "skip",
  description: "Přeskočení prvních hodnot ve streamu.",
  summary:
    "Operátor skip zahodí zadaný počet prvních hodnot ze streamu a všechny další hodnoty už propustí beze změny. Hodí se ve chvíli, kdy úvodní emise nejsou pro další zpracování důležité.",
  usage: [
    "Používá se, když je potřeba ignorovat úvodní hodnoty ze zdroje.",
    "Počet přeskočených hodnot je pevně daný parametrem operátoru.",
    "Po přeskočení zadaného počtu hodnot už další hodnoty pokračují dál ve stejném pořadí.",
  ],
  exampleCode: `source$.pipe(
  skip(2) // Zahodí první dvě hodnoty
).subscribe(value => {
  console.log(value);
});`,
  resources: [
    {
      label: "RxJS dokumentace",
      href: "https://rxjs.dev/api/operators/skip",
    },
    {
      label: "ReactiveX dokumentace",
      href: "https://reactivex.io/documentation/operators/skip.html",
    },
    {
      label: "RxMarbles diagram",
      href: "https://rxmarbles.com/#skip",
    },
  ],
  visualizerTitle: "Ukázka skip",
  visualizerDescription:
    "Skip přeskočí první dvě hodnoty. Další hodnoty už pokračují k subscriberovi.",
  operators: [
    {
      id: "library-skip-two",
      type: "skip",
      config: {
        count: 2,
      },
    },
  ],
  sourceValues: [
    { id: "library-skip-1", shape: "circle", color: "red", value: 1 },
    { id: "library-skip-2", shape: "square", color: "blue", value: 2 },
    { id: "library-skip-3", shape: "triangle", color: "green", value: 3 },
    { id: "library-skip-4", shape: "circle", color: "blue", value: 4 },
    { id: "library-skip-5", shape: "square", color: "green", value: 5 },
    { id: "library-skip-6", shape: "triangle", color: "red", value: 6 },
  ],
};
