import React from 'react';
import { TopNav } from '@/components/dashboard/TopNav';
import { PerformanceHub } from '@/components/dashboard/analytics/PerformanceHub';
import { PulseCards } from '@/components/dashboard/analytics/PulseCards';
import { MetricOverviews } from '@/components/dashboard/analytics/MetricOverviews';
import { PerformanceGraph } from '@/components/dashboard/analytics/PerformanceGraph';
import { AudienceTiming } from '@/components/dashboard/analytics/AudienceTiming';
import { ConversionFunnel } from '@/components/dashboard/analytics/ConversionFunnel';
import { ActionStack } from '@/components/dashboard/analytics/ActionStack';
import { GlobalFooter } from '@/components/dashboard/analytics/GlobalFooter';
import { cn } from '@/lib/utils';

export default function Analytics() {
  return (
    <div className="min-h-screen bg-[#0B0F19] text-white font-sans pb-20 selection:bg-purple-500/30">
      <TopNav />
      
      <main className="max-w-[1600px] mx-auto px-6 pt-24 fade-in">
        <PerformanceHub />

        <div className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-6">
          {/* Main Content Area */}
          <div className="flex flex-col">
            <PulseCards />
            <MetricOverviews />

            <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6 mb-6 h-full">
              <div className="flex flex-col gap-6">
                <PerformanceGraph />
                <div className="h-[360px]">
                  <AudienceTiming />
                </div>
              </div>
              <div className="h-full">
                <ConversionFunnel />
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="flex flex-col gap-6 h-full">
            <ActionStack />
          </div>
        </div>
      </main>

      <GlobalFooter />
    </div>
  );
}
