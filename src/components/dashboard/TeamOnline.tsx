import React from 'react';
import { Users } from 'lucide-react';

export function TeamOnline() {
  return (
    <div className="p-4 rounded-xl bg-white dark:bg-[#13161f] border border-gray-200 dark:border-white/5 mt-4 shadow-sm dark:shadow-none">
      <div className="flex items-center gap-2 mb-3">
        <Users size={18} className="text-purple-400" />
        <h2 className="text-base font-bold text-gray-900 dark:text-white">Team Online</h2>
      </div>

      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-[10px] font-bold text-white border-2 border-white dark:border-[#13161f]">JD</div>
        <div className="w-8 h-8 rounded-full bg-teal-500 flex items-center justify-center text-[10px] font-bold text-white border-2 border-white dark:border-[#13161f] -ml-3">SK</div>
        <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-[10px] font-bold text-white border-2 border-white dark:border-[#13161f] -ml-3">MR</div>
        <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-[10px] font-bold text-gray-600 dark:text-gray-400 border-2 border-white dark:border-[#13161f] -ml-3">+3</div>
      </div>
    </div>
  );
}
