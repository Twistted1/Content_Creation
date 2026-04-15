import React from 'react';
import { heatmapData } from './mockData';
import { cn } from '../../../lib/utils';

export function AudienceTiming() {
  const timeLabels = ['6am', '9am', '12pm', '3pm', '6pm', '9pm'];

  const getColorClass = (intensity: number) => {
    if (intensity < 20) return 'bg-[#1e1b4b]';
    if (intensity < 40) return 'bg-[#312e81]';
    if (intensity < 60) return 'bg-[#4338ca]';
    if (intensity < 80) return 'bg-[#8b5cf6]';
    return 'bg-[#2dd4bf]'; // Bright cyan for peak
  };

  return (
    <div className="bg-[#111827] border border-white/5 rounded-2xl p-6 h-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-white mb-1">Audience Readiness</h2>
          <p className="text-sm text-gray-400">When your followers are most active</p>
        </div>
        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
          <i className="fas fa-expand-alt text-gray-400 text-sm"></i>
        </div>
      </div>

      <div className="relative">
        {/* Heatmap Grid */}
        <div className="flex">
          {/* Y-axis Labels (Days) */}
          <div className="flex flex-col justify-around pr-4 text-xs text-gray-500 py-2">
            {heatmapData.map((d) => (
              <span key={d.day} className="h-8 flex items-center">{d.day}</span>
            ))}
          </div>

          <div className="flex-1">
            <div className="grid grid-rows-7 gap-1">
              {heatmapData.map((d, i) => (
                <div key={d.day} className="grid grid-cols-6 gap-1 h-8">
                  {d.hours.map((intensity, j) => (
                    <div
                      key={j}
                      className={cn(
                        "rounded-sm transition-colors hover:ring-2 hover:ring-white/50 cursor-pointer",
                        getColorClass(intensity)
                      )}
                      title={`${d.day} at ${timeLabels[j]}: ${intensity}% active`}
                    />
                  ))}
                </div>
              ))}
            </div>

            {/* X-axis Labels (Times) */}
            <div className="grid grid-cols-6 gap-1 mt-2 text-xs text-gray-500 text-center">
              {timeLabels.map((time, i) => (
                <span key={i}>{time}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-end gap-2 mt-6 text-xs text-gray-500">
        <span>Low</span>
        <div className="flex gap-1">
          <div className="w-4 h-4 rounded-sm bg-[#1e1b4b]" />
          <div className="w-4 h-4 rounded-sm bg-[#312e81]" />
          <div className="w-4 h-4 rounded-sm bg-[#4338ca]" />
          <div className="w-4 h-4 rounded-sm bg-[#8b5cf6]" />
          <div className="w-4 h-4 rounded-sm bg-[#2dd4bf]" />
        </div>
        <span>High</span>
      </div>
    </div>
  );
}
