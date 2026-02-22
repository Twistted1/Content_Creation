import React from 'react';
import { TopNav } from '@/components/dashboard/TopNav';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { ActiveProjects } from '@/components/dashboard/ActiveProjects';
import { WeekSchedule } from '@/components/dashboard/WeekSchedule';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { UsageStats } from '@/components/dashboard/UsageStats';
import { TeamOnline } from '@/components/dashboard/TeamOnline';
import { QuickStart } from '@/components/dashboard/QuickStart';
import { FileText, Eye, Users, DollarSign, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { scriptService } from '@/services/scriptService';
import { publishService } from '@/services/publishService';
import { auth } from '@/lib/firebase';

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
    <div className="min-h-screen pb-8">
      <TopNav />

      <main className="max-w-[1600px] mx-auto px-4 pt-24 pb-12 fade-in">
        {/* Welcome Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold mb-1 flex items-center gap-2 text-gray-900 dark:text-white">
              Welcome back, {userName}! <span className="text-xl">👋</span>
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Here's your content overview for today</p>
          </div>
          <button 
            onClick={() => navigate('/ideas')}
            className="flex items-center gap-2 bg-[#6366f1] hover:bg-[#5558e6] text-white px-4 py-2 rounded-xl font-bold transition shadow-lg shadow-indigo-900/20 text-sm"
          >
            <Plus size={16} /> New Project
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatsCard 
            label="Scripts Saved" 
            value={liveStats.scripts} 
            change="" 
            icon={<FileText size={20} />} 
            iconBgClass="bg-blue-100 dark:bg-blue-500/10" 
            iconColorClass="text-blue-600 dark:text-blue-400" 
          />
          <StatsCard 
            label="Posts Published" 
            value={liveStats.published} 
            change="" 
            icon={<Eye size={20} />} 
            iconBgClass="bg-purple-100 dark:bg-purple-500/10" 
            iconColorClass="text-purple-600 dark:text-purple-400" 
          />
          <StatsCard 
            label="Posts Scheduled" 
            value={liveStats.scheduled} 
            change="" 
            icon={<Users size={20} />} 
            iconBgClass="bg-green-100 dark:bg-green-500/10" 
            iconColorClass="text-green-600 dark:text-green-400" 
          />
          <StatsCard 
            label="Revenue" 
            value="$0" 
            change="" 
            icon={<DollarSign size={20} />} 
            iconBgClass="bg-orange-100 dark:bg-orange-500/10" 
            iconColorClass="text-orange-600 dark:text-orange-400" 
          />
        </div>

        {/* Quick Actions (Preserved) */}
        <div className="mb-6">
          <QuickStart />
        </div>

        {/* Links to Production Tabs */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <button onClick={() => navigate('/production?tab=voiceover')} className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition flex items-center justify-center gap-2 shadow-sm dark:shadow-none">
            <i className="fas fa-microphone text-blue-500 dark:text-blue-400"></i> <span className="font-bold text-gray-900 dark:text-white">Voice Gen</span>
          </button>
          <button onClick={() => navigate('/production?tab=images')} className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition flex items-center justify-center gap-2 shadow-sm dark:shadow-none">
            <i className="fas fa-image text-purple-500 dark:text-purple-400"></i> <span className="font-bold text-gray-900 dark:text-white">Image Gen</span>
          </button>
          <button onClick={() => navigate('/production?tab=video')} className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition flex items-center justify-center gap-2 shadow-sm dark:shadow-none">
            <i className="fas fa-video text-red-500 dark:text-red-400"></i> <span className="font-bold text-gray-900 dark:text-white">Video Gen</span>
          </button>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
          {/* Left Column (Wider) */}
          <div className="lg:col-span-2 space-y-4">
            <ActiveProjects />
            <RecentActivity />
          </div>

          {/* Right Column (Narrower) */}
          <div className="space-y-4">
            <WeekSchedule />
            <div>
              <UsageStats />
              <TeamOnline />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
