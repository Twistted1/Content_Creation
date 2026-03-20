import { IconButton } from "../IconButton";
import { PauseIcon, PlayIcon, StopIcon } from "../Icons";
import { Panel } from "../Panel";
import { useStudio } from "../StudioContext";

export function AudioMixer() {
  const { channels, updateChannelGain, toggleChannel } = useStudio();

  return (
    <Panel
      title="AUDIO MIXING CONSOLE"
      className="min-h-0 bg-[#111] border-white/5 shadow-2xl"
      actions={
        <div className="flex items-center gap-2">
          {[
            { label: "PLAY", icon: <PlayIcon className="h-3 w-3" /> },
            { label: "PAUSE", icon: <PauseIcon className="h-3 w-3" /> },
            { label: "STOP", icon: <StopIcon className="h-3 w-3" /> },
          ].map((btn) => (
            <IconButton key={btn.label} label={btn.label} tooltipPos="bottom" className="h-7 w-7 border-white/5 bg-white/5 hover:bg-white/10 transition-colors">
              {btn.icon}
            </IconButton>
          ))}
        </div>
      }
    >
      <div className="flex h-full w-full justify-between gap-2 overflow-x-auto pr-2 scrollbar-hide">
        {channels.map((channel) => (
          <div
            key={channel.id}
            className="flex min-w-[58px] flex-col items-center justify-between rounded-xl border border-white/5 bg-black/40 py-3 px-1.5 shadow-inner group"
          >
            <div className="flex flex-col items-center">
              <span className="text-[10px] font-black text-white/20 tracking-[0.2em] group-hover:text-white/40 transition-colors">{channel.id.toString().padStart(2, '0')}</span>
              <span className="mt-1 max-w-[48px] truncate text-[9px] font-black tracking-widest text-white/40 uppercase" title={channel.name}>
                {channel.name}
              </span>
            </div>

            <div className="flex flex-col items-center gap-2 mt-3 w-full px-1">
              <button
                type="button"
                onClick={() => toggleChannel(channel.id, "solo")}
                className={`w-full py-1 rounded-md text-[9px] font-black tracking-widest transition-all ${
                  channel.solo ? "bg-emerald-500 text-black shadow-[0_0_15px_rgba(16,185,129,0.4)]" : "bg-white/5 text-white/20 hover:text-white"
                }`}
              >
                SOLO
              </button>
              <button
                type="button"
                onClick={() => toggleChannel(channel.id, "muted")}
                className={`w-full py-1 rounded-md text-[9px] font-black tracking-widest transition-all ${
                  channel.muted ? "bg-rose-500 text-black shadow-[0_0_15px_rgba(225,29,72,0.4)]" : "bg-white/5 text-white/20 hover:text-white"
                }`}
              >
                MUTE
              </button>
            </div>

            <div className="relative my-4 flex h-[80px] w-8 justify-center rounded-xl bg-black/60 shadow-inner border border-white/5 overflow-hidden">
              <input
                type="range"
                min={0}
                max={100}
                value={channel.gain}
                onChange={(e) => updateChannelGain(channel.id, Number(e.target.value))}
                className="absolute left-1/2 top-1/2 h-[80px] w-[6px] -translate-x-1/2 -translate-y-1/2 appearance-none rounded-full bg-white/10 outline-none [writing-mode:vertical-lr]"
                style={{ WebkitAppearance: "slider-vertical" }}
              />
              <div className="absolute left-0 top-0 h-full w-full flex flex-col justify-between py-2 px-1 pointer-events-none opacity-10">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="h-[1px] w-full bg-white rounded-full" />
                ))}
              </div>
            </div>

            <span className="text-[10px] font-mono font-black text-white/20">{channel.gain.toString().padStart(3, '0')}</span>
          </div>
        ))}

        <div className="w-[1px] bg-white/10 h-full mx-1" />

        <div className="flex min-w-[70px] flex-col items-center justify-between rounded-xl border border-violet-500/30 bg-violet-600/5 py-4 px-2 shadow-2xl ring-1 ring-violet-500/20">
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-black text-violet-400 tracking-[0.2em] mb-1">MASTER</span>
            <span className="text-[8px] font-black text-white/20 uppercase tracking-[0.2em]">OUTPUT</span>
          </div>
          
          <div className="relative my-4 flex h-[100px] w-12 items-end justify-center gap-1.5 rounded-xl bg-black/80 px-2 py-1.5 shadow-2xl border border-white/10">
             {/* Master Meters */}
             <div className="flex-1 rounded-sm bg-gradient-to-t from-emerald-500 via-amber-500 to-rose-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]" style={{ height: "82%" }} />
             <div className="flex-1 rounded-sm bg-gradient-to-t from-emerald-500 via-amber-500 to-rose-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]" style={{ height: "78%" }} />
          </div>
          <span className="text-[10px] font-mono font-black text-violet-400">0.0dB</span>
        </div>
      </div>
    </Panel>
  );
}
