import {
  getOperatorExpressionPreview,
  type PipelineOperator,
} from "@/features/pipeline-editor";

import { STAGE_SPACING, SVG_PADDING_X, TRACK_Y } from "./constants";
import type { PipelineStage, StagePosition } from "./types";

export const SOURCE_STAGE_ID = "source";
export const SUBSCRIBER_STAGE_ID = "subscriber";

export function buildPipelineStages(
  operators: PipelineOperator[]
): PipelineStage[] {
  return [
    {
      id: SOURCE_STAGE_ID,
      kind: "source",
      label: "Source",
    },
    ...operators.map((operator, index) => ({
      id: operator.id,
      kind: "operator" as const,
      label: `${index + 1}. ${operator.type}`,
      expression: getOperatorExpressionPreview(operator),
      operator,
    })),
    {
      id: SUBSCRIBER_STAGE_ID,
      kind: "subscriber",
      label: "Subscriber",
    },
  ];
}

export function getStagePositions(stages: PipelineStage[]): StagePosition[] {
  return stages.map((stage, index) => ({
    ...stage,
    x: SVG_PADDING_X + index * STAGE_SPACING,
    y: TRACK_Y,
  }));
}

export function getVisualizerWidth(stageCount: number) {
  return Math.max(760, SVG_PADDING_X * 2 + (stageCount - 1) * STAGE_SPACING);
}
