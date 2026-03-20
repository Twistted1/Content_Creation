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
  const { gain, setGain, activePreset, setActivePreset, activeClip, setActiveClip } = useStudio();

  return (
    <div className="flex h-full flex-col gap-3 min-w-0 w-[15rem]">
      <Panel title="SIGNAL CHAIN" className="min-h-0 flex-1">
        <div className="flex h-full min-h-0 flex-col gap-3">
          <div className="rounded-md border border-slate-700/60 bg-[#161925] p-4 shadow-inner">
            <div className="mb-4 flex items-center justify-between text-[11px] font-bold tracking-wider text-slate-400">
              <span>INPUT GAIN</span>
              <span className="text-violet-400">{gain}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={gain}
              onChange={(e) => setGain(Number(e.target.value))}
              className="w-full accent-violet-500 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div className="mt-2 text-[10px] font-bold tracking-widest text-slate-500 uppercase">DSP Presets</div>
          <div className="min-h-0 flex-1 space-y-2 overflow-y-auto pr-1 pb-2 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
            {presets.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => setActivePreset(preset.id)}
                className={cn(
                  "flex w-full items-center gap-2 rounded-lg border px-2 py-2 text-left transition-all",
                  activePreset === preset.id
                    ? "border-violet-500/50 bg-violet-900/20 shadow-[0_0_15px_rgba(139,92,246,0.1)]"
                    : "border-slate-800 bg-[#1A1D2A] hover:border-slate-600 hover:bg-[#1E2230]"
                )}
                title={`Activate ${preset.name} profile`}
              >
                <div className={cn(
                  "flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-800 text-[10px]",
                  activePreset === preset.id ? "text-violet-400" : "text-slate-400"
                )}>
                  🎙️
                </div>
                <div className="min-w-0 flex-1">
                  <p className={cn("text-[11px] font-bold tracking-wide truncate", activePreset === preset.id ? "text-violet-200" : "text-slate-200")}>
                    {preset.name}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </Panel>

      {/* Soundboard */}
      <Panel title="SOUNDBOARD" className="min-h-0 h-[220px] bg-[#161925]" actions={<IconButton label="Add sound" tooltipPos="right"><PlusIcon className="h-3 w-3" /></IconButton>}>
        <div className="grid grid-cols-2 gap-2 overflow-y-auto pr-1 pb-1 scrollbar-thin scrollbar-thumb-slate-700">
          {soundClips.map((clip) => (
            <motion.button
              key={clip.id}
              type="button"
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveClip(clip.id)}
              className={cn(
                "rounded-lg border px-1 py-2.5 text-[10px] font-bold tracking-wide transition-all truncate",
                clip.colorClass,
                activeClip === clip.id ? "ring-2 ring-white/50 brightness-125" : "hover:brightness-110"
              )}
              title={`Play ${clip.label}`}
            >
              {clip.label}
            </motion.button>
          ))}
        </div>
      </Panel>
    </div>
  );
}
