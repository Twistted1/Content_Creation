import React, { useState, useEffect, useRef } from 'react';
import { TopNav } from '@/components/dashboard/TopNav';
import { scriptService } from '@/services/scriptService';
import { motion, AnimatePresence } from 'framer-motion';

// Toast helper
const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
  const toast = document.createElement('div');
  toast.className = `fixed bottom-6 right-6 px-6 py-4 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] transform transition-all duration-500 translate-y-10 opacity-0 z-[100] border backdrop-blur-xl ${
    type === 'success' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 
    type === 'error' ? 'bg-rose-500/10 border-rose-500/30 text-rose-400' : 
    'bg-violet-500/10 border-violet-500/30 text-violet-400'
  }`;
  toast.innerHTML = `<div class="flex items-center gap-3 font-bold text-sm tracking-wide"><i class="fas fa-${
    type === 'success' ? 'check-circle' : 
    type === 'error' ? 'exclamation-circle' : 
    'info-circle'
  } text-lg"></i> ${message.toUpperCase()}</div>`;
  document.body.appendChild(toast);
  requestAnimationFrame(() => toast.classList.remove('translate-y-10', 'opacity-0'));
  setTimeout(() => {
    toast.classList.add('translate-y-10', 'opacity-0');
    setTimeout(() => toast.remove(), 500);
  }, 3000);
};

export default function Teleprompter() {
  const [isControlsOpen, setIsControlsOpen] = useState(true);
  const [mode, setMode] = useState<'webcam' | 'avatar'>('avatar');
  
  const [scripts, setScripts] = useState<any[]>([]);
  const [selectedScriptId, setSelectedScriptId] = useState('');
  const [prompterText, setPrompterText] = useState('Welcome to the ContentFlow Teleprompter Suite. Select a script to begin...');
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [fontSize, setFontSize] = useState(42);
  const [mirror, setMirror] = useState(false);
  const [opacity, setOpacity] = useState(0.9);
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  
  const [showInputModal, setShowInputModal] = useState(false);
  const [customInputText, setCustomInputText] = useState('');
  
  const [avatarImage, setAvatarImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const recognitionRef = useRef<any>(null);
  const [recognizedText, setRecognizedText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const isVoiceModeRef = useRef(false);
  const lastFinalRef = useRef('');
  
  const textRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!recognitionRef.current) {
          try {
              recognitionRef.current = new SpeechRecognition();
              recognitionRef.current.continuous = true;
              recognitionRef.current.interimResults = true;
              recognitionRef.current.lang = 'en-US';

              recognitionRef.current.onresult = (event: any) => {
                let finalText = '';
                let interimText = '';
                for (let i = event.resultIndex; i < event.results.length; i++) {
                  if (event.results[i].isFinal) {
                    finalText += event.results[i][0].transcript + ' ';
                  } else {
                    interimText += event.results[i][0].transcript;
                  }
                }
                if (finalText) {
                  const combined = (lastFinalRef.current + ' ' + finalText).trim();
                  const words = combined.split(/\s+/);
                  lastFinalRef.current = words.slice(-20).join(' ');
                }
                const rolling = (lastFinalRef.current + ' ' + interimText).trim();
                setRecognizedText(rolling.toLowerCase());
              };

              recognitionRef.current.onerror = (event: any) => {
                console.error('Speech recognition error', event.error);
                setIsListening(false);
                setIsVoiceMode(false);
                if (event.error === 'not-allowed') showToast('Microphone access denied', 'error');
              };
              
              recognitionRef.current.onend = () => {
                 setIsListening(false);
                 if (isVoiceModeRef.current) {
                   try {
                     recognitionRef.current.start();
                     setIsListening(true);
                   } catch(e) {}
                 }
              };
          } catch (e) {
              console.error("Speech Init Failed", e);
          }
      }
    }
  }, []);

  useEffect(() => {
     isVoiceModeRef.current = isVoiceMode;
     if (!recognitionRef.current) return;
     if (isVoiceMode) {
        try {
           lastFinalRef.current = '';
           setRecognizedText('');
           recognitionRef.current.start();
           setIsListening(true);
           showToast('Voice Tracking Activated', 'info');
        } catch(e) {}
     } else {
        try { recognitionRef.current.stop(); } catch(e) {}
        setIsListening(false);
        setRecognizedText('');
        lastFinalRef.current = '';
     }
  }, [isVoiceMode]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
     const file = e.target.files?.[0];
     if (!file) return;
     const reader = new FileReader();
     reader.onload = (e) => {
        setPrompterText(e.target?.result as string);
        showToast('Script Imported', 'success');
     };
     reader.readAsText(file);
  };
  
  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
     const file = e.target.files?.[0];
     if (file) setAvatarImage(URL.createObjectURL(file));
  };

  const renderPrompterText = () => {
     const recentWords = new Set(
       recognizedText.split(/\s+/).map(w => w.replace(/[^a-z0-9]/g, '')).filter(w => w.length > 2)
     );
     return prompterText.split(/(\s+)/).map((word, i) => {
        const cleanWord = word.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
        const isSpoken = isVoiceMode && cleanWord.length > 2 && recentWords.has(cleanWord);
        return (
          <span
             key={i}
             ref={el => wordRefs.current[i] = el}
             className={`transition-all duration-300 ${isSpoken ? 'text-amber-400 font-extrabold scale-110' : 'text-white'}`}
          >
             {word}
          </span>
        );
     });
  };

  useEffect(() => {
    scriptService.getScripts().then(setScripts).catch(console.error);
  }, []);

  useEffect(() => {
    if (selectedScriptId) {
       const script = scripts.find(s => s.id === selectedScriptId);
       if (script) {
         setPrompterText(script.content || script.script || '');
         if (textRef.current) textRef.current.scrollTop = 0;
       }
    }
  }, [selectedScriptId, scripts]);

  useEffect(() => {
    const startWebcam = async () => {
      if (mode === 'webcam') {
        try {
          const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
          setStream(mediaStream);
          if (videoRef.current) videoRef.current.srcObject = mediaStream;
        } catch (err) {
          showToast('Webcam Access Denied', 'error');
          setMode('avatar');
        }
      } else if (stream) {
        stream.getTracks().forEach(track => track.stop());
        setStream(null);
      }
    };
    startWebcam();
    return () => stream?.getTracks().forEach(t => t.stop());
  }, [mode]);

  useEffect(() => {
    let animationFrame: number;
    let lastTime = 0;
    const animate = (time: number) => {
      if (lastTime === 0) lastTime = time;
      const deltaTime = time - lastTime;
      if (isPlaying && textRef.current) {
         textRef.current.scrollTop += (speed * 0.4) * (deltaTime / 16); 
         if (textRef.current.scrollTop + textRef.current.clientHeight >= textRef.current.scrollHeight) {
             setIsPlaying(false);
         }
      }
      lastTime = time;
      animationFrame = requestAnimationFrame(animate);
    };
    if (isPlaying) animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [isPlaying, speed]);

  return (
    <div className="min-h-screen bg-[#05060a] text-white font-sans overflow-hidden selection:bg-violet-500/30">
      <TopNav />
      
      <AnimatePresence>
        {showInputModal && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-6"
          >
             <motion.div 
               initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
               className="bg-[#111] p-8 rounded-[2rem] w-full max-w-2xl border border-white/10 shadow-[0_0_100px_rgba(139,92,246,0.15)]"
             >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-violet-600/20 flex items-center justify-center text-violet-500">
                    <i className="fas fa-edit text-xl"></i>
                  </div>
                  <h3 className="text-2xl font-bold tracking-tight">Script Editor</h3>
                </div>
                <textarea 
                  className="w-full h-80 bg-black/50 border border-white/5 rounded-2xl p-6 text-xl text-gray-300 outline-none focus:border-violet-500/50 transition-all font-medium leading-relaxed"
                  placeholder="Paste or type your script here..."
                  value={customInputText}
                  onChange={(e) => setCustomInputText(e.target.value)}
                ></textarea>
                <div className="flex gap-4 justify-end mt-8">
                   <button onClick={() => setShowInputModal(false)} className="px-6 py-3 text-gray-400 font-bold hover:text-white transition uppercase tracking-widest text-xs">Cancel</button>
                   <button 
                     onClick={() => {
                        if (customInputText) setPrompterText(customInputText);
                        setShowInputModal(false);
                        showToast('Script Updated', 'success');
                     }}
                     className="px-8 py-3 bg-violet-600 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-violet-500 transition shadow-lg shadow-violet-900/40"
                   >
                      Load Script
                   </button>
                </div>
             </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="h-screen w-full flex flex-col pt-16">
        <div className="flex-1 flex overflow-hidden">
          
          {/* Main Stage */}
          <div className="flex-1 relative bg-black group overflow-hidden">
            {/* Visuals Layer */}
            <div className="absolute inset-0 z-0 flex items-center justify-center overflow-hidden">
               {mode === 'webcam' ? (
                  <video ref={videoRef} autoPlay muted className={`w-full h-full object-cover transition-transform duration-700 ${mirror ? 'scale-x-[-1]' : ''}`} />
               ) : (
                  <div className="relative w-full h-full bg-[#05060A]">
                     {avatarImage ? (
                        <img src={avatarImage} className="w-full h-full object-cover animate-pulse-slow opacity-60" alt="Avatar" />
                     ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center opacity-20">
                               <i className="fas fa-cube text-[12rem] mb-8 text-violet-500"></i>
                               <p className="text-xl font-bold tracking-[0.2em] uppercase">Booth Active</p>
                            </div>
                        </div>
                     )}
                     <div className="absolute bottom-8 left-8 flex items-center gap-3 bg-black/60 border border-white/10 px-4 py-2 rounded-xl backdrop-blur-xl">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.8)]"></div>
                        <span className="text-[10px] font-black tracking-widest text-white/50">{mode.toUpperCase()} MODE ACTIVE</span>
                     </div>
                  </div>
               )}
            </div>
            
            {/* Prompter Overlay */}
            <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
               <div 
                 className="w-full max-w-5xl h-full p-[15%] text-center font-bold tracking-tight transition-all duration-300 pointer-events-auto outline-none overflow-y-auto scrollbar-hide text-white"
                 style={{ 
                   fontSize: `${fontSize}px`, 
                   opacity: opacity,
                   transform: mirror ? 'scaleX(-1)' : 'none',
                   textShadow: '0 4px 12px rgba(0,0,0,0.8), 0 0 20px rgba(0,0,0,0.5)'
                 }}
                 ref={textRef}
               >
                  <div className="h-[40vh]"></div>
                  <div className="whitespace-pre-wrap leading-[1.6]">
                     {isVoiceMode ? renderPrompterText() : prompterText}
                  </div>
                  <div className="h-[40vh]"></div>

                  {/* Guide Rails */}
                  <div className="fixed top-1/2 left-0 right-0 h-24 -mt-12 pointer-events-none z-20 flex items-center justify-between px-10">
                     <div className="w-1.5 h-full rounded-full bg-gradient-to-t from-transparent via-violet-500/40 to-transparent"></div>
                     <div className="w-1.5 h-full rounded-full bg-gradient-to-t from-transparent via-violet-500/40 to-transparent"></div>
                  </div>
               </div>
            </div>

            {/* Quick Stats Overlay (Floating top info) */}
            <div className="absolute top-8 left-8 flex items-center gap-8 z-30 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="flex flex-col">
                   <span className="text-[10px] font-black text-white/30 tracking-[0.2em]">SPEED</span>
                   <span className="text-lg font-bold text-violet-400 font-mono">{speed}x</span>
                </div>
                <div className="flex flex-col">
                   <span className="text-[10px] font-black text-white/30 tracking-[0.2em]">FONT</span>
                   <span className="text-lg font-bold text-violet-400 font-mono">{fontSize}px</span>
                </div>
            </div>
          </div>

          {/* Controls Sidebar */}
          <div className="w-[380px] bg-[#0c0c0e] border-l border-white/5 p-8 flex flex-col gap-8 overflow-y-auto scrollbar-thin">
             
             <div>
                <h3 className="text-[11px] font-black text-white/30 uppercase tracking-[0.3em] mb-4">Input Stream</h3>
                <div className="bg-black/40 rounded-2xl p-1.5 flex border border-white/5">
                   <button 
                     onClick={() => setMode('avatar')}
                     className={`flex-1 py-3 rounded-xl text-[10px] font-black tracking-widest transition-all ${mode === 'avatar' ? 'bg-violet-600 text-white shadow-[0_10px_20px_rgba(139,92,246,0.3)] scale-[1.02]' : 'text-white/40 hover:text-white'}`}
                   >
                      AVATAR
                   </button>
                   <button 
                     onClick={() => setMode('webcam')}
                     className={`flex-1 py-3 rounded-xl text-[10px] font-black tracking-widest transition-all ${mode === 'webcam' ? 'bg-blue-600 text-white shadow-[0_10px_20px_rgba(37,99,235,0.3)] scale-[1.02]' : 'text-white/40 hover:text-white'}`}
                   >
                      WEBCAM
                   </button>
                </div>
             </div>

             {mode === 'avatar' && (
                <div className="group relative h-32 rounded-3xl border-2 border-dashed border-white/10 hover:border-violet-500/40 bg-black/20 flex flex-col items-center justify-center transition-all cursor-pointer overflow-hidden" onClick={() => avatarInputRef.current?.click()}>
                   <input type="file" accept="image/*" className="hidden" ref={avatarInputRef} onChange={handleAvatarUpload} />
                   {avatarImage ? (
                      <img src={avatarImage} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform" alt="Avatar" />
                   ) : (
                      <>
                        <i className="fas fa-plus text-white/20 text-xl mb-2 group-hover:text-violet-500 transition-colors"></i>
                        <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Select Backdrop</span>
                      </>
                   )}
                </div>
             )}

             <div>
                <h3 className="text-[11px] font-black text-white/30 uppercase tracking-[0.3em] mb-4">Content Source</h3>
                <select 
                  value={selectedScriptId}
                  onChange={(e) => setSelectedScriptId(e.target.value)}
                  className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 px-4 text-sm font-bold text-white placeholder-white/20 outline-none focus:border-violet-500/50 transition-all mb-4 appearance-none"
                >
                   <option value="">-- SYSTEM REPOSITORY --</option>
                   {scripts.map(s => <option key={s.id} value={s.id}>{s.title.toUpperCase()}</option>)}
                </select>

                <div className="flex gap-3">
                   <button onClick={() => setShowInputModal(true)} className="flex-1 py-3 bg-white/5 border border-white/5 rounded-xl text-[10px] font-black hover:bg-white/10 transition">MANUAL</button>
                   <button onClick={() => fileInputRef.current?.click()} className="flex-1 py-3 bg-white/5 border border-white/5 rounded-xl text-[10px] font-black hover:bg-white/10 transition">UPLOAD</button>
                   <input type="file" accept=".txt" className="hidden" ref={fileInputRef} onChange={handleFileUpload} />
                </div>
             </div>

             <div className="mt-4 flex flex-col gap-4">
                <button 
                  onClick={() => setIsPlaying(!isPlaying)}
                  className={`w-full py-5 rounded-2xl font-black text-[13px] tracking-[0.2em] flex items-center justify-center gap-4 transition-all active:scale-95 ${isPlaying ? 'bg-rose-600 text-white shadow-[0_15px_30px_rgba(225,29,72,0.3)]' : 'bg-violet-600 text-white shadow-[0_15px_30px_rgba(139,92,246,0.3)]'}`}
                >
                   {isPlaying ? 'PAUSE ENGINE' : 'ACTIVATE SCROLL'}
                </button>
                
                <button 
                  onClick={() => setIsVoiceMode(!isVoiceMode)}
                  className={`w-full py-4 rounded-2xl font-black text-[10px] tracking-[0.2em] flex items-center justify-center gap-3 transition-all ${isVoiceMode ? 'bg-blue-600 text-white shadow-[0_15px_30px_rgba(37,99,235,0.3)]' : 'bg-white/5 border border-white/5 text-white/40 hover:text-white'}`}
                >
                   <i className={`fas fa-microphone ${isVoiceMode ? 'animate-pulse' : ''}`}></i>
                   {isVoiceMode ? 'VOICE SYNC ACTIVE' : 'ENABLE VOICE SYNC'}
                </button>
             </div>

             <div className="space-y-8 pt-4">
                {[
                  { label: 'Speed', val: speed, set: setSpeed, min: 0.5, max: 5, step: 0.5, unit: 'x' },
                  { label: 'Font Size', val: fontSize, set: setFontSize, min: 20, max: 92, step: 2, unit: 'px' },
                  { label: 'Opacity', val: opacity, set: setOpacity, min: 0.1, max: 1, step: 0.1, unit: '%' }
                ].map((s) => (
                   <div key={s.label}>
                      <div className="flex justify-between items-center mb-4">
                         <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">{s.label}</span>
                         <span className="text-xs font-bold font-mono text-violet-400">{s.label === 'Opacity' ? Math.round(s.val * 100) : s.val}{s.unit}</span>
                      </div>
                      <input 
                        type="range" min={s.min} max={s.max} step={s.step} value={s.val}
                        onChange={(e) => s.set(parseFloat(e.target.value))}
                        className="w-full accent-violet-500 h-1 bg-white/5 rounded-full appearance-none cursor-pointer"
                      />
                   </div>
                ))}
             </div>

             <div className="mt-auto pt-8 flex items-center justify-between border-t border-white/5">
                <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Mirror Display</span>
                <button 
                  onClick={() => setMirror(!mirror)}
                  className={`w-12 h-6 rounded-full p-1 transition-all duration-500 ${mirror ? 'bg-violet-600' : 'bg-white/10'}`}
                >
                   <div className={`w-4 h-4 bg-white rounded-full shadow-lg transform transition-transform duration-500 ${mirror ? 'translate-x-6' : 'translate-x-0'}`}></div>
                </button>
             </div>
          </div>
        </div>
      </main>
    </div>
  );
}
