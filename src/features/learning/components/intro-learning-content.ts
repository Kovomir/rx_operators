import type { PipelineEditorHighlightedElement } from "@/features/pipeline-editor/components/PipelineFlow";
import type { StreamValue } from "@/features/stream-visualizer";

export type IntroLearningStep = {
  title: string;
  summary: string;
  codeExample?: string;
  points: {
    label: string;
    text: IntroLearningText;
  }[];
  highlightedElement?: PipelineEditorHighlightedElement;
  resources?: IntroLearningResourceLink[];
};

export type IntroLearningText =
  | string
  | {
      text: string;
      href?: string;
    }[];

export type IntroLearningResourceLink = {
  label: string;
  href: string;
};

export const INTRO_SOURCE_VALUES: StreamValue[] = [
  { id: "intro-source-1", shape: "circle", color: "red", value: 1 },
  { id: "intro-source-2", shape: "square", color: "blue", value: 2 },
  { id: "intro-source-3", shape: "triangle", color: "green", value: 3 },
];

export const INTRO_LEARNING_STEPS: IntroLearningStep[] = [
  {
    title: "Datový proud",
    summary:
      "Datový proud (stream) je posloupnost hodnot, které vznikají postupně v čase.",
    points: [
      {
        label: "Představa",
        text: "Pipeline si představte jako potrubí: hodnoty vstoupí na začátku, postupují jedním směrem a cestou mohou projít úpravami.",
      },
      {
        label: "V aplikaci",
        text: "Stream může vznikat z textového vstupu od uživatele, kliknutí na tlačítko, příchozích notifikací nebo odpovědí ze serveru.",
      },
      {
        label: "Co sledovat",
        text: "Barevné tvary postupují jednou společnou cestou zleva doprava. Každý tvar je jedna hodnota ve stejném datovém proudu.",
      },
    ],
  },
  {
    title: "Zdroj",
    highlightedElement: "source",
    summary:
      "Zdroj (source) je místo, odkud do datového proudu vstupují hodnoty.",
    points: [
      {
        label: "Co to znamená",
        text: [
          { text: "V Reactive Extensions je zdroj typicky reprezentován jako " },
          {
            text: "Pozorovatelný zdroj (Observable)",
            href: "https://reactivex.io/documentation/observable.html",
          },
          { text: ", tedy objekt, který umí posílat hodnoty dál." },
        ],
      },
      {
        label: "V aplikaci",
        text: "Textový vstup od uživatele může posílat novou hodnotu pokaždé, když se změní jeho obsah. Tlačítko může poslat hodnotu při každém kliknutí.",
      },
      {
        label: "Co sledovat",
        text: "Ve vizualizaci je zdroj vlevo. Odtud se hodnoty vydávají doprava do zbytku pipeline.",
      },
    ],
  },
  {
    title: "Operátor",
    highlightedElement: "first-operator",
    summary:
      "Operátor (operator) zpracovává hodnoty, které procházejí streamem.",
    points: [
      {
        label: "Co to znamená",
        text: [
          {
            text: "Operátor",
            href: "https://reactivex.io/documentation/operators.html",
          },
          {
            text: " je krok vložený mezi zdroj a odběratele. Každá hodnota přes něj projde a operátor rozhodne, co se stane dál.",
          },
        ],
      },
      {
        label: "V aplikaci",
        text: "Operátor může převést odpověď API do tvaru pro zobrazení, vybrat jen platné položky nebo ignorovat prázdný vyhledávací dotaz.",
      },
      {
        label: "Styl programování",
        text: "Reactive Extensions podporují deklarativní styl: místo ručního řízení každého kroku popíšete, jak se má proud hodnot postupně měnit. Operátory se skládají za sebe a každý z nich řeší jednu konkrétní část zpracování.",
      },
      {
        label: "Co sledovat",
        text: "V ukázce je zvýrazněný zamčený operátor map, který hodnoty vynásobí 2. Později lze v samostatných úlohách operátory skládat a nastavovat ručně.",
      },
    ],
    codeExample: `source$.pipe(
  map(value => value * 2) // každou hodnotu vynásobí 2
).subscribe(value => {
  console.log(value); // odběratel reaguje na výsledek, například výpisem do konzole
});`,
  },
  {
    title: "Odběratel",
    highlightedElement: "subscriber",
    summary:
      "Odběratel (Observer) představuje příjemce výsledných hodnot datového proudu.",
    points: [
      {
        label: "Co to znamená",
        text: [
          {
            text: "Odběratel je koncový příjemce ReactiveX Observable. ",
            href: "https://reactivex.io/documentation/observable.html",
          },
          { text: "Dostane jen hodnoty, které prošly celou pipeline." },
        ],
      },
      {
        label: "V aplikaci",
        text: "Odběratel může vykreslit výsledky hledání, aktualizovat počitadlo, zobrazit toast nebo uložit výsledek do stavu komponenty.",
      },
      {
        label: "Co sledovat",
        text: "Ve vizualizaci je odběratel vpravo. Hodnoty, které sem dorazí, tvoří výstup pipeline. Aplikace na ně potom může reagovat například překreslením komponenty, změnou počitadla nebo zobrazením výsledku.",
      },
    ],
  },
  {
    title: "Shrnutí",
    summary:
      "Nyní znáte základní části Rx pipeline: Observable jako zdroj hodnot, operátory jako kroky zpracování a Observer jako odběratele výsledku.",
    points: [
      {
        label: "Co už znáte",
        text: "Hodnoty vznikají ve zdroji, procházejí pipeline přes případné operátory a nakonec dorazí k odběrateli.",
      },
      {
        label: "Další krok",
        text: "Pokračujte postupně jednotlivými operátory. U každého si nejdřív všimněte, jak mění průchod hodnot pipeline, a potom si jeho chování vyzkoušejte v úlohách.",
      },
      {
        label: "V aplikaci",
        text: "Knihovna operátorů slouží jako rychlé vysvětlení a vizuální ukázka. Výukové úlohy potom ověří, že operátor umíte použít ve správné části pipeline.",
      },
    ],
    resources: [
      {
        label: "RxJS dokumentace",
        href: "https://rxjs.dev/guide/overview",
      },
      {
        label: "ReactiveX dokumentace",
        href: "https://reactivex.io/intro.html",
      },
    ],
  },
];
