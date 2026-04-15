import React from 'react';
import { Trophy, TrendingUp } from 'lucide-react';

const queue = [
  { id: 1, title: 'AI Tools 2024', status: 'Ready', platform: 'YouTube', score: 98 },
  { id: 2, title: 'Viral Hook Secrets', status: 'Draft', platform: 'TikTok', score: 85 },
  { id: 3, title: 'Creator Journey', status: 'Review', platform: 'Instagram', score: 72 },
];

export function TopPerforming() {
  return (
    <div className="bg-white dark:bg-[#13161f] rounded-xl border border-gray-200 dark:border-white/5 p-6 shadow-sm dark:shadow-none">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Trophy size={18} className="text-amber-500" /> Publishing Queue
        </h2>
        <button className="text-xs text-indigo-600 font-medium hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300">View Calendar</button>
      </div>

      <div className="space-y-4">
        {queue.map((item, index) => (
          <div key={item.id} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold text-gray-400 dark:text-gray-600 w-4">{index + 1}</span>
              <div>
                <h4 className="font-medium text-xs text-gray-900 dark:text-white">{item.title}</h4>
                <p className="text-[10px] text-gray-500">{item.platform} • {item.status}</p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-green-500 bg-green-50 dark:bg-green-500/10 px-1.5 py-0.5 rounded text-[10px] font-bold">
              <TrendingUp size={10} />
              {item.score}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
