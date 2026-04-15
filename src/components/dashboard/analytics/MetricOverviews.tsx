import React from 'react';
import { metricCards } from './mockData';
import { MetricCard } from './MetricCard';

export function MetricOverviews() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {metricCards.map((metric) => (
        <MetricCard key={metric.id} data={metric} />
      ))}
    </div>
  );
}
