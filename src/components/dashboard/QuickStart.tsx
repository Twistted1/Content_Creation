import React from 'react';
import { Lightbulb, PenTool, Mic, Image, Video, Send, Rocket } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

const actions = [
  { label: 'Ideas', icon: Lightbulb, color: 'text-blue-400', bg: 'bg-blue-500/10 hover:bg-blue-500/20', path: '/ideas' },
  { label: 'Script', icon: PenTool, color: 'text-purple-400', bg: 'bg-purple-500/10 hover:bg-purple-500/20', path: '/script' },
  { label: 'Voice', icon: Mic, color: 'text-green-400', bg: 'bg-green-500/10 hover:bg-green-500/20', path: '/production?tab=voiceover' },
  { label: 'Images', icon: Image, color: 'text-orange-400', bg: 'bg-orange-500/10 hover:bg-orange-500/20', path: '/production?tab=images' },
  { label: 'Video', icon: Video, color: 'text-red-400', bg: 'bg-red-500/10 hover:bg-red-500/20', path: '/production?tab=video' },
  { label: 'Publish', icon: Send, color: 'text-teal-400', bg: 'bg-teal-500/10 hover:bg-teal-500/20', path: '/publish' },
];

export function QuickStart() {
  return (
    <div className="p-4 rounded-xl bg-white dark:bg-[#13161f] border border-gray-200 dark:border-white/5 shadow-sm dark:shadow-none">
      <div className="flex items-center gap-2 mb-4">
        <Rocket size={18} className="text-pink-500" />
        <h2 className="text-base font-bold text-gray-900 dark:text-white">Quick Start New Project</h2>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {actions.map((action) => (
          <Link 
            key={action.label}
            to={action.path}
            className={cn(
              "flex flex-col items-center justify-center gap-2 p-3 rounded-lg transition-all duration-200 border border-transparent hover:border-gray-200 dark:hover:border-white/10 group",
              action.bg
            )}
          >
            <div className={cn("p-2.5 rounded-full bg-gray-100 dark:bg-[#0b0e14]/50", action.color)}>
              <action.icon size={20} />
            </div>
            <span className="text-xs font-medium text-gray-600 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white">{action.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
