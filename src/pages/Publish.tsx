import React, { useState, useEffect } from 'react';
import { TopNav } from '@/components/dashboard/TopNav';
import { publishService, Post } from '@/services/publishService';
import { showToast } from '@/utils/toast';

interface AutoRule {
  id: string;
  platform: 'youtube' | 'tiktok' | 'instagram' | 'x' | 'facebook' | 'linkedin' | 'website' | 'rumble';
  name: string;
  enabled: boolean;
  trigger: string;
}

export default function Publish() {
  const [view, setView] = useState<'calendar' | 'list'>('calendar');
  const [currentDate, setCurrentDate] = useState(new Date());

  const [posts, setPosts] = useState<Post[]>([]);

  const [isYoutubeConnected, setIsYoutubeConnected] = useState(false);
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [channelInfo, setChannelInfo] = useState<any>(null);

  // Initialize Google Identity Services
    useEffect(() => {
      // Check if token exists in session
      const token = sessionStorage.getItem('youtube_access_token');
      if (token) {
        setIsYoutubeConnected(true);
      }
    }, []);
  
    const handleConnectPlatform = (platform: string) => {
      if (platform === 'youtube') {
          handleConnectYoutube();
      } else {
          // Placeholder for other platforms
          showToast(`${platform.charAt(0).toUpperCase() + platform.slice(1)} integration coming soon!`, 'info');
      }
    };
  
    const handleConnectYoutube = () => {
    const keys = localStorage.getItem('api_keys');
    if (!keys) {
      alert('Please configure YouTube API keys in Settings first.');
      return;
    }
    
    const { youtubeClientId } = JSON.parse(keys);
    if (!youtubeClientId) {
      alert('Missing YouTube Client ID in Settings.');
      return;
    }

    setIsConnecting(true);

    // Initialize the token client
    const client = (window as any).google?.accounts.oauth2.initTokenClient({
      client_id: youtubeClientId,
      scope: 'https://www.googleapis.com/auth/youtube.upload https://www.googleapis.com/auth/youtube.readonly',
      callback: (response: any) => {
        if (response.access_token) {
          sessionStorage.setItem('youtube_access_token', response.access_token);
          setIsYoutubeConnected(true);
          setShowConnectModal(false);
          alert('Successfully connected to YouTube!');
        } else {
          alert('Failed to connect to YouTube.');
        }
        setIsConnecting(false);
      },
    });

    if (client) {
      client.requestAccessToken();
    } else {
      alert('Google Identity Services script not loaded. Please refresh the page.');
      setIsConnecting(false);
    }
  };

  // Load posts from Firebase
  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const data = await publishService.getPosts();
      setPosts(data);
    } catch (error) {
      console.error("Failed to load posts", error);
    }
  };

  const [autoRules, setAutoRules] = useState<AutoRule[]>([
    { id: '1', platform: 'youtube', name: 'YouTube Auto-Upload', enabled: true, trigger: 'When video is ready' },
    { id: '2', platform: 'tiktok', name: 'TikTok Auto-Upload', enabled: true, trigger: 'When video is ready' },
    { id: '3', platform: 'instagram', name: 'Instagram Auto-Post', enabled: true, trigger: 'When video is ready' },
    { id: '4', platform: 'x', name: 'X Auto-Post', enabled: false, trigger: 'When video is ready' },
    { id: '5', platform: 'facebook', name: 'Facebook Auto-Post', enabled: false, trigger: 'When video is ready' },
    { id: '6', platform: 'linkedin', name: 'LinkedIn Auto-Post', enabled: false, trigger: 'When article is ready' },
    { id: '7', platform: 'website', name: 'Novus Exchange (Website)', enabled: true, trigger: 'When post is ready' },
    { id: '8', platform: 'rumble', name: 'Rumble Auto-Upload', enabled: true, trigger: 'When video is ready' }
  ]);

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Helper to get days in month
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    
    const dayArray = [];
    for (let i = 0; i < firstDay; i++) {
      dayArray.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      dayArray.push(i);
    }
    return dayArray;
  };

  const calendarDays = getDaysInMonth(currentDate);

  const getPostsForDay = (day: number) => {
    if (!day) return [];
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return posts.filter(p => p.date === dateStr);
  };

  const toggleRule = (id: string) => {
    setAutoRules(prev => prev.map(rule => 
      rule.id === id ? { ...rule, enabled: !rule.enabled } : rule
    ));
  };

  const handleSchedulePost = async () => {
    const title = prompt('Enter post title:');
    if (!title) return;
    
    // In a real app, we would ask for platform. Defaulting to youtube for now.
    const newPost: Omit<Post, 'id'> = {
      platform: 'youtube',
      title,
      date: `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(new Date().getDate()).padStart(2, '0')}`,
      time: '12:00',
      status: 'scheduled',
      type: 'video'
    };
    
    try {
      await publishService.createPost(newPost);
      await loadPosts(); // Reload
      alert('Post scheduled successfully!');
    } catch (error) {
      console.error("Failed to schedule post", error);
    }
  };


  const getPlatformIcon = (platform: string) => {
    switch(platform) {
      case 'youtube': return 'fab fa-youtube text-red-400';
      case 'tiktok': return 'fab fa-tiktok text-blue-400';
      case 'instagram': return 'fab fa-instagram text-pink-400';
      case 'x': return 'fab fa-x-twitter text-white';
      case 'facebook': return 'fab fa-facebook text-blue-500';
      case 'linkedin': return 'fab fa-linkedin text-blue-400';
      default: return 'fas fa-share-alt';
    }
  };

  const getPlatformColor = (platform: string) => {
    switch(platform) {
      case 'youtube': return 'red';
      case 'tiktok': return 'blue';
      case 'instagram': return 'pink';
      case 'x': return 'gray';
      case 'facebook': return 'blue';
      case 'linkedin': return 'blue';
      default: return 'gray';
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white font-sans pt-24 pb-8 transition-colors duration-200">
      <TopNav />
      
      <main className="max-w-[1600px] mx-auto px-6 fade-in">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold mb-2 text-gray-900 dark:text-white">📤 Publishing Hub</h1>
            <p className="text-gray-500 dark:text-gray-400">Schedule and automate your content distribution</p>
          </div>
          <div className="flex gap-3">
             <button 
               onClick={() => setShowConnectModal(true)}
               className={`px-4 py-2 rounded-lg font-medium transition flex items-center gap-2 border ${isYoutubeConnected ? 'bg-green-500/10 border-green-500 text-green-600 dark:text-green-400' : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500 text-gray-700 dark:text-gray-300'}`}
             >
               <i className={`fab fa-youtube ${isYoutubeConnected ? '' : 'text-gray-400'}`}></i> 
               {isYoutubeConnected ? 'Connected' : 'Connect YouTube'}
             </button>
             <button 
               onClick={handleSchedulePost}
               className="gradient-bg px-6 py-2 rounded-lg font-medium hover:opacity-90 transition flex items-center gap-2 text-white shadow-lg shadow-purple-900/20"
             >
               <i className="fas fa-calendar-plus"></i> Schedule Post
             </button>
          </div>
        </div>

        {/* Connect Modal */}
        {showConnectModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
             <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full border border-gray-200 dark:border-gray-700 shadow-2xl">
               <div className="flex justify-between items-center mb-6">
                 <h3 className="text-xl font-bold text-gray-900 dark:text-white">Connect Platforms</h3>
                 <button onClick={() => setShowConnectModal(false)} className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                   <i className="fas fa-times"></i>
                 </button>
               </div>
               
               <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                 {/* YouTube */}
                 <div className={`p-4 rounded-xl border transition ${isYoutubeConnected ? 'bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800' : 'bg-gray-50 dark:bg-gray-700/30 border-gray-200 dark:border-gray-600'}`}>
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-sm">
                                <i className="fab fa-youtube text-xl text-red-600"></i>
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900 dark:text-white">YouTube</h4>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{isYoutubeConnected ? 'Connected as Tech Insider' : 'Not connected'}</p>
                            </div>
                        </div>
                        {isYoutubeConnected ? (
                            <button onClick={() => setIsYoutubeConnected(false)} className="text-xs text-red-500 hover:underline">Disconnect</button>
                        ) : (
                            <button onClick={handleConnectYoutube} disabled={isConnecting} className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg transition">Connect</button>
                        )}
                    </div>
                 </div>

                 {/* Other Platforms */}
                 {[
                    { id: 'tiktok', name: 'TikTok', icon: 'fab fa-tiktok', color: 'text-black dark:text-white', bg: 'bg-black/5 dark:bg-white/10' },
                    { id: 'instagram', name: 'Instagram', icon: 'fab fa-instagram', color: 'text-pink-600', bg: 'bg-pink-50 dark:bg-pink-900/10' },
                    { id: 'x', name: 'X (Twitter)', icon: 'fab fa-x-twitter', color: 'text-black dark:text-white', bg: 'bg-gray-100 dark:bg-gray-700' },
                    { id: 'linkedin', name: 'LinkedIn', icon: 'fab fa-linkedin', color: 'text-blue-700', bg: 'bg-blue-50 dark:bg-blue-900/10' },
                 ].map(platform => (
                     <div key={platform.id} className="p-4 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/30 opacity-75 hover:opacity-100 transition">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 ${platform.bg} rounded-full flex items-center justify-center shadow-sm`}>
                                    <i className={`${platform.icon} text-xl ${platform.color}`}></i>
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900 dark:text-white">{platform.name}</h4>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Not connected</p>
                                </div>
                            </div>
                            <button onClick={() => handleConnectPlatform(platform.id)} className="px-3 py-1.5 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-700 dark:text-white text-xs font-bold rounded-lg transition">Connect</button>
                        </div>
                     </div>
                 ))}
               </div>
             </div>
          </div>
        )}

        {/* View Toggle */}
        <div className="flex gap-4 mb-6">
          <button 
            onClick={() => setView('calendar')}
            className={`px-6 py-2 rounded-lg text-sm flex items-center gap-2 transition ${view === 'calendar' ? 'bg-purple-500/10 dark:bg-purple-500/20 border border-purple-500 text-purple-600 dark:text-white' : 'bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
          >
            <i className="fas fa-calendar"></i> Calendar
          </button>
          <button 
            onClick={() => setView('list')}
            className={`px-6 py-2 rounded-lg text-sm flex items-center gap-2 transition ${view === 'list' ? 'bg-purple-500/10 dark:bg-purple-500/20 border border-purple-500 text-purple-600 dark:text-white' : 'bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
          >
            <i className="fas fa-list"></i> List
          </button>
        </div>

        <div className="grid lg:grid-cols-5 gap-6">
          {/* Main Content Area (Calendar or List) - Takes up 4/5 space */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm dark:shadow-none transition-colors duration-200">
            {view === 'calendar' ? (
              <>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                  </h3>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))}
                      className="p-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300"
                    >
                      <i className="fas fa-chevron-left"></i>
                    </button>
                    <button 
                      onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))}
                      className="p-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300"
                    >
                      <i className="fas fa-chevron-right"></i>
                    </button>
                  </div>
                </div>
                <div className="overflow-x-auto pb-2">
                  <div className="min-w-[800px]">
                    <div className="grid grid-cols-7 gap-1 mb-2">
                      {days.map(day => (
                        <div key={day} className="text-center text-sm text-gray-500 dark:text-gray-400 py-2 font-medium">{day}</div>
                      ))}
                    </div>
                    <div className="grid grid-cols-7 gap-px bg-gray-200 dark:bg-gray-700 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                      {calendarDays.map((day, i) => {
                        const dayPosts = day ? getPostsForDay(day) : [];
                        const isToday = day === new Date().getDate() && currentDate.getMonth() === new Date().getMonth();
                        
                        return (
                          <div 
                            key={i} 
                            className={`min-h-[140px] bg-white dark:bg-gray-800 p-2 relative group transition hover:bg-gray-50 dark:hover:bg-gray-700/50 ${!day ? 'bg-gray-50 dark:bg-gray-800/50' : ''}`}
                            onClick={() => day && handleSchedulePost()}
                          >
                            {day && (
                              <>
                                <div className="flex justify-between items-start mb-2">
                                    <span className={`text-sm font-medium ${isToday ? 'bg-purple-600 text-white w-6 h-6 rounded-full flex items-center justify-center shadow-md' : 'text-gray-700 dark:text-gray-300'}`}>
                                        {day}
                                    </span>
                                    {/* Quick Add Button on Hover */}
                                    <button className="opacity-0 group-hover:opacity-100 transition p-1 text-gray-400 hover:text-purple-600 dark:hover:text-purple-400">
                                        <i className="fas fa-plus-circle"></i>
                                    </button>
                                </div>
                                
                                <div className="space-y-1.5 overflow-y-auto max-h-[100px] scrollbar-hide">
                                  {dayPosts.map(post => (
                                    <div 
                                        key={post.id} 
                                        className={`text-xs p-1.5 rounded-md border border-l-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md cursor-pointer
                                            bg-white dark:bg-gray-700 border-gray-100 dark:border-gray-600
                                            ${post.platform === 'youtube' ? 'border-l-red-500' : 
                                              post.platform === 'tiktok' ? 'border-l-blue-400' :
                                              post.platform === 'instagram' ? 'border-l-pink-500' :
                                              post.platform === 'linkedin' ? 'border-l-blue-700' : 'border-l-gray-500'}
                                        `}
                                    >
                                      <div className="flex items-center gap-1.5 mb-0.5">
                                        <i className={`${getPlatformIcon(post.platform)} text-[10px]`}></i>
                                        <span className="text-[10px] text-gray-500 dark:text-gray-400">{post.time}</span>
                                      </div>
                                      <p className="truncate font-medium text-gray-900 dark:text-white leading-tight">{post.title}</p>
                                    </div>
                                  ))}
                                  
                                  {/* Empty State Indicator */}
                                  {dayPosts.length === 0 && (
                                      <div className="h-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition delay-75">
                                          <div className="text-center">
                                              <p className="text-[10px] text-gray-400">No posts</p>
                                          </div>
                                      </div>
                                  )}
                                </div>
                              </>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div>
                <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">All Scheduled Posts</h3>
                <div className="space-y-3">
                  {posts.map(post => (
                    <div key={post.id} className="flex items-center justify-between p-4 bg-white dark:bg-gray-700/30 border border-gray-200 dark:border-transparent rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-lg bg-${getPlatformColor(post.platform)}-100 dark:bg-${getPlatformColor(post.platform)}-500/20 flex items-center justify-center text-${getPlatformColor(post.platform)}-600 dark:text-${getPlatformColor(post.platform)}-400`}>
                          <i className={getPlatformIcon(post.platform)}></i>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{post.title}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {post.date} at {post.time} • <span className="capitalize">{post.type}</span>
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          post.status === 'scheduled' ? 'bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400' :
                          post.status === 'published' ? 'bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400' :
                          'bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400'
                        }`}>
                          {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                        </span>
                        <button className="text-gray-400 hover:text-gray-900 dark:hover:text-white"><i className="fas fa-ellipsis-v"></i></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            </div>

            {/* Auto-Post Settings */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm dark:shadow-none transition-colors duration-200">
              <h3 className="font-bold mb-4 text-gray-900 dark:text-white">⚡ Auto-Publishing Rules</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {autoRules.map(rule => (
                  <div key={rule.id} className="p-4 bg-white dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-600">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <i className={getPlatformIcon(rule.platform)}></i>
                        <span className="font-medium text-sm text-gray-900 dark:text-white">
                          {rule.platform === 'x' ? 'X (Twitter)' : 
                           rule.platform === 'linkedin' ? 'LinkedIn' :
                           rule.platform === 'facebook' ? 'Facebook' :
                           rule.platform.charAt(0).toUpperCase() + rule.platform.slice(1)}
                        </span>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer" 
                          checked={rule.enabled}
                          onChange={() => toggleRule(rule.id)}
                        />
                        <div className="w-9 h-5 bg-gray-300 dark:bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-600"></div>
                      </label>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{rule.trigger}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar - Takes up 1/4 space */}
          <div className="space-y-6">
            {/* Upcoming Summary */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 h-full border border-gray-200 dark:border-gray-700 shadow-sm dark:shadow-none transition-colors duration-200 flex flex-col">
              <h3 className="font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
                  <i className="fas fa-clock text-purple-500"></i> Upcoming
              </h3>
              <div className="space-y-3 flex-1 overflow-y-auto max-h-[calc(100vh-300px)] scrollbar-hide">
                {posts.filter(p => new Date(p.date) >= new Date()).slice(0, 8).map(post => (
                  <div key={post.id} className="p-3 bg-white dark:bg-gray-700/30 border border-gray-100 dark:border-gray-600 rounded-xl hover:shadow-md transition group">
                    <div className="flex items-center gap-2 mb-1.5">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center bg-${getPlatformColor(post.platform)}-100 dark:bg-${getPlatformColor(post.platform)}-900/30 text-${getPlatformColor(post.platform)}-600 dark:text-${getPlatformColor(post.platform)}-400`}>
                          <i className={`${getPlatformIcon(post.platform)} text-xs`}></i>
                      </div>
                      <span className="text-xs font-medium text-gray-500 dark:text-gray-400 ml-auto bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full">
                        {post.time}
                      </span>
                    </div>
                    <p className="font-medium text-sm text-gray-900 dark:text-white line-clamp-2 leading-snug group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">{post.title}</p>
                    <div className="flex items-center gap-2 mt-2 pt-2 border-t border-gray-100 dark:border-gray-700/50">
                        <span className="text-[10px] text-gray-400">{post.date === new Date().toISOString().split('T')[0] ? 'Today' : new Date(post.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded ml-auto ${
                          post.status === 'scheduled' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-gray-100 text-gray-600'
                        }`}>{post.status}</span>
                    </div>
                  </div>
                ))}
                {posts.filter(p => new Date(p.date) >= new Date()).length === 0 && (
                    <div className="flex flex-col items-center justify-center h-32 text-gray-400 text-center">
                        <i className="fas fa-calendar-times text-2xl mb-2 opacity-50"></i>
                        <p className="text-sm">No upcoming posts</p>
                    </div>
                )}
              </div>
              
              <button onClick={handleSchedulePost} className="w-full mt-4 py-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl text-gray-500 hover:border-purple-500 hover:text-purple-500 transition text-sm font-medium">
                  + Add New
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
