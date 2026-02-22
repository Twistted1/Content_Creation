// Podcast Studio TypeScript Definitions

export interface Channel {
  id: number;
  label: string;
  level: number;
  muted: boolean;
  solo: boolean;
  input: string;
}

export interface DSPPreset {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType;
}

export interface SoundboardItem {
  id: string;
  label: string;
  color: string;
  audioUrl?: string;
}

export interface MediaLibraryItem {
  id: string;
  label: string;
  icon: React.ComponentType;
  type: 'folder' | 'audio' | 'video' | 'document';
  color: string;
}

export interface Segment {
  id: number;
  title: string;
  duration?: number;
  completed: boolean;
}

export interface PodcastStudioProps {
  onRecordingToggle?: (isRecording: boolean) => void;
  onSegmentAdd?: (segment: Segment) => void;
  onPresetChange?: (presetId: string) => void;
  isLive?: boolean;
  initialGain?: number;
}
