import React from 'react';
import { SectionData } from '../types';
import { cn } from '@/utils/cn';

interface ScriptLeftSidebarProps {
  sections: SectionData[];
  activeSectionId: string;
  setActiveSectionId: (id: string) => void;
  handleStatusChange: (id: string) => void;
}

export default function ScriptLeftSidebar({
  sections,
  activeSectionId,
  setActiveSectionId,
  handleStatusChange
}: ScriptLeftSidebarProps) {
  return (
    <div className="w-[280px] bg-gray-950 border-r border-gray-800 flex flex-col h-full flex-shrink-0">
      <div className="px-4 py-4 border-b border-gray-800 flex items-center justify-between">
        <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Sections</h2>
        <button className="w-6 h-6 bg-purple-600/20 text-purple-400 rounded flex items-center justify-center hover:bg-purple-600 hover:text-white transition-colors">
          <i className="fas fa-plus text-xs"></i>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {sections.map(section => {
          const isActive = section.id === activeSectionId;
          const isCompleted = section.status === 'completed';

          return (
            <div
              key={section.id}
              onClick={() => setActiveSectionId(section.id)}
              className={cn(
                "group relative p-3 rounded-xl cursor-pointer transition-all border",
                isActive
                  ? "bg-gray-900 border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.15)]"
                  : "bg-transparent border-transparent hover:bg-gray-900/50"
              )}
            >
              {/* Connecting line for steps (simplified visual) */}
              <div className="absolute left-5 top-10 bottom-[-20px] w-px bg-gray-800 group-last:hidden z-0"></div>

              <div className="flex gap-3 relative z-10">
                {/* Status indicator */}
                <div className="mt-1 flex-shrink-0">
                  <button
                    onClick={(e) => { e.stopPropagation(); handleStatusChange(section.id); }}
                    className={cn(
                      "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors",
                      isCompleted
                        ? "bg-teal-500 border-teal-500 text-gray-900"
                        : isActive
                            ? "border-gray-500 bg-gray-800"
                            : "border-gray-700 bg-gray-900 group-hover:border-gray-500"
                    )}
                  >
                    {isCompleted && <i className="fas fa-check text-[10px]"></i>}
                  </button>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={cn(
                      "text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider",
                      section.colorClass
                    )}>
                      {section.type}
                    </span>
                  </div>
                  <h3 className={cn(
                    "font-medium text-sm truncate",
                    isActive ? "text-white" : "text-gray-300"
                  )}>
                    {section.title}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    {section.wordCount} words
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
