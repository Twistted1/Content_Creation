import React from 'react';

export function GlobalFooter() {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#0B0F19] border-t border-white/5 py-3 px-6 flex items-center justify-between text-xs z-50">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
          <span className="text-gray-400">System Nominal</span>
        </div>
        <div className="flex items-center gap-2 text-gray-500">
          <i className="fas fa-network-wired"></i>
          <span>Latency: 24ms</span>
        </div>
        <div className="flex items-center gap-2 text-gray-500">
          <i className="fas fa-microchip"></i>
          <span>GPU: Idle</span>
        </div>
      </div>

      <button className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white px-3 py-1.5 rounded-md transition-colors border border-white/5">
        <i className="fas fa-expand-arrows-alt text-gray-400"></i>
        <span>Open Director View</span>
      </button>
    </div>
  );
}
