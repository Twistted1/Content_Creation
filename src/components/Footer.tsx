import React from 'react';
import { useLocation } from 'react-router-dom';

export function Footer() {
  const location = useLocation();

  return (
    <footer className="bg-gray-900 border-t border-gray-800 h-10 flex items-center px-6 text-xs text-gray-400 mt-auto shrink-0">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div>
        <span className="text-gray-300">ENGINE: RUNNING</span>
      </div>
      <div className="flex gap-4 ml-6">
        <span>2 workflows active</span>
        <span>70 total runs</span>
      </div>
      <div className="ml-auto">
        <span>v2.4.0</span>
      </div>
    </footer>
  );
}
