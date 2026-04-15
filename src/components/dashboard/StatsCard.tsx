import React from 'react';
import { ArrowUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ResponsiveContainer, LineChart, Line } from 'recharts';

interface StatsCardProps {
  label: string;
  value: string;
  change: string;
  icon: React.ReactNode;
  iconColorClass: string;
  iconBgClass: string;
  data?: any[];
  trendColor?: string;
}

export function StatsCard({ label, value, change, icon, iconColorClass, iconBgClass, data, trendColor = '#10b981' }: StatsCardProps) {
  return (
    <div className="p-4 rounded-xl bg-white dark:bg-[#13161f] border border-gray-200 dark:border-white/5 hover:border-gray-300 dark:hover:border-white/10 transition-colors shadow-sm dark:shadow-none flex flex-col justify-between">
      <div className="flex justify-between items-start mb-3">
        <div className={cn("flex items-center justify-center w-10 h-10 rounded-lg", iconBgClass, iconColorClass)}>
          {icon}
        </div>
        <div className="flex flex-col items-end">
          <div className="flex items-center gap-1 text-[10px] font-medium text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-500/10 px-1.5 py-0.5 rounded-full mb-1">
            <ArrowUp size={10} />
            {change || '12%'}
          </div>
        </div>
      </div>

      <div className="flex justify-between items-end gap-4">
        <div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-0.5">{value}</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{label}</p>
        </div>

        {data && (
          <div className="w-20 h-10">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <Line type="monotone" dataKey="value" stroke={trendColor} strokeWidth={2} dot={false} isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}
