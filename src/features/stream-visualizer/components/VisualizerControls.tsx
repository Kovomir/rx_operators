import {
  GaugeIcon,
  MousePointerClickIcon,
  RotateCcwIcon,
  ShuffleIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  PLAYBACK_SPEED_OPTIONS,
  type PlaybackSpeed,
} from "../playback";

type VisualizerControlsProps = {
  playbackSpeed: PlaybackSpeed;
  onEmitLiveValue: () => void;
  onPlaybackSpeedChange: (playbackSpeed: PlaybackSpeed) => void;
  onRandomizeValues: () => void;
  onRestart: () => void;
};

export function VisualizerControls({
  playbackSpeed,
  onEmitLiveValue,
  onPlaybackSpeedChange,
  onRandomizeValues,
  onRestart,
}: VisualizerControlsProps) {
  function changePlaybackSpeed(nextSpeed: string) {
    onPlaybackSpeedChange(Number(nextSpeed) as PlaybackSpeed);
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Select
        value={String(playbackSpeed)}
        onValueChange={changePlaybackSpeed}
      >
        <SelectTrigger
          aria-label="Rychlost animace"
          size="sm"
          className="h-7 w-24 justify-between rounded-[min(var(--radius-md),12px)] px-2.5 text-[0.8rem]"
        >
          <GaugeIcon className="size-4 text-muted-foreground" />
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {PLAYBACK_SPEED_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={String(option.value)}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button type="button" variant="outline" size="sm" onClick={onRestart}>
        <RotateCcwIcon />
        Restart
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={onEmitLiveValue}
      >
        <MousePointerClickIcon />
        Vložit hodnotu
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={onRandomizeValues}
      >
        <ShuffleIcon />
        Nové hodnoty
      </Button>
    </div>
  );
}
