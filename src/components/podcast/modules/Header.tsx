import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { cn } from "../../../utils/cn";
import { SparkIcon, PanelLeftIcon, PanelRightIcon } from "../Icons";
import { useStudio } from "../StudioContext";

const topNav = [
  { label: "Dashboard", path: "/" },
  { label: "Ideas", path: "/ideas" },
  { label: "Script", path: "/script" },
  { label: "Podcast", path: "/podcast" },
  { label: "Teleprompter", path: "/teleprompter" },
  { label: "Production", path: "/production" },
  { label: "Publish", path: "/publish" },
  { label: "Analytics", path: "/analytics" },
  { label: "Automation", path: "/automation" },
  { label: "More", path: "/pricing" },
];

function formatClock(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}

export function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { 
    recording, 
    startRecording,
    stopRecording, 
    elapsed, 
    leftSidebarOpen, 
    setLeftSidebarOpen, 
    rightSidebarOpen, 
    setRightSidebarOpen 
  } = useStudio();

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-800/90 bg-[#161925] px-5">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => setLeftSidebarOpen(!leftSidebarOpen)}
          className={cn(
            "p-1.5 rounded-md transition-colors",
            leftSidebarOpen ? "text-slate-400 hover:text-white hover:bg-slate-800" : "text-slate-600 hover:text-slate-400"
          )}
          title={leftSidebarOpen ? "Close Sidebar" : "Open Sidebar"}
        >
          <PanelLeftIcon className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-violet-600 text-white shadow-sm shadow-violet-900/50">
            <SparkIcon className="h-4 w-4" />
          </span>
          <p className="text-[17px] font-semibold tracking-tight text-white">ContentFlow <span className="text-[10px] bg-amber-500/20 text-amber-400 border border-amber-500/50 px-1 py-0.5 rounded ml-1">PRO</span></p>
        </div>
      </div>

      <nav className="hidden flex-1 justify-center items-center gap-1.5 lg:flex">
        {topNav.map((item) => (
          <button
            key={item.label}
            type="button"
            onClick={() => navigate(item.path)}
            className={cn(
              "rounded-md px-3 py-1.5 text-[13px] font-medium transition-colors",
              isActive(item.path)
                ? "bg-slate-700/60 text-white shadow-sm"
                : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"
            )}
            title={`Go to ${item.label}`}
          >
            {item.label}
          </button>
        ))}
      </nav>

      <div className="flex items-center gap-4">
        <button type="button" className="text-[13px] font-medium flex items-center gap-2 bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded-full px-3 py-1 hover:bg-amber-500/20 transition-colors">
          <span>👑</span> Upgrade
        </button>
        <div className="h-8 w-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-white shadow-sm">
          D
        </div>
        
        <div className="h-6 w-[1px] bg-slate-700/60 mx-1" />

        <div className="flex items-center gap-3">
          <div className="rounded-md border border-emerald-500/30 bg-[#0F111A] px-3 py-1.5 text-sm font-semibold text-emerald-400 tracking-wider shadow-inner">
            {formatClock(elapsed)}
          </div>
          <motion.button
            type="button"
            onClick={() => recording ? stopRecording() : startRecording()}
            whileTap={{ scale: 0.95 }}
            className={cn(
              "inline-flex items-center gap-2 rounded-md px-4 py-1.5 text-sm font-semibold shadow-sm transition-colors",
              recording ? "bg-rose-600 text-white hover:bg-rose-500 shadow-[0_0_15px_rgba(225,29,72,0.4)]" : "bg-rose-600/20 border border-rose-500/30 text-rose-400 hover:bg-rose-600/30"
            )}
            title={recording ? "Stop recording" : "Start recording"}
          >
            <motion.span
              animate={recording ? { scale: [1, 1.2, 1], opacity: [1, 0.5, 1] } : { scale: 1, opacity: 1 }}
              transition={recording ? { duration: 1.5, repeat: Infinity } : undefined}
              className={cn("h-2 w-2 rounded-full", recording ? "bg-white" : "bg-rose-400")}
            />
            {recording ? "STOP" : "REC"}
          </motion.button>
        </div>

        <button 
          onClick={() => setRightSidebarOpen(!rightSidebarOpen)}
          className={cn(
            "p-1.5 rounded-md transition-colors ml-1",
            rightSidebarOpen ? "text-slate-400 hover:text-white hover:bg-slate-800" : "text-slate-600 hover:text-slate-400"
          )}
          title={rightSidebarOpen ? "Close Sidebar" : "Open Sidebar"}
        >
          <PanelRightIcon className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
}
