import React from 'react';

export function PerformanceHub() {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-[#111827] border border-white/5 rounded-2xl p-8 mb-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">See what wins. Ignore the rest.</h1>
        <p className="text-gray-400">Your AI-driven command center for content performance.</p>
      </div>
      <div className="flex flex-wrap gap-4">
        <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center">
            <i className="fas fa-layer-group"></i>
          </div>
          <div>
            <div className="text-xl font-bold text-white">12</div>
            <div className="text-xs text-gray-400">Campaigns tracked</div>
          </div>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center">
            <i className="fas fa-users"></i>
          </div>
          <div>
            <div className="text-xl font-bold text-white">4</div>
            <div className="text-xs text-gray-400">Audience clusters</div>
          </div>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <i className="fas fa-magic"></i>
          </div>
          <div>
            <div className="text-xl font-bold text-white">7</div>
            <div className="text-xs text-gray-400">AI opportunities</div>
          </div>
        </div>
      </div>
    </div>
  );
}
