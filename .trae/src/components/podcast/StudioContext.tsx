import { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { type MixerChannel, type Segment } from "./types";

const initialChannels: MixerChannel[] = [
  { id: 1, name: "Channel 1", gain: 62, muted: false, solo: false },
  { id: 2, name: "Channel 2", gain: 55, muted: false, solo: false },
  { id: 3, name: "Channel 3", gain: 48, muted: false, solo: false },
  { id: 4, name: "Channel 4", gain: 51, muted: false, solo: false },
  { id: 5, name: "Channel 5", gain: 40, muted: false, solo: false },
  { id: 6, name: "Channel 6", gain: 58, muted: false, solo: false },
];

const starterScript =
  "Welcome back to ContentFlow Podcast Studio.\\n\\nToday we are sharing how to turn one idea into a full episode and three short clips without extra effort.\\n\\nOpen with a tight hook. Tell a quick story. Then end with one action listeners can apply immediately.";

type StudioContextType = {
  activeTab: "studio" | "episodes";
  setActiveTab: (tab: "studio" | "episodes") => void;
  mainView: "camera" | "teleprompter";
  setMainView: (view: "camera" | "teleprompter") => void;
  recording: boolean;
  setRecording: React.Dispatch<React.SetStateAction<boolean>>;
  elapsed: number;
  gain: number;
  setGain: (gain: number) => void;
  activePreset: string;
  setActivePreset: (preset: string) => void;
  channels: MixerChannel[];
  updateChannelGain: (id: number, gain: number) => void;
  toggleChannel: (id: number, key: "muted" | "solo") => void;
  activeClip: string | null;
  setActiveClip: (clip: string | null) => void;
  teleprompterText: string;
  setTeleprompterText: (text: string) => void;
  autoScroll: boolean;
  setAutoScroll: React.Dispatch<React.SetStateAction<boolean>>;
  scrollSpeed: number;
  setScrollSpeed: React.Dispatch<React.SetStateAction<number>>;
  query: string;
  setQuery: (query: string) => void;
  segments: Segment[];
  toggleSegment: (id: string) => void;
  addSegment: (title: string) => void;
  teleprompterViewportRef: React.MutableRefObject<HTMLDivElement | null>;
};

const StudioContext = createContext<StudioContextType | null>(null);

export function StudioProvider({ children }: { children: ReactNode }) {
  const [activeTab, setActiveTab] = useState<"studio" | "episodes">("studio");
  const [mainView, setMainView] = useState<"camera" | "teleprompter">("camera");
  const [recording, setRecording] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [gain, setGain] = useState(56);
  const [activePreset, setActivePreset] = useState("studio");
  const [channels, setChannels] = useState(initialChannels);
  const [activeClip, setActiveClip] = useState<string | null>(null);
  const [teleprompterText, setTeleprompterText] = useState(starterScript);
  const [autoScroll, setAutoScroll] = useState(false);
  const [scrollSpeed, setScrollSpeed] = useState(30);
  const [query, setQuery] = useState("");
  const [segments, setSegments] = useState<Segment[]>([
    { id: "s1", title: "Show notes", done: true },
    { id: "s2", title: "Segment planner", done: false },
    { id: "s3", title: "Closing CTA", done: false },
  ]);

  const teleprompterViewportRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!recording) return;
    const id = setInterval(() => setElapsed((prev) => prev + 1), 1000);
    return () => clearInterval(id);
  }, [recording]);

  useEffect(() => {
    if (!autoScroll || !teleprompterViewportRef.current) return;
    const id = setInterval(() => {
      if (!teleprompterViewportRef.current) return;
      teleprompterViewportRef.current.scrollTop += scrollSpeed / 7;
    }, 120);
    return () => clearInterval(id);
  }, [autoScroll, scrollSpeed, mainView]);

  function updateChannelGain(id: number, nextGain: number) {
    setChannels((prev) => prev.map((ch) => (ch.id === id ? { ...ch, gain: nextGain } : ch)));
  }

  function toggleChannel(id: number, key: "muted" | "solo") {
    setChannels((prev) => prev.map((ch) => (ch.id === id ? { ...ch, [key]: !ch[key] } : ch)));
  }

  function addSegment(title: string) {
    const value = title.trim();
    if (!value) return;
    setSegments((prev) => [...prev, { id: crypto.randomUUID(), title: value, done: false }]);
  }

  function toggleSegment(id: string) {
    setSegments((prev) => prev.map((s) => (s.id === id ? { ...s, done: !s.done } : s)));
  }

  const value = useMemo(
    () => ({
      activeTab,
      setActiveTab,
      mainView,
      setMainView,
      recording,
      setRecording,
      elapsed,
      gain,
      setGain,
      activePreset,
      setActivePreset,
      channels,
      updateChannelGain,
      toggleChannel,
      activeClip,
      setActiveClip,
      teleprompterText,
      setTeleprompterText,
      autoScroll,
      setAutoScroll,
      scrollSpeed,
      setScrollSpeed,
      query,
      setQuery,
      segments,
      toggleSegment,
      addSegment,
      teleprompterViewportRef,
    }),
    [
      activeTab,
      mainView,
      recording,
      elapsed,
      gain,
      activePreset,
      channels,
      activeClip,
      teleprompterText,
      autoScroll,
      scrollSpeed,
      query,
      segments,
    ]
  );

  return <StudioContext.Provider value={value}>{children}</StudioContext.Provider>;
}

export function useStudio() {
  const ctx = useContext(StudioContext);
  if (!ctx) throw new Error("useStudio must be used within StudioProvider");
  return ctx;
}
