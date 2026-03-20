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
    rightSidebarOpen,
  } = useStudio();

  if (!rightSidebarOpen) return null;

  const filteredMedia = [
    "Episode intro.wav",
    "Main thumbnail.png",
    "Guest bio.txt",
    "Sponsor read.doc",
    "Transcript.vtt",
  ].filter((item) => item.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="flex h-full w-[17rem] flex-col gap-3 min-w-0">
      <Panel
        title="TELEPROMPTER SCRIPT"
        className="min-h-0 h-[35%] bg-[#111] border-white/5"
        actions={
          <div className="flex items-center gap-1.5 bg-white/5 rounded-lg p-0.5 border border-white/10">
            <span className="text-[10px] font-black text-white/30 px-1 tracking-widest">AA</span>
          </div>
        }
      >
        <div className="flex h-full min-h-0 flex-col gap-3">
          <div className="flex flex-col gap-2 rounded-xl border border-white/5 bg-black/40 p-3">
            <div className="flex items-center justify-between text-[10px] font-black tracking-[0.2em] text-white/40 mb-1">
              <span>SPEED</span>
              <span className="text-emerald-400">{scrollSpeed}x</span>
            </div>
            <input
              type="range"
              min={10}
              max={90}
              value={scrollSpeed}
              onChange={(e) => setScrollSpeed(Number(e.target.value))}
              className="flex-1 accent-emerald-500 h-1 bg-white/10 rounded-full appearance-none cursor-pointer"
            />
            <button
              type="button"
              onClick={() => setAutoScroll((prev) => !prev)}
              className={cn(
                "mt-3 w-full rounded-xl border py-2.5 text-[10px] font-black tracking-[0.2em] transition-all uppercase shadow-lg",
                autoScroll
                  ? "border-amber-500/50 bg-amber-500/10 text-amber-400 active:scale-95"
                  : "border-emerald-500/50 bg-emerald-500/10 text-emerald-400 active:scale-95 shadow-emerald-900/10"
              )}
            >
              {autoScroll ? "PAUSE ENGINE" : "ENGAGE SCROLL"}
            </button>
          </div>
          <textarea
            value={teleprompterText}
            onChange={(e) => setTeleprompterText(e.target.value)}
            placeholder="TYPE OR PASTE SCRIPT..."
            className="min-h-0 flex-1 resize-none rounded-xl border border-white/5 bg-black/40 p-4 text-[13px] font-medium leading-relaxed text-white/80 outline-none focus:border-violet-500/50 transition-all placeholder-white/10 scrollbar-hide"
          />
        </div>
      </Panel>

      {/* Media Library */}
      <Panel title="MEDIA ASSETS" className="min-h-0 flex-1 bg-[#111] border-white/5">
        <div className="flex h-full min-h-0 flex-col gap-3">
          <label className="flex items-center gap-3 rounded-xl border border-white/5 bg-black/40 px-4 py-3 focus-within:border-violet-500/50 transition-all">
            <SearchIcon className="h-4 w-4 text-white/20" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="SEARCH ASSETS..."
              className="w-full bg-transparent text-[11px] font-black tracking-widest text-white outline-none placeholder-white/10"
            />
          </label>
          <div className="mt-1 grid grid-cols-3 gap-2 pb-2 text-center text-[9px] font-black tracking-widest text-white/30 uppercase">
            <div className="flex flex-col items-center gap-2 rounded-xl border border-violet-500/20 bg-violet-600/10 py-3 text-violet-400 hover:bg-violet-600/20 transition cursor-pointer">
              <span className="text-base text-violet-500">📁</span>
              ALL
            </div>
            {[
              { icon: '🎵', l: 'MUSIC' },
              { icon: '🎬', l: 'VIDEO' },
              { icon: '🖼️', l: 'GFX' },
              { icon: '📝', l: 'SCRIPTS' },
              { icon: '⬇️', l: 'SAVED' },
            ].map((cat) => (
              <div key={cat.l} className="flex flex-col items-center gap-2 rounded-xl border border-white/5 bg-white/5 py-3 hover:bg-white/10 transition cursor-pointer">
                <span className="text-base">{cat.icon}</span>
                {cat.l}
              </div>
            ))}
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto pr-1 scrollbar-hide">
            {filteredMedia.map((item) => (
              <button
                key={item}
                type="button"
                className="mb-2 flex w-full items-center justify-between rounded-xl border border-transparent bg-white/5 px-4 py-3 text-left text-[11px] font-bold text-white/70 hover:border-white/10 hover:bg-white/10 transition-all group"
              >
                <span className="truncate tracking-wide group-hover:text-white transition-colors">{item.toUpperCase()}</span>
                <i className="fas fa-chevron-right text-[8px] opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0"></i>
              </button>
            ))}
          </div>
        </div>
      </Panel>

      {/* Show Notes / Segments */}
      <Panel title="SESSION PLANNER" className="min-h-0 h-[30%] bg-[#111] border-white/5">
        <div className="flex h-full min-h-0 flex-col gap-3">
          <div className="min-h-0 flex-1 overflow-y-auto pr-1 scrollbar-hide">
            <AnimatePresence initial={false}>
              {segments.map((segment) => (
                <motion.button
                  key={segment.id}
                  type="button"
                  layout
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  onClick={() => toggleSegment(segment.id)}
                  className={cn(
                    "mb-2 flex w-full items-center gap-4 rounded-xl border px-4 py-3.5 text-left text-[11px] font-bold transition-all",
                    segment.done
                      ? "border-emerald-500/10 bg-emerald-600/5 text-emerald-500/40 line-through"
                      : "border-white/5 bg-white/5 text-white/80 hover:border-violet-500/30 hover:bg-white/10"
                  )}
                >
                  <div
                    className={cn(
                      "flex h-4 w-4 shrink-0 items-center justify-center rounded-md border border-white/10 text-[10px] font-black transition-all",
                      segment.done ? "border-emerald-500/50 bg-emerald-500 text-black shadow-[0_0_15px_rgba(16,185,129,0.4)]" : "bg-black/40"
                    )}
                  >
                    {segment.done ? "✓" : ""}
                  </div>
                  <span className="truncate tracking-wide">{segment.title.toUpperCase()}</span>
                </motion.button>
              ))}
            </AnimatePresence>
          </div>
          <div className="mt-auto flex items-center gap-2">
            <input
              type="text"
              placeholder="ADD SEGMENT..."
              className="flex-1 rounded-xl border border-white/5 bg-black/40 px-4 py-3 text-[10px] font-black tracking-widest outline-none placeholder-white/10 focus:border-violet-500/50 transition-all"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  addSegment(e.currentTarget.value);
                  e.currentTarget.value = "";
                }
              }}
            />
            <button type="button" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-600 text-white hover:bg-violet-500 transition shadow-lg shadow-violet-900/40 active:scale-90">
              <PlusIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </Panel>
    </div>
  );
}
