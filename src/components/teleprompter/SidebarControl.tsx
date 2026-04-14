import React from 'react';

interface SidebarControlProps {
  isControlsOpen: boolean;
  setIsControlsOpen: (open: boolean) => void;
  mode: 'avatar' | 'webcam';
  setMode: (mode: 'avatar' | 'webcam') => void;
  avatarImage: string | null;
  avatarInputRef: React.RefObject<HTMLInputElement>;
  handleAvatarUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  selectedScriptId: string;
  setSelectedScriptId: (id: string) => void;
  scripts: any[];
  setShowInputModal: (show: boolean) => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  isVoiceMode: boolean;
  setIsVoiceMode: (voice: boolean) => void;
  speed: number;
  setSpeed: (speed: number) => void;
  fontSize: number;
  setFontSize: (size: number) => void;
  opacity: number;
  setOpacity: (opacity: number) => void;
  mirror: boolean;
  setMirror: (mirror: boolean) => void;
  lineHeight: number;
  setLineHeight: (lineHeight: number) => void;
}

export function SidebarControl({
  isControlsOpen, setIsControlsOpen,
  mode, setMode,
  avatarImage, avatarInputRef, handleAvatarUpload,
  selectedScriptId, setSelectedScriptId, scripts,
  setShowInputModal, fileInputRef, handleFileUpload,
  isPlaying, setIsPlaying,
  isVoiceMode, setIsVoiceMode,
  speed, setSpeed,
  fontSize, setFontSize,
  opacity, setOpacity,
  mirror, setMirror,
  lineHeight, setLineHeight
}: SidebarControlProps) {
  return (
    <div className={`absolute top-6 right-6 z-30 bg-[#0a0a1a] border border-gray-800 rounded-xl shadow-2xl transition-all duration-300 ${isControlsOpen ? 'w-[320px] p-6' : 'w-12 h-12 p-0 overflow-hidden flex items-center justify-center'}`}>
      <div className="flex items-center justify-between mb-6">
        {isControlsOpen && (
          <>
            <h2 className="font-semibold text-lg flex items-center gap-2"><i className="fas fa-desktop text-gray-400 text-sm"></i> Teleprompter</h2>
            <div className="flex items-center gap-2">
              <i className="fas fa-compress-arrows-alt text-gray-400 text-xs"></i><div className="w-6 h-6 rounded-full bg-gray-800 flex items-center justify-center ml-2"><i className="fas fa-expand-arrows-alt text-gray-400 text-xs"></i></div>

            </div>
          </>
        )}
      </div>

      {!isControlsOpen && (
        <button onClick={() => setIsControlsOpen(true)} className="w-full h-full text-white hover:text-purple-400">
          <i className="fas fa-sliders-h"></i>
        </button>
      )}

      {isControlsOpen && (
        <>
          <div className="border border-gray-800 rounded-xl p-1 flex mb-6">
              <button
                onClick={() => setMode('avatar')}
                className={`flex-1 py-1.5 rounded-lg text-sm font-medium transition ${mode === 'avatar' ? 'bg-[#0f1219] text-gray-300 border border-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-300'}`}
              >
                <i className="far fa-image mr-2 text-gray-500"></i>Avatar
              </button>
              <button
                onClick={() => setMode('webcam')}
                className={`flex-1 py-1.5 rounded-lg text-sm font-medium transition ${mode === 'webcam' ? 'bg-[#0f1219] text-gray-300 border border-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-300'}`}
              >
                <i className="fas fa-video mr-2 text-gray-500"></i>Webcam
              </button>
          </div>

          {/* Custom Avatar Upload (Visible only in Avatar mode) */}
          {mode === 'avatar' && (
            <div className="mb-6 p-4 bg-gray-800 rounded-xl border border-dashed border-gray-600 text-center">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={avatarInputRef}
                onChange={handleAvatarUpload}
              />
              <button
                onClick={() => avatarInputRef.current?.click()}
                className="text-sm text-gray-400 hover:text-white transition"
              >
                <i className="fas fa-cloud-upload-alt mr-2"></i>
                {avatarImage ? 'Change Avatar Image' : 'Upload Avatar / BG'}
              </button>
            </div>
          )}

          <div className="mb-6 space-y-3">
            <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">SCRIPT SOURCE</label>

            <select
              value={selectedScriptId}
              onChange={(e) => setSelectedScriptId(e.target.value)}
              className="w-full bg-[#0f1219] border border-gray-800 rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none focus:ring-1 focus:ring-purple-500 appearance-none"
            >
              <option value="">-- Select Saved Script --</option>
              {scripts.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}
            </select>

            <div className="flex gap-2">
              <button
                onClick={() => setShowInputModal(true)}
                className="flex-1 py-2 bg-[#0f1219] border border-gray-800 rounded-lg text-xs text-gray-300 hover:bg-gray-800 font-semibold"
              >
                <i className="far fa-file-alt mr-2 text-gray-400"></i> Manual Input
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 py-2 bg-[#0f1219] border border-gray-800 rounded-lg text-xs text-gray-300 hover:bg-gray-800 font-semibold"
              >
                <i className="fas fa-upload mr-2 text-gray-400"></i> Upload .txt
              </button>
              <input
                type="file"
                accept=".txt"
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileUpload}
              />
            </div>
          </div>

          {/* Playback Controls */}
          <div className="grid grid-cols-2 gap-2 mb-6">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition tracking-wider shadow-[0_0_15px_rgba(16,185,129,0.3)] ${isPlaying ? 'bg-red-500/20 text-red-400 border border-red-500/50' : 'bg-[#00875A] text-white border border-[#00A36C] hover:bg-[#00A36C]'}`}
            >
              <i className={`fas fa-${isPlaying ? 'pause' : 'play'}`}></i>
              {isPlaying ? 'PAUSE' : 'SCROLL'}
            </button>

            <button
              onClick={() => setIsVoiceMode(!isVoiceMode)}
              className={`py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition border ${isVoiceMode ? 'bg-blue-500/20 text-blue-400 border-blue-500/50' : 'bg-[#0f1219] text-gray-400 border-gray-800 hover:bg-gray-800'}`}
              title="Experimental: Highlights spoken words"
            >
              <i className="fas fa-microphone"></i>
              {isVoiceMode ? 'LISTENING' : 'VOICE MODE'}
            </button>
          </div>

          {/* Sliders */}
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span className="flex items-center gap-2"><i className="fas fa-tachometer-alt"></i> Speed</span>
                <span className="font-mono text-white">{speed}x</span>
              </div>
              <input
                type="range" min="0.5" max="5" step="0.5"
                value={speed}
                onChange={(e) => setSpeed(parseFloat(e.target.value))}
                className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer custom-range-slider"
                style={{
                  background: `linear-gradient(to right, #8b5cf6 0%, #8b5cf6 ${(speed - 0.5) / 4.5 * 100}%, #374151 ${(speed - 0.5) / 4.5 * 100}%, #374151 100%)`
                }}
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span className="flex items-center gap-2"><i className="fas fa-font"></i> Font Size</span>
                <span className="font-mono text-white">{fontSize}px</span>
              </div>
              <input
                type="range" min="18" max="72" step="2"
                value={fontSize}
                onChange={(e) => setFontSize(parseInt(e.target.value))}
                className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer custom-range-slider"
                style={{
                  background: `linear-gradient(to right, #8b5cf6 0%, #8b5cf6 ${(fontSize - 18) / 54 * 100}%, #374151 ${(fontSize - 18) / 54 * 100}%, #374151 100%)`
                }}
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span className="flex items-center gap-2"><i className="far fa-eye"></i> Opacity</span>
                <span className="font-mono text-white">{opacity}</span>
              </div>
              <input
                type="range" min="0.1" max="1" step="0.1"
                value={opacity}
                onChange={(e) => setOpacity(parseFloat(e.target.value))}
                className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer custom-range-slider"
                style={{
                  background: `linear-gradient(to right, #8b5cf6 0%, #8b5cf6 ${(opacity - 0.1) / 0.9 * 100}%, #374151 ${(opacity - 0.1) / 0.9 * 100}%, #374151 100%)`
                }}
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span className="flex items-center gap-2"><i className="fas fa-text-height"></i> Line Height</span>
                <span className="font-mono text-white">{lineHeight}</span>
              </div>
              <input
                type="range" min="1" max="3" step="0.1"
                value={lineHeight}
                onChange={(e) => setLineHeight(parseFloat(e.target.value))}
                className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer custom-range-slider"
                style={{
                  background: `linear-gradient(to right, #8b5cf6 0%, #8b5cf6 ${(lineHeight - 1) / 2 * 100}%, #374151 ${(lineHeight - 1) / 2 * 100}%, #374151 100%)`
                }}
              />
            </div>
          </div>

          <hr className="border-gray-800 my-6" />

          {/* Toggles */}
          <div className="mt-6 flex items-center justify-between">
            <label className="flex items-center justify-between w-full cursor-pointer flex-row-reverse">
              <div className={`w-9 h-5 rounded-full transition-colors relative flex items-center ${mirror ? 'bg-white' : 'bg-gray-600'}`} onClick={() => setMirror(!mirror)}>
                <div className={`w-3.5 h-3.5 rounded-full shadow-md transform transition-transform absolute ${mirror ? 'translate-x-5 bg-gray-900' : 'translate-x-0.5 bg-white'}`}></div>
              </div>
              <span className="text-sm font-semibold text-gray-300 flex items-center gap-2"><i className="fas fa-border-none text-gray-400"></i>Mirror Mode</span>
            </label>
          </div>
        </>
      )}
    </div>
  );
}
