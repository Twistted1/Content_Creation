import { cn } from "../../../utils/cn";
import { IconButton } from "../IconButton";
import { MicIcon, PauseIcon, PlayIcon, StopIcon, VideoIcon } from "../Icons";
import { useStudio } from "../StudioContext";

export function MainScreen() {
  const {
    mainView,
    setMainView,
    teleprompterText,
    autoScroll,
    setAutoScroll,
    scrollSpeed,
    setScrollSpeed,
    teleprompterViewportRef,
  } = useStudio();

  return (
    <div className="flex min-h-0 flex-col gap-3 h-full">
      <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-slate-700/60 bg-[#0F111A] shadow-xl">
        {/* Top Floating Controls */}
        <div className="absolute left-4 top-4 z-10 flex items-center gap-2 rounded-lg border border-slate-700/50 bg-[#161925]/90 px-2 py-1.5 shadow-lg backdrop-blur">
          <button
            type="button"
            onClick={() => setMainView("teleprompter")}
            className={cn(
              "rounded-md px-3 py-1 text-[11px] font-bold tracking-wider transition-colors",
              mainView === "teleprompter"
                ? "bg-violet-600/90 text-white shadow"
                : "bg-transparent text-slate-400 hover:text-slate-200"
            )}
            title="Show teleprompter on the main screen"
          >
            PROMPT
          </button>
          <button
            type="button"
            onClick={() => setMainView("camera")}
            className={cn(
              "rounded-md px-3 py-1 text-[11px] font-bold tracking-wider transition-colors",
              mainView === "camera"
                ? "bg-emerald-600/90 text-white shadow"
                : "bg-transparent text-slate-400 hover:text-slate-200"
            )}
            title="Show camera on the main screen"
          >
            CAMERA
          </button>
        </div>

        {/* Floating Icons */}
        <div className="absolute right-4 top-4 z-10 flex items-center gap-1.5 rounded-lg border border-slate-700/50 bg-[#161925]/90 px-1 py-1 shadow-lg backdrop-blur">
          <IconButton label="Toggle Video Input" className="h-7 w-7 border-none bg-transparent hover:bg-slate-700/50" active={mainView === "camera"}>
            <VideoIcon className="h-4 w-4" />
          </IconButton>
          <IconButton label="Toggle Microphone Input" className="h-7 w-7 border-none bg-transparent hover:bg-slate-700/50" active>
            <MicIcon className="h-4 w-4" />
          </IconButton>
          <div className="h-4 w-[1px] bg-slate-700 mx-1" />
          <IconButton label="More options" className="h-7 w-7 border-none bg-transparent hover:bg-slate-700/50 text-slate-400">
            <span className="font-bold">⋯</span>
          </IconButton>
        </div>

        {/* Content Area */}
        <div className="relative h-full w-full bg-[#05060A]">
          {mainView === "camera" ? (
            <img
              src="https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=1600&q=80"
              alt="Podcast host in studio"
              className="h-full w-full object-cover opacity-90 transition-opacity hover:opacity-100"
            />
          ) : (
            <div
              ref={teleprompterViewportRef}
              className="h-full overflow-y-auto px-[15%] py-[8%] text-center text-[2.75rem] font-medium leading-[1.6] text-slate-200 tracking-wide scroll-smooth"
            >
              {teleprompterText.trim() ? (
                teleprompterText.split("\n").map((line, index) => (
                  <p key={`${line}-${index}`} className="mb-6 opacity-90 transition-opacity hover:opacity-100">
                    {line || "\u00a0"}
                  </p>
                ))
              ) : (
                <p className="mt-20 text-xl text-slate-600">Paste script in Teleprompter Controls to display here.</p>
              )}
            </div>
          )}

          {/* Teleprompter Hover Controls */}
          {mainView === "teleprompter" && (
            <>
              {/* Left Play/Pause Controls */}
              <div className="absolute left-4 top-1/2 flex -translate-y-1/2 flex-col gap-2 rounded-xl border border-slate-700/60 bg-[#161925]/90 p-2 shadow-2xl backdrop-blur">
                <IconButton label="Start auto scroll" onClick={() => setAutoScroll(true)} className="h-9 w-9 rounded-lg border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:border-emerald-500 hover:bg-emerald-500 hover:text-white" active={autoScroll} tooltipPos="right">
                  <PlayIcon className="h-4 w-4 ml-0.5" />
                </IconButton>
                <IconButton label="Pause auto scroll" onClick={() => setAutoScroll(false)} className="h-9 w-9 rounded-lg border-amber-500/30 bg-amber-500/10 text-amber-400 hover:border-amber-500 hover:bg-amber-500 hover:text-white" active={!autoScroll} tooltipPos="right">
                  <PauseIcon className="h-4 w-4" />
                </IconButton>
                <IconButton label="Reset to top" onClick={() => teleprompterViewportRef.current?.scrollTo({ top: 0, behavior: "smooth" })} className="h-9 w-9 rounded-lg border-slate-600/50 bg-slate-800 text-slate-300 hover:border-slate-500 hover:bg-slate-700 hover:text-white" tooltipPos="right">
                  <StopIcon className="h-4 w-4" />
                </IconButton>
              </div>

              {/* Right Speed Controls */}
              <div className="absolute right-4 top-1/2 flex -translate-y-1/2 flex-col items-center gap-1.5 rounded-xl border border-slate-700/60 bg-[#161925]/90 p-2 shadow-2xl backdrop-blur">
                <span className="text-[10px] font-bold text-slate-400 mb-1 tracking-widest">SPEED</span>
                <button
                  type="button"
                  onClick={() => setScrollSpeed((prev) => Math.min(90, prev + 5))}
                  className="flex h-8 w-8 items-center justify-center rounded border border-slate-600/50 bg-slate-800 text-lg font-light text-slate-200 hover:border-violet-500 hover:bg-violet-500 hover:text-white transition-colors"
                  title="Increase scroll speed"
                >
                  +
                </button>
                <span className="my-1 text-[13px] font-bold text-emerald-400 font-mono w-6 text-center">{scrollSpeed}</span>
                <button
                  type="button"
                  onClick={() => setScrollSpeed((prev) => Math.max(10, prev - 5))}
                  className="flex h-8 w-8 items-center justify-center rounded border border-slate-600/50 bg-slate-800 text-lg font-light text-slate-200 hover:border-violet-500 hover:bg-violet-500 hover:text-white transition-colors"
                  title="Decrease scroll speed"
                >
                  -
                </button>
              </div>
            </>
          )}

          {/* Bottom Feed Label */}
          <div className="absolute bottom-4 left-4 rounded-md border border-slate-800 bg-black/60 px-3 py-1.5 text-[11px] font-bold tracking-widest text-slate-300 backdrop-blur shadow-sm">
            <span className="text-emerald-500 mr-2">●</span>
            {mainView === "camera" ? "LIVE CAMERA FEED" : "TELEPROMPTER LIVE"}
          </div>
        </div>
      </div>
    </div>
  );
}
