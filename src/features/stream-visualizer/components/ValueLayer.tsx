import type { LiveVisualValue } from "../types";
import { VisualValueAnimator } from "./VisualValueAnimator";

type ValueLayerProps = {
  visualValues: LiveVisualValue[];
};

export function ValueLayer({ visualValues }: ValueLayerProps) {
  return (
    <>
      {visualValues.map((visualValue) => (
        <VisualValueAnimator
          key={visualValue.id}
          visualValue={visualValue}
        />
      ))}
    </>
  );
}
