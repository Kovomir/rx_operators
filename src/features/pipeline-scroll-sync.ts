import { useCallback, useMemo, useRef } from "react";

export type PipelineScrollSyncSource = "editor" | "visualizer";

export type PipelineScrollSyncController = {
  register: (
    source: PipelineScrollSyncSource,
    element: HTMLDivElement | null
  ) => void;
  scrollTo: (
    source: PipelineScrollSyncSource,
    scrollLeft: number
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

  const updateTargetScrollLeft = useCallback(
    (source: PipelineScrollSyncSource, scrollLeft: number) => {
      const targetSource: PipelineScrollSyncSource =
        source === "editor" ? "visualizer" : "editor";
      const sourceElement = elementsRef.current[source];
      const targetElement = elementsRef.current[targetSource];
      const sourceMaxScrollLeft = getMaxScrollLeft(sourceElement);
      const targetMaxScrollLeft = getMaxScrollLeft(targetElement);
      const sourceScrollRatio =
        sourceMaxScrollLeft > 0
          ? clampScrollLeft(scrollLeft, sourceMaxScrollLeft) /
            sourceMaxScrollLeft
          : 0;
      const targetScrollLeft = targetMaxScrollLeft * sourceScrollRatio;

      if (
        !targetElement ||
        Math.abs(targetElement.scrollLeft - targetScrollLeft) <= 0.5
      ) {
        return;
      }

      ignoredSourceRef.current = targetSource;
      targetElement.scrollLeft = targetScrollLeft;

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

  const syncScrollLeft = useCallback(
    (source: PipelineScrollSyncSource, scrollLeft: number) => {
      if (ignoredSourceRef.current === source) {
        ignoredSourceRef.current = null;
        return;
      }

      updateTargetScrollLeft(source, scrollLeft);
    },
    [updateTargetScrollLeft]
  );

  const scrollTo = useCallback(
    (source: PipelineScrollSyncSource, scrollLeft: number) => {
      const sourceElement = elementsRef.current[source];
      const sourceMaxScrollLeft = getMaxScrollLeft(sourceElement);
      const sourceScrollLeft = clampScrollLeft(scrollLeft, sourceMaxScrollLeft);

      if (
        sourceElement &&
        Math.abs(sourceElement.scrollLeft - sourceScrollLeft) > 0.5
      ) {
        sourceElement.scrollLeft = sourceScrollLeft;
      }

      updateTargetScrollLeft(source, sourceScrollLeft);
    },
    [updateTargetScrollLeft]
  );

  return useMemo(
    () => ({
      register,
      scrollTo,
      syncScrollLeft,
    }),
    [register, scrollTo, syncScrollLeft]
  );
}

function getMaxScrollLeft(element: HTMLDivElement | null) {
  if (!element) {
    return 0;
  }

  return Math.max(0, element.scrollWidth - element.clientWidth);
}

function clampScrollLeft(scrollLeft: number, maxScrollLeft: number) {
  return Math.max(0, Math.min(maxScrollLeft, scrollLeft));
}
