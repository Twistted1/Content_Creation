import React, { useRef, useEffect } from 'react';
import { SectionData, Tone } from '../types';
import { cn } from '@/utils/cn';

interface ScriptMainEditorProps {
  activeSection: SectionData;
  activeTone: Tone;
  setActiveTone: (tone: Tone) => void;
  onContentChange: (content: string) => void;
}

const tones: { id: Tone; icon: string; label: string }[] = [
  { id: 'Conversational', icon: 'fa-comments', label: 'Conversational' },
  { id: 'Professional', icon: 'fa-user-tie', label: 'Professional' },
  { id: 'Energetic', icon: 'fa-bolt', label: 'Energetic' },
  { id: 'Educational', icon: 'fa-book-open', label: 'Educational' },
  { id: 'Storytelling', icon: 'fa-book', label: 'Storytelling' },
];

export default function ScriptMainEditor({
  activeSection,
  activeTone,
  setActiveTone,
  onContentChange
}: ScriptMainEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Focus and move cursor to end when section changes
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [activeSection.id]);

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[#0a0a0a]">
      {/* Editor Header / Secondary Toolbar */}
      <div className="flex items-center justify-between px-8 py-4 border-b border-gray-800/50">
        <div className="flex items-center gap-3">
          <span className={cn(
            "text-xs font-bold px-2 py-1 rounded uppercase tracking-wider",
            activeSection.colorClass
          )}>
            {activeSection.type}
          </span>
          <h2 className="text-xl font-bold text-white">{activeSection.title}</h2>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-1 bg-gray-900 rounded-lg p-1 border border-gray-800">
             {tones.slice(0, 5).map(tone => (
               <button
                 key={tone.id}
                 onClick={() => setActiveTone(tone.id)}
                 className={cn(
                   "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors",
                   activeTone === tone.id
                     ? "bg-gray-800 text-purple-400 shadow-sm border border-purple-500/20"
                     : "text-gray-500 hover:text-gray-300 hover:bg-gray-800/50"
                 )}
               >
                 <i className={cn("fas", tone.icon)}></i>
                 <span className="hidden xl:inline">{tone.label}</span>
               </button>
             ))}
          </div>

          <div className="flex items-center gap-1 border-l border-gray-800 pl-4">
             <button className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-800 rounded transition-colors">
               <i className="fas fa-bold"></i>
             </button>
             <button className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-800 rounded transition-colors">
               <i className="fas fa-italic"></i>
             </button>
          </div>

          <div className="flex items-center gap-2 border-l border-gray-800 pl-4">
            <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-purple-400 bg-purple-500/10 hover:bg-purple-500/20 rounded-lg transition-colors border border-purple-500/20">
               <i className="fas fa-list-ul"></i> Outline
            </button>
            <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
               <i className="fas fa-robot"></i> AI Tools
            </button>
            <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
               <i className="fas fa-book-open"></i> Library
            </button>
          </div>
        </div>
      </div>

      {/* Editor Content Area */}
      <div className="flex-1 overflow-y-auto px-8 py-6 custom-scrollbar">
        <div className="max-w-4xl mx-auto">
          {/* Tip Box */}
          <div className="mb-6 flex items-start gap-3 text-yellow-500 bg-yellow-500/10 border border-yellow-500/20 px-4 py-3 rounded-lg text-sm italic">
            <i className="far fa-lightbulb mt-0.5"></i>
            <p>Use B-roll here for visual variety</p>
          </div>

          <textarea
            ref={textareaRef}
            value={activeSection.content}
            onChange={(e) => onContentChange(e.target.value)}
            className="w-full h-full min-h-[500px] bg-transparent text-gray-200 text-lg leading-loose resize-none focus:outline-none placeholder-gray-700 font-mono"
            placeholder={`Start writing your ${activeSection.type.toLowerCase()} here...`}
            spellCheck="false"
          />
        </div>
      </div>
    </div>
  );
}
