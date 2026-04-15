import React from 'react';

interface TeleprompterStageProps {
  fontSize: number;
  opacity: number;
  mirror: boolean;
  isVoiceMode: boolean;
  prompterText: string;
  renderPrompterText: () => React.ReactNode;
  textRef: React.RefObject<HTMLDivElement>;
  mode: 'avatar' | 'webcam';
  avatarImage: string | null;
  videoRef: React.RefObject<HTMLVideoElement>;
}

export function TeleprompterStage({
  fontSize,
  opacity,
  mirror,
  isVoiceMode,
  prompterText,
  renderPrompterText,
  textRef,
  mode,
  avatarImage,
  videoRef
}: TeleprompterStageProps) {
  return (
    <div className="relative flex-grow bg-black flex items-center justify-center overflow-hidden">
      {/* Background Layer (Webcam or Avatar) */}
      <div className="absolute inset-0 z-0">
        {mode === 'webcam' ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className={`w-full h-full object-cover transition-transform duration-300 ${mirror ? 'scale-x-[-1]' : ''}`}
          />
        ) : (
          <div className="w-full h-full bg-[#0a0a1a] flex items-center justify-center relative">
            {avatarImage ? (
              <img src={avatarImage} alt="Avatar" className="w-full h-full object-cover opacity-60" />
            ) : (
              <div className="text-center">
                <div className="w-24 h-24 bg-[#0a0a1a] rounded-3xl border border-gray-800 flex items-center justify-center mb-6 mx-auto shadow-2xl backdrop-blur-sm shadow-[#1a1a3a]">
                  <i className="fas fa-sparkles text-3xl text-gray-400 opacity-60"></i>
                </div>
                <h3 className="text-[28px] font-bold text-white mb-3 tracking-tight">Welcome to the ContentFlow Teleprompter Suite.</h3>
                <p className="text-[#64748b] text-[15px]">Select a script to begin your session...</p>
                <div className="mt-8 flex gap-3 justify-center">
                  <button className="px-5 py-2.5 bg-[#0f1219] rounded-xl border border-gray-800 hover:bg-gray-800 transition text-[13px] font-semibold text-gray-300 flex items-center gap-2.5">
                    <i className="fas fa-keyboard text-gray-400"></i> Keyboard Shortcuts
                  </button>
                  <button className="px-5 py-2.5 bg-[#0f1219] rounded-xl border border-gray-800 hover:bg-gray-800 transition text-[13px] font-semibold text-gray-300 flex items-center gap-2.5">
                    <i className="far fa-folder text-gray-400"></i> Browse Scripts
                  </button>
                </div>
              </div>
            )}

          </div>
        )}
      </div>

      {/* Teleprompter Overlay Layer */}
      <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
        <div
          className={`w-full max-w-4xl h-full p-12 text-center leading-relaxed transition-all duration-300 pointer-events-auto outline-none custom-scrollbar overflow-y-auto no-scrollbar`}
          style={{
            fontSize: `${fontSize}px`,
            opacity: opacity,
            transform: mirror ? 'scaleX(-1)' : 'none',
            textShadow: '2px 2px 4px rgba(0,0,0,0.8)'
          }}
          ref={textRef}
        >
          {/* Padding to allow scrolling text to start from middle */}
          <div className="h-[40vh]"></div>
          <p className="whitespace-pre-wrap font-bold text-white">
            {isVoiceMode ? renderPrompterText() : prompterText}
          </p>
          <div className="h-[40vh]"></div>


        </div>
      </div>
    </div>
  );
}
