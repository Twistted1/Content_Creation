import React from 'react';
import { actionItems } from './mockData';

export function ActionStack() {
  return (
    <div className="bg-[#111827] border border-white/5 rounded-2xl p-6 h-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Action Stack</div>
          <h2 className="text-xl font-bold text-white">Next moves for the team</h2>
        </div>
        <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
          <i className="fas fa-check"></i>
        </div>
      </div>

      <div className="space-y-4">
        {actionItems.map((item) => (
          <div key={item.id} className="bg-[#1F2937]/50 border border-white/5 rounded-xl p-4 flex gap-4 hover:bg-[#1F2937] transition-colors cursor-pointer">
            <div className="w-10 h-10 rounded-full bg-white/5 flex flex-shrink-0 items-center justify-center text-gray-400">
              <i className={`fas ${item.icon}`}></i>
            </div>
            <div>
              <h3 className="font-bold text-sm text-white mb-1.5">{item.title}</h3>
              <p className="text-xs text-gray-400 leading-relaxed">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
