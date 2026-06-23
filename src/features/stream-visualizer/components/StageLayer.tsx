import type { ReactNode } from "react";
import { FilterIcon, FlagIcon, RadioIcon } from "lucide-react";

import type { PipelineOperator } from "@/features/pipeline-editor";

import { TRACK_Y } from "../constants";
import type { StagePosition } from "../types";

type StageLayerProps = {
  outputValueCount: number;
  sourceValueCount: number;
  stagePositions: StagePosition[];
};

const STAGE_GUIDE_TOP_Y = 126;
const STAGE_GUIDE_BOTTOM_Y = 406;
const STAGE_LABEL_Y = 44;
const STAGE_DETAIL_Y = 76;
const STAGE_ICON_SIZE = 30;
const STAGE_DETAIL_BADGE_HEIGHT = 26;
const STAGE_DETAIL_BADGE_MIN_WIDTH = 106;
const STAGE_DETAIL_BADGE_MAX_WIDTH = 230;

export function StageLayer({
  outputValueCount,
  sourceValueCount,
  stagePositions,
}: StageLayerProps) {
  return (
    <>
      {stagePositions.map((stagePosition) => (
        <g key={stagePosition.id}>
          <line
            x1={stagePosition.x}
            x2={stagePosition.x}
            y1={STAGE_GUIDE_TOP_Y}
            y2={STAGE_GUIDE_BOTTOM_Y}
            stroke="var(--border)"
            strokeWidth="1"
            strokeDasharray="4 8"
          />
          <circle
            cx={stagePosition.x}
            cy={TRACK_Y}
            r="4"
            fill="var(--background)"
            stroke="var(--border)"
            strokeWidth="1.5"
          />
          <StageLabel
            stagePosition={stagePosition}
            sourceValueCount={sourceValueCount}
            outputValueCount={outputValueCount}
          />
        </g>
      ))}
    </>
  );
}

type StageLabelProps = {
  stagePosition: StagePosition;
  sourceValueCount: number;
  outputValueCount: number;
};

function StageLabel({
  stagePosition,
  sourceValueCount,
  outputValueCount,
}: StageLabelProps) {
  const topLabelWidth = STAGE_ICON_SIZE + 10 + stagePosition.label.length * 9;
  const iconX = stagePosition.x - topLabelWidth / 2;
  const iconY = STAGE_LABEL_Y - 23;
  const labelX = iconX + STAGE_ICON_SIZE + 10;
  const detailText = getStageDetailText(
    stagePosition,
    sourceValueCount,
    outputValueCount
  );

  return (
    <>
      <StageIcon stagePosition={stagePosition} x={iconX} y={iconY} />
      <text
        x={labelX}
        y={STAGE_LABEL_Y}
        textAnchor="start"
        className="fill-foreground text-[17px] font-semibold"
      >
        {stagePosition.label}
      </text>
      <StageDetailBadge x={stagePosition.x} text={detailText} />
    </>
  );
}

type StageIconProps = {
  stagePosition: StagePosition;
  x: number;
  y: number;
};

function StageIcon({ stagePosition, x, y }: StageIconProps) {
  switch (stagePosition.kind) {
    case "source":
      return (
        <StageIconFrame x={x} y={y} className="fill-sky-100">
          <RadioIcon
            x={x + 7}
            y={y + 7}
            width={16}
            height={16}
            className="stroke-sky-700"
          />
        </StageIconFrame>
      );
    case "operator":
      if (!stagePosition.operator) {
        return null;
      }

      return (
        <OperatorStageIcon
          type={stagePosition.operator.type}
          x={x}
          y={y}
        />
      );
    case "subscriber":
      return (
        <StageIconFrame x={x} y={y} className="fill-emerald-100">
          <FlagIcon
            x={x + 7}
            y={y + 7}
            width={16}
            height={16}
            className="stroke-emerald-700"
          />
        </StageIconFrame>
      );
  }
}

type StageIconFrameProps = {
  x: number;
  y: number;
  className: string;
  children: ReactNode;
};

function StageIconFrame({ x, y, className, children }: StageIconFrameProps) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={STAGE_ICON_SIZE}
        height={STAGE_ICON_SIZE}
        rx="7"
        className={className}
      />
      {children}
    </g>
  );
}

type OperatorStageIconProps = {
  type: PipelineOperator["type"];
  x: number;
  y: number;
};

function OperatorStageIcon({ type, x, y }: OperatorStageIconProps) {
  switch (type) {
    case "filter":
      return (
        <StageIconFrame x={x} y={y} className="fill-amber-100">
          <FilterIcon
            x={x + 7}
            y={y + 7}
            width={16}
            height={16}
            className="stroke-amber-700"
          />
        </StageIconFrame>
      );
    case "map":
      return (
        <StageIconFrame x={x} y={y} className="fill-violet-100">
          <text
            x={x + STAGE_ICON_SIZE / 2}
            y={y + 21}
            textAnchor="middle"
            className="fill-violet-700 text-[18px] font-semibold"
          >
            f
          </text>
        </StageIconFrame>
      );
  }
}

type StageDetailBadgeProps = {
  x: number;
  text: string;
};

function StageDetailBadge({ x, text }: StageDetailBadgeProps) {
  const badgeWidth = Math.max(
    STAGE_DETAIL_BADGE_MIN_WIDTH,
    Math.min(STAGE_DETAIL_BADGE_MAX_WIDTH, text.length * 7 + 22)
  );

  return (
    <foreignObject
      x={x - badgeWidth / 2}
      y={STAGE_DETAIL_Y - 18}
      width={badgeWidth}
      height={STAGE_DETAIL_BADGE_HEIGHT}
    >
      <div className="flex h-full items-center justify-center truncate rounded-md bg-muted px-2 font-mono text-xs text-muted-foreground">
        <span className="truncate">{text}</span>
      </div>
    </foreignObject>
  );
}

function getStageDetailText(
  stagePosition: StagePosition,
  sourceValueCount: number,
  outputValueCount: number
) {
  switch (stagePosition.kind) {
    case "source":
      return `Vstup: ${sourceValueCount}`;
    case "operator":
      return stagePosition.expression ?? "";
    case "subscriber":
      return `Výstup: ${outputValueCount}`;
  }
}
