import { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { type MixerChannel, type Segment } from "./types";
import { podcastService } from "@/services/podcastService";

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
  startRecording: () => Promise<void>;
  stopRecording: () => void;
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
  leftSidebarOpen: boolean;
  setLeftSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  rightSidebarOpen: boolean;
  setRightSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  audioVisualData: Uint8Array;
  saveRecording: () => Promise<void>;
  recordedBlob: Blob | null;
  isUploading: boolean;
};

const StudioContext = createContext<StudioContextType | null>(null);

export function StudioProvider({ children }: { children: ReactNode }) {
  const [activeTab, setActiveTab] = useState<"studio" | "episodes">("studio");
  const [mainView, setMainView] = useState<"camera" | "teleprompter">("camera");
  const [recording, setRecording] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  // Audio Recording Refs & State
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const [audioVisualData, setAudioVisualData] = useState<Uint8Array>(new Uint8Array(0));
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);

  // Persisted State Initialization
  const [gain, setGain] = useState(() => {
    const saved = localStorage.getItem("podcast_gain");
    return saved ? Number(saved) : 56;
  });
  
  const [activePreset, setActivePreset] = useState(() => {
    return localStorage.getItem("podcast_preset") || "studio";
  });
  
  const [channels, setChannels] = useState(() => {
    const saved = localStorage.getItem("podcast_channels");
    return saved ? JSON.parse(saved) : initialChannels;
  });
  
  const [activeClip, setActiveClip] = useState<string | null>(null);
  
  const [teleprompterText, setTeleprompterText] = useState(() => {
    return localStorage.getItem("podcast_script") || starterScript;
  });
  
  const [autoScroll, setAutoScroll] = useState(false);
  
  const [scrollSpeed, setScrollSpeed] = useState(() => {
    const saved = localStorage.getItem("podcast_scrollSpeed");
    return saved ? Number(saved) : 30;
  });
  
  const [query, setQuery] = useState("");
  
  const [segments, setSegments] = useState<Segment[]>(() => {
    const saved = localStorage.getItem("podcast_segments");
    return saved ? JSON.parse(saved) : [
      { id: "s1", title: "Show notes", done: true },
      { id: "s2", title: "Segment planner", done: false },
      { id: "s3", title: "Closing CTA", done: false },
    ];
  });

  const [leftSidebarOpen, setLeftSidebarOpen] = useState(() => {
    const saved = localStorage.getItem("podcast_leftSidebar");
    return saved ? saved === "true" : true;
  });
  
  const [rightSidebarOpen, setRightSidebarOpen] = useState(() => {
    const saved = localStorage.getItem("podcast_rightSidebar");
    return saved ? saved === "true" : true;
  });

  const teleprompterViewportRef = useRef<HTMLDivElement | null>(null);

  // Persistence Effects
  useEffect(() => localStorage.setItem("podcast_gain", String(gain)), [gain]);
  useEffect(() => localStorage.setItem("podcast_preset", activePreset), [activePreset]);
  useEffect(() => localStorage.setItem("podcast_channels", JSON.stringify(channels)), [channels]);
  useEffect(() => localStorage.setItem("podcast_script", teleprompterText), [teleprompterText]);
  useEffect(() => localStorage.setItem("podcast_scrollSpeed", String(scrollSpeed)), [scrollSpeed]);
  useEffect(() => localStorage.setItem("podcast_segments", JSON.stringify(segments)), [segments]);
  useEffect(() => localStorage.setItem("podcast_leftSidebar", String(leftSidebarOpen)), [leftSidebarOpen]);
  useEffect(() => localStorage.setItem("podcast_rightSidebar", String(rightSidebarOpen)), [rightSidebarOpen]);

  useEffect(() => {
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.setTargetAtTime(gain / 100, audioContextRef.current?.currentTime || 0, 0.1);
    }
  }, [gain]);

  // Timer Effect
  useEffect(() => {
    if (!recording) return;
    const id = setInterval(() => setElapsed((prev) => prev + 1), 1000);
    return () => clearInterval(id);
  }, [recording]);

  // Auto-scroll Effect
  useEffect(() => {
    if (!autoScroll || !teleprompterViewportRef.current) return;
    const id = setInterval(() => {
      if (!teleprompterViewportRef.current) return;
      teleprompterViewportRef.current.scrollTop += scrollSpeed / 10;
    }, 100);
    return () => clearInterval(id);
  }, [autoScroll, scrollSpeed]);

  // Visualizer Loop
  useEffect(() => {
    let animationFrame: number;
    const draw = () => {
      if (analyserRef.current && recording) {
        const bufferLength = analyserRef.current.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        analyserRef.current.getByteFrequencyData(dataArray);
        setAudioVisualData(dataArray);
        animationFrame = requestAnimationFrame(draw);
      }
    };
    if (recording) draw();
    return () => cancelAnimationFrame(animationFrame);
  }, [recording]);

  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const ctx = new AudioContext();
      audioContextRef.current = ctx;
      
      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 64;
      analyserRef.current = analyser;
      
      const gainNode = ctx.createGain();
      gainNode.gain.value = gain / 100;
      gainNodeRef.current = gainNode;
      
      const dest = ctx.createMediaStreamDestination();
      source.connect(gainNode);
      gainNode.connect(analyser);
      analyser.connect(dest);
      
      const recorder = new MediaRecorder(dest.stream);
      const chunks: Blob[] = [];
      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/mp3' });
        setRecordedBlob(blob);
        stream.getTracks().forEach(t => t.stop());
        ctx.close();
      };
      
      recorder.start();
      mediaRecorderRef.current = recorder;
      setRecording(true);
      setElapsed(0);
      setRecordedBlob(null);
      if (teleprompterText) setAutoScroll(true);
    } catch (err) {
      console.error("Recording failed", err);
      alert("Microphone access denied or error occurred");
    }
  }

  function stopRecording() {
    if (mediaRecorderRef.current && recording) {
      mediaRecorderRef.current.stop();
      setRecording(false);
      setAutoScroll(false);
    }
  }

  async function saveRecording() {
    if (!recordedBlob) return;
    setIsUploading(true);
    try {
      const title = `Session ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`;
      const audioUrl = await podcastService.uploadEpisode(recordedBlob, title);
      await podcastService.createPodcast({
        title,
        topic: "Studio Recording",
        hosts: ["Me"],
        guests: [],
        duration: `${Math.floor(elapsed / 60)}:${(elapsed % 60).toString().padStart(2, '0')}`,
        status: "published",
        audioUrl
      });
      setRecordedBlob(null);
      setElapsed(0);
    } catch (err) {
      console.error("Save failed", err);
    } finally {
      setIsUploading(false);
    }
  }

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
      startRecording,
      stopRecording,
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
      leftSidebarOpen,
      setLeftSidebarOpen,
      rightSidebarOpen,
      setRightSidebarOpen,
      audioVisualData,
      saveRecording,
      recordedBlob,
      isUploading,
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
      leftSidebarOpen,
      rightSidebarOpen,
      audioVisualData,
      recordedBlob,
      isUploading,
    ]
  );

  return <StudioContext.Provider value={value}>{children}</StudioContext.Provider>;
}

export function useStudio() {
  const ctx = useContext(StudioContext);
  if (!ctx) throw new Error("useStudio must be used within StudioProvider");
  return ctx;
}
