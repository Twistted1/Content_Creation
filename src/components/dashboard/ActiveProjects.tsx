import React from 'react';
import { Folder, Video, Edit3, Film } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

const projects = [
  {
    id: 1,
    title: 'Tech Review Video',
    subLabel: 'Voice Over',
    progress: 65,
    color: 'bg-purple-500',
    icon: Video,
    iconBg: 'bg-purple-500/20 text-purple-400'
  },
  {
    id: 2,
    title: 'Setup Tour 2024',
    subLabel: 'Script Writing',
    progress: 30,
    color: 'bg-blue-500', 
    icon: Edit3,
    iconBg: 'bg-blue-500/20 text-blue-400'
  },
  {
    id: 3,
    title: '5 Tips Shorts',
    subLabel: 'Video Generation',
    progress: 85,
    color: 'bg-green-500',
    icon: Film,
    iconBg: 'bg-green-500/20 text-green-400'
  }
];

export function ActiveProjects() {
  return (
    <div className="p-4 rounded-xl bg-white dark:bg-[#13161f] border border-gray-200 dark:border-white/5 shadow-sm dark:shadow-none">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Folder size={18} className="text-blue-400" />
          <h2 className="text-base font-bold text-gray-900 dark:text-white">Active Projects</h2>
        </div>
        <Link to="/production" className="text-xs font-medium text-purple-500 dark:text-purple-400 hover:text-purple-600 dark:hover:text-purple-300 transition-colors">
          Manage All
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {projects.map((project) => (
          <Link 
            key={project.id} 
            to={`/production`}
            className="block p-4 rounded-lg bg-gray-50 dark:bg-[#0b0e14]/50 border border-gray-200 dark:border-white/5 hover:border-gray-300 dark:hover:border-white/10 transition-all hover:translate-y-[-2px] group"
          >
            <div className="flex items-start gap-3 mb-4">
              <div className={cn("p-2 rounded-lg", project.iconBg)}>
                <project.icon size={18} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-0.5 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">{project.title}</h3>
                <p className="text-[10px] font-medium text-gray-500 dark:text-gray-400">{project.subLabel}</p>
              </div>
            </div>
            
            <div className="space-y-1.5">
              <div className="flex justify-between text-[10px] font-medium">
                <span className="text-gray-500 dark:text-gray-400">{project.progress}% complete</span>
              </div>
              <div className="h-1 w-full bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                <div 
                  className={cn("h-full rounded-full transition-all duration-500", project.color)} 
                  style={{ width: `${project.progress}%` }}
                />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
