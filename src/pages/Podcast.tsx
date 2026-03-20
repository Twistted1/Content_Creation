import React, { useState, useEffect } from 'react';
import PodcastStudio from '../components/podcast/PodcastStudio';
import { TopNav } from '@/components/dashboard/TopNav';
import { podcastService, PodcastData } from '@/services/podcastService';
import { useAuth } from '@/contexts/AuthContext';

const PodcastPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'episodes' | 'studio'>('studio');
  const [podcasts, setPodcasts] = useState<PodcastData[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const loadPodcasts = async () => {
    try {
      const data = await podcastService.getPodcasts();
      setPodcasts(data);
      setIsLoaded(true);
    } catch (error) {
      console.error("Failed to load podcasts", error);
    }
  };

  useEffect(() => {
    loadPodcasts();
  }, []);

  const handleRecordingToggle = (isRecording: boolean) => {
    console.log('Recording status changed:', isRecording);
  };

  return (
    <div className="min-h-screen bg-[#05060a] text-white transition-colors duration-200 pt-20 pb-8">
      <TopNav />
      
      <main className="max-w-[1800px] mx-auto px-6 fade-in">
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2 text-white flex items-center gap-3">
              <span className="p-2 bg-violet-600/20 rounded-lg">
                <i className="fas fa-microphone-alt text-violet-500"></i>
              </span>
              Podcast Studio
            </h1>
            <p className="text-gray-400">Record, mix, and produce your podcast episodes</p>
          </div>

          <div className="flex bg-[#111] p-1 rounded-xl border border-gray-800 shadow-xl">
            <button
              onClick={() => setActiveTab('studio')}
              className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${
                activeTab === 'studio' 
                  ? 'bg-violet-600 text-white shadow-lg shadow-violet-900/40' 
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              STUDIO
            </button>
            <button
              onClick={() => setActiveTab('episodes')}
              className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${
                activeTab === 'episodes' 
                  ? 'bg-violet-600 text-white shadow-lg shadow-violet-900/40' 
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              EPISODES
            </button>
          </div>
        </div>
        
        {activeTab === 'studio' ? (
          <div className="bg-[#05060A] rounded-2xl border border-gray-800 shadow-2xl overflow-hidden min-h-[700px]">
            <PodcastStudio 
              onRecordingToggle={handleRecordingToggle}
              isLive={true}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4">
            {podcasts.length === 0 ? (
              <div className="col-span-full py-20 text-center bg-[#111] rounded-2xl border border-gray-800">
                <div className="w-20 h-20 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-800">
                  <i className="fas fa-wave-square text-3xl text-gray-700"></i>
                </div>
                <h3 className="text-xl font-bold mb-2">No episodes yet</h3>
                <p className="text-gray-400 mb-6">Start your first recording session in the Studio</p>
                <button 
                  onClick={() => setActiveTab('studio')}
                  className="px-8 py-3 bg-violet-600 hover:bg-violet-500 rounded-xl font-bold transition shadow-lg shadow-violet-900/20"
                >
                  Launch Studio
                </button>
              </div>
            ) : (
              podcasts.map((podcast) => (
                <div key={podcast.id} className="bg-[#111] border border-gray-800 p-6 rounded-22xl hover:border-violet-500/50 transition group relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-4">
                      <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${podcast.status === 'published' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
                        {podcast.status}
                      </span>
                   </div>
                   
                   <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-violet-600/20 rounded-xl flex items-center justify-center text-xl text-violet-500">
                        <i className="fas fa-play"></i>
                      </div>
                      <div>
                        <h4 className="font-bold text-white group-hover:text-violet-400 transition">{podcast.title}</h4>
                        <p className="text-sm text-gray-500">{podcast.duration} • {podcast.topic}</p>
                      </div>
                   </div>

                   <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-800">
                      <div className="flex -space-x-2">
                         {podcast.hosts.map((host, i) => (
                           <div key={i} className="w-8 h-8 rounded-full bg-gray-800 border-2 border-[#111] flex items-center justify-center text-[10px] font-bold" title={host}>
                              {host[0]}
                           </div>
                         ))}
                      </div>
                      <div className="flex gap-2">
                        {podcast.audioUrl && (
                          <a href={podcast.audioUrl} target="_blank" rel="noreferrer" className="p-2 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-white transition">
                            <i className="fas fa-download"></i>
                          </a>
                        )}
                        <button 
                          onClick={() => {
                            if(confirm('Delete this episode?')) {
                              podcastService.deletePodcast(podcast.id!).then(loadPodcasts);
                            }
                          }}
                          className="p-2 hover:bg-red-500/10 rounded-lg text-gray-400 hover:text-red-500 transition"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                   </div>
                </div>
              ))
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default PodcastPage;
