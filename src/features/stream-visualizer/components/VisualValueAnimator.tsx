import { motion } from "motion/react";

import type { LiveVisualValue } from "../types";
import { StreamValueGlyph } from "./StreamValueGlyph";

type VisualValueAnimatorProps = {
  visualValue: LiveVisualValue;
};

export function VisualValueAnimator({
  visualValue,
}: VisualValueAnimatorProps) {
  return (
    <motion.g
      initial={{
        x: visualValue.x,
        y: visualValue.y,
        opacity: 0,
        scale: 0.8,
      }}
      animate={{
        x: visualValue.x,
        y: visualValue.y,
        opacity: visualValue.opacity,
        scale: visualValue.scale,
      }}
      transition={{
        duration: visualValue.transitionDurationMs / 1000,
        ease: "easeInOut",
      }}
    >
      <StreamValueGlyph
        streamValue={visualValue.streamValue}
        value={visualValue.displayValue}
        status={visualValue.status}
      />
    </motion.g>
  );
}
