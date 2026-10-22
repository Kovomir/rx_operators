import { useMemo } from "react";

type PipelineScrollSyncSource = "editor" | "visualizer";

export type PipelineScrollSyncController = {
  register: (source: PipelineScrollSyncSource, element: HTMLDivElement | null) => void;
  scrollTo: (source: PipelineScrollSyncSource, scrollLeft: number) => void;
};

export function usePipelineScrollSync(): PipelineScrollSyncController {
  return useMemo(() => {
    const elements: Record<PipelineScrollSyncSource, HTMLDivElement | null> = {
      editor: null,
      visualizer: null,
    };
    const expectedPositions = new WeakMap<HTMLDivElement, number>();
    let activeElement: HTMLDivElement | null = null;
    let observer: ResizeObserver | null = null;

    function sync(source: HTMLDivElement) {
      const target = source === elements.editor ? elements.visualizer : elements.editor;
      if (!target) return;

      const sourceRange = source.scrollWidth - source.clientWidth;
      const targetRange = Math.max(0, target.scrollWidth - target.clientWidth);
      const ratio = sourceRange > 0
        ? Math.max(0, Math.min(1, source.scrollLeft / sourceRange))
        : 0;
      const targetLeft = ratio * targetRange;
      if (Math.abs(target.scrollLeft - targetLeft) <= 0.5) return;

      target.scrollLeft = targetLeft;
      expectedPositions.set(target, target.scrollLeft);
    }

    function onScroll(event: Event) {
      const source = event.currentTarget as HTMLDivElement;
      const expected = expectedPositions.get(source);
      // Ignore our own writes even if their scroll event arrives later.
      if (expected !== undefined && Math.abs(source.scrollLeft - expected) <= 0.5) return;

      expectedPositions.delete(source);
      activeElement = source;
      sync(source);
    }

    return {
      register(source, element) {
        const previous = elements[source];
        if (previous) {
          previous.removeEventListener("scroll", onScroll);
          expectedPositions.delete(previous);
          observer?.unobserve(previous);
          if (previous.firstElementChild) observer?.unobserve(previous.firstElementChild);
          if (activeElement === previous) activeElement = null;
        }
        elements[source] = element;

        if (element) {
          observer ??= new ResizeObserver(() => {
            if (activeElement) sync(activeElement);
          });
          element.addEventListener("scroll", onScroll, { passive: true });
          observer.observe(element);
          if (element.firstElementChild) observer.observe(element.firstElementChild);
        } else if (!elements.editor && !elements.visualizer) {
          observer?.disconnect();
          observer = null;
        }
      },
      scrollTo(source, scrollLeft) {
        const element = elements[source];
        if (!element) return;

        expectedPositions.delete(element);
        element.scrollLeft = scrollLeft;
        activeElement = element;
        sync(element);
      },
    };
  }, []);
}
