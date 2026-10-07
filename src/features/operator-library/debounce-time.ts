import type { DebounceTimePipelineOperator } from "@/features/pipeline-editor";
import type { StreamValue } from "@/types/stream";

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
    description: "Propustí poslední hodnotu až po tichu ve streamu.",
    summary:
      "Operátor debounceTime čeká po každé hodnotě nastavený čas. Pokud mezitím přijde nová hodnota, předchozí hodnotu zahodí a začne čekat znovu. Výsledek je poslední hodnota z rychlé skupiny emisí.",
    usage: [
      "Používá se pro rychlé události, kde má smysl až poslední stabilní hodnota.",
      "Typicky se hodí pro vyhledávání při psaní, resize okna nebo rychlé klikání.",
      "Na rozdíl od filter nerozhoduje podle obsahu hodnoty, ale podle časové mezery mezi emisemi.",
    ],
    exampleCode: `source$.pipe(
  debounceTime(500) // Počká 500 ms na ticho ve streamu
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
      "DebounceTime zahodí hodnoty, po kterých rychle přišla další emise, a propustí až poslední hodnotu po klidové pauze.",
    operators: [
      {
        id: "library-debounce-time-500",
        type: "debounceTime",
        config: {
          durationMs: 500,
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
