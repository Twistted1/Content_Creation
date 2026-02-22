import React from 'react';
import { BarChart2 } from 'lucide-react';

export function UsageStats() {
  return (
    <div className="p-4 rounded-xl bg-white dark:bg-[#13161f] border border-gray-200 dark:border-white/5 shadow-sm dark:shadow-none">
      <div className="flex items-center gap-2 mb-4">
        <BarChart2 size={18} className="text-purple-400" />
        <h2 className="text-base font-bold text-gray-900 dark:text-white">Usage This Month</h2>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-[10px] font-medium mb-1.5">
            <span className="text-gray-500 dark:text-gray-400">API Calls</span>
            <span className="text-gray-900 dark:text-white">2,458 / 5,000</span>
          </div>
          <div className="h-1.5 w-full bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
            <div className="h-full bg-purple-500 rounded-full w-[49%]" />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-[10px] font-medium mb-1.5">
            <span className="text-gray-500 dark:text-gray-400">Credits</span>
            <span className="text-gray-900 dark:text-white">234 / 500</span>
          </div>
          <div className="h-1.5 w-full bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
            <div className="h-full bg-green-500 rounded-full w-[46%]" />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-[10px] font-medium mb-1.5">
            <span className="text-gray-500 dark:text-gray-400">Storage</span>
            <span className="text-gray-900 dark:text-white">2.4 GB / 10 GB</span>
          </div>
          <div className="h-1.5 w-full bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 rounded-full w-[24%]" />
          </div>
        </div>
      </div>
    </div>
  );
}
