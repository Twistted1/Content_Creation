import React from 'react';
import { CheckCircle2, Edit, UserPlus } from 'lucide-react';

const activities = [
  {
    id: 1,
    title: 'Video published to YouTube',
    desc: '*Tech Review 2024* • 234 views',
    time: '2 min ago',
    icon: CheckCircle2,
    color: 'text-green-400',
    bg: 'bg-green-500/10'
  },
  {
    id: 2,
    title: 'Script generated with AI',
    desc: '*5 Hidden iPhone Features* • 1,245 words',
    time: '15 min ago',
    icon: Edit,
    color: 'text-purple-400',
    bg: 'bg-purple-500/10'
  },
  {
    id: 3,
    title: 'New team member added',
    desc: 'Sarah joined as Editor',
    time: '1 hour ago',
    icon: UserPlus,
    color: 'text-blue-400',
    bg: 'bg-blue-500/10'
  }
];

export function RecentActivity() {
  return (
    <div className="p-4 rounded-xl bg-white dark:bg-[#13161f] border border-gray-200 dark:border-white/5 shadow-sm dark:shadow-none">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-5 h-5 flex items-center justify-center rounded bg-orange-100 dark:bg-orange-500/10">
            <span className="text-orange-500 dark:text-orange-400 text-xs font-bold">📄</span>
        </div>
        <h2 className="text-base font-bold text-gray-900 dark:text-white">Recent Activity</h2>
      </div>

      <div className="space-y-3">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-[#0b0e14]/50 border border-gray-200 dark:border-white/5 hover:border-gray-300 dark:hover:border-white/10 transition-colors">
            <div className={`p-1.5 rounded-lg ${activity.bg} ${activity.color} mt-0.5`}>
              <activity.icon size={16} />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white">{activity.title}</h3>
                <span className="text-[10px] text-gray-500 font-medium">{activity.time}</span>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">{activity.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
