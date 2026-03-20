import { IconButton } from "../IconButton";
import { PauseIcon, PlayIcon, StopIcon } from "../Icons";
import { Panel } from "../Panel";
import { useStudio } from "../StudioContext";

export function AudioMixer() {
  const { channels, updateChannelGain, toggleChannel } = useStudio();

  return (
    <Panel
      title="PROFESSIONAL AUDIO MIXER"
      className="min-h-0 shadow-lg shadow-black/40 bg-[#1A1D2A] border-slate-800/80"
      actions={
        <>
          <IconButton label="Play Master" tooltipPos="bottom" className="h-6 w-6 border-slate-700 bg-slate-800 hover:bg-slate-700">
            <PlayIcon className="h-3 w-3" />
          </IconButton>
          <IconButton label="Pause Master" tooltipPos="bottom" className="h-6 w-6 border-slate-700 bg-slate-800 hover:bg-slate-700">
            <PauseIcon className="h-3 w-3" />
          </IconButton>
          <IconButton label="Stop Master" tooltipPos="bottom" className="h-6 w-6 border-slate-700 bg-slate-800 hover:bg-slate-700">
            <StopIcon className="h-3 w-3" />
          </IconButton>
        </>
      }
    >
      <div className="flex h-full w-full justify-between gap-1 overflow-x-auto pr-1">
        {channels.map((channel) => (
          <div
            key={channel.id}
            className="flex min-w-[50px] flex-col items-center justify-between rounded-lg border border-slate-800/80 bg-[#12151F] py-2 px-1 shadow-inner"
          >
            <div className="flex flex-col items-center">
              <span className="text-[10px] font-bold text-slate-500 tracking-widest">{channel.id}</span>
              <span className="mt-1 max-w-[40px] truncate text-[9px] font-medium text-slate-400" title={channel.name}>
                {channel.name}
              </span>
            </div>

            <div className="flex flex-col items-center gap-1.5 mt-2">
              <button
                type="button"
                onClick={() => toggleChannel(channel.id, "solo")}
                className={`h-[18px] w-[34px] rounded text-[9px] font-bold tracking-wider transition-colors ${
                  channel.solo ? "bg-emerald-500 text-[#0F111A]" : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                }`}
                title="Solo channel"
              >
                S
              </button>
              <button
                type="button"
                onClick={() => toggleChannel(channel.id, "muted")}
                className={`h-[18px] w-[34px] rounded text-[9px] font-bold tracking-wider transition-colors ${
                  channel.muted ? "bg-rose-500 text-[#0F111A]" : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                }`}
                title="Mute channel"
              >
                M
              </button>
            </div>

            <div className="relative my-2 flex h-[65px] w-6 justify-center rounded-sm bg-black/60 shadow-inner">
              <input
                type="range"
                min={0}
                max={100}
                value={channel.gain}
                onChange={(e) => updateChannelGain(channel.id, Number(e.target.value))}
                className="absolute left-1/2 top-1/2 h-[65px] w-[6px] -translate-x-1/2 -translate-y-1/2 appearance-none rounded-full bg-slate-800 outline-none [writing-mode:vertical-lr]"
                style={{
                  WebkitAppearance: "slider-vertical",
                }}
                title={`${channel.name} gain: ${channel.gain}%`}
              />
              {/* Fake meter lines */}
              <div className="absolute left-0 top-0 h-full w-0.5 flex flex-col justify-between py-1 opacity-40">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-[1px] w-1 bg-white" />
                ))}
              </div>
            </div>

            <span className="text-[9px] font-mono text-slate-500">{channel.gain}</span>
          </div>
        ))}

        <div className="w-[1px] bg-slate-800 mx-1" />

        <div className="flex min-w-[50px] flex-col items-center justify-between rounded-lg border border-slate-800/80 bg-[#12151F] py-2 px-1 shadow-inner ring-1 ring-violet-500/20">
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-bold text-violet-400 tracking-widest">MASTER</span>
            <span className="mt-1 text-[9px] font-medium text-slate-400">Out</span>
          </div>
          <div className="flex flex-col items-center gap-1.5 mt-2">
            <div className="h-[18px] w-[34px] rounded bg-slate-800/50" />
            <div className="h-[18px] w-[34px] rounded bg-slate-800/50" />
          </div>
          <div className="relative my-2 flex h-[65px] w-8 justify-center rounded-sm bg-black/80 shadow-inner">
             {/* Fake Master Meters */}
             <div className="absolute bottom-1 w-2.5 rounded-sm bg-gradient-to-t from-emerald-500 via-amber-500 to-rose-500" style={{ height: "70%" }} />
             <div className="absolute bottom-1 w-2.5 rounded-sm bg-gradient-to-t from-emerald-500 via-amber-500 to-rose-500 ml-4" style={{ height: "65%" }} />
          </div>
          <span className="text-[9px] font-mono text-slate-500">0dB</span>
        </div>
      </div>
    </Panel>
  );
}
