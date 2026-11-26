import { AnimatePresence, motion, MotionConfig } from "motion/react";

import type { StreamValue } from "../types";
import { formatStreamValueLabel } from "../value-formatting";
import { StreamValueGlyph } from "./StreamValueGlyph";

type SubscriberOutputProps = {
  runId: number;
  totalCount: number;
  values: StreamValue[];
};

const valueTransition = { duration: 0.18, ease: "easeOut" } as const;

export function SubscriberOutput({ runId, totalCount, values }: SubscriberOutputProps) {
  const hiddenCount = totalCount - values.length;

  return (
    <div className="grid w-fit max-w-full gap-1">
      <div className="mb-1 text-xs font-medium text-muted-foreground">
        <strong>Výstup odběratele</strong>
      </div>
      <div className="relative flex min-h-[66px] w-fit max-w-full flex-wrap items-center gap-2 rounded-md border bg-card px-2 py-1.5">
        {values.length === 0 && (
          <span className="animate-in fade-in-0 fill-mode-both duration-0 delay-150 px-1.5 text-xs text-muted-foreground">
            Prázdný
          </span>
        )}
        <MotionConfig reducedMotion="user" transition={valueTransition}>
          <AnimatePresence key={runId} initial={false} mode="popLayout">
            {hiddenCount > 0 && (
              <motion.span
                key="ellipsis"
                className="px-1 font-mono text-sm text-muted-foreground"
                layout="position"
                layoutDependency={values}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <span aria-hidden="true">...</span>
              </motion.span>
            )}
            {values.map((value, index) => {
              const deliveryNumber = hiddenCount + index + 1;

              return (
                <motion.span
                  key={deliveryNumber}
                  className="grid shrink-0 justify-items-center gap-0.5"
                  layout="position"
                  layoutDependency={values}
                  initial={{ opacity: 0, x: 8, scale: 0.9 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -8, scale: 0.9 }}
                >
                  <svg
                    width="40"
                    height="40"
                    viewBox="-20 -20 40 40"
                    className="block size-10"
                    aria-label={formatStreamValueLabel(value)}
                    role="img"
                  >
                    <StreamValueGlyph streamValue={value} value={value.value} />
                  </svg>
                  <span className="font-mono text-[10px] leading-none text-muted-foreground tabular-nums">
                    {deliveryNumber}.
                  </span>
                </motion.span>
              );
            })}
          </AnimatePresence>
        </MotionConfig>
      </div>
    </div>
  );
}
