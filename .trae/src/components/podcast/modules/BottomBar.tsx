import { cn } from "../../../utils/cn";
import { IconButton } from "../IconButton";
import { MicIcon, PauseIcon, PlayIcon, StopIcon, VideoIcon } from "../Icons";
import { useStudio } from "../StudioContext";

export function BottomBar() {
  const { recording } = useStudio();

  return (
    <div className="flex shrink-0 items-center justify-between rounded-xl border border-slate-700/60 bg-[#161925] px-6 py-4 shadow-xl mb-3">
      <div className="flex flex-col gap-1">
        <p className="text-[13px] font-bold tracking-widest text-slate-200">ADVANCED RECORDING</p>
        <div className="flex items-center gap-2 text-[11px] font-bold tracking-widest text-slate-400">
          STREAM STATUS
          <span className="flex items-center gap-1.5 text-emerald-400">
            <span className={cn("h-2 w-2 rounded-full", recording ? "animate-pulse bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" : "bg-slate-500")} />
            {recording ? "LIVE" : "READY"}
          </span>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 rounded-lg bg-[#0F111A] p-1.5 border border-slate-700/50 shadow-inner">
          <IconButton label="Play recording" className="h-8 w-8 hover:bg-slate-800">
            <PlayIcon className="h-4 w-4 ml-0.5" />
          </IconButton>
          <IconButton label="Pause recording" className="h-8 w-8 hover:bg-slate-800">
            <PauseIcon className="h-4 w-4" />
          </IconButton>
          <IconButton label="Stop recording" className="h-8 w-8 hover:bg-slate-800">
            <StopIcon className="h-4 w-4" />
          </IconButton>
        </div>
        
        <div className="h-6 w-[1px] bg-slate-700/60 mx-2" />
        
        <div className="flex items-center gap-2 rounded-lg bg-[#0F111A] p-1.5 border border-slate-700/50 shadow-inner">
          <IconButton label="Toggle stream mic" className="h-8 w-8 hover:bg-slate-800">
            <MicIcon className="h-4 w-4 text-emerald-400" />
          </IconButton>
          <IconButton label="Toggle stream video" className="h-8 w-8 hover:bg-slate-800">
            <VideoIcon className="h-4 w-4" />
          </IconButton>
          <IconButton label="Settings" className="h-8 w-8 hover:bg-slate-800">
            <span className="text-sm">⚙️</span>
          </IconButton>
        </div>
      </div>
    </div>
  );
}
