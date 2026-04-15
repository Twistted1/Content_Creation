import React from 'react';
import { TopNav } from '@/components/dashboard/TopNav';
import ScriptStudio from '@/components/script/ScriptStudio';

export default function Script() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white font-sans transition-colors duration-200 flex flex-col">
      <TopNav />
      <div className="flex-1 pt-16">
        <ScriptStudio />
      </div>
    </div>
  );
}
