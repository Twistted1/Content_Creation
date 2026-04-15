import React from 'react';
import { SectionData } from '../types';

interface ScriptBottomBarProps {
  activeSection: SectionData;
  completedSections: number;
  totalSections: number;
}

export default function ScriptBottomBar({
  activeSection,
  completedSections,
  totalSections
}: ScriptBottomBarProps) {
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `~${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercent = (completedSections / totalSections) * 100;
  const characterCount = activeSection.content.length;

  return (
    <div className="flex items-center justify-between px-6 py-3 border-t border-gray-800 bg-[#0a0a0a] flex-shrink-0">
      <div className="flex items-center gap-12">
        {/* Global Progress */}
        <div className="flex flex-col gap-1 w-48">
          <div className="flex items-center justify-between text-[10px] text-gray-500 font-medium">
            <span>Progress</span>
            <span>{completedSections}/{totalSections} done</span>
          </div>
          <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-purple-500 transition-all duration-300 ease-out"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>

        {/* Section Metrics */}
        <div className="flex items-center gap-6 text-xs text-gray-500">
          <span>{activeSection.wordCount} words in section</span>
          <span className="w-1 h-1 bg-gray-700 rounded-full"></span>
          <span>{formatDuration(activeSection.duration)} duration</span>
          <span className="w-1 h-1 bg-gray-700 rounded-full"></span>
          <span>{characterCount} characters</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-lg transition-colors shadow-lg shadow-purple-500/20">
          <i className="fas fa-magic"></i> AI Enhance
        </button>
        <button className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-medium rounded-lg transition-colors border border-gray-700">
          <i className="far fa-copy"></i> Copy
        </button>
      </div>
    </div>
  );
}
