import React, { useState, useEffect } from 'react';
import { TopNav } from '@/components/dashboard/TopNav';
import { scriptService, ScriptData } from '@/services/scriptService';
import { aiService } from '@/services/aiService';
import { Timestamp } from 'firebase/firestore';
import { useNavigate, useLocation } from 'react-router-dom';
import { showToast } from '@/utils/toast';

// Mock AI Data
const HOOKS = [
  "Have you ever wondered how to [TOPIC]? Well, today I'm going to show you exactly how.",
  "Stop doing [TOPIC] the wrong way! Here is the secret method experts use.",
  "This is the ultimate guide to [TOPIC] that I wish I had when I started.",
  "What if I told you that [TOPIC] is easier than you think?",
  "3 secrets about [TOPIC] that nobody is talking about."
];

const INTROS = [
  "Hi everyone, I'm [NAME] and on this channel we help you master [NICHE]. If you're new here, consider subscribing!",
  "Welcome back to the channel! I'm [NAME], and today we are diving deep into [TOPIC].",
  "Hey guys! It's [NAME]. In this video, we're breaking down everything you need to know about [TOPIC]."
];

const BODY_TEMPLATES = [
  "[POINT 1]\nFirst, let's talk about the basics. It's crucial to understand...\n\n[POINT 2]\nNext, we need to look at the advanced techniques. For example...\n\n[POINT 3]\nFinally, let's put it all together. The key takeaway is...",
  "[STEP 1]\nStep one is simple but effective. You just need to...\n\n[STEP 2]\nOnce that's done, move on to step two. This is where the magic happens...\n\n[STEP 3]\nLastly, don't forget to optimize. A common mistake is...",
  "[MYTH]\nA lot of people think that... but actually...\n\n[TRUTH]\nThe reality is that... and here is why...\n\n[APPLICATION]\nSo how can you apply this? Start by..."
];

const CONCLUSIONS = [
  "So there you have it! That's how you master [TOPIC].",
  "I hope this video helped you understand [TOPIC] better.",
  "Now you have all the tools you need to succeed with [TOPIC]."
];

const CTAS = [
  "Don't forget to smash that like button and subscribe for more content!",
  "If you found this helpful, share it with a friend and leave a comment below.",
  "Check out the link in the description for more resources. Thanks for watching!"
];

export default function Script() {
  const navigate = useNavigate();
  const location = useLocation();
  const [scriptContent, setScriptContent] = useState('');
  const [title, setTitle] = useState('');

  // Handle incoming data from Ideas page
  useEffect(() => {
    if (location.state && location.state.title) {
      setTitle(location.state.title);
      // Optional: If we had a draft content, we could set it too
    }
  }, [location.state]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speechSynthesisUtterance, setSpeechSynthesisUtterance] = useState<SpeechSynthesisUtterance | null>(null);

  const toggleTTS = () => {
    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    } else {
      if (!scriptContent) return;
      const utterance = new SpeechSynthesisUtterance(scriptContent);
      utterance.onend = () => setIsPlaying(false);
      setSpeechSynthesisUtterance(utterance);
      window.speechSynthesis.speak(utterance);
      setIsPlaying(true);
    }
  };

  // Cleanup TTS on unmount
  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);
  const [type, setType] = useState('medium');
  const [isGenerating, setIsGenerating] = useState(false);
  const [wordCount, setWordCount] = useState(0);

  const [duration, setDuration] = useState('0:00');
  const [savedScripts, setSavedScripts] = useState<ScriptData[]>([]);

  useEffect(() => {
    loadScripts();
  }, []);
    
  useEffect(() => {
    const words = scriptContent.trim().split(/\s+/).filter(w => w.length > 0).length;
    setWordCount(words);

    const minutes = Math.floor(words / 150);
    const seconds = Math.floor(((words / 150) % 1) * 60);
    setDuration(`${minutes}:${seconds.toString().padStart(2, '0')}`);
  }, [scriptContent]);

  const loadScripts = async () => {
    try {
      const scripts = await scriptService.getScripts();
      setSavedScripts(scripts);
    } catch (error) {
      console.error("Failed to load scripts", error);
    }
  };

  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const deleteScript = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (deleteConfirmId !== id) {
      setDeleteConfirmId(id);
      setTimeout(() => setDeleteConfirmId(null), 3000);
      return;
    }
    setDeleteConfirmId(null);
    try {
      await scriptService.deleteScript(id);
      showToast('Script deleted', 'success');
      loadScripts();
    } catch (error) {
      showToast('Failed to delete script', 'error');
    }
  };

  const generateScript = async () => {
    if (!title) {
      showToast('Please enter a title first', 'error');
      return;
    }

    setIsGenerating(true);
    
    try {
      const script = await aiService.generateScript(title, type);
      if (script) {
        // Strip markdown formatting if present
        const cleanScript = script.replace(/[*#_`]/g, '');
        setScriptContent(cleanScript);
        showToast('Script generated successfully!', 'success');
      } else {
        showToast('AI returned empty response', 'error');
      }
    } catch (error) {
      console.error(error);
      showToast('Failed to generate script. Check API Key.', 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  const saveScript = async (redirectTarget?: string) => {
    if (!title || !scriptContent) {
        showToast('Title and content are required', 'error');
        return;
    }
    
    const scriptData: Omit<ScriptData, 'id' | 'createdAt'> = {
      title,
      content: scriptContent,
      type,
      date: new Date().toISOString()
    };

    try {
      await scriptService.createScript(scriptData);
      showToast('Script saved to Firebase', 'success');
      loadScripts(); // Reload list
      
      if (redirectTarget) {
          navigate(redirectTarget);
      }
    } catch (error) {
      showToast('Failed to save script', 'error');
    }
  };

  const exportScript = () => {
    const blob = new Blob([scriptContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.replace(/\s+/g, '_').toLowerCase()}_script.txt`;
    a.click();
    showToast('Script downloaded', 'success');
  };

  const loadScriptContent = (script: ScriptData) => {
    setTitle(script.title);
    setScriptContent(script.content);
    setType(script.type);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white font-sans pb-8 transition-colors duration-200">
      <TopNav />
      
      <main className="max-w-[1600px] mx-auto px-4 pt-24 fade-in">
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">📝 Script Writer</h1>
            <p className="text-gray-600 dark:text-gray-400">AI-powered script generation and transcript management</p>
          </div>
          <button 
            onClick={() => { setTitle(''); setScriptContent(''); }}
            className="gradient-bg px-6 py-2 rounded-lg font-medium hover:opacity-90 transition flex items-center gap-2 w-fit text-white shadow-lg shadow-purple-500/20"
          >
            <i className="fas fa-plus"></i> New Script
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm dark:shadow-none">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <input 
                type="text" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter script title (e.g., How to Code)" 
                className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 dark:text-white"
              />
              <select 
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 dark:text-white"
              >
                <option value="short">Short (60s)</option>
                <option value="medium">Medium (5-10 min)</option>
                <option value="long">Long (10+ min)</option>
                <option value="tutorial">Tutorial</option>
                <option value="vlog">Vlog</option>
              </select>
            </div>
            
            <div className="relative">
              <div className="absolute top-2 right-2 z-10 flex gap-2">
                 <button 
                   onClick={toggleTTS}
                   className={`p-2 rounded-lg transition ${isPlaying ? 'bg-purple-500 text-white animate-pulse' : 'bg-gray-100 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-white'}`}
                   title="Read Aloud (TTS)"
                 >
                   <i className={`fas fa-${isPlaying ? 'stop' : 'volume-up'}`}></i>
                 </button>
              </div>
              <textarea 
                value={scriptContent}
                onChange={(e) => setScriptContent(e.target.value)}
                className="w-full h-[600px] bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-transparent rounded-xl p-6 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono text-base leading-loose text-gray-900 dark:text-white" 
                placeholder="Write your script here or use AI generation..."
              ></textarea>
              {isGenerating && (
                <div className="absolute inset-0 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-xl flex items-center justify-center flex-col gap-4">
                  <div className="loading-spinner"></div>
                  <p className="text-sm font-medium animate-pulse text-gray-900 dark:text-white">AI is writing your script...</p>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-4">
              <button 
                onClick={generateScript}
                disabled={isGenerating}
                className="flex-1 gradient-bg py-3 rounded-xl font-medium hover:opacity-90 transition flex items-center justify-center gap-2 disabled:opacity-50 text-white shadow-lg shadow-purple-500/20"
              >
                <i className="fas fa-magic"></i> AI Generate
              </button>
              <button 
                onClick={() => saveScript()}
                className="flex-1 bg-gray-200 dark:bg-gray-700 py-3 rounded-xl font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition flex items-center justify-center gap-2 text-gray-700 dark:text-white"
              >
                <i className="fas fa-save"></i> Save to Cloud
              </button>
              <button 
                onClick={() => saveScript('/podcast')}
                className="flex-1 bg-purple-600 py-3 rounded-xl font-medium hover:bg-purple-500 transition flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20 text-white"
              >
                <i className="fas fa-microphone"></i> To Studio
              </button>
              <button 
                onClick={exportScript}
                className="bg-purple-100 dark:bg-purple-600/30 text-purple-600 dark:text-purple-400 px-4 rounded-xl hover:bg-purple-200 dark:hover:bg-purple-600/50 transition flex items-center justify-center"
              >
                <i className="fas fa-download"></i>
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm dark:shadow-none">
              <h3 className="font-bold mb-4 text-gray-900 dark:text-white">📋 Script Outline</h3>
              <div className="space-y-2">
                <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition border border-gray-100 dark:border-transparent text-gray-700 dark:text-gray-200" onClick={() => setScriptContent(prev => prev + '\n\n[HOOK]\nHave you ever wondered how to [TOPIC]? Well, today I\'m going to show you exactly how.\n')}>
                  <span className="text-purple-600 dark:text-purple-400 font-bold">Hook:</span> Start with a compelling question
                </div>
                <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition border border-gray-100 dark:border-transparent text-gray-700 dark:text-gray-200" onClick={() => setScriptContent(prev => prev + '\n\n[INTRO]\nHi everyone! Welcome back to the channel. Today we are diving deep into [TOPIC]. If you\'re new here, make sure to subscribe!\n')}>
                  <span className="text-blue-600 dark:text-blue-400 font-bold">Intro:</span> Brief self-introduction (15s)
                </div>
                <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition border border-gray-100 dark:border-transparent text-gray-700 dark:text-gray-200" onClick={() => setScriptContent(prev => prev + '\n\n[MAIN CONTENT]\nFirst, let\'s talk about the basics...\n\nNext, we need to look at the advanced techniques...\n\nFinally, let\'s put it all together...\n')}>
                  <span className="text-green-600 dark:text-green-400 font-bold">Main:</span> Core content delivery
                </div>
                <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition border border-gray-100 dark:border-transparent text-gray-700 dark:text-gray-200" onClick={() => setScriptContent(prev => prev + '\n\n[CALL TO ACTION]\nIf you found this helpful, smash that like button and subscribe for more content like this. Drop a comment below and let me know what you think!\n')}>
                  <span className="text-orange-600 dark:text-orange-400 font-bold">CTA:</span> Call to action (10s)
                </div>
              </div>
            </div>
            
            {/* Saved Scripts List */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-h-[300px] overflow-y-auto border border-gray-200 dark:border-gray-700 shadow-sm dark:shadow-none">
              <h3 className="font-bold mb-4 text-gray-900 dark:text-white">☁️ Saved in Cloud</h3>
              {savedScripts.length === 0 ? (
                 <p className="text-sm text-gray-500 dark:text-gray-400">No saved scripts yet.</p>
              ) : (
                <div className="space-y-2">
                  {savedScripts.map(script => (
                    <div 
                      key={script.id} 
                      onClick={() => loadScriptContent(script)}
                      className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition flex justify-between items-center group border border-gray-100 dark:border-transparent"
                    >
                      <span className="truncate flex-1 pr-2 text-gray-700 dark:text-gray-200">{script.title}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500 dark:text-gray-500 whitespace-nowrap">{new Date(script.date).toLocaleDateString()}</span>
                        <button 
                          onClick={(e) => deleteScript(script.id!, e)}
                          className={`p-1 transition opacity-0 group-hover:opacity-100 text-xs font-bold rounded px-1.5 ${
                            deleteConfirmId === script.id
                              ? 'bg-red-500 text-white opacity-100'
                              : 'hover:text-red-500 dark:hover:text-red-400 text-gray-400'
                          }`}
                          title={deleteConfirmId === script.id ? 'Click again to confirm' : 'Delete'}
                        >
                          {deleteConfirmId === script.id ? 'Confirm?' : <i className="fas fa-trash"></i>}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm dark:shadow-none">
              <h3 className="font-bold mb-4 text-gray-900 dark:text-white">⏱️ Estimated Duration</h3>
              <div className="text-center">
                <p className="text-4xl font-bold gradient-bg bg-clip-text text-transparent">
                  {duration}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{wordCount} words • 150 wpm</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
