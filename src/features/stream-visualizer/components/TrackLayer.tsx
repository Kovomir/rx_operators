import type { StagePosition, StreamLane } from "../types";

type TrackLayerProps = {
  stagePositions: StagePosition[];
  streamLanes: StreamLane[];
  visualizerWidth: number;
};

export function TrackLayer({
  stagePositions,
  streamLanes,
  visualizerWidth,
}: TrackLayerProps) {
  return (
    <>
      {streamLanes.map((streamLane) => (
        <line
          key={streamLane.streamId}
          x1={stagePositions[0]?.x ?? 0}
          x2={stagePositions[stagePositions.length - 1]?.x ?? visualizerWidth}
          y1={streamLane.y}
          y2={streamLane.y}
          className="stroke-muted-foreground/65"
          strokeWidth="1.5"
          strokeDasharray="8 10"
        />
      ))}
    </>
  );
}
