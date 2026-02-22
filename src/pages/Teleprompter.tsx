import React, { useState, useEffect, useRef } from 'react';
import { TopNav } from '@/components/dashboard/TopNav';
import { scriptService } from '@/services/scriptService';

// Toast helper
const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
  const toast = document.createElement('div');
  toast.className = `fixed bottom-4 right-4 px-6 py-3 rounded-xl shadow-2xl transform transition-all duration-500 translate-y-10 opacity-0 z-50 ${
    type === 'success' ? 'bg-green-500/90 text-white' : 
    type === 'error' ? 'bg-red-500/90 text-white' : 
    'bg-blue-500/90 text-white'
  }`;
  toast.innerHTML = `<div class="flex items-center gap-2"><i class="fas fa-${
    type === 'success' ? 'check-circle' : 
    type === 'error' ? 'exclamation-circle' : 
    'info-circle'
  }"></i> ${message}</div>`;
  document.body.appendChild(toast);
  requestAnimationFrame(() => toast.classList.remove('translate-y-10', 'opacity-0'));
  setTimeout(() => {
    toast.classList.add('translate-y-10', 'opacity-0');
    setTimeout(() => toast.remove(), 500);
  }, 3000);
};

export default function Teleprompter() {
  const [isControlsOpen, setIsControlsOpen] = useState(true);
  // Mode: 'webcam' | 'avatar'
  const [mode, setMode] = useState<'webcam' | 'avatar'>('avatar');
  
  // Scripts
  const [scripts, setScripts] = useState<any[]>([]);
  const [selectedScriptId, setSelectedScriptId] = useState('');
  const [prompterText, setPrompterText] = useState('Welcome to the ContentFlow Teleprompter Suite. Select a script to begin...');
  
  // Controls
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [fontSize, setFontSize] = useState(32);
  const [mirror, setMirror] = useState(false);
  const [opacity, setOpacity] = useState(0.8);
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  
  // Custom Input
  const [showInputModal, setShowInputModal] = useState(false);
  const [customInputText, setCustomInputText] = useState('');
  
  // Custom Avatar
  const [avatarImage, setAvatarImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  // Voice Recognition State
  const recognitionRef = useRef<any>(null);
  const [recognizedText, setRecognizedText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const isVoiceModeRef = useRef(false);
  const lastFinalRef = useRef('');
  
  // Auto-scroll logic
  const textRef = useRef<HTMLDivElement>(null);
  // Webcam
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  // Initialize Speech Recognition
  useEffect(() => {
    // Only initialize if supported
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      
      // Prevent multiple instances
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
                setIsVoiceMode(false); // Auto-off on error
                
                if (event.error === 'not-allowed') {
                   showToast('Microphone access denied', 'error');
                }
              };
              
              recognitionRef.current.onend = () => {
                 setIsListening(false);
                 if (isVoiceModeRef.current) {
                   try {
                     recognitionRef.current.start();
                     setIsListening(true);
                   } catch(e) { /* already started */ }
                 }
              };
          } catch (e) {
              console.error("Speech Init Failed", e);
          }
      }
    }
  }, []);

  // Voice Mode Toggle
  useEffect(() => {
     isVoiceModeRef.current = isVoiceMode;
     if (!recognitionRef.current) return;
     if (isVoiceMode) {
        try {
           lastFinalRef.current = '';
           setRecognizedText('');
           recognitionRef.current.start();
           setIsListening(true);
           showToast('Voice Tracking Enabled', 'info');
        } catch(e) {
           console.log("Speech start error:", e);
        }
     } else {
        try { recognitionRef.current.stop(); } catch(e) {}
        setIsListening(false);
        setRecognizedText('');
        lastFinalRef.current = '';
     }
  }, [isVoiceMode]);

  // Handle File Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
     const file = e.target.files?.[0];
     if (!file) return;
     
     const reader = new FileReader();
     reader.onload = (e) => {
        const text = e.target?.result as string;
        setPrompterText(text);
        showToast('Script loaded from file', 'success');
     };
     reader.readAsText(file);
  };
  
  // Handle Avatar Upload
  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
     const file = e.target.files?.[0];
     if (file) {
        const url = URL.createObjectURL(file);
        setAvatarImage(url);
     }
  };

  // Helper to split text into spans for voice tracking
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
             className={`transition-colors duration-200 ${isSpoken ? 'text-yellow-300 font-semibold' : 'text-white'}`}
          >
             {word}
          </span>
        );
     });
  };

  // Load Scripts
  useEffect(() => {
    const loadScripts = async () => {
      try {
        const data = await scriptService.getScripts();
        setScripts(data);
      } catch (error) {
        console.error("Failed to load scripts", error);
      }
    };
    loadScripts();
  }, []);

  // Handle Script Selection
  useEffect(() => {
    if (selectedScriptId) {
       const script = scripts.find(s => s.id === selectedScriptId);
       if (script) {
         setPrompterText(script.content || script.script || '');
         // Reset scroll
         if (textRef.current) textRef.current.scrollTop = 0;
       }
    }
  }, [selectedScriptId, scripts]);

  // Webcam Logic
  useEffect(() => {
    const startWebcam = async () => {
      if (mode === 'webcam') {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
           showToast('Webcam not supported in this browser', 'error');
           setMode('avatar');
           return;
        }

        try {
          const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
          setStream(mediaStream);
          if (videoRef.current) {
            videoRef.current.srcObject = mediaStream;
          }
        } catch (err: any) {
          console.warn("Webcam access failed:", err.name, err.message);
          
          if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
             showToast('No webcam found on this device', 'error');
          } else if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
             showToast('Webcam permission denied', 'error');
          } else {
             showToast('Could not access webcam', 'error');
          }
          
          setMode('avatar'); // Fallback
        }
      } else {
        // Stop webcam if switching away
        if (stream) {
          stream.getTracks().forEach(track => track.stop());
          setStream(null);
        }
      }
    };

    startWebcam();
    return () => {
      if (stream) stream.getTracks().forEach(track => track.stop());
    };
  }, [mode]);

  // Scroll Animation
  useEffect(() => {
    let animationFrame: number;
    let lastTime = 0;
    
    const animate = (time: number) => {
      if (lastTime === 0) lastTime = time;
      const deltaTime = time - lastTime;
      
      if (isPlaying && textRef.current) {
         // Speed 1 = 20px per second approx? Let's tune it.
         // Let's say speed 1 = 0.5px per frame (at 60fps) -> 30px/sec
         const scrollAmount = (speed * 0.5) * (deltaTime / 16); 
         textRef.current.scrollTop += scrollAmount;
         
         // Loop if end reached (optional, maybe stop)
         if (textRef.current.scrollTop + textRef.current.clientHeight >= textRef.current.scrollHeight) {
             setIsPlaying(false);
         }
      }
      
      lastTime = time;
      animationFrame = requestAnimationFrame(animate);
    };
    
    if (isPlaying) {
       animationFrame = requestAnimationFrame(animate);
    } else {
       cancelAnimationFrame(animationFrame!);
    }
    
    return () => cancelAnimationFrame(animationFrame!);
  }, [isPlaying, speed]);


  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans pt-16 pb-8 overflow-hidden">
      <TopNav />
      
      {/* Input Modal */}
      {showInputModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
           <div className="bg-gray-800 p-6 rounded-2xl w-full max-w-lg border border-gray-700 shadow-2xl">
              <h3 className="text-xl font-bold mb-4">📝 Manual Script Entry</h3>
              <textarea 
                className="w-full h-64 bg-gray-900 border border-gray-700 rounded-xl p-4 text-gray-200 outline-none focus:ring-2 focus:ring-purple-500 mb-4"
                placeholder="Paste or type your script here..."
                value={customInputText}
                onChange={(e) => setCustomInputText(e.target.value)}
              ></textarea>
              <div className="flex gap-3 justify-end">
                 <button 
                   onClick={() => setShowInputModal(false)}
                   className="px-4 py-2 text-gray-400 hover:text-white"
                 >
                    Cancel
                 </button>
                 <button 
                   onClick={() => {
                      if (customInputText) setPrompterText(customInputText);
                      setShowInputModal(false);
                      showToast('Script updated', 'success');
                   }}
                   className="px-6 py-2 gradient-bg rounded-lg font-bold"
                 >
                    Load Script
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* Main Container */}
      <main className="relative h-[calc(100vh-64px)] w-full flex">
        
        {/* Background Layer (Visuals) */}
        <div className="absolute inset-0 bg-black z-0 flex items-center justify-center overflow-hidden">
           {mode === 'webcam' ? (
              <video 
                ref={videoRef} 
                autoPlay 
                muted 
                className={`w-full h-full object-cover ${mirror ? 'scale-x-[-1]' : ''}`}
              />
           ) : (
              <div className="relative w-full h-full bg-gray-900">
                 {/* Customizable Avatar / Background */}
                 {avatarImage ? (
                    <img 
                       src={avatarImage} 
                       className="w-full h-full object-cover opacity-80"
                       alt="Custom Avatar"
                    />
                 ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center text-gray-600">
                           <i className="fas fa-user-astronaut text-9xl mb-4 opacity-20"></i>
                           <p>No Avatar Selected</p>
                           <p className="text-sm">Upload an image or select "Webcam"</p>
                        </div>
                    </div>
                 )}
                 
                 <div className="absolute bottom-10 left-10 text-white/50 font-mono text-sm">
                    <i className="fas fa-circle text-green-500 mr-2 text-[10px] animate-pulse"></i>
                    MODE: {avatarImage ? 'CUSTOM AVATAR' : 'DEFAULT'}
                 </div>
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
              
              {/* Center Marker */}
              <div className="fixed top-1/2 left-0 right-0 h-1 bg-red-500/50 z-20 pointer-events-none flex items-center justify-between px-4">
                 <i className="fas fa-caret-right text-red-500 text-2xl"></i>
                 <i className="fas fa-caret-left text-red-500 text-2xl"></i>
              </div>
           </div>
        </div>

        {/* Controls Sidebar (Floating) */}
        <div className={`absolute top-6 right-6 z-30 bg-gray-900/90 backdrop-blur-md border border-gray-700 rounded-2xl shadow-2xl transition-all duration-300 ${isControlsOpen ? 'w-80 p-6' : 'w-12 h-12 p-0 overflow-hidden flex items-center justify-center'}`}>
           <div className="flex items-center justify-between mb-6">
              {isControlsOpen && (
                <>
                  <h2 className="font-bold text-xl">🎬 Teleprompter</h2>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                    <button onClick={() => setIsControlsOpen(false)} className="text-gray-400 hover:text-white">
                      <i className="fas fa-compress-alt"></i>
                    </button>
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
           {/* Source Selection */}
           <div className="bg-gray-800 rounded-xl p-1 flex mb-6">
              <button 
                onClick={() => setMode('avatar')}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${mode === 'avatar' ? 'bg-purple-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
              >
                 <i className="fas fa-image mr-2"></i>Avatar
              </button>
              <button 
                onClick={() => setMode('webcam')}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${mode === 'webcam' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
              >
                 <i className="fas fa-camera mr-2"></i>Webcam
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

           {/* Script Selector & Upload */}
           <div className="mb-6 space-y-3">
              <label className="text-xs text-gray-400 font-bold uppercase tracking-wider block">Script Source</label>
              
              <select 
                value={selectedScriptId}
                onChange={(e) => setSelectedScriptId(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                 <option value="">-- Select Saved Script --</option>
                 {scripts.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}
              </select>

              <div className="flex gap-2">
                 <button 
                   onClick={() => setShowInputModal(true)}
                   className="flex-1 py-2 bg-gray-800 border border-gray-700 rounded-lg text-xs hover:bg-gray-700"
                 >
                    <i className="fas fa-pen mr-1"></i> Manual Input
                 </button>
                 <button 
                   onClick={() => fileInputRef.current?.click()}
                   className="flex-1 py-2 bg-gray-800 border border-gray-700 rounded-lg text-xs hover:bg-gray-700"
                 >
                    <i className="fas fa-file-upload mr-1"></i> Upload .txt
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
                className={`py-3 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition ${isPlaying ? 'bg-red-500/20 text-red-400 border border-red-500/50' : 'bg-green-500/20 text-green-400 border border-green-500/50'}`}
              >
                 <i className={`fas fa-${isPlaying ? 'pause' : 'play'}`}></i>
                 {isPlaying ? 'PAUSE' : 'SCROLL'}
              </button>
              
              <button 
                onClick={() => setIsVoiceMode(!isVoiceMode)}
                className={`py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition ${isVoiceMode ? 'bg-blue-500 text-white shadow-lg animate-pulse' : 'bg-gray-800 text-gray-400 hover:text-white'}`}
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
                    <span>Speed</span>
                    <span>{speed}x</span>
                 </div>
                 <input 
                   type="range" min="0.5" max="5" step="0.5"
                   value={speed}
                   onChange={(e) => setSpeed(parseFloat(e.target.value))}
                   className="w-full accent-purple-500 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                 />
              </div>
              
              <div>
                 <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>Font Size</span>
                    <span>{fontSize}px</span>
                 </div>
                 <input 
                   type="range" min="18" max="72" step="2"
                   value={fontSize}
                   onChange={(e) => setFontSize(parseInt(e.target.value))}
                   className="w-full accent-blue-500 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                 />
              </div>

              <div>
                 <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>Opacity</span>
                    <span>{Math.round(opacity * 100)}%</span>
                 </div>
                 <input 
                   type="range" min="0.1" max="1" step="0.1"
                   value={opacity}
                   onChange={(e) => setOpacity(parseFloat(e.target.value))}
                   className="w-full accent-white h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                 />
              </div>
           </div>

           {/* Toggles */}
           <div className="mt-6 flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                 <div className={`w-10 h-6 rounded-full p-1 transition-colors ${mirror ? 'bg-purple-600' : 'bg-gray-700'}`} onClick={() => setMirror(!mirror)}>
                    <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${mirror ? 'translate-x-4' : 'translate-x-0'}`}></div>
                 </div>
                 <span className="text-sm text-gray-300">Mirror Mode</span>
              </label>
           </div>
           </>
           )}
        </div>

      </main>
    </div>
  );
}
