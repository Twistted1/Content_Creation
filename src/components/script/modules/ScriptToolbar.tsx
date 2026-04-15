import React from 'react';
import { Platform } from '../types';
import { cn } from '@/utils/cn';

interface ScriptToolbarProps {
  activePlatform: Platform;
  setActivePlatform: (platform: Platform) => void;
  totalWords: number;
  totalDuration: number;
  scriptTitle: string;
  setScriptTitle: (title: string) => void;
  completedSections: number;
  totalSections: number;
}

const platforms: { id: Platform; icon: string; label: string }[] = [
  { id: 'YouTube', icon: 'fa-youtube', label: 'YouTube' },
  { id: 'Podcast', icon: 'fa-microphone', label: 'Podcast' },
  { id: 'Instagram', icon: 'fa-instagram', label: 'Instagram' },
  { id: 'TikTok', icon: 'fa-tiktok', label: 'TikTok' },
  { id: 'LinkedIn', icon: 'fa-linkedin', label: 'in LinkedIn' },
  { id: 'Blog', icon: 'fa-blog', label: 'Blog' },
];

export default function ScriptToolbar({
  activePlatform,
  setActivePlatform,
  totalWords,
  totalDuration,
  scriptTitle,
  setScriptTitle,
  completedSections,
  totalSections,
}: ScriptToolbarProps) {
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercent = Math.round((completedSections / totalSections) * 100);

  return (
    <div className="flex flex-col border-b border-gray-800 bg-gray-950 px-6 py-4 flex-shrink-0">
      <div className="flex items-center justify-between mb-4">
        {/* Left: Title & Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-purple-500/20">
            <i className="fas fa-pen-nib text-xl text-white"></i>
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Script Studio</h1>
            <p className="text-xs text-gray-400">AI-powered script generation & segment management</p>
          </div>
        </div>

        {/* Center: Platforms */}
        <div className="flex items-center gap-1 bg-gray-900 rounded-full p-1 border border-gray-800">
          {platforms.map(platform => (
            <button
              key={platform.id}
              onClick={() => setActivePlatform(platform.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium transition-colors",
                activePlatform === platform.id
                  ? "bg-gray-800 text-white shadow-sm"
                  : "text-gray-400 hover:text-gray-200"
              )}
            >
              <i className={cn(
                  "fab",
                  platform.icon === 'fa-microphone' || platform.icon === 'fa-blog' ? 'fas' : 'fab',
                  platform.icon,
                  activePlatform === platform.id && platform.id === 'YouTube' ? 'text-red-500' : '',
                  activePlatform === platform.id && platform.id === 'Blog' ? 'text-orange-500' : ''
              )}></i>
              {platform.label}
            </button>
          ))}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors border border-gray-800">
            <i className="fas fa-eye"></i> Preview
          </button>
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors border border-gray-800">
            <i className="fas fa-cloud-upload-alt"></i> Save
          </button>
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors border border-gray-800">
            <i className="fas fa-download"></i> Export
          </button>
          <button className="flex items-center gap-2 px-5 py-2 text-sm font-bold text-white bg-purple-600 hover:bg-purple-500 rounded-lg shadow-lg shadow-purple-500/20 transition-colors ml-2">
            <i className="fas fa-microphone"></i> To Studio &rarr;
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between mt-2">
        <input
            type="text"
            value={scriptTitle}
            onChange={(e) => setScriptTitle(e.target.value)}
            placeholder="Untitled Script – click to name it..."
            className="bg-transparent text-xl font-medium text-gray-400 focus:text-white focus:outline-none placeholder-gray-600 w-1/2"
        />

        <div className="flex items-center gap-6 text-sm text-gray-400">
          <span className="flex items-center gap-2">
            <i className="fas fa-text-width"></i>
            {totalWords} words
          </span>
          <span className="flex items-center gap-2">
            <i className="far fa-clock"></i>
            {formatDuration(totalDuration)} est.
          </span>
          <span className="flex items-center gap-2">
            <i className="fas fa-chart-bar"></i>
            {progressPercent}% done
          </span>
          <span className="bg-gray-800 text-gray-300 px-3 py-1 rounded-full text-xs font-medium border border-gray-700">
            Medium (5-10 min)
          </span>
        </div>
      </div>
    </div>
  );
}
