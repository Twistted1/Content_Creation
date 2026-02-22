import React, { useState, useEffect } from 'react';
import { CheckCircle2, Edit, Send } from 'lucide-react';
import { scriptService } from '@/services/scriptService';
import { publishService } from '@/services/publishService';

interface ActivityItem {
  id: string;
  title: string;
  desc: string;
  time: string;
  icon: React.ElementType;
  color: string;
  bg: string;
}

function timeAgo(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  if (isNaN(then)) return '';
  const diff = Math.floor((now - then) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export function RecentActivity() {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [scripts, posts] = await Promise.all([
          scriptService.getScripts(),
          publishService.getPosts(),
        ]);
        const scriptItems: ActivityItem[] = scripts.slice(0, 3).map((s) => ({
          id: `script-${s.id}`,
          title: 'Script saved',
          desc: `"${s.title}" \u2022 ${s.content?.trim().split(/\s+/).filter(Boolean).length ?? 0} words`,
          time: s.createdAt ? timeAgo(s.createdAt.toDate().toISOString()) : '',
          icon: Edit,
          color: 'text-purple-400',
          bg: 'bg-purple-500/10',
        }));
        const postItems: ActivityItem[] = posts.slice(0, 3).map((p) => ({
          id: `post-${p.id}`,
          title: p.status === 'published' ? `Published to ${p.platform}` : `Scheduled for ${p.platform}`,
          desc: `"${p.title}" \u2022 ${p.date} ${p.time}`,
          time: p.createdAt ? timeAgo(p.createdAt) : '',
          icon: p.status === 'published' ? CheckCircle2 : Send,
          color: p.status === 'published' ? 'text-green-400' : 'text-blue-400',
          bg: p.status === 'published' ? 'bg-green-500/10' : 'bg-blue-500/10',
        }));
        setActivities([...scriptItems, ...postItems].slice(0, 5));
      } catch (e) {
        console.error('RecentActivity load error', e);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="p-4 rounded-xl bg-white dark:bg-[#13161f] border border-gray-200 dark:border-white/5 shadow-sm dark:shadow-none">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-5 h-5 flex items-center justify-center rounded bg-orange-100 dark:bg-orange-500/10">
          <span className="text-orange-500 dark:text-orange-400 text-xs font-bold">📄</span>
        </div>
        <h2 className="text-base font-bold text-gray-900 dark:text-white">Recent Activity</h2>
      </div>
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-14 rounded-lg bg-gray-100 dark:bg-gray-800 animate-pulse" />
          ))}
        </div>
      ) : activities.length === 0 ? (
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-6">
          No activity yet. Create a script or schedule a post to get started.
        </p>
      ) : (
        <div className="space-y-3">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-[#0b0e14]/50 border border-gray-200 dark:border-white/5 hover:border-gray-300 dark:hover:border-white/10 transition-colors">
              <div className={`p-1.5 rounded-lg ${activity.bg} ${activity.color} mt-0.5`}>
                <activity.icon size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start gap-2">
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white truncate">{activity.title}</h3>
                  {activity.time && <span className="text-[10px] text-gray-500 font-medium whitespace-nowrap">{activity.time}</span>}
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5 truncate">{activity.desc}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
