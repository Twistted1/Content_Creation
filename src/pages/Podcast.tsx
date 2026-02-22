import React from 'react';
import PodcastStudio from '../components/podcast/PodcastStudio';
import { TopNav } from '@/components/dashboard/TopNav';

const PodcastPage = () => {
  const handleRecordingToggle = (isRecording: boolean) => {
    console.log('Recording status changed:', isRecording);
    // Add your recording logic here
  };

  const handleSegmentAdd = (segment: string) => {
    console.log('New segment added:', segment);
    // Add segment to your backend or state management
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-200 pt-24 pb-8">
      <TopNav />
      
      <main className="max-w-[1600px] mx-auto px-4 fade-in">
        <h1 className="text-2xl font-semibold mb-6">🎙️ Podcast Studio</h1>
        
        <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-1 border border-gray-200 dark:border-gray-700 shadow-sm dark:shadow-none transition-colors duration-200">
          <PodcastStudio 
            onRecordingToggle={handleRecordingToggle}
            isLive={true}
          />
        </div>
        
        {/* Optional: Add additional page content below */}
        <div className="mt-8 text-center text-gray-500 dark:text-gray-400">
          <div className="inline-flex items-center space-x-2 bg-green-500/10 px-3 py-1 rounded-full">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-green-600 dark:text-green-400">System Ready - Connected to audio devices</span>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PodcastPage;
