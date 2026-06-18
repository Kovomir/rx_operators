import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { motion } from "motion/react";
import {
  FilterIcon,
  FlagIcon,
  GaugeIcon,
  PlayIcon,
  RadioIcon,
  RotateCcwIcon,
  ShuffleIcon,
} from "lucide-react";
import { toArray } from "rxjs";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { PipelineOperator } from "@/features/pipeline-editor";
import { createDefaultStreamValues } from "@/features/stream-visualizer/simulation/create-default-values";

import { SVG_HEIGHT, TRACK_Y } from "../constants";
import {
  buildPipelineStages,
  buildSimulationTrace,
  getStagePositions,
  getVisualizerWidth,
} from "../simulation/build-simulation-trace";
import { buildRxPipeline } from "../simulation/build-rx-pipeline";
import type { StagePosition, StreamValue, ValueAnimation } from "../types";

import { StreamValueGlyph } from "./StreamValueGlyph";

type PipelineVisualizerProps = {
  operators: PipelineOperator[];
};

type PlaybackSpeed = 0.5 | 1 | 1.5 | 2;

const PLAYBACK_SPEED_OPTIONS: { value: PlaybackSpeed; label: string }[] = [
  { value: 0.5, label: "0.5x" },
  { value: 1, label: "1x" },
  { value: 1.5, label: "1.5x" },
  { value: 2, label: "2x" },
];

const STAGE_GUIDE_TOP_Y = 126;
const STAGE_GUIDE_BOTTOM_Y = 406;
const STAGE_LABEL_Y = 44;
const STAGE_DETAIL_Y = 76;
const STAGE_ICON_SIZE = 30;
const STAGE_DETAIL_BADGE_HEIGHT = 26;
const STAGE_DETAIL_BADGE_MIN_WIDTH = 106;
const STAGE_DETAIL_BADGE_MAX_WIDTH = 230;

export function PipelineVisualizer({ operators }: PipelineVisualizerProps) {
  const [sourceValues, setSourceValues] = useState<StreamValue[]>(() =>
    createDefaultStreamValues()
  );
  const [outputValues, setOutputValues] = useState<StreamValue[]>([]);
  const [playbackSpeed, setPlaybackSpeed] = useState<PlaybackSpeed>(1);
  const [runId, setRunId] = useState(0);

  const stages = useMemo(() => buildPipelineStages(operators), [operators]);
  const stagePositions = useMemo(() => getStagePositions(stages), [stages]);
  const visualizerWidth = getVisualizerWidth(stages.length);
  const traceKey = useMemo(
    () => JSON.stringify({ sourceValues, operators }),
    [operators, sourceValues]
  );
  const animations = useMemo(
    () => buildSimulationTrace(sourceValues, operators, stagePositions),
    [operators, sourceValues, stagePositions]
  );

  useEffect(() => {
    const subscription = buildRxPipeline(sourceValues, operators)
      .pipe(toArray())
      .subscribe((nextOutputValues) => {
        setOutputValues(nextOutputValues);
      });

    return () => subscription.unsubscribe();
  }, [operators, sourceValues]);

  function restart() {
    setRunId((currentRunId) => currentRunId + 1);
  }

  function randomizeValues() {
    setSourceValues(createDefaultStreamValues());
  }

  function changePlaybackSpeed(nextSpeed: string) {
    setPlaybackSpeed(Number(nextSpeed) as PlaybackSpeed);
    restart();
  }

  return (
    <section className="min-w-0 overflow-hidden rounded-lg border bg-background shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b px-4 py-3">
        <div className="min-w-0">
          <h2 className="text-sm font-semibold text-foreground">
            Vizualizace streamu
          </h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Vizualizace vaší Rx pipeline.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Select
            value={String(playbackSpeed)}
            onValueChange={changePlaybackSpeed}
          >
            <SelectTrigger
              aria-label="Rychlost animace"
              size="sm"
              className="h-7 w-24 justify-between rounded-[min(var(--radius-md),12px)] px-2.5 text-[0.8rem]"
            >
              <GaugeIcon className="size-4 text-muted-foreground" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PLAYBACK_SPEED_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={String(option.value)}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button type="button" variant="outline" size="sm" onClick={restart}>
            <PlayIcon />
            Přehrát
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={restart}>
            <RotateCcwIcon />
            Restart
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={randomizeValues}
          >
            <ShuffleIcon />
            Nové hodnoty
          </Button>
        </div>
      </div>

      <div className="max-w-full overflow-x-auto bg-muted/20">
        <svg
          width={visualizerWidth}
          height={SVG_HEIGHT}
          viewBox={`0 0 ${visualizerWidth} ${SVG_HEIGHT}`}
          className="block"
          role="img"
          aria-label="Animovaná vizualizace hodnot procházejících pipeline"
        >
          <line
            x1={stagePositions[0]?.x ?? 0}
            x2={stagePositions[stagePositions.length - 1]?.x ?? visualizerWidth}
            y1={TRACK_Y}
            y2={TRACK_Y}
            stroke="var(--border)"
            strokeWidth="1.5"
            strokeDasharray="8 10"
          />

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
                sourceValueCount={sourceValues.length}
                outputValueCount={outputValues.length}
              />
            </g>
          ))}

          {animations.map((animation) => (
            <AnimatedStreamValue
              key={`${runId}-${playbackSpeed}-${traceKey}-${animation.value.id}`}
              animation={animation}
              playbackSpeed={playbackSpeed}
            />
          ))}
        </svg>
      </div>
    </section>
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

type AnimatedStreamValueProps = {
  animation: ValueAnimation;
  playbackSpeed: PlaybackSpeed;
};

function AnimatedStreamValue({
  animation,
  playbackSpeed,
}: AnimatedStreamValueProps) {
  const [segmentIndex, setSegmentIndex] = useState(0);
  const currentSegment =
    animation.segments[segmentIndex] ?? animation.segments[0];
  const transitionDuration = currentSegment.durationMs / 1000 / playbackSpeed;

  useEffect(() => {
    const timeouts = animation.segments.slice(1).map((segment, index) =>
      window.setTimeout(() => {
        setSegmentIndex(index + 1);
      }, segment.at / playbackSpeed)
    );

    return () => {
      for (const timeout of timeouts) {
        window.clearTimeout(timeout);
      }
    };
  }, [animation, playbackSpeed]);

  return (
    <motion.g
      initial={false}
      animate={{
        x: currentSegment.x,
        y: currentSegment.y,
        opacity: currentSegment.opacity,
        scale: currentSegment.scale,
      }}
      transition={{
        duration: transitionDuration,
        ease: "easeInOut",
      }}
    >
      <StreamValueGlyph
        streamValue={animation.value}
        value={currentSegment.value}
        status={currentSegment.status}
      />
    </motion.g>
  );
}
