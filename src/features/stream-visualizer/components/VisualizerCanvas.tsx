import { useEffect, useRef, type ReactNode, type UIEvent } from "react";

import type { PipelineScrollSyncController } from "@/features/pipeline-scroll-sync";

import { SVG_HEIGHT } from "../constants";

type VisualizerCanvasProps = {
  children: ReactNode;
  centeredX?: number;
  centerRequestKey?: number;
  scrollSync?: PipelineScrollSyncController;
  width: number;
};

export function VisualizerCanvas({
  children,
  centeredX,
  centerRequestKey,
  scrollSync,
  width,
}: VisualizerCanvasProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollSync?.register("visualizer", scrollContainerRef.current);

    return () => {
      scrollSync?.register("visualizer", null);
    };
  }, [scrollSync]);

  function handleScroll(event: UIEvent<HTMLDivElement>) {
    scrollSync?.syncScrollLeft("visualizer", event.currentTarget.scrollLeft);
  }

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;

    if (!scrollContainer || centeredX === undefined) {
      return;
    }

    const maxScrollLeft =
      scrollContainer.scrollWidth - scrollContainer.clientWidth;
    const nextScrollLeft = Math.max(
      0,
      Math.min(maxScrollLeft, centeredX - scrollContainer.clientWidth / 2)
    );

    scrollSync?.scrollTo("visualizer", nextScrollLeft);
  }, [centerRequestKey, centeredX, scrollSync]);

  return (
    <div
      ref={scrollContainerRef}
      className="max-w-full overflow-x-auto bg-muted/20"
      onScroll={handleScroll}
    >
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
