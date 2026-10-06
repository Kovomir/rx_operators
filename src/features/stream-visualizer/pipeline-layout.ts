import {
  getOperatorExpressionPreview,
  type PipelineOperator,
} from "@/features/pipeline-editor";

import { STAGE_SPACING, SVG_PADDING_X, TRACK_Y } from "./constants";
import type { PipelineStage, StagePosition } from "./types";

export const SOURCE_STAGE_ID = "source";
export const SUBSCRIBER_STAGE_ID = "subscriber";

const EDITOR_FLOW_PADDING_X = 12;
const EDITOR_ENDPOINT_NODE_WIDTH = 128;
const EDITOR_INSERT_SLOT_WIDTH = 96;
const EDITOR_OPERATOR_NODE_WIDTH = 192;
const EDITOR_FLOW_GAP = 6;
const VISUALIZER_MIN_WIDTH = 760;

const FIRST_OPERATOR_STAGE_X =
  EDITOR_FLOW_PADDING_X +
  EDITOR_ENDPOINT_NODE_WIDTH +
  EDITOR_FLOW_GAP +
  EDITOR_INSERT_SLOT_WIDTH +
  EDITOR_FLOW_GAP +
  EDITOR_OPERATOR_NODE_WIDTH / 2;

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

export function getStagePositions(
  stages: PipelineStage[],
  streamY = TRACK_Y
): StagePosition[] {
  return stages.map((stage, index) => ({
    ...stage,
    x: getStageX(index, stages.length),
    y: streamY,
  }));
}

export function getVisualizerWidth(stageCount: number) {
  return Math.max(VISUALIZER_MIN_WIDTH, getEditableEditorContentWidth(stageCount));
}

function getStageX(stageIndex: number, stageCount: number) {
  if (stageIndex === 0) {
    return SVG_PADDING_X;
  }

  if (stageIndex === stageCount - 1) {
    return getEditableEditorContentWidth(stageCount) - SVG_PADDING_X;
  }

  return FIRST_OPERATOR_STAGE_X + (stageIndex - 1) * STAGE_SPACING;
}

function getEditableEditorContentWidth(stageCount: number) {
  const operatorCount = Math.max(0, stageCount - 2);

  return (
    EDITOR_FLOW_PADDING_X * 2 +
    EDITOR_ENDPOINT_NODE_WIDTH * 2 +
    EDITOR_INSERT_SLOT_WIDTH +
    operatorCount *
      (EDITOR_OPERATOR_NODE_WIDTH + EDITOR_FLOW_GAP + EDITOR_INSERT_SLOT_WIDTH) +
    (operatorCount + 2) * EDITOR_FLOW_GAP
  );
}
