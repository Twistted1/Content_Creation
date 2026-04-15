import React from 'react';
import { Play, FileText, Image as ImageIcon, CheckCircle } from 'lucide-react';

const stages = [
  { id: 'ideas', label: 'Ideas', count: 12 },
  { id: 'script', label: 'Script', count: 5 },
  { id: 'voice', label: 'Voice', count: 3 },
  { id: 'video', label: 'Video', count: 2 },
  { id: 'publish', label: 'Publish', count: 1 },
];

const projects = [
  { id: 1, title: 'Top 10 AI Tools 2024', stage: 'video', platform: 'YouTube', date: 'Today' },
  { id: 2, title: 'How to write a viral hook', stage: 'script', platform: 'TikTok', date: 'Tomorrow' },
  { id: 3, title: 'My journey as a creator', stage: 'ideas', platform: 'Instagram', date: 'Next Week' },
];

export function ContentPipeline() {
  return (
    <div className="bg-white dark:bg-[#13161f] rounded-xl border border-gray-200 dark:border-white/5 p-6 shadow-sm dark:shadow-none">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Play size={18} className="text-indigo-500" /> Content Pipeline
        </h2>
        <button className="text-xs text-indigo-600 font-medium hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300">View All</button>
      </div>

      {/* Stage Tracker */}
      <div className="flex items-center justify-between mb-8 relative">
        <div className="absolute left-0 top-1/2 w-full h-0.5 bg-gray-100 dark:bg-gray-800 -z-10 translate-y-[-50%]"></div>
        {stages.map((stage, index) => (
          <div key={stage.id} className="flex flex-col items-center gap-2 bg-white dark:bg-[#13161f] px-2">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border-2
              ${index < 2 ? 'bg-indigo-600 border-indigo-600 text-white' :
                index === 2 ? 'bg-white dark:bg-[#13161f] border-indigo-600 text-indigo-600 dark:text-indigo-400' :
                'bg-gray-50 dark:bg-[#0b0e14] border-gray-200 dark:border-gray-800 text-gray-400'}`}>
              {index < 2 ? <CheckCircle size={12} /> : stage.count}
            </div>
            <span className="text-[10px] font-medium text-gray-500">{stage.label}</span>
          </div>
        ))}
      </div>

      {/* Project List */}
      <div className="space-y-2">
        {projects.map((project) => (
          <div key={project.id} className="flex items-center justify-between p-3 rounded-lg border border-gray-100 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-pointer group">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-md bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                <FileText size={14} />
              </div>
              <div>
                <h4 className="font-semibold text-xs text-gray-900 dark:text-white mb-0.5">{project.title}</h4>
                <div className="flex items-center gap-2 text-[10px] text-gray-500">
                  <span className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded capitalize">{project.stage}</span>
                  <span>•</span>
                  <span>{project.platform}</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-medium text-gray-500 block mb-0.5">{project.date}</span>
              <button className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity">Continue &rarr;</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
