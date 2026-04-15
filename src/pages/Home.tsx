import React, { useEffect, useState } from 'react';
import { TopNav } from '@/components/dashboard/TopNav';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { QuickStart } from '@/components/dashboard/QuickStart';
import { AIInsight } from '@/components/dashboard/AIInsight';
import { ContentPipeline } from '@/components/dashboard/ContentPipeline';
import { TopPerforming } from '@/components/dashboard/TopPerforming';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { UsageStats } from '@/components/dashboard/UsageStats';
import { TeamOnline } from '@/components/dashboard/TeamOnline';
import { AIAssistant } from '@/components/dashboard/AIAssistant';
import { FileText, Eye, Users, DollarSign } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { scriptService } from '@/services/scriptService';
import { publishService } from '@/services/publishService';
import { auth } from '@/lib/firebase';

const mockSparklineData = [
  { value: 10 }, { value: 25 }, { value: 15 }, { value: 40 }, { value: 30 }, { value: 50 }, { value: 45 }
];

export default function Home() {
  const navigate = useNavigate();
  const [liveStats, setLiveStats] = useState({ scripts: '...', published: '...', scheduled: '...' });
  const [userName, setUserName] = useState('there');

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      const name = user.displayName || user.email?.split('@')[0] || 'there';
      setUserName(name);
    }
    const unsub = auth.onAuthStateChanged((u) => {
      if (u) setUserName(u.displayName || u.email?.split('@')[0] || 'there');
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [scripts, posts] = await Promise.all([
          scriptService.getScripts(),
          publishService.getPosts()
        ]);
        setLiveStats({
          scripts: String(scripts.length),
          published: String(posts.filter((p: any) => p.status === 'published').length),
          scheduled: String(posts.filter((p: any) => p.status === 'scheduled').length),
        });
      } catch (e) {
        console.error('Failed to load dashboard stats', e);
        setLiveStats({ scripts: '0', published: '0', scheduled: '0' });
      }
    };
    loadStats();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0b0e14]">
      <TopNav />

      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12 fade-in">
        {/* Welcome Header */}
        <div className="flex flex-col mb-8">
          <h1 className="text-2xl font-bold mb-1 text-gray-900 dark:text-white flex items-center gap-2">
            Welcome back, {userName}! <span className="text-xl">👋</span>
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Here's your content overview for today</p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatsCard 
            label="Scripts Saved" 
            value={liveStats.scripts} 
            change="+12%"
            icon={<FileText size={18} />}
            iconBgClass="bg-blue-50 dark:bg-blue-500/10"
            iconColorClass="text-blue-500 dark:text-blue-400"
            data={mockSparklineData}
            trendColor="#3b82f6"
          />
          <StatsCard 
            label="Posts Published" 
            value={liveStats.published} 
            change="+5%"
            icon={<Eye size={18} />}
            iconBgClass="bg-purple-50 dark:bg-purple-500/10"
            iconColorClass="text-purple-500 dark:text-purple-400"
            data={mockSparklineData}
            trendColor="#a855f7"
          />
          <StatsCard 
            label="Posts Scheduled" 
            value={liveStats.scheduled} 
            change="+2%"
            icon={<Users size={18} />}
            iconBgClass="bg-green-50 dark:bg-green-500/10"
            iconColorClass="text-green-500 dark:text-green-400"
            data={mockSparklineData}
            trendColor="#22c55e"
          />
          <StatsCard 
            label="Revenue" 
            value="$0" 
            change="0%"
            icon={<DollarSign size={18} />}
            iconBgClass="bg-orange-50 dark:bg-orange-500/10"
            iconColorClass="text-orange-500 dark:text-orange-400"
            data={mockSparklineData}
            trendColor="#f97316"
          />
        </div>

        <div className="mb-6">
          <QuickStart />
        </div>

        <div className="mb-6">
          <AIInsight />
        </div>

        {/* 12-Column Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Content Column (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            <ContentPipeline />
            <RecentActivity />
          </div>

          {/* Sidebar Column (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <TopPerforming />
            <UsageStats />
            <AIAssistant />
          </div>
        </div>
      </main>
    </div>
  );
}
