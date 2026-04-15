import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';

export function AIInsight() {
  return (
    <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl p-4 text-white flex items-center justify-between shadow-lg shadow-purple-500/20">
      <div className="flex items-center gap-3">
        <div className="bg-white/20 p-2 rounded-lg">
          <Sparkles size={18} className="text-white" />
        </div>
        <div>
          <h3 className="font-bold text-sm mb-0.5">AI Insight</h3>
          <p className="text-xs text-purple-100">"How to grow on TikTok" is trending in your niche.</p>
        </div>
      </div>
      <button className="flex items-center gap-2 bg-white text-purple-600 px-4 py-2 rounded-lg text-xs font-bold hover:bg-purple-50 transition shadow-sm">
        Generate Ideas <ArrowRight size={14} />
      </button>
    </div>
  );
}
