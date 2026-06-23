import { TRACK_Y } from "../constants";
import type { StagePosition } from "../types";

type TrackLayerProps = {
  stagePositions: StagePosition[];
  visualizerWidth: number;
};

export function TrackLayer({
  stagePositions,
  visualizerWidth,
}: TrackLayerProps) {
  return (
    <line
      x1={stagePositions[0]?.x ?? 0}
      x2={stagePositions[stagePositions.length - 1]?.x ?? visualizerWidth}
      y1={TRACK_Y}
      y2={TRACK_Y}
      stroke="var(--border)"
      strokeWidth="1.5"
      strokeDasharray="8 10"
    />
  );
}
