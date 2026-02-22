import React from 'react';
import { Calendar, Play, Music, Camera } from 'lucide-react';

const schedule = [
  { 
    title: 'Tech Review Video', 
    time: 'Today, 3:00 PM', 
    icon: Play, 
    color: 'text-red-400', 
    bg: 'bg-red-500/10' 
  },
  { 
    title: 'Shorts: 5 Tips', 
    time: 'Tomorrow, 10:00 AM', 
    icon: Music, 
    color: 'text-blue-400', 
    bg: 'bg-blue-500/10' 
  },
  { 
    title: 'Reel: Behind Scenes', 
    time: 'Dec 15, 2:00 PM', 
    icon: Camera, 
    color: 'text-green-400', 
    bg: 'bg-green-500/10' 
  },
];

export function WeekSchedule() {
  return (
    <div className="p-4 rounded-xl bg-white dark:bg-[#13161f] border border-gray-200 dark:border-white/5 shadow-sm dark:shadow-none">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Calendar size={18} className="text-blue-400" />
          <h2 className="text-base font-bold text-gray-900 dark:text-white">This Week</h2>
        </div>
        <button className="text-xs font-medium text-purple-500 dark:text-purple-400 hover:text-purple-600 dark:hover:text-purple-300 transition-colors">
          View All
        </button>
      </div>

      <div className="space-y-3">
        {schedule.map((item, index) => (
          <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-[#0b0e14]/50 border border-gray-200 dark:border-white/5 hover:border-gray-300 dark:hover:border-white/10 transition-colors cursor-pointer group">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${item.bg} ${item.color}`}>
              <item.icon size={16} fill="currentColor" className="opacity-80" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-purple-500 dark:group-hover:text-purple-400 transition-colors">{item.title}</h3>
              <p className="text-[10px] font-medium text-gray-500">{item.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
