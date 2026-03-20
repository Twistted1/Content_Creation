import { cn } from "../../../utils/cn";
import { Panel } from "../Panel";
import { useStudio } from "../StudioContext";
import { type DspPreset } from "../types";

const presets: DspPreset[] = [
  { id: "studio", name: "STUDIO", description: "Balanced & Clear" },
  { id: "radio", name: "RADIO", description: "Deep & Bass Heavy" },
  { id: "crisp", name: "CRISP", description: "High Clarity" },
  { id: "warm", name: "WARM", description: "Soft & Rich" },
  { id: "echo", name: "ECHO", description: "Reverb Effect" },
  { id: "phone", name: "PHONE", description: "Lo-Fi Filter" },
];

import { motion } from "framer-motion";
import { PlusIcon } from "../Icons";
import { IconButton } from "../IconButton";
import { type SoundClip } from "../types";

const soundClips: SoundClip[] = [
  { id: "1", label: "Jingle 1", colorClass: "bg-violet-900/40 text-violet-300 border-violet-500/50" },
  { id: "2", label: "Jingle 2", colorClass: "bg-orange-900/40 text-orange-300 border-orange-500/50" },
  { id: "3", label: "Effect 3", colorClass: "bg-sky-900/40 text-sky-300 border-sky-500/50" },
  { id: "4", label: "Effect 4", colorClass: "bg-slate-800/80 text-slate-300 border-slate-600/50" },
  { id: "5", label: "Effect 5", colorClass: "bg-rose-900/40 text-rose-300 border-rose-500/50" },
  { id: "6", label: "Effect 6", colorClass: "bg-emerald-900/40 text-emerald-300 border-emerald-500/50" },
  { id: "7", label: "Jingle 7", colorClass: "bg-slate-800/80 text-slate-300 border-slate-600/50" },
  { id: "8", label: "Jingle 8", colorClass: "bg-slate-800/80 text-slate-300 border-slate-600/50" },
];

export function SidebarLeft() {
  const { gain, setGain, activePreset, setActivePreset, activeClip, setActiveClip, leftSidebarOpen } = useStudio();

  if (!leftSidebarOpen) return null;

  return (
    <div className="flex h-full flex-col gap-3 min-w-0 w-[15rem]">
      <Panel title="SIGNAL CHAIN" className="min-h-0 flex-1 bg-[#111] border-white/5">
        <div className="flex h-full min-h-0 flex-col gap-3">
          <div className="rounded-xl border border-white/5 bg-black/40 p-4 shadow-inner">
            <div className="mb-4 flex items-center justify-between text-[10px] font-black tracking-[0.2em] text-white/40 uppercase">
              <span>INPUT GAIN</span>
              <span className="text-violet-400">{gain}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={gain}
              onChange={(e) => setGain(Number(e.target.value))}
              className="w-full accent-violet-500 h-1 bg-white/10 rounded-full appearance-none cursor-pointer"
            />
          </div>

          <div className="mt-2 text-[10px] font-black tracking-[0.3em] text-white/20 uppercase">DSP PRESETS</div>
          <div className="min-h-0 flex-1 space-y-2 overflow-y-auto pr-1 pb-2 scrollbar-hide">
            {presets.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => setActivePreset(preset.id)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-xl border px-3 py-3 text-left transition-all group",
                  activePreset === preset.id
                    ? "border-violet-500/50 bg-violet-600/10 shadow-[0_0_20px_rgba(139,92,246,0.15)]"
                    : "border-white/5 bg-white/5 hover:border-white/10 hover:bg-white/10"
                )}
              >
                <div className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-black/40 text-xs transition-colors",
                  activePreset === preset.id ? "text-violet-400" : "text-white/20"
                )}>
                  🎙️
                </div>
                <div className="min-w-0 flex-1">
                  <p className={cn("text-[11px] font-black tracking-widest truncate", activePreset === preset.id ? "text-white" : "text-white/40")}>
                    {preset.name}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </Panel>

      {/* Soundboard */}
      <Panel title="SOUNDBOARD" className="min-h-0 h-[220px] bg-[#111] border-white/5">
        <div className="grid grid-cols-2 gap-2 overflow-y-auto pr-1 pb-1 scrollbar-hide">
          {soundClips.map((clip) => (
            <motion.button
              key={clip.id}
              type="button"
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveClip(clip.id)}
              className={cn(
                "rounded-xl border px-1 py-3.5 text-[10px] font-black tracking-widest transition-all truncate uppercase",
                clip.colorClass.replace('bg-violet-900/40', 'bg-violet-600/10').replace('text-violet-300', 'text-violet-400').replace('bg-orange-900/40', 'bg-orange-600/10').replace('text-orange-300', 'text-orange-400').replace('bg-sky-900/40', 'bg-sky-600/10').replace('text-sky-300', 'text-sky-400').replace('bg-rose-900/40', 'bg-rose-600/10').replace('text-rose-300', 'text-rose-400').replace('bg-emerald-900/40', 'bg-emerald-600/10').replace('text-emerald-300', 'text-emerald-400').replace('bg-slate-800/80', 'bg-white/5').replace('text-slate-300', 'text-white/40'),
                activeClip === clip.id ? "ring-2 ring-white/20 scale-[1.02] brightness-125" : "hover:brightness-110"
              )}
            >
              {clip.label}
            </motion.button>
          ))}
        </div>
      </Panel>
    </div>
  );
}
