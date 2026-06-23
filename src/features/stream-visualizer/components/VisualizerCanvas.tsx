import type { ReactNode } from "react";

import { SVG_HEIGHT } from "../constants";

type VisualizerCanvasProps = {
  children: ReactNode;
  width: number;
};

export function VisualizerCanvas({ children, width }: VisualizerCanvasProps) {
  return (
    <div className="max-w-full overflow-x-auto bg-muted/20">
      <svg
        width={width}
        height={SVG_HEIGHT}
        viewBox={`0 0 ${width} ${SVG_HEIGHT}`}
        className="block"
        role="img"
        aria-label="Animovaná vizualizace hodnot procházejících pipeline"
      >
        {children}
      </svg>
    </div>
  );
}
