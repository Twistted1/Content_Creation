import React, { useState, useEffect } from 'react';
import { TopNav } from '@/components/dashboard/TopNav';
import { analyticsService } from '@/services/analyticsService';

// Mock data types
interface PlatformStat {
  platform: string;
  views: string;
  label: string;
  change: string;
  changeType: 'up' | 'down';
  color: string;
  icon: string;
  bgClass: string;
  percent: number;
}

interface ContentItem {
  id: number;
  title: string;
  views: string;
  change: string;
  type: 'video' | 'short' | 'post';
  icon: string;
  gradient: string;
}

interface DailyView {
  day: string;
  value: number;
}

export default function Analytics() {
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');
  
  // State for dynamic data
  const [platformStats, setPlatformStats] = useState<PlatformStat[]>([
    {
      platform: 'youtube',
      views: '0',
      label: 'YouTube Posts',
      change: '-',
      changeType: 'up',
      color: 'bg-red-500',
      icon: 'fab fa-youtube text-red-400',
      bgClass: 'bg-red-500/20',
      percent: 0
    },
    {
      platform: 'tiktok',
      views: '0',
      label: 'TikTok Posts',
      change: '-',
      changeType: 'up',
      color: 'bg-blue-500',
      icon: 'fab fa-tiktok text-blue-400',
      bgClass: 'bg-blue-500/20',
      percent: 0
    },
    {
      platform: 'instagram',
      views: '0',
      label: 'Instagram Posts',
      change: '-',
      changeType: 'up',
      color: 'bg-pink-500',
      icon: 'fab fa-instagram text-pink-400',
      bgClass: 'bg-pink-500/20',
      percent: 0
    }
  ]);

  const [chartData, setChartData] = useState<DailyView[]>([]);

  const [activeChart, setActiveChart] = useState<'views' | 'engagement' | 'earnings'>('views');

  const [topContent, setTopContent] = useState<ContentItem[]>([]);

  useEffect(() => {
    loadAnalytics();
  }, [timeRange]);

  const loadAnalytics = async () => {
    try {
      setIsLoading(true);
      const data = await analyticsService.getDashboardStats();
      
      // Map real data to platformStats
      setPlatformStats(prev => prev.map(p => {
        const found = data.platformStats.find(s => s.platform === p.platform);
        const count = found ? found.count : 0;
        return {
            ...p,
            views: count.toString(),
            percent: data.totalPosts > 0 ? (count / data.totalPosts) * 100 : 0,
            change: data.totalPosts > 0 ? `${Math.round((count / data.totalPosts) * 100)}%` : '-'
        };
      }));

      // Map real data to chartData (Daily Activity)
      if (data.dailyActivity) {
         setChartData(data.dailyActivity);
      }

      // Map real data to Top Content
      if (data.recentPosts && data.recentPosts.length > 0) {
         setTopContent(data.recentPosts.map((post: any, index: number) => ({
            id: index,
            title: post.title || 'Untitled Post',
            views: 'New', // We don't have view count yet
            change: 'Just now',
            type: post.platform === 'youtube' ? 'video' : post.platform === 'tiktok' ? 'short' : 'post',
            icon: post.platform === 'youtube' ? '🎬' : '📱',
            gradient: post.platform === 'youtube' ? 'from-red-500 to-pink-500' : 'from-blue-500 to-cyan-500'
         })));
      }

    } catch (error) {
      console.error("Failed to load analytics", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateReport = () => {
    const csvContent = [
      ['Platform', 'Views', 'Change'],
      ...platformStats.map(s => [s.platform, s.views, s.change])
    ].map(e => e.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `analytics_report_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const refreshData = () => {
    loadAnalytics();
  };
  
  const maxValue = Math.max(...chartData.map(d => d.value), 10);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white font-sans pb-8 transition-colors duration-200">
      <TopNav />
      
      <main className="max-w-[1600px] mx-auto px-4 pt-24 fade-in">
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">📊 Analytics & Statistics</h1>
            <p className="text-gray-600 dark:text-gray-400">Track your content performance across all platforms</p>
          </div>
          <div className="flex items-center gap-3">
            <select 
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-purple-500 text-gray-900 dark:text-white"
            >
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 3 Months</option>
            </select>
            <button 
              onClick={refreshData}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition text-gray-600 dark:text-gray-300"
              title="Refresh Data"
            >
              <i className={`fas fa-sync-alt ${isLoading ? 'fa-spin' : ''}`}></i>
            </button>
            <button 
              onClick={handleGenerateReport}
              className="gradient-bg px-6 py-2 rounded-lg font-medium hover:opacity-90 transition flex items-center gap-2 text-white shadow-lg shadow-purple-500/20"
            >
              <i className="fas fa-file-export"></i> Export
            </button>
          </div>
        </div>

        {/* Platform Stats */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          {platformStats.map((stat) => (
            <div key={stat.platform} className="bg-white dark:bg-gray-800 rounded-2xl p-6 hover:bg-gray-50 dark:hover:bg-gray-750 transition duration-300 border border-gray-200 dark:border-gray-700 shadow-sm dark:shadow-none">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 ${stat.bgClass} rounded-lg flex items-center justify-center`}>
                    <i className={stat.icon}></i>
                  </div>
                  <div>
                    <p className="font-bold text-xl text-gray-900 dark:text-white">{stat.views}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
                  </div>
                </div>
                <span className={`text-${stat.changeType === 'up' ? 'green' : 'red'}-600 dark:text-${stat.changeType === 'up' ? 'green' : 'red'}-400 text-sm`}>
                  <i className={`fas fa-arrow-${stat.changeType}`}></i> {stat.change}
                </span>
              </div>
              <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className={`h-2 ${stat.color} rounded-full transition-all duration-1000 ease-out`} 
                  style={{ width: isLoading ? '0%' : `${stat.percent}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid lg:grid-cols-3 gap-6 mb-6">
           {/* Chart Section */}
           <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm dark:shadow-none">
              <div className="flex items-center justify-between mb-6">
                 <h3 className="font-bold text-lg text-gray-900 dark:text-white">📅 Posting Activity</h3>
                 <div className="text-sm bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-lg text-gray-600 dark:text-gray-300">Last 7 Days</div>
              </div>
              
              <div className="h-72 relative">
                 {/* Y-Axis Labels */}
                 <div className="absolute left-0 top-0 bottom-6 w-8 flex flex-col justify-between text-xs text-gray-400 dark:text-gray-500 text-right pr-2">
                    <span>{maxValue}</span>
                    <span>{Math.round(maxValue * 0.75)}</span>
                    <span>{Math.round(maxValue * 0.5)}</span>
                    <span>{Math.round(maxValue * 0.25)}</span>
                    <span>0</span>
                 </div>
                 
                 {/* Chart Area */}
                 <div className="ml-8 h-full flex items-end justify-between gap-2 pl-2 border-l border-b border-gray-200 dark:border-gray-700">
                    {chartData.map((data, i) => (
                      <div key={i} className="flex-1 flex flex-col justify-end group relative h-full">
                        {/* Tooltip */}
                        <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition pointer-events-none border border-gray-700 shadow-lg z-10 whitespace-nowrap">
                          {data.value} posts
                          <div className="absolute bottom-[-4px] left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45 border-r border-b border-gray-700"></div>
                        </div>
                        
                        {/* Bar */}
                        <div 
                          className="w-full mx-auto max-w-[40px] rounded-t-sm hover:opacity-80 transition-all duration-500 ease-out relative overflow-hidden bg-gradient-to-t from-purple-600 to-blue-500"
                          style={{ height: isLoading ? '0%' : `${(data.value / maxValue) * 100}%` }}
                        >
                           <div className="absolute top-0 left-0 w-full h-1 bg-white/20"></div>
                        </div>
                        
                        {/* X-Axis Label */}
                        <div className="text-center text-xs text-gray-500 dark:text-gray-400 mt-2">{data.day}</div>
                      </div>
                    ))}
                 </div>
                 
                 {/* Grid Lines */}
                 <div className="absolute left-8 right-0 top-0 h-px bg-gray-100 dark:bg-gray-700/30"></div>
                 <div className="absolute left-8 right-0 top-1/4 h-px bg-gray-100 dark:bg-gray-700/30"></div>
                 <div className="absolute left-8 right-0 top-2/4 h-px bg-gray-100 dark:bg-gray-700/30"></div>
                 <div className="absolute left-8 right-0 top-3/4 h-px bg-gray-100 dark:bg-gray-700/30"></div>
              </div>
           </div>

           {/* Top Content (Sidebar) */}
           <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 flex flex-col border border-gray-200 dark:border-gray-700 shadow-sm dark:shadow-none">
              <h3 className="font-bold mb-4 text-gray-900 dark:text-white">🎯 Recent Posts</h3>
              {topContent.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-gray-500 dark:text-gray-500">
                      <p>No recent content found.</p>
                  </div>
              ) : (
                  <div className="space-y-4 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                    {topContent.map((content) => (
                      <div key={content.id} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700/30 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700/50 transition cursor-pointer group border border-gray-100 dark:border-transparent">
                        <div className={`w-12 h-12 flex-shrink-0 bg-gradient-to-br ${content.gradient} rounded-lg flex items-center justify-center text-xl shadow-lg group-hover:scale-110 transition-transform`}>
                          {content.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">{content.title}</p>
                          <div className="flex items-center justify-between mt-1">
                             <span className="text-xs text-gray-500 dark:text-gray-400">Published recently</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
              )}
           </div>
        </div>
      </main>
    </div>
  );
}
