export type PlaybackSpeed = 0.5 | 1 | 1.5 | 2;

export const PLAYBACK_SPEED_OPTIONS: { value: PlaybackSpeed; label: string }[] =
  [
    { value: 0.5, label: "0.5x" },
    { value: 1, label: "1x" },
    { value: 1.5, label: "1.5x" },
    { value: 2, label: "2x" },
  ];
