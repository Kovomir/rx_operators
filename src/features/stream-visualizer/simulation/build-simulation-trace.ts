import {
  DROP_DURATION_MS,
  EMIT_GAP_MS,
  LANE_COUNT,
  LANE_GAP,
  MAP_PULSE_MS,
  MOVE_DURATION_MS,
  OPERATOR_PAUSE_MS,
  STAGE_SPACING,
  SVG_PADDING_X,
  TRACK_Y,
} from "../constants";
import type {
  PipelineStage,
  StagePosition,
  StreamValue,
  ValueAnimation,
  ValueAnimationSegment,
} from "../types";

import {
  getOperatorExpressionPreview,
  type PipelineOperator,
} from "@/features/pipeline-editor";

import { applyMapOperator, passesFilterOperator } from "./apply-operator";

export function buildPipelineStages(
  operators: PipelineOperator[]
): PipelineStage[] {
  return [
    {
      id: "source",
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
      id: "subscriber",
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

export function buildSimulationTrace(
  sourceValues: StreamValue[],
  operators: PipelineOperator[],
  stagePositions: StagePosition[]
): ValueAnimation[] {
  const sourcePosition = findStagePosition(stagePositions, "source");
  const subscriberPosition = findStagePosition(stagePositions, "subscriber");

  return sourceValues.map((sourceValue, valueIndex) => {
    let currentValue = sourceValue;
    let currentTime = valueIndex * EMIT_GAP_MS;
    const y = getLaneY(valueIndex);
    const segments: ValueAnimationSegment[] = [
      createSegment({
        at: 0,
        durationMs: 0,
        x: sourcePosition.x,
        y,
        opacity: 0,
        scale: 0.8,
        value: currentValue.value,
        status: "queued",
      }),
    ];

    function pushSegment(
      durationMs: number,
      target: Omit<ValueAnimationSegment, "at" | "durationMs">
    ) {
      segments.push(createSegment({ at: currentTime, durationMs, ...target }));
      currentTime += durationMs;
    }

    pushSegment(140, {
      x: sourcePosition.x,
      y,
      opacity: 1,
      scale: 1,
      value: currentValue.value,
      status: "moving",
    });

    for (const operator of operators) {
      const operatorPosition = findStagePosition(stagePositions, operator.id);

      pushSegment(MOVE_DURATION_MS, {
        x: operatorPosition.x,
        y,
        opacity: 1,
        scale: 1,
        value: currentValue.value,
        status: "moving",
      });

      switch (operator.type) {
        case "map":
          currentValue = applyMapOperator(currentValue, operator);

          pushSegment(MAP_PULSE_MS, {
            x: operatorPosition.x,
            y,
            opacity: 1,
            scale: 1.16,
            value: currentValue.value,
            status: "mapped",
          });
          pushSegment(OPERATOR_PAUSE_MS, {
            x: operatorPosition.x,
            y,
            opacity: 1,
            scale: 1,
            value: currentValue.value,
            status: "mapped",
          });
          break;
        case "filter":
          if (passesFilterOperator(currentValue, operator)) {
            pushSegment(OPERATOR_PAUSE_MS, {
              x: operatorPosition.x,
              y,
              opacity: 1,
              scale: 1.08,
              value: currentValue.value,
              status: "passed",
            });
            pushSegment(120, {
              x: operatorPosition.x,
              y,
              opacity: 1,
              scale: 1,
              value: currentValue.value,
              status: "passed",
            });
            break;
          }

          pushSegment(OPERATOR_PAUSE_MS, {
            x: operatorPosition.x,
            y,
            opacity: 1,
            scale: 0.9,
            value: currentValue.value,
            status: "dropped",
          });
          pushSegment(DROP_DURATION_MS, {
            x: operatorPosition.x,
            y,
            opacity: 1,
            scale: 0.9,
            value: currentValue.value,
            status: "dropped",
          });

          return {
            value: sourceValue,
            segments,
          };
      }
    }

    pushSegment(MOVE_DURATION_MS, {
      x: subscriberPosition.x,
      y,
      opacity: 1,
      scale: 1,
      value: currentValue.value,
      status: "moving",
    });
    pushSegment(MAP_PULSE_MS, {
      x: subscriberPosition.x,
      y,
      opacity: 1,
      scale: 1.14,
      value: currentValue.value,
      status: "completed",
    });
    pushSegment(OPERATOR_PAUSE_MS, {
      x: subscriberPosition.x,
      y,
      opacity: 1,
      scale: 1,
      value: currentValue.value,
      status: "completed",
    });

    return {
      value: sourceValue,
      segments,
    };
  });
}

function createSegment(segment: ValueAnimationSegment) {
  return segment;
}

function findStagePosition(stagePositions: StagePosition[], stageId: string) {
  const position = stagePositions.find((stagePosition) => stagePosition.id === stageId);

  if (!position) {
    throw new Error(`Missing stage position: ${stageId}`);
  }

  return position;
}

function getLaneY(valueIndex: number) {
  const lane = valueIndex % LANE_COUNT;
  const centeredLane = lane - (LANE_COUNT - 1) / 2;
  return TRACK_Y + centeredLane * LANE_GAP;
}
