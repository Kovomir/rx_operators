import type { DistinctUntilChangedPipelineOperator } from "@/features/pipeline-editor";
import type { StreamValue } from "@/types/stream";

export type DistinctUntilChangedOperatorLibraryEntry = {
  type: "distinctUntilChanged";
  label: string;
  description: string;
  summary: string;
  usage: string[];
  exampleCode: string;
  resources: DistinctUntilChangedOperatorResourceLink[];
  visualizerTitle: string;
  visualizerDescription: string;
  operators: DistinctUntilChangedPipelineOperator[];
  sourceValues: StreamValue[];
};

export type DistinctUntilChangedOperatorResourceLink = {
  label: string;
  href: string;
};

export const DISTINCT_UNTIL_CHANGED_OPERATOR_LIBRARY_ENTRY: DistinctUntilChangedOperatorLibraryEntry =
  {
    type: "distinctUntilChanged",
    label: "distinctUntilChanged",
    description: "Odstranění sousedních duplicit ve streamu.",
    summary:
      "Operátor distinctUntilChanged propustí hodnotu jen tehdy, když se liší od bezprostředně předchozí propuštěné hodnoty. Nehledá duplicity v celém streamu, takže stejná hodnota se může později objevit znovu.",
    usage: [
      "Používá se, když chcete ignorovat opakované stejné hodnoty hned za sebou.",
      "Porovnává vždy aktuální hodnotu s poslední propuštěnou hodnotou.",
      "Hodí se například pro změny stavu, kde opakování stejného stavu nepřináší novou informaci.",
    ],
    exampleCode: `source$.pipe(
  distinctUntilChanged() // Zahodí jen sousední duplicity
).subscribe(value => {
  console.log(value);
});`,
    resources: [
      {
        label: "RxJS dokumentace",
        href: "https://rxjs.dev/api/operators/distinctUntilChanged",
      },
      {
        label: "ReactiveX dokumentace",
        href: "https://reactivex.io/documentation/operators/distinct.html",
      },
    ],
    visualizerTitle: "Ukázka distinctUntilChanged",
    visualizerDescription:
      "Sousední duplicity jsou odfiltrovány. Hodnota 1 se ale po hodnotě 3 může objevit znovu.",
    operators: [
      {
        id: "library-distinct-until-changed",
        type: "distinctUntilChanged",
        config: {},
      },
    ],
    sourceValues: [
      {
        id: "library-distinct-until-changed-1",
        shape: "circle",
        color: "red",
        value: 1,
      },
      {
        id: "library-distinct-until-changed-2",
        shape: "square",
        color: "red",
        value: 1,
      },
      {
        id: "library-distinct-until-changed-3",
        shape: "triangle",
        color: "blue",
        value: 2,
      },
      {
        id: "library-distinct-until-changed-4",
        shape: "circle",
        color: "blue",
        value: 2,
      },
      {
        id: "library-distinct-until-changed-5",
        shape: "square",
        color: "green",
        value: 3,
      },
      {
        id: "library-distinct-until-changed-6",
        shape: "triangle",
        color: "red",
        value: 1,
      },
      {
        id: "library-distinct-until-changed-7",
        shape: "circle",
        color: "red",
        value: 1,
      },
    ],
  };
