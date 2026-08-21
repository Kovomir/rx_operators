import type { FilterPipelineOperator } from "@/features/pipeline-editor";
import type { StreamValue } from "@/features/stream-visualizer";

export type FilterOperatorLibraryEntry = {
  type: "filter";
  label: string;
  description: string;
  summary: string;
  usage: string[];
  exampleCode: string;
  resources: FilterOperatorResourceLink[];
  visualizerTitle: string;
  visualizerDescription: string;
  operators: FilterPipelineOperator[];
  sourceValues: StreamValue[];
};

export type FilterOperatorResourceLink = {
  label: string;
  href: string;
};

export const FILTER_OPERATOR_LIBRARY_ENTRY: FilterOperatorLibraryEntry = {
  type: "filter",
  label: "filter",
  description: "Propouštění pouze hodnot, které splní podmínku.",
  summary:
    "Operátor filter testuje každou hodnotu ve streamu, zda splňuje definovanou podmínku. Dále pokračují pouze hodnoty, které podmínku splní, ostatní jsou ze streamu odfiltrovány.",
  usage: [
    "Používá se, když chcete z proudu vybrat jen relevantní hodnoty.",
    "Počet výstupních hodnot může být menší než počet vstupních hodnot.",
    "Využívá se pro ignorování prázdných vstupů, chybových stavů nebo hodnot mimo požadovaný rozsah.",
  ],
  exampleCode: `source$.pipe(
  filter(value => value % 2 === 0) // Propustí pouze sudé hodnoty
).subscribe(value => {
  console.log(value);
});`,
  resources: [
    {
      label: "RxJS dokumentace",
      href: "https://rxjs.dev/api/operators/filter",
    },
    {
      label: "ReactiveX dokumentace",
      href: "https://reactivex.io/documentation/operators/filter.html",
    },
    {
      label: "RxMarbles diagram",
      href: "https://rxmarbles.com/#filter",
    },
  ],
  visualizerTitle: "Ukázka filter",
  visualizerDescription:
    "Filter propustí pouze sudé hodnoty. Liché hodnoty jsou odfiltrovány.",
  operators: [
    {
      id: "library-filter-even",
      type: "filter",
      config: {
        target: "value",
        allowedColors: ["red", "blue", "green"],
        allowedShapes: ["circle", "square", "triangle"],
        allowedValueKinds: ["even"],
      },
    },
  ],
  sourceValues: [
    { id: "library-filter-1", shape: "circle", color: "red", value: 1 },
    { id: "library-filter-2", shape: "square", color: "blue", value: 2 },
    { id: "library-filter-3", shape: "triangle", color: "green", value: 3 },
    { id: "library-filter-4", shape: "circle", color: "blue", value: 4 },
    { id: "library-filter-5", shape: "square", color: "red", value: 5 },
    { id: "library-filter-6", shape: "triangle", color: "blue", value: 6 },
    { id: "library-filter-7", shape: "circle", color: "green", value: 7 },
    { id: "library-filter-8", shape: "square", color: "green", value: 8 },
  ],
};
