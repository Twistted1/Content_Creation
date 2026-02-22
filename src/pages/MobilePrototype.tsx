import React, { useState } from 'react';
import { TopNav } from '@/components/dashboard/TopNav';

export default function MobilePrototype() {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans pt-16 pb-8">
      <TopNav />
      
      <main className="max-w-7xl mx-auto px-4 fade-in">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">📱 Mobile App Prototype</h1>
          <p className="text-gray-400">Interactive preview of the iOS/Android experience</p>
        </div>

        <div className="flex justify-center gap-8 flex-wrap">
          {/* iOS Device Frame */}
          <div className="relative border-gray-800 bg-gray-900 border-[14px] rounded-[2.5rem] h-[600px] w-[300px] shadow-xl">
            <div className="w-[148px] h-[18px] bg-gray-800 top-0 rounded-b-[1rem] left-1/2 -translate-x-1/2 absolute"></div>
            <div className="h-[32px] w-[3px] bg-gray-800 absolute -start-[17px] top-[72px] rounded-s-lg"></div>
            <div className="h-[46px] w-[3px] bg-gray-800 absolute -start-[17px] top-[124px] rounded-s-lg"></div>
            <div className="h-[46px] w-[3px] bg-gray-800 absolute -start-[17px] top-[178px] rounded-s-lg"></div>
            <div className="h-[64px] w-[3px] bg-gray-800 absolute -end-[17px] top-[142px] rounded-e-lg"></div>
            
            {/* Screen Content */}
            <div className="rounded-[2rem] overflow-hidden w-full h-full bg-black relative flex flex-col">
              
              {/* Status Bar */}
              <div className="h-12 w-full bg-black flex justify-between items-center px-6 pt-2 text-xs font-bold">
                <span>9:41</span>
                <div className="flex gap-1">
                  <i className="fas fa-signal"></i>
                  <i className="fas fa-wifi"></i>
                  <i className="fas fa-battery-full"></i>
                </div>
              </div>

              {/* App Content */}
              <div className="flex-1 overflow-y-auto custom-scrollbar pb-20 bg-gray-900">
                {activeTab === 'home' && (
                  <div className="p-4 space-y-4">
                    <div className="flex justify-between items-center">
                      <h2 className="text-xl font-bold">Good Morning</h2>
                      <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                        <i className="fas fa-user text-xs"></i>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-4 rounded-2xl">
                      <p className="text-xs text-purple-200 mb-1">Daily Streak</p>
                      <h3 className="text-2xl font-bold">🔥 12 Days</h3>
                      <p className="text-xs mt-2">Keep creating to maintain it!</p>
                    </div>

                    <h3 className="font-bold mt-4">Recent Ideas</h3>
                    {[1, 2, 3].map(i => (
                      <div key={i} className="bg-gray-800 p-3 rounded-xl flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center">
                          <i className="fas fa-lightbulb text-yellow-400"></i>
                        </div>
                        <div>
                          <p className="font-medium text-sm">Tech Review #{i}</p>
                          <p className="text-xs text-gray-400">AI Generated • 2m ago</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'create' && (
                  <div className="p-4 h-full flex flex-col justify-center items-center text-center space-y-6">
                    <div className="w-20 h-20 gradient-bg rounded-full flex items-center justify-center shadow-lg animate-pulse">
                      <i className="fas fa-microphone text-3xl"></i>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">Tap to Record</h2>
                      <p className="text-gray-400 text-sm mt-2">Capture a quick idea via voice</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 w-full mt-8">
                       <button className="bg-gray-800 p-4 rounded-xl flex flex-col items-center gap-2">
                         <i className="fas fa-pen text-blue-400 text-xl"></i>
                         <span className="text-xs">Write Script</span>
                       </button>
                       <button className="bg-gray-800 p-4 rounded-xl flex flex-col items-center gap-2">
                         <i className="fas fa-image text-purple-400 text-xl"></i>
                         <span className="text-xs">Gen Image</span>
                       </button>
                    </div>
                  </div>
                )}

                {activeTab === 'profile' && (
                  <div className="p-4">
                    <div className="text-center mb-6">
                      <div className="w-20 h-20 bg-gray-700 rounded-full mx-auto mb-3 border-4 border-gray-800"></div>
                      <h2 className="font-bold text-lg">Creator Name</h2>
                      <p className="text-sm text-gray-400">@creator_pro</p>
                    </div>
                    <div className="grid grid-cols-3 gap-2 mb-6 text-center">
                      <div className="bg-gray-800 p-2 rounded-lg">
                        <p className="font-bold">1.2k</p>
                        <p className="text-[10px] text-gray-400">Ideas</p>
                      </div>
                      <div className="bg-gray-800 p-2 rounded-lg">
                        <p className="font-bold">45</p>
                        <p className="text-[10px] text-gray-400">Posts</p>
                      </div>
                      <div className="bg-gray-800 p-2 rounded-lg">
                        <p className="font-bold">8.9k</p>
                        <p className="text-[10px] text-gray-400">Views</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {['Settings', 'Subscription', 'Help & Support'].map(item => (
                        <div key={item} className="p-3 bg-gray-800 rounded-xl flex justify-between items-center">
                          <span className="text-sm">{item}</span>
                          <i className="fas fa-chevron-right text-xs text-gray-500"></i>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Nav */}
              <div className="absolute bottom-0 w-full h-20 bg-gray-800/90 backdrop-blur-md border-t border-gray-700 flex justify-around items-start pt-4 px-2">
                 <button onClick={() => setActiveTab('home')} className={`flex flex-col items-center gap-1 w-16 ${activeTab === 'home' ? 'text-purple-400' : 'text-gray-400'}`}>
                   <i className="fas fa-home text-xl"></i>
                   <span className="text-[10px]">Home</span>
                 </button>
                 <button onClick={() => setActiveTab('create')} className={`flex flex-col items-center gap-1 w-16 ${activeTab === 'create' ? 'text-purple-400' : 'text-gray-400'}`}>
                   <div className="w-10 h-10 -mt-6 bg-purple-600 rounded-full flex items-center justify-center shadow-lg border-4 border-black">
                     <i className="fas fa-plus text-white"></i>
                   </div>
                 </button>
                 <button onClick={() => setActiveTab('profile')} className={`flex flex-col items-center gap-1 w-16 ${activeTab === 'profile' ? 'text-purple-400' : 'text-gray-400'}`}>
                   <i className="fas fa-user text-xl"></i>
                   <span className="text-[10px]">Profile</span>
                 </button>
              </div>

              {/* Home Indicator */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-white rounded-full"></div>
            </div>
          </div>
          
          <div className="max-w-xs pt-20">
             <h3 className="text-xl font-bold mb-4">React Native Features</h3>
             <ul className="space-y-3 text-gray-400 text-sm list-disc pl-4">
               <li><strong className="text-white">Camera Access:</strong> Direct integration for recording clips.</li>
               <li><strong className="text-white">Push Notifications:</strong> Get alerted when scripts are ready.</li>
               <li><strong className="text-white">Offline Mode:</strong> Draft ideas without internet.</li>
               <li><strong className="text-white">Share Sheet:</strong> Native sharing to TikTok/Instagram apps.</li>
               <li><strong className="text-white">Haptic Feedback:</strong> Tactile response for interactions.</li>
             </ul>
             <div className="mt-8 p-4 bg-gray-800 rounded-xl border border-gray-700">
               <p className="text-xs text-gray-400 mb-2">To start development:</p>
               <code className="block bg-black p-2 rounded text-xs text-green-400 font-mono">
                 npx create-expo-app mobile-app
               </code>
             </div>
          </div>
        </div>
      </main>
    </div>
  );
}
