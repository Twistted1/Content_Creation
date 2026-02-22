import React from 'react';
import { ArrowUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  label: string;
  value: string;
  change: string;
  icon: React.ReactNode;
  iconColorClass: string;
  iconBgClass: string;
}

export function StatsCard({ label, value, change, icon, iconColorClass, iconBgClass }: StatsCardProps) {
  return (
    <div className="p-4 rounded-xl bg-white dark:bg-[#13161f] border border-gray-200 dark:border-white/5 hover:border-gray-300 dark:hover:border-white/10 transition-colors shadow-sm dark:shadow-none">
      <div className="flex justify-between items-start mb-3">
        <div className={cn("flex items-center justify-center w-10 h-10 rounded-lg", iconBgClass, iconColorClass)}>
          {icon}
        </div>
        <div className="flex items-center gap-1 text-[10px] font-medium text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-500/10 px-1.5 py-0.5 rounded-full">
          <ArrowUp size={10} />
          {change}
        </div>
      </div>
      <div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-0.5">{value}</h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{label}</p>
      </div>
    </div>
  );
}
