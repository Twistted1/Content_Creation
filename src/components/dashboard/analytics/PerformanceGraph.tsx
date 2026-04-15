import React, { useState } from 'react';
import { performanceData } from './mockData';
import { cn } from '../../../lib/utils';

export function PerformanceGraph() {
  const [activePlatform, setActivePlatform] = useState(performanceData[0].platform);

  const currentData = performanceData.find(d => d.platform === activePlatform) || performanceData[0];
  const maxValue = Math.max(...currentData.dataPoints) * 1.2;

  return (
    <div className="bg-[#111827] border border-white/5 rounded-2xl p-6 mb-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-lg font-bold text-white mb-1">Cross-platform velocity</h2>
          <div className="text-3xl font-bold text-white">{currentData.total}</div>
        </div>
        <div className="flex bg-[#1F2937] rounded-lg p-1">
          {performanceData.map((d) => (
            <button
              key={d.platform}
              onClick={() => setActivePlatform(d.platform)}
              className={cn(
                "px-4 py-1.5 rounded-md text-sm transition-colors",
                activePlatform === d.platform
                  ? "bg-[#374151] text-white shadow"
                  : "text-gray-400 hover:text-gray-200"
              )}
            >
              {d.platform}
            </button>
          ))}
        </div>
      </div>

      <div className="h-64 relative flex items-end">
        {/* Simple mock line chart visualization */}
        <div className="absolute inset-0 flex items-end justify-between">
          <svg className="w-full h-full" preserveAspectRatio="none" viewBox={`0 0 ${currentData.dataPoints.length - 1} 100`}>
            <defs>
              <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="rgba(168, 85, 247, 0.4)" />
                <stop offset="100%" stopColor="rgba(168, 85, 247, 0)" />
              </linearGradient>
            </defs>
            <path
              d={`M 0 100 ${currentData.dataPoints.map((point, i) => `L ${i} ${100 - (point / maxValue) * 100}`).join(' ')} L ${currentData.dataPoints.length - 1} 100 Z`}
              fill="url(#chartGradient)"
            />
            <path
              d={`M ${currentData.dataPoints.map((point, i) => `${i === 0 ? 'M' : 'L'} ${i} ${100 - (point / maxValue) * 100}`).join(' ')}`}
              fill="none"
              stroke="#A855F7"
              strokeWidth="2"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        </div>

        {/* X-axis labels */}
        <div className="absolute -bottom-6 left-0 right-0 flex justify-between text-xs text-gray-500">
          {currentData.labels.map((label, i) => (
            <span key={i} className="text-center w-full">{label}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
