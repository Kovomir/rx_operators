import type { DebounceTimePipelineOperator } from "@/features/pipeline-editor";
import type { StreamValue } from "@/types/stream";

export const DEBOUNCE_TIME_DEMO_DURATION_MS = 2500;

export type DebounceTimeOperatorLibraryEntry = {
  type: "debounceTime";
  label: string;
  description: string;
  summary: string;
  usage: string[];
  exampleCode: string;
  resources: DebounceTimeOperatorResourceLink[];
  visualizerTitle: string;
  visualizerDescription: string;
  operators: DebounceTimePipelineOperator[];
  sourceValues: StreamValue[];
};

export type DebounceTimeOperatorResourceLink = {
  label: string;
  href: string;
};

export const DEBOUNCE_TIME_OPERATOR_LIBRARY_ENTRY: DebounceTimeOperatorLibraryEntry =
  {
    type: "debounceTime",
    label: "debounceTime",
    description: "Propustí poslední hodnotu až po chvíli klidu ve streamu.",
    summary:
      "Operátor debounceTime čeká po každé hodnotě nastavený čas. Pokud mezitím přijde nová hodnota, předchozí hodnotu zahodí a začne čekat znovu. Výsledek je poslední hodnota z rychlé skupiny emisí.",
    usage: [
      "Používá se pro rychlé události, kde má smysl až poslední stabilní hodnota. Mezihodnoty jsou zahozeny.",
      "Typicky se hodí pro vyhledávání při psaní nebo rychlé klikání uživatele.",
      "Slouží k optimalizaci, když například nechceme po každé rapidní změně textového inputu provolávat backend pro vyhledání záznamu.",
    ],
    exampleCode: `source$.pipe(
  debounceTime(${DEBOUNCE_TIME_DEMO_DURATION_MS}) // Počká 2,5 s na ticho ve streamu
).subscribe(value => {
  console.log(value);
});`,
    resources: [
      {
        label: "RxJS dokumentace",
        href: "https://rxjs.dev/api/operators/debounceTime",
      },
      {
        label: "ReactiveX dokumentace",
        href: "https://reactivex.io/documentation/operators/debounce.html",
      },
    ],
    visualizerTitle: "Ukázka debounceTime",
    visualizerDescription:
      "Vkládejte hodnoty tlačítkem níže. DebounceTime propustí až poslední hodnotu po 2,5 sekundách bez další emise.",
    operators: [
      {
        id: "library-debounce-time-2500",
        type: "debounceTime",
        config: {
          durationMs: DEBOUNCE_TIME_DEMO_DURATION_MS,
        },
      },
    ],
    sourceValues: [
      {
        id: "library-debounce-time-1",
        shape: "circle",
        color: "red",
        value: 1,
        emittedAtMs: 0,
      },
      {
        id: "library-debounce-time-2",
        shape: "square",
        color: "blue",
        value: 2,
        emittedAtMs: 220,
      },
      {
        id: "library-debounce-time-3",
        shape: "triangle",
        color: "green",
        value: 3,
        emittedAtMs: 920,
      },
      {
        id: "library-debounce-time-4",
        shape: "circle",
        color: "blue",
        value: 4,
        emittedAtMs: 1120,
      },
      {
        id: "library-debounce-time-5",
        shape: "square",
        color: "green",
        value: 5,
        emittedAtMs: 1780,
      },
    ],
  };
