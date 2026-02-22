import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { TopNav } from '@/components/dashboard/TopNav';

export default function PlaceholderPage() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Extract the page title from the path (e.g., "/ideas" -> "Ideas")
  const title = location.pathname.split('/').filter(Boolean).pop() || 'Page';
  const formattedTitle = title.charAt(0).toUpperCase() + title.slice(1).replace(/-/g, ' ');

  return (
    <div className="min-h-screen bg-[#0b0e14] text-white font-sans">
      <TopNav />
      <main className="max-w-[1600px] mx-auto px-6 py-8">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft size={20} />
          Back
        </button>
        
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
          <div className="w-20 h-20 rounded-full bg-purple-500/10 flex items-center justify-center mb-4">
            <span className="text-4xl">🚧</span>
          </div>
          <h1 className="text-3xl font-bold text-white">{formattedTitle}</h1>
          <p className="text-gray-400 max-w-md">
            This feature is currently under development. You can navigate back to the dashboard to explore other active features.
          </p>
        </div>
      </main>
    </div>
  );
}
