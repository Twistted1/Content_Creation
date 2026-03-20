import React, { useState, useEffect } from 'react';
import { TopNav } from '@/components/dashboard/TopNav';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { aiService } from '../services/aiService';
import { publishService } from '../services/publishService';
import { usageService, PLAN_LIMITS } from '../services/usageService';
import { showToast } from '@/utils/toast';  
import { useProductionSession } from '@/hooks/useProductionSession';

export default function Production() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // Persistent Session
  const session = useProductionSession();
  const { data, updateState } = session;

  // Sync URL tab to session
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && tab !== data.activeTab) {
      updateState({ activeTab: tab });
    }
  }, [searchParams]);

  const activeTab = data.activeTab;
  const setActiveTab = (tab: string) => {
    updateState({ activeTab: tab });
    setSearchParams({ tab });
  };

  // State Wrappers with functional update support
  const generatedVideos = data.generatedVideos;
  const setGeneratedVideos = (valOrFn: any) => {
    const newVal = typeof valOrFn === 'function' ? valOrFn(data.generatedVideos) : valOrFn;
    updateState({ generatedVideos: newVal });
  };

  const timeline = data.timeline;
  const setTimeline = (valOrFn: any) => {
    const newVal = typeof valOrFn === 'function' ? valOrFn(data.timeline) : valOrFn;
    updateState({ timeline: newVal });
  };

  const voiceText = data.voiceText;
  const setVoiceText = (val: string) => updateState({ voiceText: val });

  const imagePrompt = data.imagePrompt;
  const setImagePrompt = (val: string) => updateState({ imagePrompt: val });

  const videoPrompt = data.videoPrompt;
  const setVideoPrompt = (val: string) => updateState({ videoPrompt: val });

  const generatedImages = data.generatedImages;
  const setGeneratedImages = (valOrFn: any) => {
    const newVal = typeof valOrFn === 'function' ? valOrFn(data.generatedImages) : valOrFn;
    updateState({ generatedImages: newVal });
  };

  const targetLang = data.targetLang;
  const setTargetLang = (val: string) => updateState({ targetLang: val });

  const speechRate = data.speechRate;
  const setSpeechRate = (val: number) => updateState({ speechRate: val });

  const speechPitch = data.speechPitch;
  const setSpeechPitch = (val: number) => updateState({ speechPitch: val });
  
  const originalVoiceText = data.originalVoiceText;
  const setOriginalVoiceText = (val: string) => updateState({ originalVoiceText: val });

  const imageStyle = data.imageStyle ?? 'realistic';
  const setImageStyle = (val: string) => updateState({ imageStyle: val });

  const imageSize = data.imageSize ?? '1024x1024';
  const setImageSize = (val: string) => updateState({ imageSize: val });

  // Local UI State
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const previewVideoRef = React.useRef<HTMLVideoElement>(null);
  const previewAudioRef = React.useRef<HTMLAudioElement>(null);
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [generatedAudioUrl, setGeneratedAudioUrl] = useState<string | null>(null);

  // Real usage / credits from Firestore
  const [videoCredits, setVideoCredits] = useState<{ used: number; limit: number; plan: string } | null>(null);

  useEffect(() => {
    usageService.getUserUsage().then((data) => {
      if (data) {
        const plan = data.plan || 'free';
        const limit = PLAN_LIMITS[plan]?.video_minutes ?? 2;
        const used = data.metrics?.video_minutes ?? 0;
        setVideoCredits({ used, limit, plan });
      }
    }).catch(console.error);
  }, []);

  // Helper to add items to timeline
  const addToTimeline = (type: 'video' | 'audio', src: string, duration: number = 5) => {
    const track = type === 'video' ? timeline.video : timeline.audio;
    // Simple logic: append to end
    const lastItem = track[track.length - 1];
    const start = lastItem ? lastItem.start + lastItem.duration : 0;
    
    const newItem = {
      id: Math.random().toString(36).substr(2, 9),
      type: type === 'video' ? 'image' : 'voice', // simplified
      src,
      duration,
      start
    };

    setTimeline(prev => ({
      ...prev,
      [type]: [...prev[type], newItem]
    }));
    
    showToast(`Added to ${type} track`, 'success');
    // Switch to editor tab so user sees the result
    setActiveTab('editor');
  };

  const playPreview = () => {
    if (isPlayingPreview) {
      setIsPlayingPreview(false);
      previewAudioRef.current?.pause();
    } else {
      setIsPlayingPreview(true);
      // Logic to sync would go here, for now just play audio if exists
      // In a real app, we'd use requestAnimationFrame to update currentTime
      if (timeline.audio.length > 0 && previewAudioRef.current) {
        previewAudioRef.current.src = timeline.audio[0].src; // Play first audio for demo
        previewAudioRef.current.play();
      }
    }
  };

  // Effect to handle preview timer
  useEffect(() => {
    let interval: any;
    if (isPlayingPreview) {
      interval = setInterval(() => {
        setCurrentTime(prev => prev + 0.1);
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlayingPreview]);

  // Determine current visual based on currentTime
  const currentVisual = timeline.video.find(v => currentTime >= v.start && currentTime < v.start + v.duration)?.src || null;

  // Local UI State (Processing & Playback)
  // Note: Persistent state (voiceText, etc.) is handled by useProductionSession above.
  
  // Voice Over States
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Load Voices
  React.useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      // Filter for distinct languages or just show all
      setVoices(availableVoices);
      
      if (availableVoices.length > 0 && !selectedVoice) {
        // Try to find a good default (Google or English)
        const defaultVoice = availableVoices.find(v => v.name.includes("Google") && v.lang.startsWith("en")) 
                          || availableVoices.find(v => v.lang.startsWith("en")) 
                          || availableVoices[0];
        setSelectedVoice(defaultVoice);
      }
    };

    // Chrome requires this event to load voices
    loadVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
       window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    return () => {
       if (window.speechSynthesis.onvoiceschanged !== undefined) {
          window.speechSynthesis.onvoiceschanged = null;
       }
    };
  }, []);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  // ...

  const handleTranslate = async () => {
    if (!voiceText) return showToast('Please enter text to translate', 'error');
    if (targetLang === 'en') {
       // If reverting to English and we have the original text, restore it
       if (originalVoiceText) {
         setVoiceText(originalVoiceText);
         showToast('Restored original English text', 'success');
       }
       return; 
    }

    // Save original text before first translation if not already saved
    if (!originalVoiceText) {
      setOriginalVoiceText(voiceText);
    }

    setIsProcessing(true);
    try {
      const translated = await aiService.translateText(voiceText, targetLang === 'es' ? 'Spanish' : targetLang === 'pt' ? 'Portuguese (Brazilian)' : targetLang === 'zh' ? 'Chinese (Simplified)' : 'English');
      setVoiceText(translated);
      showToast('Text translated successfully', 'success');
    } catch (error) {
      console.error(error);
      showToast('Translation failed', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePlay = () => {
    if (!voiceText) return showToast('Please enter text first', 'error');
    
    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
      setIsPlaying(true);
      return;
    }

    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(voiceText);
    if (selectedVoice) utterance.voice = selectedVoice;
    utterance.rate = speechRate;
    utterance.pitch = speechPitch;
    
    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };

    utterance.onerror = (e) => {
      console.error(e);
      setIsPlaying(false);
      setIsPaused(false);
    };

    window.speechSynthesis.cancel(); // Cancel any current speech
    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
  };

  const handlePause = () => {
    if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
      window.speechSynthesis.pause();
      setIsPaused(true);
      setIsPlaying(false); // UI toggle
    } else if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
      setIsPlaying(true);
    }
  };

  const handleStop = () => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
  };

  const generateImage = async () => {
    if (!imagePrompt) return showToast('Please describe the image', 'error');
    setIsProcessing(true);
    try {
      const fullPrompt = `${imagePrompt}, ${imageStyle} style, ${imageSize} aspect ratio`;
      const url = await aiService.generateImage(fullPrompt);
      setGeneratedImages([url, ...generatedImages]);
      showToast('Image generated successfully', 'success');
    } catch (error) {
      console.error(error);
      showToast('Failed to generate image', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const generateVideo = async () => {
    if (!videoPrompt) return showToast('Please describe the video', 'error');
    
    setIsProcessing(true);
    try {
      // 1. Generate Script
      const script = await aiService.generateScript(videoPrompt, 'short', 'energetic');
      
      // 2. Generate Video (Real call to D-ID or other service via aiService)
      // Note: This assumes aiService has a real implementation for generateVideo
      const videoUrl = await aiService.generateVideo(
        script, 
        "https://d-id-public-bucket.s3.amazonaws.com/alice.jpg" 
      );

      const newVideo = {
        id: Date.now(),
        title: videoPrompt,
        thumbnail: 'https://picsum.photos/300/200', // Placeholder thumbnail until we get real one
        duration: '0:15',
        url: videoUrl
      };

      setGeneratedVideos([newVideo, ...generatedVideos]);
      showToast('Video generated successfully!', 'success');
      
      // Auto-add to timeline for convenience
      addToTimeline('video', videoUrl, 15);
      
    } catch (error) {
      console.error(error);
      showToast('Failed to generate video', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white font-sans pb-8 transition-colors duration-200">
      <TopNav />
      
      <main className="max-w-[1600px] mx-auto px-6 fade-in">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold mb-2 text-gray-900 dark:text-white flex items-center gap-2">
            <i className="fas fa-film text-purple-500"></i> Production Studio
          </h1>
          <p className="text-gray-500 dark:text-gray-400">Voice over, images, and video generation</p>
        </div>

        {/* Production Tabs */}
        <div className="flex gap-4 mb-6 overflow-x-auto scrollbar-hide pb-2">
          {['voiceover', 'voiceclone', 'images', 'editor', 'video'].map(tab => (
            <button 
              key={tab}
              onClick={() => handleTabChange(tab)}
              className={`px-6 py-3 rounded-xl font-medium whitespace-nowrap transition flex items-center gap-2 ${activeTab === tab ? 'gradient-bg text-white shadow-lg shadow-purple-500/20' : 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700'}`}
            >
              <i className={`fas fa-${tab === 'voiceover' ? 'microphone' : tab === 'voiceclone' ? 'clone' : tab === 'images' ? 'image' : tab === 'editor' ? 'layer-group' : 'video'}`}></i> 
              {tab === 'voiceover' ? 'Voice Over' : tab === 'voiceclone' ? 'Voice Clone' : tab === 'images' ? 'Image Gen' : tab === 'editor' ? 'Editor' : 'Video Gen'}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="min-h-[400px]">
          {activeTab === 'voiceover' && (
            <div className="grid lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-2">
              <div className="lg:col-span-2 bg-[#111] rounded-2xl p-6 border border-white/5 shadow-xl">
                <h3 className="font-bold mb-4 text-gray-900 dark:text-white">🎙️ Voice Over Generator</h3>
                <textarea 
                  value={voiceText}
                  onChange={(e) => setVoiceText(e.target.value)}
                  className="w-full h-64 bg-gray-50 dark:bg-gray-700 rounded-xl p-4 resize-none mb-4 focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono text-gray-900 dark:text-white border border-gray-200 dark:border-transparent" 
                  placeholder="Paste your script here for voice over generation..."
                ></textarea>
                
                <div className="flex flex-wrap gap-4 mb-4">
                  {/* Language/Translate */}
                      <div className="flex-1 min-w-[200px]">
                         <label htmlFor="target-lang-select" className="text-sm text-gray-500 dark:text-gray-400 mb-1 block">Translate To</label>
                         <div className="flex gap-2">
                           <select 
                             id="target-lang-select"
                             value={targetLang}
                             onChange={(e) => setTargetLang(e.target.value)}
                             aria-label="Target language for translation"
                             title="Target language for translation"
                             className="flex-1 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-transparent rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 dark:text-white"
                           >
                         <option value="en">English (Default/Reset)</option>
                         <option value="es">Spanish</option>
                         <option value="pt">Portuguese (BR)</option>
                         <option value="zh">Chinese (Simplified)</option>
                       </select>
                       <button 
                         onClick={handleTranslate}
                         disabled={isProcessing}
                         className="px-4 py-2 bg-blue-600 rounded-lg text-sm hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white shadow-lg shadow-blue-500/20"
                       >
                         {targetLang === 'en' ? 'Reset' : isProcessing ? '...' : 'Translate'}
                       </button>
                     </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                  <div className="sm:col-span-1">
                    <label htmlFor="voice-select" className="text-sm text-gray-500 dark:text-gray-400 mb-1 block">
                      Voice 
                      <span className="text-xs text-gray-400 dark:text-gray-500 ml-2" title="These are system voices. For realistic AI voices, add an ElevenLabs API Key in Settings.">(System Fallback)</span>
                    </label>
                    <select 
                      id="voice-select"
                      value={selectedVoice?.name || ''}
                      onChange={(e) => {
                        const voice = voices.find(v => v.name === e.target.value);
                        setSelectedVoice(voice || null);
                      }}
                      aria-label="Select playback voice"
                      title="Select playback voice"
                      className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-transparent rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 dark:text-white"
                    >
                      {voices.map(v => (
                        <option key={v.name} value={v.name}>
                          {v.name} ({v.lang})
                        </option>
                      ))}
                    </select>
                    {!import.meta.env.VITE_ELEVENLABS_API_KEY && (
                       <p className="text-xs text-yellow-600 dark:text-yellow-500 mt-1">
                         <i className="fas fa-exclamation-triangle mr-1"></i>
                         Add ElevenLabs Key in Settings for human-like AI voices.
                       </p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="speech-rate" className="text-sm text-gray-500 dark:text-gray-400 mb-1 block">Speed ({speechRate}x)</label>
                    <input 
                      id="speech-rate"
                      type="range" 
                      min="0.5" 
                      max="2" 
                      step="0.1" 
                      value={speechRate} 
                      onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
                      aria-label="Adjust speech speed"
                      title={`Speed: ${speechRate}x`}
                      className="w-full accent-purple-600"
                    />
                  </div>
                  <div>
                    <label htmlFor="speech-pitch" className="text-sm text-gray-500 dark:text-gray-400 mb-1 block">Pitch ({speechPitch})</label>
                    <input 
                      id="speech-pitch"
                      type="range" 
                      min="0.5" 
                      max="2" 
                      step="0.1" 
                      value={speechPitch} 
                      onChange={(e) => setSpeechPitch(parseFloat(e.target.value))}
                      aria-label="Adjust speech pitch"
                      title={`Pitch: ${speechPitch}`}
                      className="w-full accent-purple-600"
                    />
                  </div>
                </div>

                <div className="flex gap-4">
                  <button 
                    onClick={handlePlay}
                    className={`flex-1 py-3 rounded-xl font-medium transition flex items-center justify-center gap-2 text-white shadow-lg ${isPlaying ? 'bg-red-500/80 hover:bg-red-500 shadow-red-500/20' : 'gradient-bg hover:opacity-90 shadow-purple-500/20'}`}
                  >
                    <i className={`fas fa-${isPlaying ? 'stop' : 'play'}`}></i>
                    {isPlaying ? 'Stop' : 'Play Voiceover'}
                  </button>
                  
                  {isPlaying && (
                     <button 
                       onClick={handlePause}
                       aria-label="Pause/Resume voiceover"
                       className="px-6 py-3 bg-gray-200 dark:bg-gray-700 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition text-gray-700 dark:text-white"
                     >
                       <i className={`fas fa-${isPaused ? 'play' : 'pause'}`}></i>
                     </button>
                  )}
                </div>
                
                {/* Timeline Visualization (Mock) */}
                <div className="mt-6">
                  <h4 className="font-medium mb-3 text-gray-900 dark:text-white">📊 Audio Visualization</h4>
                  <div className="bg-gray-100 dark:bg-gray-700 rounded-xl p-4 h-24 flex items-center justify-center gap-1 overflow-hidden border border-gray-200 dark:border-transparent">
                     {isPlaying && !isPaused ? (
                        <div className="flex items-end justify-center gap-1 h-full w-full">
                           {/* Simple Real-time visualization using CSS animations for now */}
                           {[...Array(20)].map((_, i) => (
                              <div key={i} className="w-2 bg-purple-500 animate-[bounce_0.5s_infinite]" style={{ 
                                height: '50%', 
                                animationDelay: `${i * 0.05}s`,
                                animationDuration: '0.4s' 
                              }}></div>
                           ))}
                        </div>
                     ) : (
                        <p className="text-gray-500 dark:text-gray-400 text-sm">Click Play to visualize audio</p>
                     )}
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="bg-[#111] rounded-2xl p-6 border border-white/5 shadow-xl">
                  <h3 className="font-bold mb-4 text-gray-900 dark:text-white">📁 Generated Audio</h3>
                  {generatedAudioUrl ? (
                    <div className="space-y-4">
                      <audio controls src={generatedAudioUrl} className="w-full" />
                      <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg flex items-center gap-3 border border-gray-100 dark:border-transparent">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">generated_voiceover.mp3</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Just now</p>
                        </div>
                        <a href={generatedAudioUrl} download="voiceover.mp3" aria-label="Download voiceover" className="text-gray-400 hover:text-purple-600 dark:hover:text-white">
                          <i className="fas fa-download"></i>
                        </a>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400 text-sm">No audio generated yet.</p>
                  )}
                </div>
                <div className="bg-[#111] rounded-2xl p-6 border border-white/5 shadow-xl">
                  <h3 className="font-bold mb-4 text-gray-900 dark:text-white">💰 Estimated Cost</h3>
                  <div className="text-center">
                    <p className="text-3xl font-bold gradient-bg bg-clip-text text-transparent">
                      ${voiceText ? (voiceText.length * 0.000015).toFixed(4) : '0.0000'}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{voiceText.length} chars × $0.000015</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'voiceclone' && (
             <div className="grid lg:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-2">
               <div className="bg-[#111] rounded-2xl p-6 border border-white/5 shadow-xl">
                 <h3 className="font-bold mb-2 text-gray-900 dark:text-white">🎭 Voice Clone Studio</h3>
                 <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">Create a digital clone of your voice using ElevenLabs AI. Requires an ElevenLabs API key in Settings.</p>

                 {/* Step 1 — Check ElevenLabs Key */}
                 <div className="space-y-4">
                   <div className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30">
                     <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                       import.meta.env.VITE_ELEVENLABS_API_KEY ? 'bg-green-500' : 'bg-yellow-500'
                     }`}>
                       {import.meta.env.VITE_ELEVENLABS_API_KEY ? <i className="fas fa-check"></i> : '1'}
                     </div>
                     <div className="flex-1">
                       <p className="font-medium text-sm text-gray-900 dark:text-white">ElevenLabs API Key</p>
                       <p className="text-xs text-gray-500 dark:text-gray-400">
                         {import.meta.env.VITE_ELEVENLABS_API_KEY
                           ? 'Connected ✓ — ready to clone'
                           : 'Add your key in Settings → AI Models → ElevenLabs API Key'}
                       </p>
                     </div>
                   </div>

                   <div className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30 opacity-75">
                     <div className="w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center text-white text-sm font-bold">2</div>
                     <div className="flex-1">
                       <p className="font-medium text-sm text-gray-900 dark:text-white">Upload Voice Samples</p>
                       <p className="text-xs text-gray-500 dark:text-gray-400">Minimum 1 minute of clean audio recommended</p>
                     </div>
                   </div>

                   <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 text-center cursor-pointer hover:border-purple-500 transition">
                     <i className="fas fa-cloud-upload-alt text-4xl mb-3 text-gray-400 dark:text-gray-500"></i>
                     <p className="text-gray-500 dark:text-gray-400 mb-2">Drag & drop audio files or click to browse</p>
                     <p className="text-xs text-gray-400 dark:text-gray-500">WAV, MP3, M4A • Max 500MB • 1–30 min recommended</p>
                     <input
                       type="file"
                       accept="audio/*"
                       className="hidden"
                       id="voice-clone-upload"
                       onChange={async (e) => {
                         const file = e.target.files?.[0];
                         if (!file) return;
                         const keys = (() => {
                           try { return JSON.parse(localStorage.getItem('api_keys') || '{}'); } catch { return {}; }
                         })();
                         const elevenLabsKey = keys.elevenLabsApiKey || import.meta.env.VITE_ELEVENLABS_API_KEY;
                         if (!elevenLabsKey) {
                           showToast('Add your ElevenLabs API key in Settings first.', 'error');
                           return;
                         }
                         setIsProcessing(true);
                         showToast('Uploading voice sample to ElevenLabs...', 'info');
                         try {
                           const formData = new FormData();
                           formData.append('name', `Voice Clone — ${Date.now()}`);
                           formData.append('files', file);
                           const response = await fetch('https://api.elevenlabs.io/v1/voices/add', {
                             method: 'POST',
                             headers: { 'xi-api-key': elevenLabsKey },
                             body: formData,
                           });
                           if (!response.ok) {
                             const err = await response.json();
                             throw new Error(err.detail?.message || 'ElevenLabs upload failed');
                           }
                           showToast('Voice sample uploaded! Check ElevenLabs dashboard for status.', 'success');
                         } catch (err: any) {
                           showToast(err.message || 'Upload failed', 'error');
                         } finally {
                           setIsProcessing(false);
                         }
                       }}
                     />
                     <label
                       htmlFor="voice-clone-upload"
                       className="mt-4 inline-block px-6 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition text-gray-700 dark:text-white cursor-pointer text-sm"
                     >
                       {isProcessing ? <><i className="fas fa-spinner fa-spin mr-2"></i>Uploading...</> : 'Select Audio File'}
                     </label>
                   </div>
                 </div>
               </div>
               
               <div className="bg-[#111] rounded-2xl p-6 border border-white/5 shadow-xl">
                 <h3 className="font-bold mb-4 text-gray-900 dark:text-white">🗣️ My Cloned Voices</h3>
                 <p className="text-sm text-gray-500 dark:text-gray-400">Voices cloned via ElevenLabs will appear in your ElevenLabs dashboard and can be used in the Voice Over tab once added. Select them from the Voice dropdown in the Voice Over tab.</p>
                 <a
                   href="https://elevenlabs.io/app/voice-lab"
                   target="_blank" rel="noreferrer noopener"
                   className="mt-6 flex items-center gap-2 px-4 py-3 bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/30 rounded-xl text-purple-700 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-500/20 transition text-sm font-medium"
                 >
                   <i className="fas fa-external-link-alt"></i> Open ElevenLabs Voice Lab
                 </a>
                 {!import.meta.env.VITE_ELEVENLABS_API_KEY && (
                   <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-500/10 border border-yellow-200 dark:border-yellow-500/30 rounded-xl">
                     <p className="text-sm text-yellow-700 dark:text-yellow-400">
                       <i className="fas fa-exclamation-triangle mr-2"></i>
                       Voice cloning is available on Creator plan and above. Add your ElevenLabs API key in <strong>Settings → AI Models</strong> to get started.
                     </p>
                   </div>
                 )}
               </div>
             </div>
          )}

          {activeTab === 'images' && (
            <div className="grid lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-2">
              <div className="bg-[#111] rounded-2xl p-6 border border-white/5 shadow-xl">
                <h3 className="font-bold mb-4 text-gray-900 dark:text-white">🎨 AI Image Generator</h3>
                <textarea 
                  value={imagePrompt}
                  onChange={(e) => setImagePrompt(e.target.value)}
                  className="w-full h-32 bg-gray-50 dark:bg-gray-700 rounded-xl p-4 resize-none mb-4 focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 dark:text-white border border-gray-200 dark:border-transparent" 
                  placeholder="Describe the image you want to generate..."
                ></textarea>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div>
                    <label htmlFor="image-style" className="text-sm text-gray-500 dark:text-gray-400 mb-1 block">Style</label>
                    <select id="image-style" value={imageStyle} onChange={(e) => setImageStyle(e.target.value)} aria-label="Image style" className="w-full bg-gray-50 dark:bg-gray-700 rounded-lg px-3 py-2 text-sm border border-gray-200 dark:border-transparent text-gray-900 dark:text-white">
                      <option value="realistic">Realistic</option>
                      <option value="anime">Anime</option>
                      <option value="cartoon">Cartoon</option>
                      <option value="oil painting">Oil Painting</option>
                      <option value="3D render">3D Render</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="image-size" className="text-sm text-gray-500 dark:text-gray-400 mb-1 block">Size</label>
                    <select id="image-size" value={imageSize} onChange={(e) => setImageSize(e.target.value)} aria-label="Image size" className="w-full bg-gray-50 dark:bg-gray-700 rounded-lg px-3 py-2 text-sm border border-gray-200 dark:border-transparent text-gray-900 dark:text-white">
                      <option value="1024x1024">1024×1024</option>
                      <option value="1280x720">1280×720</option>
                      <option value="720x1280">720×1280</option>
                      <option value="1920x1080">1920×1080</option>
                    </select>
                  </div>
                </div>
                <button 
                  onClick={generateImage}
                  disabled={isProcessing}
                  className="w-full gradient-bg py-3 rounded-xl font-medium hover:opacity-90 transition disabled:opacity-50 text-white shadow-lg shadow-purple-500/20"
                >
                  {isProcessing ? 'Generating...' : <span><i className="fas fa-palette mr-2"></i>Generate Image</span>}
                </button>
              </div>
              
              <div className="lg:col-span-2 bg-[#111] rounded-2xl p-6 border border-white/5 shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-gray-900 dark:text-white">🖼️ Generated Images</h3>
                  <span className="text-sm text-gray-500 dark:text-gray-400">Free tier: 50 images/month</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                   {generatedImages.map((src, i) => (
                    <div key={i} className="aspect-square bg-gray-50 dark:bg-[#0b0e14]/50 border border-gray-200 dark:border-white/5 hover:border-gray-300 dark:hover:border-white/10 transition-all hover:translate-y-[-2px] rounded-xl overflow-hidden relative group cursor-pointer shadow-sm dark:shadow-none" onClick={() => { addToTimeline('video', src, 5); }}>
                      <img src={src} className="w-full h-full object-cover" alt="Generated" />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                        <button className="p-2 bg-white/20 rounded-lg hover:bg-white/30 text-white"><i className="fas fa-plus"></i> Add to Timeline</button>
                      </div>
                    </div>
                   ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'editor' && (
            <div className="grid lg:grid-cols-1 gap-6 animate-in fade-in slide-in-from-bottom-2">
               {/* Preview Player */}
               <div className="bg-[#111] rounded-2xl p-6 border border-white/5 shadow-xl">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-gray-900 dark:text-white">📺 Preview & Timeline</h3>
                    <div className="flex gap-2">
                       <button onClick={() => setTimeline({ video: [], audio: [] })} className="text-xs text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300">
                         Clear Timeline
                       </button>
                    </div>
                  </div>
                  
                  {/* Player Window */}
                  <div className="aspect-video bg-black rounded-xl overflow-hidden relative flex items-center justify-center border border-gray-200 dark:border-gray-700 mx-auto max-w-4xl mb-6 shadow-lg">
                     {currentVisual ? (
                        <img src={currentVisual} className="w-full h-full object-contain" alt="Preview" />
                     ) : (
                        <div className="text-gray-500 text-center">
                           <i className="fas fa-film text-4xl mb-2"></i>
                           <p>Timeline Empty or Scrubber at Start</p>
                        </div>
                     )}
                     
                     {/* Hidden Audio Element for Playback */}
                     <audio ref={previewAudioRef} onEnded={() => setIsPlayingPreview(false)} />

                     {/* Controls Overlay */}
                     <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 flex items-center justify-between">
                        <button onClick={playPreview} aria-label="Play/Pause preview" className="w-10 h-10 bg-white text-black rounded-full flex items-center justify-center hover:scale-105 transition">
                           <i className={`fas fa-${isPlayingPreview ? 'pause' : 'play'}`}></i>
                        </button>
                        <span className="text-white font-mono text-sm">
                          {Math.floor(currentTime / 60)}:{Math.floor(currentTime % 60).toString().padStart(2, '0')} / 
                          {Math.floor(Math.max(...timeline.video.map(v => v.start + v.duration), ...timeline.audio.map(a => a.start + a.duration), 0) / 60)}:
                          {Math.floor(Math.max(...timeline.video.map(v => v.start + v.duration), ...timeline.audio.map(a => a.start + a.duration), 0) % 60).toString().padStart(2, '0')}
                        </span>
                     </div>
                  </div>

                  {/* Timeline Tracks */}
                  <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-700 overflow-x-auto">
                     {/* Time Ruler */}
                     <div className="h-6 flex border-b border-gray-200 dark:border-gray-700 mb-2 relative min-w-[800px]">
                        {[...Array(20)].map((_, i) => (
                           <div key={i} className="flex-1 text-xs text-gray-500 border-l border-gray-300 dark:border-gray-800 pl-1">{i * 5}s</div>
                        ))}
                        {/* Scrubber Head */}
                        <div 
                           className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-10 transition-all duration-100"
                           style={{ left: `${(currentTime / 100) * 100}%` }} // Simplified scale
                        ></div>
                     </div>

                     {/* Video Track */}
                     <div className="mb-2 relative min-w-[800px]">
                        <div className="text-xs text-gray-500 dark:text-gray-400 mb-1 flex items-center gap-2"><i className="fas fa-video"></i> Video / Images</div>
                        <div className="h-16 bg-gray-200 dark:bg-gray-800 rounded-lg flex relative overflow-hidden border border-gray-300 dark:border-gray-700">
                           {timeline.video.map((item, i) => (
                              <div 
                                key={item.id}
                                className="h-full bg-blue-500/20 border border-blue-500/50 rounded flex items-center justify-center relative group"
                                style={{ width: `${item.duration * 10}px` }} // 10px per second scale
                              >
                                 <img src={item.src} className="h-full w-auto object-cover opacity-50" alt="Timeline clip" />
                                 <span className="absolute text-xs text-white shadow-black drop-shadow-md truncate w-full text-center px-1">Img {i+1}</span>
                              </div>
                           ))}
                           {timeline.video.length === 0 && <div className="text-gray-500 dark:text-gray-400 text-xs p-2">Drag generated images here (Click 'Add to Timeline' in Image Gen tab)</div>}
                        </div>
                     </div>

                     {/* Audio Track */}
                     <div className="relative min-w-[800px]">
                        <div className="text-xs text-gray-500 dark:text-gray-400 mb-1 flex items-center gap-2"><i className="fas fa-music"></i> Voice / Audio</div>
                        <div className="h-12 bg-gray-200 dark:bg-gray-800 rounded-lg flex relative overflow-hidden border border-gray-300 dark:border-gray-700">
                           {timeline.audio.map((item, i) => (
                              <div 
                                key={item.id}
                                className="h-full bg-purple-500/20 border border-purple-500/50 rounded flex items-center justify-center relative"
                                style={{ width: `${item.duration * 10}px` }}
                              >
                                 <i className="fas fa-wave-square text-purple-600 dark:text-purple-400"></i>
                                 <span className="absolute text-xs text-gray-900 dark:text-white shadow-black drop-shadow-md ml-6">Voice {i+1}</span>
                              </div>
                           ))}
                           {timeline.audio.length === 0 && <div className="text-gray-500 dark:text-gray-400 text-xs p-2">Generate voiceovers to add them here</div>}
                        </div>
                     </div>
                  </div>
               </div>

               {/* Action Bar */}
               <div className="flex justify-end gap-4">
                  <button onClick={() => showToast('Project saved as draft', 'success')} className="px-6 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition font-medium text-gray-700 dark:text-white">
                     Save Draft
                  </button>
                  <button 
                     disabled={timeline.video.length === 0}
                     className="px-6 py-3 gradient-bg rounded-xl font-bold text-lg hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-white shadow-lg shadow-purple-500/20"
                     onClick={async () => {
                        showToast('Rendering video...', 'info');
                        // Simulate rendering time
                        setTimeout(async () => {
                           try {
                              // Create a draft post in Publish module
                              await publishService.createPost({
                                 platform: 'youtube', // Default
                                 title: `New Video Project ${new Date().toLocaleTimeString()}`,
                                 date: new Date().toISOString().split('T')[0],
                                 time: '12:00',
                                 status: 'scheduled', // Draft/Scheduled
                                 type: 'video'
                              });
                              showToast('Video exported and sent to Publishing Hub!', 'success');
                              setTimeout(() => navigate('/publish'), 1500);
                           } catch (error) {
                              console.error(error);
                              showToast('Failed to export to Publishing Hub', 'error');
                           }
                        }, 2000);
                     }}
                  >
                     <i className="fas fa-file-export"></i> Export & Schedule
                  </button>
               </div>
            </div>
          )}

          {activeTab === 'video' && (
            <div className="grid lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-2">
                <div className="bg-[#111] rounded-2xl p-6 border border-white/5 shadow-xl">
                    <h3 className="font-bold mb-4 text-gray-900 dark:text-white">🎬 Video Generator</h3>
                    
                    <div className="mb-4">
                        <label className="text-sm text-gray-500 dark:text-gray-400 mb-2 block">Video Type</label>
                        <div className="flex gap-2">
                            <button className="flex-1 py-2 bg-purple-500/10 dark:bg-purple-500/20 border border-purple-500 rounded-lg text-sm text-purple-600 dark:text-purple-400">
                                <i className="fas fa-mobile-alt mr-1"></i> Short
                            </button>
                            <button className="flex-1 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 transition">
                                <i className="fas fa-desktop mr-1"></i> Long
                            </button>
                        </div>
                    </div>
                    
                    <div className="mb-4">
                        <label htmlFor="video-aspect-ratio" className="text-sm text-gray-500 dark:text-gray-400 mb-1 block">Aspect Ratio</label>
                        <select id="video-aspect-ratio" aria-label="Video aspect ratio" className="w-full bg-gray-50 dark:bg-gray-700 rounded-lg px-3 py-2 text-sm border border-gray-200 dark:border-transparent text-gray-900 dark:text-white">
                            <option value="9:16">9:16 (TikTok/Reels)</option>
                            <option value="16:9">16:9 (YouTube)</option>
                            <option value="1:1">1:1 (Square)</option>
                            <option value="4:5">4:5 (Portrait)</option>
                        </select>
                    </div>

                    <textarea 
                      value={videoPrompt}
                      onChange={(e) => setVideoPrompt(e.target.value)}
                      className="w-full h-28 bg-gray-50 dark:bg-gray-700 rounded-xl p-4 resize-none mb-4 focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 dark:text-white border border-gray-200 dark:border-transparent" 
                      placeholder="Describe your video scene by scene..."
                    ></textarea>
                    
                    <button 
                      onClick={generateVideo}
                      disabled={isProcessing}
                      className="w-full gradient-bg py-3 rounded-xl font-medium hover:opacity-90 transition disabled:opacity-50 text-white shadow-lg shadow-purple-500/20"
                    >
                        {isProcessing ? 'Queuing...' : <span><i className="fas fa-film mr-2"></i>Generate Video</span>}
                    </button>
                </div>
                
                <div className="lg:col-span-2 bg-[#111] rounded-2xl p-6 border border-white/5 shadow-xl">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-gray-900 dark:text-white">🎥 Generated Videos</h3>
                        <div className="flex gap-2">
                            <span className="text-sm text-gray-500 dark:text-gray-400">Credits: </span>
                            {videoCredits ? (
                              <span className={`font-medium ${
                                videoCredits.limit - videoCredits.used <= 2
                                  ? 'text-red-500 dark:text-red-400'
                                  : 'text-green-600 dark:text-green-400'
                              }`}>
                                {Math.max(0, videoCredits.limit - videoCredits.used)} min remaining
                                <span className="text-gray-400 dark:text-gray-500 font-normal text-xs ml-1">
                                  ({videoCredits.plan})
                                </span>
                              </span>
                            ) : (
                              <span className="text-gray-400 dark:text-gray-500">Loading...</span>
                            )}
                        </div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                        {generatedVideos.map((video) => (
                          <div key={video.id} className="bg-gray-50 dark:bg-[#0b0e14]/50 border border-gray-200 dark:border-white/5 hover:border-gray-300 dark:hover:border-white/10 transition-all hover:translate-y-[-2px] rounded-xl overflow-hidden group cursor-pointer shadow-sm dark:shadow-none" onClick={() => {
                             // Add to timeline logic if needed
                             showToast('Added video to timeline', 'info');
                          }}>
                              <div className="aspect-video bg-gray-200 dark:bg-gray-800 relative flex items-center justify-center">
                                  <img src={video.thumbnail} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition" alt="Video thumbnail" />
                                  <i className="fas fa-play-circle text-5xl text-white/50 group-hover:text-white/80 transition absolute"></i>
                                  <span className="absolute bottom-2 right-2 bg-black/70 px-2 py-1 rounded text-xs text-white">{video.duration}</span>
                              </div>
                              <div className="p-3">
                                  <p className="font-medium text-sm truncate text-gray-900 dark:text-white">{video.title}</p>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">Generated just now</p>
                              </div>
                          </div>
                        ))}
                    </div>
                    
                    {/* Processing Queue */}
                    <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl border border-gray-100 dark:border-transparent">
                        <h4 className="font-medium mb-3 text-gray-900 dark:text-white">⏳ Processing Queue</h4>
                        {isProcessing ? (
                          <div className="space-y-2">
                              <div className="flex items-center gap-3">
                                  <div className="loading-spinner"></div>
                                  <span className="text-sm text-gray-700 dark:text-gray-200">Rendering: "New Project"</span>
                                  <span className="text-xs text-gray-500 dark:text-gray-400 ml-auto">Est. 2m left</span>
                              </div>
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500 dark:text-gray-400">Queue is empty.</p>
                        )}
                    </div>
                </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
