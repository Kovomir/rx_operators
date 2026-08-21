import type { MapPipelineOperator } from "@/features/pipeline-editor";
import type { StreamValue } from "@/features/stream-visualizer";

export type MapOperatorLibraryEntry = {
  type: "map";
  label: string;
  description: string;
  summary: string;
  usage: string[];
  exampleCode: string;
  resources: MapOperatorResourceLink[];
  visualizerTitle: string;
  visualizerDescription: string;
  operators: MapPipelineOperator[];
  sourceValues: StreamValue[];
};

export type MapOperatorResourceLink = {
  label: string;
  href: string;
};

export const MAP_OPERATOR_LIBRARY_ENTRY: MapOperatorLibraryEntry = {
  type: "map",
  label: "map",
  description: "Transformace každé hodnoty ve streamu.",
  summary:
    "Operátor map vezme každou hodnotu ze vstupního streamu, upraví ji podle zadané funkce a pošle dál novou hodnotu. Počet hodnot ve streamu se nemění.",
  usage: [
    "Používá se, když potřebujete změnit data, ale nechcete nic zahazovat.",
    "Každá vstupní hodnota projde transformační funkcí přesně jednou.",
    "Pomocí map se běžně transformují odpovědi z volání externích služeb, čísla, texty nebo objekty do tvaru, který potřebujeme v další části pipeline.",
  ],
  exampleCode: `source$.pipe(
  map(value => value * 2) // Vynásobí hodnoty dvěma
).subscribe(value => {
  console.log(value);
});`,
  resources: [
    {
      label: "RxJS dokumentace",
      href: "https://rxjs.dev/api/operators/map",
    },
    {
      label: "ReactiveX dokumentace",
      href: "https://reactivex.io/documentation/operators/map.html",
    },
    {
      label: "RxMarbles diagram",
      href: "https://rxmarbles.com/#map",
    },
  ],
  visualizerTitle: "Ukázka map",
  visualizerDescription: "Každá hodnota se vynásobí dvěma.",
  operators: [
    {
      id: "library-map-double",
      type: "map",
      config: {
        operation: "multiply",
        operand: 2,
      },
    },
  ],
  sourceValues: [
    { id: "library-map-1", shape: "circle", color: "red", value: 1 },
    { id: "library-map-2", shape: "square", color: "blue", value: 3 },
    { id: "library-map-3", shape: "triangle", color: "green", value: 5 },
    { id: "library-map-4", shape: "circle", color: "blue", value: 7 },
  ],
};
