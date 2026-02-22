import React, { useState, useEffect } from 'react';
import { Calendar, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { publishService, Post } from '@/services/publishService';

const PLATFORM_COLORS: Record<string, { text: string; bg: string }> = {
  youtube:   { text: 'text-red-400',   bg: 'bg-red-500/10' },
  tiktok:    { text: 'text-blue-400',  bg: 'bg-blue-500/10' },
  instagram: { text: 'text-pink-400',  bg: 'bg-pink-500/10' },
  x:         { text: 'text-gray-400',  bg: 'bg-gray-500/10' },
  facebook:  { text: 'text-blue-500',  bg: 'bg-blue-600/10' },
  linkedin:  { text: 'text-sky-400',   bg: 'bg-sky-500/10' },
};

export function WeekSchedule() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const allPosts = await publishService.getPosts();
        const today = new Date();
        const weekEnd = new Date(today);
        weekEnd.setDate(today.getDate() + 7);
        const upcoming = allPosts
          .filter((p) => {
            const d = new Date(p.date);
            return p.status === 'scheduled' && d >= today && d <= weekEnd;
          })
          .slice(0, 4);
        setPosts(upcoming);
      } catch (e) {
        console.error('WeekSchedule load error', e);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const formatDate = (dateStr: string, timeStr: string) => {
    const d = new Date(dateStr);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const label =
      d.toDateString() === today.toDateString() ? 'Today'
      : d.toDateString() === tomorrow.toDateString() ? 'Tomorrow'
      : d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    return `${label}, ${timeStr}`;
  };

  return (
    <div className="p-4 rounded-xl bg-white dark:bg-[#13161f] border border-gray-200 dark:border-white/5 shadow-sm dark:shadow-none">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Calendar size={18} className="text-blue-400" />
          <h2 className="text-base font-bold text-gray-900 dark:text-white">This Week</h2>
        </div>
        <button
          onClick={() => navigate('/publish')}
          className="text-xs font-medium text-purple-500 dark:text-purple-400 hover:text-purple-600 dark:hover:text-purple-300 transition-colors"
        >
          View All
        </button>
      </div>
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2].map((i) => <div key={i} className="h-12 rounded-lg bg-gray-100 dark:bg-gray-800 animate-pulse" />)}
        </div>
      ) : posts.length === 0 ? (
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">No posts scheduled this week.</p>
      ) : (
        <div className="space-y-3">
          {posts.map((post) => {
            const colors = PLATFORM_COLORS[post.platform] ?? { text: 'text-gray-400', bg: 'bg-gray-500/10' };
            return (
              <div
                key={post.id}
                onClick={() => navigate('/publish')}
                className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-[#0b0e14]/50 border border-gray-200 dark:border-white/5 hover:border-gray-300 dark:hover:border-white/10 transition-colors cursor-pointer group"
              >
                <div className={`flex items-center justify-center w-8 h-8 rounded-full ${colors.bg} ${colors.text}`}>
                  <Send size={14} />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-purple-500 dark:group-hover:text-purple-400 transition-colors truncate">{post.title}</h3>
                  <p className="text-[10px] font-medium text-gray-500">{formatDate(post.date, post.time)}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
