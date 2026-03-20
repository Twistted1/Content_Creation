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
    audioVisualData,
    recording,
    recordedBlob,
    saveRecording,
    isUploading,
  } = useStudio();

  return (
    <div className="flex min-h-0 flex-col gap-3 h-full">
      <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-slate-700/60 bg-[#0F111A] shadow-xl">
        {/* Top Floating Controls */}
        <div className="absolute left-6 top-6 z-10 flex items-center gap-2 rounded-xl border border-white/5 bg-black/60 px-2 py-2 shadow-2xl backdrop-blur-xl">
          <button
            type="button"
            onClick={() => setMainView("teleprompter")}
            className={cn(
              "rounded-lg px-4 py-1.5 text-[10px] font-black tracking-[0.2em] transition-all",
              mainView === "teleprompter"
                ? "bg-violet-600 text-white shadow-lg shadow-violet-900/40 translate-y-[-1px]"
                : "bg-transparent text-white/30 hover:text-white"
            )}
          >
            PROMPT
          </button>
          <button
            type="button"
            onClick={() => setMainView("camera")}
            className={cn(
              "rounded-lg px-4 py-1.5 text-[10px] font-black tracking-[0.2em] transition-all",
              mainView === "camera"
                ? "bg-emerald-600 text-white shadow-lg shadow-emerald-900/40 translate-y-[-1px]"
                : "bg-transparent text-white/30 hover:text-white"
            )}
          >
            CAMERA
          </button>
        </div>

        {/* Floating Icons */}
        <div className="absolute right-6 top-6 z-10 flex items-center gap-2 rounded-xl border border-white/5 bg-black/60 px-2 py-2 shadow-2xl backdrop-blur-xl">
          <IconButton label="Toggle Video Input" className="h-8 w-8 border-none bg-transparent hover:bg-white/5" active={mainView === "camera"}>
            <VideoIcon className="h-4 w-4" />
          </IconButton>
          <IconButton label="Toggle Microphone Input" className="h-8 w-8 border-none bg-transparent hover:bg-white/5" active>
            <MicIcon className="h-4 w-4" />
          </IconButton>
          <div className="h-5 w-[1px] bg-white/10 mx-1" />
          <IconButton label="More options" className="h-8 w-8 border-none bg-transparent hover:bg-white/5 text-white/20">
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
              className="h-full overflow-y-auto px-[15%] py-[8%] text-center text-[2.75rem] font-medium leading-[1.6] text-slate-200 tracking-wide scroll-smooth relative"
            >
              {recording && audioVisualData.length > 0 && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
                   <div className="flex items-end gap-2 h-72 opacity-20">
                      {Array.from(audioVisualData).slice(0, 48).map((v, i) => (
                        <motion.div 
                          key={i} 
                          className="w-2.5 bg-gradient-to-t from-violet-600 via-emerald-500 to-emerald-400 rounded-full" 
                          initial={{ height: 0 }}
                          animate={{ height: `${v/2}%` }}
                          transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        />
                      ))}
                   </div>
                </div>
              )}
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
              <div className="absolute left-6 top-1/2 flex -translate-y-1/2 flex-col gap-3 rounded-2xl border border-white/5 bg-black/60 p-2 shadow-2xl backdrop-blur-xl">
                <IconButton label="Start auto scroll" onClick={() => setAutoScroll(true)} className="h-10 w-10 rounded-xl border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-white" active={autoScroll} tooltipPos="right">
                  <PlayIcon className="h-4 w-4 ml-0.5" />
                </IconButton>
                <IconButton label="Pause auto scroll" onClick={() => setAutoScroll(false)} className="h-10 w-10 rounded-xl border-amber-500/30 bg-amber-500/10 text-amber-400 hover:bg-amber-500 hover:text-white" active={!autoScroll} tooltipPos="right">
                  <PauseIcon className="h-4 w-4" />
                </IconButton>
                <IconButton label="Reset to top" onClick={() => teleprompterViewportRef.current?.scrollTo({ top: 0, behavior: "smooth" })} className="h-10 w-10 rounded-xl border-white/5 bg-white/5 text-white/40 hover:bg-white/10 hover:text-white" tooltipPos="right">
                  <StopIcon className="h-4 w-4" />
                </IconButton>
              </div>

              {/* Right Speed Controls */}
              <div className="absolute right-6 top-1/2 flex -translate-y-1/2 flex-col items-center gap-2 rounded-2xl border border-white/5 bg-black/60 p-2 shadow-2xl backdrop-blur-xl">
                <span className="text-[9px] font-black text-white/20 mb-1 tracking-[0.2em] uppercase">SPEED</span>
                <button
                  type="button"
                  onClick={() => setScrollSpeed((prev) => Math.min(90, prev + 5))}
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/5 bg-white/10 text-lg font-light text-white hover:border-violet-500 hover:bg-violet-500 transition-all"
                >
                  +
                </button>
                <span className="my-1 text-sm font-black text-emerald-400 font-mono w-8 text-center">{scrollSpeed}x</span>
                <button
                  type="button"
                  onClick={() => setScrollSpeed((prev) => Math.max(10, prev - 5))}
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/5 bg-white/10 text-xl font-light text-white hover:border-violet-500 hover:bg-violet-500 transition-all"
                >
                  -
                </button>
              </div>
            </>
          )}

          {/* Bottom Feed Label & Transport Save */}
          <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center pointer-events-none">
            <div className="rounded-md border border-slate-800 bg-black/60 px-3 py-1.5 text-[11px] font-bold tracking-widest text-slate-300 backdrop-blur shadow-sm">
              <span className="text-emerald-500 mr-2">●</span>
              {mainView === "camera" ? "LIVE CAMERA FEED" : "TELEPROMPTER LIVE"}
            </div>

            {recordedBlob && !recording && (
              <button
                onClick={saveRecording}
                disabled={isUploading}
                className="pointer-events-auto flex items-center gap-2 rounded-md bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-emerald-900/40 hover:bg-emerald-500 disabled:opacity-50 transition-all active:scale-95"
              >
                {isUploading ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-cloud-upload-alt"></i>}
                SAVE TAKE
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
