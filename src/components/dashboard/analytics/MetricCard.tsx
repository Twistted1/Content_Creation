import React from 'react';
import { MetricData } from './types';
import { cn } from '../../../lib/utils';

interface MetricCardProps {
  data: MetricData;
}

export function MetricCard({ data }: MetricCardProps) {
  return (
    <div className="bg-[#111827] border border-white/5 rounded-xl p-5 hover:bg-white/5 transition-colors">
      <h3 className="text-gray-400 text-sm mb-2">{data.title}</h3>
      <div className="flex items-end justify-between mb-4">
        <div className="text-3xl font-bold text-white">{data.value}</div>
        <div className={cn(
          "text-xs px-2 py-1 rounded-md",
          data.trendDirection === 'up'
            ? "text-emerald-400 bg-emerald-400/10"
            : "text-rose-400 bg-rose-400/10"
        )}>
          {data.trendDirection === 'up' ? '↑' : '↓'} {data.trend}
        </div>
      </div>
      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
        <div
          className={cn("h-full rounded-full bg-gradient-to-r", data.progressColorClass)}
          style={{ width: `${data.progressValue}%` }}
        />
      </div>
    </div>
  );
}
