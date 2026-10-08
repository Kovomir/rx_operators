import type { CatchErrorPipelineOperator } from "@/features/pipeline-editor";
import type { StreamValue } from "@/types/stream";

export type CatchErrorOperatorLibraryEntry = {
  type: "catchError";
  label: string;
  description: string;
  summary: string;
  usage: string[];
  exampleCode: string;
  resources: CatchErrorOperatorResourceLink[];
  visualizerTitle: string;
  visualizerDescription: string;
  operators: CatchErrorPipelineOperator[];
  sourceValues: StreamValue[];
};

export type CatchErrorOperatorResourceLink = {
  label: string;
  href: string;
};

export const CATCH_ERROR_OPERATOR_LIBRARY_ENTRY: CatchErrorOperatorLibraryEntry =
  {
    type: "catchError",
    label: "catchError",
    description: "Zachycení terminální chyby a náhrada streamu.",
    summary:
      "Error v Rx streamu není běžná hodnota, ale terminální událost. Když nastane, původní stream se ukončí a už z něj nepřijdou žádné další hodnoty. Operátor catchError chybu zachytí a místo původního streamu připojí nový stream, který zde vrátí náhradní hodnotu -1.",
    usage: [
      "Používá se ve chvíli, kdy chyba nemá rozbít celou pipeline a má se převést na bezpečnou náhradní hodnotu.",
      "Hodnoty před chybou projdou normálně, chyba se nahradí novým streamem a původní stream dál nepokračuje.",
      "Na pořadí záleží: operátory za catchError uvidí i náhradní hodnotu, operátory před ním ji neuvidí.",
    ],
    exampleCode: `source$.pipe(
  catchError(() => of(-1)) // Nahradí chybující stream novým streamem
).subscribe(value => {
  console.log(value);
});`,
    resources: [
      {
        label: "RxJS dokumentace",
        href: "https://rxjs.dev/api/operators/catchError",
      },
      {
        label: "ReactiveX dokumentace",
        href: "https://reactivex.io/documentation/operators/catch.html",
      },
    ],
    visualizerTitle: "Ukázka catchError",
    visualizerDescription:
      "Třetí událost je ERROR. catchError ukončený stream nahradí streamem s hodnotou -1; hodnoty za chybou už z původního streamu neprojdou.",
    operators: [
      {
        id: "library-catch-error-default",
        type: "catchError",
        config: {
          replacementValue: -1,
        },
      },
    ],
    sourceValues: [
      { id: "library-catch-error-1", shape: "circle", color: "red", value: 1 },
      { id: "library-catch-error-2", shape: "square", color: "blue", value: 2 },
      {
        id: "library-catch-error-error",
        kind: "error",
        shape: "triangle",
        color: "red",
        label: "ERROR",
        value: 0,
      },
      {
        id: "library-catch-error-cancelled-4",
        kind: "cancelled",
        shape: "circle",
        color: "blue",
        value: 4,
        emittedAtMs: 450,
      },
      {
        id: "library-catch-error-cancelled-5",
        kind: "cancelled",
        shape: "square",
        color: "green",
        value: 5,
        emittedAtMs: 650,
      },
    ],
  };
