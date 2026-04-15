import React from 'react';
import { funnelSteps } from './mockData';
import { cn } from '../../../lib/utils';

export function ConversionFunnel() {
  return (
    <div className="bg-[#111827] border border-white/5 rounded-2xl p-6 h-full">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Conversion Funnel</div>
          <h2 className="text-xl font-bold text-white">Content-to-revenue path</h2>
        </div>
        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
          <i className="fas fa-chart-pie text-gray-400 text-sm"></i>
        </div>
      </div>

      <div className="space-y-6">
        {funnelSteps.map((step) => (
          <div key={step.id}>
            <div className="flex justify-between items-end mb-2">
              <span className="font-medium text-white">{step.label}</span>
              <span className="font-bold text-white">{step.value}</span>
            </div>
            <div className="h-3 w-full bg-[#1F2937] rounded-full overflow-hidden">
              <div
                className={cn("h-full rounded-full bg-gradient-to-r", step.colorClass)}
                style={{ width: `${step.progress}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
