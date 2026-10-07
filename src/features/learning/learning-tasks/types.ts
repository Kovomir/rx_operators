import type { PipelineOperatorType } from "@/features/pipeline-editor";

import type { OutputTestTaskDefinition } from "../components/OutputTestTask";

export type IntroLearningTaskDefinition = {
  id: string;
  kind: "intro";
  taskNumber: number;
  title: string;
};

export type OutputLearningTaskDefinition = OutputTestTaskDefinition & {
  kind: "output-test";
};

export type LearningSectionTask =
  | IntroLearningTaskDefinition
  | OutputLearningTaskDefinition;

export type LearningSectionKind = "intro" | "operator" | "challenge-group";

export type LearningSectionDifficulty = "easy" | "medium" | "hard";

export type LearningSection = {
  id: string;
  label: string;
  description: string;
  kind: LearningSectionKind;
  difficulty?: LearningSectionDifficulty;
  operatorType?: PipelineOperatorType;
  operatorTypes?: PipelineOperatorType[];
  tasks: LearningSectionTask[];
};

export type LearningTaskTarget = {
  completedTasks: number;
  section: LearningSection;
  task: LearningSectionTask;
  totalTasks: number;
};
