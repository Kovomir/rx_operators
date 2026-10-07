import type { StartWithPipelineOperator } from "@/features/pipeline-editor";
import type { StreamValue } from "@/types/stream";

export type StartWithOperatorLibraryEntry = {
  type: "startWith";
  label: string;
  description: string;
  summary: string;
  usage: string[];
  exampleCode: string;
  resources: StartWithOperatorResourceLink[];
  visualizerTitle: string;
  visualizerDescription: string;
  operators: StartWithPipelineOperator[];
  sourceValues: StreamValue[];
};

export type StartWithOperatorResourceLink = {
  label: string;
  href: string;
};

export const START_WITH_OPERATOR_LIBRARY_ENTRY: StartWithOperatorLibraryEntry = {
  type: "startWith",
  label: "startWith",
  description: "Přidání hodnoty na začátek streamu.",
  summary:
    "Operátor startWith vloží jednu nebo více počátečních hodnot před hodnoty ze source. Vložená hodnota nevznikla ve zdroji, ale přesto pokračuje dalšími operátory stejně jako ostatní emise.",
  usage: [
    "Používá se, když má stream začít známou výchozí hodnotou.",
    "Vložená hodnota projde všemi operátory, které jsou za startWith.",
    "Pořadí v pipeline je důležité, protože operátory před startWith vloženou hodnotu nevidí.",
  ],
  exampleCode: `source$.pipe(
  startWith(1) // Nejprve emituje hodnotu 1
).subscribe(value => {
  console.log(value);
});`,
  resources: [
    {
      label: "RxJS dokumentace",
      href: "https://rxjs.dev/api/operators/startWith",
    },
    {
      label: "ReactiveX dokumentace",
      href: "https://reactivex.io/documentation/operators/startwith.html",
    },
  ],
  visualizerTitle: "Ukázka startWith",
  visualizerDescription:
    "StartWith vloží hodnotu 1 před hodnoty ze source. Subscriber ji dostane jako první.",
  operators: [
    {
      id: "library-start-with-one",
      type: "startWith",
      config: {
        value: 1,
      },
    },
  ],
  sourceValues: [
    { id: "library-start-with-2", shape: "square", color: "blue", value: 2 },
    { id: "library-start-with-3", shape: "triangle", color: "green", value: 3 },
    { id: "library-start-with-4", shape: "circle", color: "red", value: 4 },
  ],
};
