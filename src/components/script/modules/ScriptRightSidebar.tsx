import React from 'react';
import { SectionData } from '../types';
import { cn } from '@/utils/cn';

interface ScriptRightSidebarProps {
  sections: SectionData[];
  activeSectionId: string;
  setActiveSectionId: (id: string) => void;
}

export default function ScriptRightSidebar({
  sections,
  activeSectionId,
  setActiveSectionId
}: ScriptRightSidebarProps) {
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `~${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-[320px] bg-gray-950 border-l border-gray-800 flex flex-col h-full flex-shrink-0">
      <div className="px-5 py-4 border-b border-gray-800">
        <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Script Outline</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {sections.map(section => {
          const isActive = section.id === activeSectionId;
          const isCompleted = section.status === 'completed';

          return (
            <div
              key={section.id}
              onClick={() => setActiveSectionId(section.id)}
              className={cn(
                "p-4 rounded-xl cursor-pointer transition-all border",
                isActive
                  ? "bg-gray-900 border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.15)]"
                  : "bg-gray-900/50 border-gray-800 hover:border-gray-700 hover:bg-gray-900"
              )}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center",
                    section.colorClass.replace('text-', 'bg-').replace('bg-', 'bg-opacity-20 text-')
                  )}>
                    <i className={cn("fas text-sm", section.icon)}></i>
                  </div>
                  <h3 className="font-bold text-white text-sm">{section.title}</h3>
                </div>

                <div className={cn(
                  "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors",
                  isCompleted
                    ? "border-teal-500 text-teal-500"
                    : isActive
                        ? "border-gray-600"
                        : "border-gray-700"
                )}>
                  {isCompleted && <i className="fas fa-check text-[10px]"></i>}
                </div>
              </div>

              <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed mb-3">
                {section.content || "No content yet..."}
              </p>

              <div className="flex items-center justify-between text-[11px] text-gray-500">
                <span>{section.wordCount} words</span>
                <span>{formatDuration(section.duration)}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
