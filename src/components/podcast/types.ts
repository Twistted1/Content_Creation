export type MixerChannel = {
  id: number;
  name: string;
  gain: number;
  muted: boolean;
  solo: boolean;
};

export type Segment = {
  id: string;
  title: string;
  done: boolean;
};

export type DspPreset = {
  id: string;
  name: string;
  description: string;
};

export type SoundClip = {
  id: string;
  label: string;
  colorClass: string;
};
