import { useCallback, useMemo, useRef } from "react";

export type PipelineScrollSyncSource = "editor" | "visualizer";

export type PipelineScrollSyncController = {
  register: (
    source: PipelineScrollSyncSource,
    element: HTMLDivElement | null
  ) => void;
  syncScrollLeft: (
    source: PipelineScrollSyncSource,
    scrollLeft: number
  ) => void;
};

export function usePipelineScrollSync(): PipelineScrollSyncController {
  const elementsRef = useRef<Record<PipelineScrollSyncSource, HTMLDivElement | null>>({
    editor: null,
    visualizer: null,
  });
  const ignoredSourceRef = useRef<PipelineScrollSyncSource | null>(null);
  const clearIgnoredSourceFrameRef = useRef<number | null>(null);

  const register = useCallback(
    (source: PipelineScrollSyncSource, element: HTMLDivElement | null) => {
      elementsRef.current[source] = element;
    },
    []
  );

  const syncScrollLeft = useCallback(
    (source: PipelineScrollSyncSource, scrollLeft: number) => {
      if (ignoredSourceRef.current === source) {
        ignoredSourceRef.current = null;
        return;
      }

      const targetSource: PipelineScrollSyncSource =
        source === "editor" ? "visualizer" : "editor";
      const targetElement = elementsRef.current[targetSource];

      if (
        !targetElement ||
        Math.abs(targetElement.scrollLeft - scrollLeft) <= 0.5
      ) {
        return;
      }

      ignoredSourceRef.current = targetSource;
      targetElement.scrollLeft = scrollLeft;

      if (clearIgnoredSourceFrameRef.current !== null) {
        window.cancelAnimationFrame(clearIgnoredSourceFrameRef.current);
      }

      clearIgnoredSourceFrameRef.current = window.requestAnimationFrame(() => {
        ignoredSourceRef.current = null;
        clearIgnoredSourceFrameRef.current = null;
      });
    },
    []
  );

  return useMemo(
    () => ({
      register,
      syncScrollLeft,
    }),
    [register, syncScrollLeft]
  );
}
