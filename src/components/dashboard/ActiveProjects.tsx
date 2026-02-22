import React, { useState, useEffect } from 'react';
import { Folder, Edit3 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { scriptService, ScriptData } from '@/services/scriptService';

const COLORS = [
  { color: 'bg-purple-500', iconBg: 'bg-purple-500/20 text-purple-400' },
  { color: 'bg-blue-500',   iconBg: 'bg-blue-500/20 text-blue-400' },
  { color: 'bg-green-500',  iconBg: 'bg-green-500/20 text-green-400' },
];

export function ActiveProjects() {
  const [scripts, setScripts] = useState<ScriptData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await scriptService.getScripts();
        setScripts(data.slice(0, 3));
      } catch (e) {
        console.error('ActiveProjects load error', e);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="p-4 rounded-xl bg-white dark:bg-[#13161f] border border-gray-200 dark:border-white/5 shadow-sm dark:shadow-none">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Folder size={18} className="text-blue-400" />
          <h2 className="text-base font-bold text-gray-900 dark:text-white">Recent Scripts</h2>
        </div>
        <Link to="/script" className="text-xs font-medium text-purple-500 dark:text-purple-400 hover:text-purple-600 dark:hover:text-purple-300 transition-colors">
          View All
        </Link>
      </div>
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => <div key={i} className="h-24 rounded-lg bg-gray-100 dark:bg-gray-800 animate-pulse" />)}
        </div>
      ) : scripts.length === 0 ? (
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-6">
          No scripts yet. <Link to="/script" className="text-purple-500 hover:underline">Create your first script</Link>.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {scripts.map((script, idx) => {
            const { color, iconBg } = COLORS[idx % COLORS.length];
            const wordCount = script.content?.trim().split(/\s+/).filter(Boolean).length ?? 0;
            return (
              <Link
                key={script.id}
                to="/script"
                className="block p-4 rounded-lg bg-gray-50 dark:bg-[#0b0e14]/50 border border-gray-200 dark:border-white/5 hover:border-gray-300 dark:hover:border-white/10 transition-all hover:translate-y-[-2px] group"
              >
                <div className="flex items-start gap-3 mb-4">
                  <div className={cn('p-2 rounded-lg', iconBg)}>
                    <Edit3 size={18} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-0.5 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors truncate">{script.title}</h3>
                    <p className="text-[10px] font-medium text-gray-500 dark:text-gray-400">{wordCount} words</p>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[10px] font-medium">
                    <span className="text-gray-500 dark:text-gray-400">{script.type || 'script'}</span>
                  </div>
                  <div className="h-1 w-full bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div className={cn('h-full rounded-full', color)} style={{ width: '100%' }} />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
