import React, { useState, useEffect } from 'react';
import { BarChart2 } from 'lucide-react';
import { usageService, PLAN_LIMITS } from '@/services/usageService';

interface UsageBar {
  label: string;
  used: number;
  limit: number;
  color: string;
}

export function UsageStats() {
  const [bars, setBars] = useState<UsageBar[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await usageService.getUserUsage();
        if (!data) return;
        const plan = data.plan || 'free';
        const limits = PLAN_LIMITS[plan] || PLAN_LIMITS['free'];
        const metrics = data.metrics || {};
        setBars([
          {
            label: 'AI Scripts',
            used: metrics.ai_scripts || 0,
            limit: limits.ai_scripts === 99999 ? Infinity : limits.ai_scripts,
            color: 'bg-purple-500',
          },
          {
            label: 'AI Ideas',
            used: metrics.ai_ideas || 0,
            limit: limits.ai_ideas === 99999 ? Infinity : limits.ai_ideas,
            color: 'bg-green-500',
          },
          {
            label: 'Video Minutes',
            used: Math.round(metrics.video_minutes || 0),
            limit: limits.video_minutes === 99999 ? Infinity : limits.video_minutes,
            color: 'bg-blue-500',
          },
        ]);
      } catch (e) {
        console.error('UsageStats load error', e);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="p-4 rounded-xl bg-white dark:bg-[#13161f] border border-gray-200 dark:border-white/5 shadow-sm dark:shadow-none">
      <div className="flex items-center gap-2 mb-4">
        <BarChart2 size={18} className="text-purple-400" />
        <h2 className="text-base font-bold text-gray-900 dark:text-white">Usage This Month</h2>
      </div>
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => <div key={i} className="h-8 rounded bg-gray-100 dark:bg-gray-800 animate-pulse" />)}
        </div>
      ) : (
        <div className="space-y-4">
          {bars.map((bar) => {
            const pct = bar.limit === Infinity ? 0 : Math.min(100, Math.round((bar.used / bar.limit) * 100));
            const limitLabel = bar.limit === Infinity ? '\u221e' : bar.limit.toLocaleString();
            return (
              <div key={bar.label}>
                <div className="flex justify-between text-[10px] font-medium mb-1.5">
                  <span className="text-gray-500 dark:text-gray-400">{bar.label}</span>
                  <span className="text-gray-900 dark:text-white">{bar.used.toLocaleString()} / {limitLabel}</span>
                </div>
                <div className="h-1.5 w-full bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div className={`h-full ${bar.color} rounded-full transition-all duration-500`} style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
