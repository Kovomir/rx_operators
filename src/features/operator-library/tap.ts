import type { TapPipelineOperator } from "@/features/pipeline-editor";
import type { StreamValue } from "@/types/stream";

export type TapOperatorLibraryEntry = {
  type: "tap";
  label: string;
  description: string;
  summary: string;
  usage: string[];
  exampleCode: string;
  resources: TapOperatorResourceLink[];
  visualizerTitle: string;
  visualizerDescription: string;
  operators: TapPipelineOperator[];
  sourceValues: StreamValue[];
};

export type TapOperatorResourceLink = {
  label: string;
  href: string;
};

export const TAP_OPERATOR_LIBRARY_ENTRY: TapOperatorLibraryEntry = {
  type: "tap",
  label: "tap",
  description: "Vedlejší efekt bez změny hodnot ve streamu.",
  summary:
    "Operátor tap provede vedlejší efekt pro každou hodnotu, ale samotnou hodnotu nemění. V této aplikaci používá tap(console.log), takže hodnoty uvidíte ve vývojářské konzoli po spuštění vizualizace.",
  usage: [
    "Používá se hlavně pro ladění a pozorování hodnot uvnitř pipeline.",
    "Hodnota pokračuje dál ve stejné podobě, v jaké do tap vstoupila.",
    "Konzoli otevřete pomocí Ctrl + Shift + I, případně klávesou F12.",
  ],
  exampleCode: `source$.pipe(
  tap(value => console.log(value)) // Vypíše hodnotu a pošle ji dál
).subscribe(value => {
  console.log(value);
});`,
  resources: [
    {
      label: "RxJS dokumentace",
      href: "https://rxjs.dev/api/operators/tap",
    },
    {
      label: "ReactiveX dokumentace",
      href: "https://reactivex.io/documentation/operators/do.html",
    },
  ],
  visualizerTitle: "Ukázka tap",
  visualizerDescription:
    "Tap vypíše každou hodnotu do konzole a ve vizualizaci ji krátce zvýrazní. Hodnoty do subscriberu pokračují beze změny.",
  operators: [
    {
      id: "library-tap-console-log",
      type: "tap",
      config: {
        effect: "consoleLog",
      },
    },
  ],
  sourceValues: [
    { id: "library-tap-1", shape: "circle", color: "red", value: 1 },
    { id: "library-tap-2", shape: "square", color: "blue", value: 2 },
    { id: "library-tap-3", shape: "triangle", color: "green", value: 3 },
  ],
};
