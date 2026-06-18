import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { PlayIcon, RotateCcwIcon, ShuffleIcon } from "lucide-react";
import { toArray } from "rxjs";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
import type { StreamValue, ValueAnimation } from "../types";

import { StreamValueGlyph } from "./StreamValueGlyph";

type PipelineVisualizerProps = {
  operators: PipelineOperator[];
};

export function PipelineVisualizer({ operators }: PipelineVisualizerProps) {
  const [sourceValues, setSourceValues] = useState<StreamValue[]>(() =>
    createDefaultStreamValues()
  );
  const [outputValues, setOutputValues] = useState<StreamValue[]>([]);
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

  return (
    <section className="min-w-0 overflow-hidden rounded-lg border bg-background shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b px-4 py-3">
        <div className="min-w-0">
          <h2 className="text-sm font-semibold text-foreground">
            Vizualizace streamu
          </h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Deset hodnot postupně prochází skutečnou RxJS pipeline.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="rounded-md border bg-muted px-2 py-1 text-xs text-muted-foreground">
                Vstup: {sourceValues.length}
              </div>
            </TooltipTrigger>
            <TooltipContent>Počet hodnot na vstupu</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="rounded-md border bg-muted px-2 py-1 text-xs text-muted-foreground">
                Výstup: {outputValues.length}
              </div>
            </TooltipTrigger>
            <TooltipContent>Počet hodnot na výstupu</TooltipContent>
          </Tooltip>
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
                y1="46"
                y2="178"
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
              <text
                x={stagePosition.x}
                y="30"
                textAnchor="middle"
                className="fill-muted-foreground text-[11px] font-medium"
              >
                {stagePosition.label}
              </text>
            </g>
          ))}

          {animations.map((animation) => (
            <AnimatedStreamValue
              key={`${runId}-${traceKey}-${animation.value.id}`}
              animation={animation}
            />
          ))}
        </svg>
      </div>
    </section>
  );
}

type AnimatedStreamValueProps = {
  animation: ValueAnimation;
};

function AnimatedStreamValue({ animation }: AnimatedStreamValueProps) {
  const [segmentIndex, setSegmentIndex] = useState(0);
  const currentSegment = animation.segments[segmentIndex] ?? animation.segments[0];
  const transitionDuration = currentSegment.durationMs / 1000;

  useEffect(() => {
    const timeouts = animation.segments.slice(1).map((segment, index) =>
      window.setTimeout(() => {
        setSegmentIndex(index + 1);
      }, segment.at)
    );

    return () => {
      for (const timeout of timeouts) {
        window.clearTimeout(timeout);
      }
    };
  }, [animation]);

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
      />
    </motion.g>
  );
}
