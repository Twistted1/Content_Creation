import React from 'react';
import { pulseCards } from './mockData';
import { cn } from '../../../lib/utils';

export function PulseCards() {
  return (
    <div className="flex flex-col gap-4 mb-6">
      {pulseCards.map((card) => (
        <div
          key={card.id}
          className={cn(
            "rounded-xl border p-4 flex items-start gap-4",
            card.type === 'anomaly' ? 'bg-blue-900/20 border-blue-500/20' :
            card.type === 'opportunity' ? 'bg-purple-900/20 border-purple-500/20' :
            'bg-red-900/20 border-red-500/20'
          )}
        >
          <div className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
            card.type === 'anomaly' ? 'bg-blue-500/20 text-blue-400' :
            card.type === 'opportunity' ? 'bg-purple-500/20 text-purple-400' :
            'bg-red-500/20 text-red-400'
          )}>
            <i className={`fas ${card.icon}`}></i>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <h3 className={cn(
                "font-semibold text-sm",
                card.type === 'anomaly' ? 'text-blue-400' :
                card.type === 'opportunity' ? 'text-purple-400' :
                'text-red-400'
              )}>
                {card.title}
              </h3>
              <span className="text-xs text-gray-500">{card.time}</span>
            </div>
            <p className="text-sm text-gray-300">{card.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
