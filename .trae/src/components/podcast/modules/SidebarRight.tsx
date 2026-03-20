import { AnimatePresence, motion } from "framer-motion";
import { cn } from "../../../utils/cn";
import { IconButton } from "../IconButton";
import { PlusIcon, SearchIcon } from "../Icons";
import { Panel } from "../Panel";
import { useStudio } from "../StudioContext";

export function SidebarRight() {
  const {
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
  } = useStudio();

  const filteredMedia = [
    "Episode intro.wav",
    "Main thumbnail.png",
    "Guest bio.txt",
    "Sponsor read.doc",
    "Transcript.vtt",
  ].filter((item) => item.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="flex h-full w-[17rem] flex-col gap-3 min-w-0">
      {/* Teleprompter Controls */}
      <Panel
        title="TELEPROMPTER SCRIPT"
        className="min-h-0 h-[32%] bg-[#161925]"
        actions={
          <div className="flex items-center gap-1.5 bg-slate-800/50 rounded-lg p-0.5 border border-slate-700/50">
            <span className="text-[10px] font-bold text-slate-400 px-1 tracking-widest">A</span>
            <span className="text-[10px] font-bold text-slate-400 px-1 tracking-widest">Aa</span>
          </div>
        }
      >
        <div className="flex h-full min-h-0 flex-col gap-3">
          <div className="flex flex-col gap-2 rounded-lg border border-slate-700/50 bg-[#0F111A] p-2">
            <div className="flex items-center justify-between text-[11px] font-bold tracking-widest text-slate-400 mb-1">
              <span>SCROLL SPEED</span>
              <span className="text-emerald-400">{scrollSpeed}</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min={10}
                max={90}
                value={scrollSpeed}
                onChange={(e) => setScrollSpeed(Number(e.target.value))}
                className="flex-1 accent-emerald-500 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                title="Control teleprompter speed"
              />
            </div>
            <button
              type="button"
              onClick={() => setAutoScroll((prev) => !prev)}
              className={cn(
                "mt-2 w-full rounded-md border py-2 text-[12px] font-bold tracking-widest transition-all uppercase",
                autoScroll
                  ? "border-amber-500/50 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20"
                  : "border-emerald-500/50 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]"
              )}
            >
              {autoScroll ? "Pause Scroll" : "Start Scroll"}
            </button>
          </div>
          <textarea
            value={teleprompterText}
            onChange={(e) => setTeleprompterText(e.target.value)}
            placeholder="Paste script here or select from library..."
            className="min-h-0 flex-1 resize-none rounded-lg border border-slate-700/50 bg-[#0F111A] p-4 text-[13px] leading-relaxed text-slate-300 outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 transition-all shadow-inner placeholder-slate-600 scrollbar-thin scrollbar-thumb-slate-700"
          />
        </div>
      </Panel>

      {/* Media Library */}
      <Panel title="MEDIA LIBRARY" className="min-h-0 flex-1 bg-[#161925]" actions={<IconButton label="More options" tooltipPos="left"><span className="font-bold">⋯</span></IconButton>}>
        <div className="flex h-full min-h-0 flex-col gap-3">
          <label className="flex items-center gap-2 rounded-lg border border-slate-700/60 bg-[#0F111A] px-3 py-2 shadow-inner transition-colors focus-within:border-violet-500/50 focus-within:ring-1 focus-within:ring-violet-500/50">
            <SearchIcon className="h-4 w-4 text-slate-500" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search library..."
              className="w-full bg-transparent text-[12px] font-medium text-slate-200 outline-none placeholder-slate-600"
            />
          </label>
          <div className="mt-1 grid grid-cols-3 gap-2 pb-2 text-center text-[10px] font-bold tracking-wide text-slate-400">
            <div className="flex flex-col items-center gap-1.5 rounded-lg border border-violet-500/30 bg-violet-500/10 py-3 text-violet-300 hover:bg-violet-500/20 transition cursor-pointer">
              <span className="text-lg">📁</span>
              All
            </div>
            <div className="flex flex-col items-center gap-1.5 rounded-lg border border-slate-700/50 bg-[#1A1D2A] py-3 hover:bg-slate-800 transition cursor-pointer">
              <span className="text-lg">🎵</span>
              Music
            </div>
            <div className="flex flex-col items-center gap-1.5 rounded-lg border border-slate-700/50 bg-[#1A1D2A] py-3 hover:bg-slate-800 transition cursor-pointer">
              <span className="text-lg">🎬</span>
              Video
            </div>
            <div className="flex flex-col items-center gap-1.5 rounded-lg border border-slate-700/50 bg-[#1A1D2A] py-3 hover:bg-slate-800 transition cursor-pointer">
              <span className="text-lg">🖼️</span>
              Images
            </div>
            <div className="flex flex-col items-center gap-1.5 rounded-lg border border-slate-700/50 bg-[#1A1D2A] py-3 hover:bg-slate-800 transition cursor-pointer">
              <span className="text-lg">📝</span>
              Docs
            </div>
            <div className="flex flex-col items-center gap-1.5 rounded-lg border border-slate-700/50 bg-[#1A1D2A] py-3 hover:bg-slate-800 transition cursor-pointer">
              <span className="text-lg">⬇️</span>
              Downloads
            </div>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto pr-1 pb-1 scrollbar-thin scrollbar-thumb-slate-700">
            {filteredMedia.map((item) => (
              <button
                key={item}
                type="button"
                className="mb-1.5 flex w-full items-center justify-between rounded-lg border border-transparent bg-[#1A1D2A] px-3 py-2.5 text-left text-[12px] text-slate-300 hover:border-slate-700/50 hover:bg-[#1E2230] transition-colors"
                title={`Load ${item}`}
              >
                <span className="truncate font-medium">{item}</span>
              </button>
            ))}
          </div>
        </div>
      </Panel>

      {/* Show Notes / Segments */}
      <Panel title="SHOW NOTES / PLANNER" className="min-h-0 h-[30%] bg-[#161925]" actions={<div className="flex items-center gap-1"><IconButton label="Add Note" tooltipPos="left"><PlusIcon className="h-3 w-3" /></IconButton><IconButton label="Minimize" tooltipPos="left"><span className="text-[10px] font-bold">—</span></IconButton></div>}>
        <div className="flex h-full min-h-0 flex-col gap-3">
          <div className="min-h-0 flex-1 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-700">
            <AnimatePresence initial={false}>
              {segments.map((segment) => (
                <motion.button
                  key={segment.id}
                  type="button"
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  onClick={() => toggleSegment(segment.id)}
                  className={cn(
                    "mb-2 flex w-full items-center gap-3 rounded-lg border px-3 py-2.5 text-left text-[12px] transition-all",
                    segment.done
                      ? "border-emerald-500/20 bg-emerald-500/5 text-emerald-300/60 line-through"
                      : "border-slate-700/40 bg-[#1A1D2A] text-slate-200 hover:border-violet-500/40 hover:bg-[#1E2230]"
                  )}
                  title="Mark complete"
                >
                  <span
                    className={cn(
                      "flex h-4 w-4 shrink-0 items-center justify-center rounded-[4px] border border-slate-600 text-[10px] font-bold shadow-sm transition-colors",
                      segment.done ? "border-emerald-500/50 bg-emerald-500/20 text-emerald-400" : "bg-[#0F111A]"
                    )}
                  >
                    {segment.done ? "✓" : ""}
                  </span>
                  <span className="truncate font-medium tracking-wide">{segment.title}</span>
                </motion.button>
              ))}
            </AnimatePresence>
          </div>
          <div className="mt-auto flex items-center gap-2">
            <input
              type="text"
              placeholder="Type a segment..."
              className="flex-1 rounded-lg border border-slate-700/60 bg-[#0F111A] px-3 py-2 text-[12px] font-medium outline-none placeholder-slate-600 focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 shadow-inner"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  addSegment(e.currentTarget.value);
                  e.currentTarget.value = "";
                }
              }}
            />
            <button type="button" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-600 text-white hover:bg-violet-500 transition shadow-sm shadow-violet-900/50">
              <span className="text-[14px]">▶</span>
            </button>
          </div>
        </div>
      </Panel>
    </div>
  );
}
