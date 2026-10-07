import type { ScanPipelineOperator } from "@/features/pipeline-editor";
import type { StreamValue } from "@/types/stream";

export type ScanOperatorLibraryEntry = {
  type: "scan";
  label: string;
  description: string;
  summary: string;
  usage: string[];
  exampleCode: string;
  resources: ScanOperatorResourceLink[];
  visualizerTitle: string;
  visualizerDescription: string;
  operators: ScanPipelineOperator[];
  sourceValues: StreamValue[];
};

export type ScanOperatorResourceLink = {
  label: string;
  href: string;
};

export const SCAN_OPERATOR_LIBRARY_ENTRY: ScanOperatorLibraryEntry = {
  type: "scan",
  label: "scan",
  description: "Průběžná akumulace hodnot ve streamu.",
  summary:
    "Operátor scan drží průběžný stav a po každé hodnotě emituje nový akumulovaný výsledek. V této aplikaci používá průběžný součet s počáteční hodnotou 0.",
  usage: [
    "Používá se, když má výsledek záviset na předchozích hodnotách.",
    "Akumulátor se aktualizuje po každé hodnotě, která se ke scan dostane.",
    "Na rozdíl od reduce průběžně emituje každý mezivýsledek, ne až jediný finální výsledek.",
  ],
  exampleCode: `source$.pipe(
  scan((acc, value) => acc + value, 0) // Průběžný součet
).subscribe(value => {
  console.log(value);
});`,
  resources: [
    {
      label: "RxJS dokumentace",
      href: "https://rxjs.dev/api/operators/scan",
    },
    {
      label: "ReactiveX dokumentace",
      href: "https://reactivex.io/documentation/operators/scan.html",
    },
  ],
  visualizerTitle: "Ukázka scan",
  visualizerDescription:
    "Scan postupně sčítá příchozí hodnoty a po každé emisi pošle dál aktuální součet.",
  operators: [
    {
      id: "library-scan-sum",
      type: "scan",
      config: {},
    },
  ],
  sourceValues: [
    { id: "library-scan-1", shape: "circle", color: "red", value: 1 },
    { id: "library-scan-2", shape: "square", color: "blue", value: 2 },
    { id: "library-scan-3", shape: "triangle", color: "green", value: 3 },
    { id: "library-scan-4", shape: "circle", color: "blue", value: 4 },
  ],
};
