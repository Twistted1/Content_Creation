import React from 'react';
import { Bot, Sparkles, ArrowRight } from 'lucide-react';

export function AIAssistant() {
  return (
    <div className="bg-gradient-to-b from-indigo-50/50 to-white dark:from-indigo-900/10 dark:to-[#13161f] rounded-xl border border-indigo-100 dark:border-indigo-500/10 p-6 shadow-sm dark:shadow-none">
      <div className="flex items-center gap-2 mb-4">
        <Bot size={18} className="text-indigo-600 dark:text-indigo-400" />
        <h2 className="text-base font-bold text-gray-900 dark:text-white">AI Assistant</h2>
      </div>

      <div className="bg-white dark:bg-[#0b0e14] rounded-lg p-3 border border-gray-100 dark:border-white/5 mb-4 shadow-sm dark:shadow-none">
        <p className="text-xs text-gray-600 dark:text-gray-400 mb-3 leading-relaxed">
          I noticed your "Tech Reviews" script is getting great engagement. Should we generate a follow-up video script based on the top comments?
        </p>
        <div className="flex gap-2">
          <button className="flex-1 bg-indigo-600 text-white py-1.5 rounded-md text-xs font-medium hover:bg-indigo-700 transition flex items-center justify-center gap-1.5">
            <Sparkles size={12} /> Yes, generate
          </button>
          <button className="px-3 py-1.5 text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5 rounded-md text-xs font-medium transition">
            Dismiss
          </button>
        </div>
      </div>

      <div className="relative">
        <input
          type="text"
          placeholder="Ask AI to write a script..."
          className="w-full pl-3 pr-8 py-2 bg-white dark:bg-[#0b0e14] border border-gray-200 dark:border-white/10 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
        <button className="absolute right-1.5 top-1/2 -translate-y-1/2 w-6 h-6 bg-indigo-600 rounded flex items-center justify-center text-white hover:bg-indigo-700 transition">
          <ArrowRight size={12} />
        </button>
      </div>
    </div>
  );
}
