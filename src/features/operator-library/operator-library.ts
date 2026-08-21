import type {
  PipelineOperator,
  PipelineOperatorType,
} from "@/features/pipeline-editor";
import type { StreamValue } from "@/features/stream-visualizer";

export type OperatorLibraryEntry = {
  type: PipelineOperatorType;
  label: string;
  description: string;
  summary: string;
  usage: string[];
  exampleCode: string;
  visualizerTitle: string;
  visualizerDescription: string;
  operators: PipelineOperator[];
  sourceValues: StreamValue[];
};

export const OPERATOR_LIBRARY: OperatorLibraryEntry[] = [
  {
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
    visualizerTitle: "Ukázka map",
    visualizerDescription:
      "Každá hodnota projde operátorem map a její číslo se vynásobí dvěma.",
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
  },
  {
    type: "filter",
    label: "filter",
    description: "Propouštění jen hodnot, které splní podmínku.",
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
    visualizerTitle: "Ukázka filter",
    visualizerDescription:
      "Filter propustí pouze sudé hodnoty. Liché hodnoty jsou viditelně odfiltrovány.",
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
    ],
  },
];
