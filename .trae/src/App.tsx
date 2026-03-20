import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, Video, Monitor, Settings, Play, Pause, RotateCcw, 
  ChevronUp, ChevronDown, Music, Folder, 
  Layout, Activity, Radio, Phone, 
  Sliders, List, Send, Plus, 
  Maximize, Search, Mic2, Clock, CheckCircle2,
  Download, Type
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Utility for Tailwind classes */
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Types ---
type ViewMode = 'camera' | 'teleprompter' | 'screen';
type Preset = 'STUDIO' | 'RADIO' | 'CRISP' | 'WARM' | 'ECHO' | 'PHONE';

interface Segment {
  id: string;
  title: string;
  duration: string;
  completed: boolean;
}

// --- Components ---

/** Tooltip Component */
const Tooltip = ({ children, text }: { children: React.ReactNode; text: string }) => {
  const [show, setShow] = useState(false);
  return (
    <div className="relative flex items-center group" onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      {children}
      <AnimatePresence>
        {show && (
          <motion.div 
            initial={{ opacity: 0, y: 5 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: 5 }}
            className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-black/90 border border-white/10 text-white text-[10px] whitespace-nowrap rounded pointer-events-none z-50 shadow-xl"
          >
            {text}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/** Compact Icon Button */
const IconButton = ({ 
  icon: Icon, 
  label, 
  active, 
  onClick, 
  color = "primary",
  size = "md"
}: { 
  icon: any; 
  label: string; 
  active?: boolean; 
  onClick?: () => void;
  color?: 'primary' | 'red' | 'green' | 'blue' | 'purple' | 'gray';
  size?: 'sm' | 'md' | 'lg';
}) => {
  const colorMap = {
    primary: active ? "bg-indigo-600 text-white" : "text-gray-400 hover:bg-white/5 hover:text-white",
    red: active ? "bg-red-500 text-white" : "text-red-400/80 hover:bg-red-500/10 hover:text-red-400",
    green: active ? "bg-emerald-500 text-white" : "text-emerald-400/80 hover:bg-emerald-500/10 hover:text-emerald-400",
    blue: active ? "bg-blue-500 text-white" : "text-blue-400/80 hover:bg-blue-500/10 hover:text-blue-400",
    purple: active ? "bg-purple-500 text-white" : "text-purple-400/80 hover:bg-purple-500/10 hover:text-purple-400",
    gray: active ? "bg-zinc-700 text-white" : "text-zinc-500 hover:bg-white/5 hover:text-zinc-400"
  };

  const sizeMap = {
    sm: "p-1",
    md: "p-1.5",
    lg: "p-2.5"
  };

  return (
    <Tooltip text={label}>
      <button 
        onClick={onClick}
        className={cn(
          "rounded-md transition-all duration-200 flex items-center justify-center",
          colorMap[color],
          sizeMap[size]
        )}
      >
        <Icon size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} />
      </button>
    </Tooltip>
  );
};

/** Section Header */
const SectionHeader = ({ title, icon: Icon, actions }: { title: string; icon: any; actions?: React.ReactNode }) => (
  <div className="flex items-center justify-between mb-2 px-1">
    <div className="flex items-center gap-2">
      <Icon size={14} className="text-indigo-400 opacity-80" />
      <h3 className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase">{title}</h3>
    </div>
    <div className="flex items-center gap-1">
      {actions}
    </div>
  </div>
);

/** Panel Wrapper */
const Panel = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn("bg-[#0d0d0f] border border-white/5 rounded-xl p-3 shadow-2xl flex flex-col overflow-hidden", className)}>
    {children}
  </div>
);

/** MAIN APP COMPONENT */
export default function PodcastStudio() {
  const [viewMode, setViewMode] = useState<ViewMode>('teleprompter');
  const [isRecording, setIsRecording] = useState(false);
  const [activePreset, setActivePreset] = useState<Preset>('STUDIO');
  const [inputGain, setInputGain] = useState(85);
  const [script] = useState("Welcome to the Ultimate Podcast Studio! Today we are discussing the future of AI in creative workflows. Our guest is a leading expert in the field. Let's dive in and explore how tools are evolving. This teleprompter helps you stay on track without losing eye contact with your audience. Adjust the speed on the right rail or right sidebar controls.");
  const [scrollSpeed, setScrollSpeed] = useState(3);
  const [isScrolling, setIsScrolling] = useState(false);
  const [segments, setSegments] = useState<Segment[]>([
    { id: '1', title: 'Intro & Housekeeping', duration: '05:00', completed: true },
    { id: '2', title: 'AI in Design Trends', duration: '15:00', completed: false },
    { id: '3', title: 'Live Audience Q&A', duration: '10:00', completed: false },
  ]);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let interval: any;
    if (isScrolling && scrollRef.current) {
      interval = setInterval(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollTop += scrollSpeed / 2;
        }
      }, 50);
    }
    return () => clearInterval(interval);
  }, [isScrolling, scrollSpeed]);

  const toggleRecording = () => setIsRecording(!isRecording);

  return (
    <div className="min-h-screen bg-[#050506] text-zinc-300 font-sans selection:bg-indigo-500/30 overflow-hidden flex flex-col">
      {/* Top Header */}
      <header className="h-14 border-b border-white/5 flex items-center justify-between px-6 bg-[#09090b] z-20">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Radio className="text-white" size={18} />
            </div>
            <span className="font-bold text-lg tracking-tight text-white">ContentFlow <span className="text-indigo-500 italic">PRO</span></span>
          </div>
          
          <nav className="hidden md:flex items-center gap-1 bg-black/20 p-1 rounded-lg">
            {['Dashboard', 'Script', 'Podcast', 'Production', 'Publish'].map((item) => (
              <button key={item} className={cn(
                "px-3 py-1.5 rounded-md text-xs font-medium transition-all",
                item === 'Podcast' ? "bg-white/10 text-white shadow-sm" : "text-zinc-500 hover:text-zinc-300"
              )}>
                {item}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-black/40 rounded-full border border-white/5">
            <div className={cn("w-2 h-2 rounded-full", isRecording ? "bg-red-500 animate-pulse" : "bg-zinc-600")} />
            <span className="text-xs font-mono font-bold tracking-widest text-zinc-400">00:42:15</span>
          </div>
          <button 
            onClick={toggleRecording}
            className={cn(
              "flex items-center gap-2 px-5 py-2 rounded-full font-bold text-xs transition-all shadow-lg",
              isRecording ? "bg-red-500 text-white shadow-red-500/20" : "bg-indigo-600 text-white hover:bg-indigo-500 shadow-indigo-500/20"
            )}
          >
            {isRecording ? <div className="w-2 h-2 rounded-sm bg-white" /> : <Mic size={14} />}
            {isRecording ? "STOP RECORDING" : "START SESSION"}
          </button>
        </div>
      </header>

      {/* Main Layout Grid */}
      <main className="flex-1 p-4 grid grid-cols-[240px_1fr_280px] gap-4 overflow-hidden">
        
        {/* Left Column: Signal & Soundboard */}
        <aside className="flex flex-col gap-4 overflow-hidden">
          {/* Signal Chain */}
          <Panel className="flex-shrink-0">
            <SectionHeader title="Signal Chain" icon={Activity} />
            <div className="space-y-4 py-2">
              <div>
                <div className="flex justify-between text-[10px] mb-1.5 px-1 font-bold text-zinc-400">
                  <span>INPUT GAIN</span>
                  <span className="text-indigo-400">{inputGain}%</span>
                </div>
                <input 
                  type="range" 
                  value={inputGain}
                  onChange={(e) => setInputGain(Number(e.target.value))}
                  className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-indigo-500" 
                />
              </div>
              
              <div className="grid grid-cols-1 gap-1.5">
                {[
                  { id: 'STUDIO', label: 'Studio Clean', desc: 'Flat & Transparent', icon: Mic2 },
                  { id: 'RADIO', label: 'Broadcast', desc: 'Warm & Compressed', icon: Radio },
                  { id: 'PHONE', label: 'Phone Filter', desc: 'Lo-Fi / 8-bit', icon: Phone },
                ].map((p) => (
                  <button 
                    key={p.id}
                    onClick={() => setActivePreset(p.id as Preset)}
                    className={cn(
                      "flex items-center gap-3 p-2.5 rounded-lg border transition-all text-left group",
                      activePreset === p.id 
                        ? "bg-indigo-600/10 border-indigo-500/50" 
                        : "bg-black/20 border-white/5 hover:border-white/10"
                    )}
                  >
                    <div className={cn(
                      "p-1.5 rounded bg-zinc-800 group-hover:bg-zinc-700 transition-colors",
                      activePreset === p.id ? "text-indigo-400 bg-indigo-500/20" : "text-zinc-500"
                    )}>
                      <p.icon size={14} />
                    </div>
                    <div>
                      <div className={cn("text-[11px] font-bold leading-none mb-1", activePreset === p.id ? "text-white" : "text-zinc-400")}>{p.label}</div>
                      <div className="text-[9px] text-zinc-500 uppercase tracking-tighter">{p.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </Panel>

          {/* Soundboard - Compacted */}
          <Panel className="flex-1">
            <SectionHeader title="Soundboard" icon={Music} actions={<IconButton icon={Plus} label="Add" size="sm" />} />
            <div className="grid grid-cols-2 gap-2 mt-1">
              {[
                { label: 'Intro', color: 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400' },
                { label: 'Outro', color: 'bg-rose-500/10 border-rose-500/30 text-rose-400' },
                { label: 'Applause', color: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' },
                { label: 'Drum Hit', color: 'bg-amber-500/10 border-amber-500/30 text-amber-400' },
                { label: 'Transition', color: 'bg-blue-500/10 border-blue-500/30 text-blue-400' },
                { label: 'Laughter', color: 'bg-purple-500/10 border-purple-500/30 text-purple-400' },
              ].map((s, i) => (
                <button key={i} className={cn("h-12 border rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center justify-center transition-transform active:scale-95", s.color)}>
                  {s.label}
                </button>
              ))}
              <button className="h-12 border border-dashed border-zinc-800 rounded-lg text-[10px] font-bold text-zinc-600 hover:text-zinc-400 hover:border-zinc-700 transition-colors">
                MORE...
              </button>
            </div>
          </Panel>
        </aside>

        {/* Center Column: ENLARGED Main Screen & Mixer */}
        <section className="flex flex-col gap-4 overflow-hidden">
          {/* Main Visual Workspace */}
          <div className="flex-1 bg-black rounded-2xl overflow-hidden border border-white/10 relative shadow-2xl group">
            {/* Main Content Area */}
            <div className="absolute inset-0 flex items-center justify-center">
              {viewMode === 'camera' ? (
                <div className="w-full h-full relative">
                  <img 
                    src="https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&q=80&w=1200" 
                    className="w-full h-full object-cover opacity-90"
                    alt="Host View"
                  />
                  <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 bg-black/60 rounded-full text-[10px] font-bold text-white border border-white/10 backdrop-blur-md">
                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                    LIVE · CAM 01
                  </div>
                </div>
              ) : (
                <div className="w-full h-full bg-[#0a0a0c] flex flex-col p-12">
                   <div 
                    ref={scrollRef}
                    className="flex-1 overflow-hidden text-center flex flex-col items-center justify-center space-y-8"
                  >
                    <p className="text-4xl md:text-5xl font-bold leading-tight text-white/90 max-w-3xl select-none">
                      {script}
                    </p>
                    <div className="h-40 w-full" /> {/* Buffer for scrolling */}
                  </div>
                </div>
              )}
            </div>

            {/* Float Overlay Controls */}
            <div className="absolute inset-x-0 bottom-0 p-6 flex flex-col items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
               {/* Controls Bar */}
               <div className="pointer-events-auto flex items-center gap-2 p-1.5 bg-black/60 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl">
                <div className="flex items-center border-r border-white/10 pr-2 mr-1">
                  <IconButton 
                    icon={Video} 
                    label="Camera View" 
                    active={viewMode === 'camera'} 
                    onClick={() => setViewMode('camera')}
                  />
                  <IconButton 
                    icon={Type} 
                    label="Teleprompter View" 
                    active={viewMode === 'teleprompter'} 
                    onClick={() => setViewMode('teleprompter')}
                  />
                  <IconButton 
                    icon={Monitor} 
                    label="Screen Share" 
                    active={viewMode === 'screen'} 
                    onClick={() => setViewMode('screen')}
                  />
                </div>
                
                <div className="flex items-center gap-2">
                  <IconButton icon={Mic} label="Mute Mic" color="gray" />
                  <div className="w-[1px] h-4 bg-white/10 mx-1" />
                  <IconButton 
                    icon={isScrolling ? Pause : Play} 
                    label={isScrolling ? "Stop Scroll" : "Start Scroll"} 
                    color={isScrolling ? "purple" : "green"}
                    onClick={() => setIsScrolling(!isScrolling)} 
                  />
                  <IconButton icon={RotateCcw} label="Reset Scroll" color="gray" onClick={() => {
                    if (scrollRef.current) scrollRef.current.scrollTop = 0;
                  }} />
                  <div className="w-[1px] h-4 bg-white/10 mx-1" />
                  <IconButton icon={Settings} label="Visual Settings" color="gray" />
                </div>
               </div>
            </div>

            {/* Speed HUD Overlay */}
            {viewMode === 'teleprompter' && (
              <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col gap-2 p-1 bg-black/40 backdrop-blur-sm rounded-lg border border-white/5 opacity-0 group-hover:opacity-100 transition-opacity">
                 <IconButton icon={ChevronUp} label="Faster" size="sm" onClick={() => setScrollSpeed(s => Math.min(s + 1, 10))} />
                 <div className="text-[10px] font-bold text-center text-zinc-400 py-1">{scrollSpeed}x</div>
                 <IconButton icon={ChevronDown} label="Slower" size="sm" onClick={() => setScrollSpeed(s => Math.max(s - 1, 1))} />
              </div>
            )}
          </div>

          {/* Compact Audio Mixer */}
          <Panel className="h-44 flex-shrink-0">
            <SectionHeader title="Professional Audio Mixer" icon={Sliders} actions={<IconButton icon={Maximize} label="Expand" size="sm" />} />
            <div className="flex-1 grid grid-cols-6 gap-3 py-1">
              {[
                { label: 'Host', level: 75, peak: 90 },
                { label: 'Guest', level: 60, peak: 65 },
                { label: 'Music', level: 30, peak: 35 },
                { label: 'Sfx', level: 45, peak: 50 },
                { label: 'Video', level: 0, peak: 0, muted: true },
                { label: 'Master', level: 82, peak: 85, isMaster: true },
              ].map((ch, i) => (
                <div key={i} className="flex flex-col items-center">
                  <div className="flex-1 w-full bg-black/40 rounded-lg p-2 border border-white/5 relative flex flex-col justify-end overflow-hidden group">
                    {/* Meter background */}
                    <div className="absolute inset-x-2 bottom-2 top-2 bg-zinc-900 rounded-sm" />
                    {/* Gain level */}
                    <motion.div 
                      initial={false}
                      animate={{ height: `${ch.level}%` }}
                      className={cn(
                        "absolute inset-x-2 bottom-2 rounded-sm opacity-60 transition-all",
                        ch.level > 80 ? "bg-red-500" : ch.level > 60 ? "bg-amber-500" : "bg-indigo-500"
                      )}
                    />
                    {/* Peak mark */}
                    <div className="absolute inset-x-2 bg-white/40 h-0.5 z-10" style={{ bottom: `calc(2px + ${ch.peak}%)` }} />
                    
                    {/* Channel Controls (Visible on hover) */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 z-20">
                      <button className="p-1 rounded bg-zinc-800 text-[8px] font-bold text-white hover:bg-zinc-700">SOLO</button>
                      <button className={cn("p-1 rounded text-[8px] font-bold hover:opacity-80", ch.muted ? "bg-red-500/20 text-red-500" : "bg-zinc-800 text-white")}>MUTE</button>
                    </div>
                  </div>
                  <span className={cn(
                    "text-[9px] font-bold mt-1.5 uppercase tracking-tighter",
                    ch.isMaster ? "text-indigo-400" : "text-zinc-500"
                  )}>{ch.label}</span>
                </div>
              ))}
            </div>
          </Panel>
        </section>

        {/* Right Column: Library & Notes */}
        <aside className="flex flex-col gap-4 overflow-hidden">
          {/* Media Library */}
          <Panel className="h-1/2">
            <SectionHeader title="Media Library" icon={Folder} />
            <div className="relative mb-3">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-500" size={12} />
              <input 
                type="text" 
                placeholder="Search media..." 
                className="w-full bg-black/40 border border-white/5 rounded-lg py-1.5 pl-8 pr-3 text-xs focus:outline-none focus:border-indigo-500/50 placeholder:text-zinc-700"
              />
            </div>
            <div className="flex-1 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
              {[
                { name: 'Intro_Music.mp3', type: 'audio', size: '4.2MB' },
                { name: 'Sponsor_Ad_01.mp4', type: 'video', size: '128MB' },
                { name: 'Profile_Shot.jpg', type: 'image', size: '1.5MB' },
                { name: 'Interview_Broll.mp4', type: 'video', size: '450MB' },
                { name: 'Laugh_Track.wav', type: 'audio', size: '0.8MB' },
              ].map((file, i) => (
                <div key={i} className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5 cursor-pointer group border border-transparent hover:border-white/5">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <div className="p-1.5 bg-zinc-800 rounded group-hover:text-indigo-400 transition-colors">
                      {file.type === 'audio' ? <Music size={12} /> : file.type === 'video' ? <Video size={12} /> : <Layout size={12} />}
                    </div>
                    <div className="truncate">
                      <div className="text-[11px] font-medium text-zinc-300 truncate">{file.name}</div>
                      <div className="text-[9px] text-zinc-600 uppercase tracking-tighter">{file.size}</div>
                    </div>
                  </div>
                  <IconButton icon={Download} label="Use" size="sm" />
                </div>
              ))}
            </div>
          </Panel>

          {/* Show Notes / Segment Planner */}
          <Panel className="flex-1">
            <SectionHeader title="Show Planner" icon={List} actions={<IconButton icon={Plus} label="New Segment" size="sm" />} />
            <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar mt-1">
              {segments.map((seg) => (
                <div 
                  key={seg.id}
                  className={cn(
                    "p-2.5 rounded-lg border transition-all flex items-start gap-3",
                    seg.completed ? "bg-black/20 border-white/5 opacity-50" : "bg-zinc-800/20 border-white/10"
                  )}
                >
                  <button 
                    onClick={() => setSegments(prev => prev.map(s => s.id === seg.id ? {...s, completed: !s.completed} : s))}
                    className={cn(
                      "mt-0.5 w-4 h-4 rounded border flex items-center justify-center transition-colors",
                      seg.completed ? "bg-emerald-500 border-emerald-500 text-white" : "border-zinc-700 hover:border-zinc-500"
                    )}
                  >
                    {seg.completed && <CheckCircle2 size={10} />}
                  </button>
                  <div className="flex-1">
                    <div className={cn("text-[11px] font-bold leading-tight mb-1", seg.completed ? "line-through text-zinc-500" : "text-white")}>
                      {seg.title}
                    </div>
                    <div className="flex items-center gap-2 text-[9px] font-bold text-zinc-600">
                      <span className="flex items-center gap-1"><Clock size={10} /> {seg.duration}</span>
                    </div>
                  </div>
                </div>
              ))}
              
              <div className="mt-4 pt-4 border-t border-white/5">
                <div className="flex items-center gap-2 px-1">
                  <input 
                    type="text" 
                    placeholder="Quick segment..." 
                    className="flex-1 bg-transparent text-[11px] border-none focus:outline-none placeholder:text-zinc-700"
                  />
                  <IconButton icon={Send} label="Add" size="sm" color="blue" />
                </div>
              </div>
            </div>
          </Panel>
        </aside>

      </main>

      {/* Bottom Status Bar */}
      <footer className="h-8 bg-indigo-600 flex items-center justify-between px-6 text-[10px] font-bold text-white tracking-widest uppercase">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
            STREAM STATUS: LIVE (1080P/60)
          </div>
          <div className="flex items-center gap-2">
            <Mic size={12} />
            SHURE SM7B: READY
          </div>
          <div className="flex items-center gap-2">
            <Activity size={12} />
            BITRATE: 6500 KBPS
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="opacity-80">CONNECTED: US-EAST-1</span>
          <div className="h-3 w-px bg-white/20" />
          <span className="opacity-80">CPU: 12%</span>
        </div>
      </footer>
    </div>
  );
}
