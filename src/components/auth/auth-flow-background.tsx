import { StreamValueGlyph } from "@/features/stream-visualizer/components/StreamValueGlyph";
import type { StreamValue } from "@/features/stream-visualizer/types";

const BACKGROUND_WIDTH = 1440;
const BACKGROUND_HEIGHT = 900;
const TRACK_START_X = -980;
const TRACK_END_X = 2420;
const STAGE_TOP_OFFSET = -48;
const STAGE_BOTTOM_OFFSET = 48;

const LANES = [
  { id: "lane-1", y: -360, opacity: 0.3 },
  { id: "lane-2", y: -240, opacity: 0.36 },
  { id: "lane-3", y: -120, opacity: 0.42 },
  { id: "lane-4", y: 0, opacity: 0.5 },
  { id: "lane-5", y: 120, opacity: 0.56 },
  { id: "lane-6", y: 240, opacity: 0.5 },
  { id: "lane-7", y: 360, opacity: 0.42 },
  { id: "lane-8", y: 480, opacity: 0.54 },
  { id: "lane-9", y: 600, opacity: 0.48 },
  { id: "lane-10", y: 720, opacity: 0.42 },
  { id: "lane-11", y: 840, opacity: 0.5 },
  { id: "lane-12", y: 960, opacity: 0.44 },
  { id: "lane-13", y: 1080, opacity: 0.34 },
  { id: "lane-14", y: 1200, opacity: 0.28 },
] as const;

const STAGE_X_POSITIONS = [-780, -450, -120, 210, 540, 870, 1200, 1530, 1860, 2190];

const STREAM_VALUES: StreamValue[] = [
  { id: "auth-bg-1", shape: "circle", color: "blue", value: 1 },
  { id: "auth-bg-2", shape: "square", color: "red", value: 2 },
  { id: "auth-bg-3", shape: "triangle", color: "green", value: 3 },
  { id: "auth-bg-4", shape: "circle", color: "red", value: 4 },
  { id: "auth-bg-5", shape: "square", color: "blue", value: 5 },
  { id: "auth-bg-6", shape: "triangle", color: "blue", value: 6 },
  { id: "auth-bg-7", shape: "circle", color: "green", value: 7 },
  { id: "auth-bg-8", shape: "square", color: "green", value: 8 },
  { id: "auth-bg-9", shape: "triangle", color: "red", value: 9 },
] as const;

type MovingValue = {
  laneId: string;
  valueIndex: number;
  mappedValue?: number;
  duration: string;
  delay: string;
};

const MOVING_VALUES: MovingValue[] = [
  { laneId: "lane-2", valueIndex: 0, duration: "26s", delay: "-4s" },
  { laneId: "lane-3", valueIndex: 5, duration: "24s", delay: "-15s" },
  { laneId: "lane-4", valueIndex: 1, mappedValue: 10, duration: "22s", delay: "-8s" },
  { laneId: "lane-5", valueIndex: 2, duration: "26s", delay: "-17s" },
  { laneId: "lane-6", valueIndex: 6, duration: "21s", delay: "-2s" },
  { laneId: "lane-7", valueIndex: 3, mappedValue: 20, duration: "25s", delay: "-11s" },
  { laneId: "lane-8", valueIndex: 4, duration: "23s", delay: "-7s" },
  { laneId: "lane-9", valueIndex: 8, duration: "28s", delay: "-20s" },
  { laneId: "lane-10", valueIndex: 7, duration: "27s", delay: "-13s" },
  { laneId: "lane-11", valueIndex: 2, mappedValue: 15, duration: "24s", delay: "-19s" },
  { laneId: "lane-12", valueIndex: 1, duration: "29s", delay: "-6s" },
  { laneId: "lane-13", valueIndex: 6, duration: "25s", delay: "-22s" },
] as const;

export function AuthFlowBackground() {
  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 h-full w-full"
      viewBox={`0 0 ${BACKGROUND_WIDTH} ${BACKGROUND_HEIGHT}`}
      preserveAspectRatio="none"
    >
      <defs>
        {LANES.map((lane) => (
          <path
            key={lane.id}
            id={`auth-flow-${lane.id}`}
            d={`M ${TRACK_START_X} ${lane.y} L ${TRACK_END_X} ${lane.y}`}
          />
        ))}
      </defs>

      <g transform="rotate(-32 720 450)">
        <g fill="none" stroke="var(--border)" strokeLinecap="round">
          {LANES.map((lane) => (
            <g key={lane.id} opacity={lane.opacity}>
              <use
                href={`#auth-flow-${lane.id}`}
                strokeWidth="1.5"
                strokeDasharray="8 10"
              />

              {STAGE_X_POSITIONS.map((stageX) => (
                <g key={`${lane.id}-${stageX}`}>
                  <line
                    x1={stageX}
                    x2={stageX}
                    y1={lane.y + STAGE_TOP_OFFSET}
                    y2={lane.y + STAGE_BOTTOM_OFFSET}
                    strokeWidth="1"
                    strokeDasharray="4 8"
                  />
                  <circle
                    cx={stageX}
                    cy={lane.y}
                    r="4"
                    fill="var(--background)"
                    stroke="var(--border)"
                    strokeWidth="1.5"
                  />
                </g>
              ))}
            </g>
          ))}
        </g>

        <g className="motion-reduce:hidden">
          {MOVING_VALUES.map((movingValue) => (
            <AnimatedBackgroundValue
              key={`${movingValue.laneId}-${movingValue.valueIndex}`}
              laneId={movingValue.laneId}
              streamValue={STREAM_VALUES[movingValue.valueIndex]}
              mappedValue={movingValue.mappedValue}
              duration={movingValue.duration}
              delay={movingValue.delay}
            />
          ))}
        </g>
      </g>
    </svg>
  );
}

type AnimatedBackgroundValueProps = {
  laneId: string;
  streamValue: StreamValue;
  mappedValue?: number;
  duration: string;
  delay: string;
};

function AnimatedBackgroundValue({
  laneId,
  streamValue,
  mappedValue,
  duration,
  delay,
}: AnimatedBackgroundValueProps) {
  const hasMappedValue = mappedValue !== undefined;

  return (
    <g opacity="0.78">
      <animateMotion dur={duration} begin={delay} repeatCount="indefinite">
        <mpath href={`#auth-flow-${laneId}`} />
      </animateMotion>

      <g>
        {hasMappedValue && (
          <animateTransform
            attributeName="transform"
            type="scale"
            values="1; 1; 1.16; 1; 1"
            keyTimes="0; 0.43; 0.48; 0.54; 1"
            dur={duration}
            begin={delay}
            repeatCount="indefinite"
          />
        )}

        <g>
          {hasMappedValue && (
            <animate
              attributeName="opacity"
              values="1; 1; 0; 0"
              keyTimes="0; 0.45; 0.5; 1"
              dur={duration}
              begin={delay}
              repeatCount="indefinite"
            />
          )}
          <StreamValueGlyph streamValue={streamValue} value={streamValue.value} />
        </g>

        {hasMappedValue && (
          <g opacity="0">
            <animate
              attributeName="opacity"
              values="0; 0; 1; 1"
              keyTimes="0; 0.48; 0.53; 1"
              dur={duration}
              begin={delay}
              repeatCount="indefinite"
            />
            <StreamValueGlyph streamValue={streamValue} value={mappedValue} />
          </g>
        )}
      </g>
    </g>
  );
}
