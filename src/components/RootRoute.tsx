import React from 'react';
import { useAuth } from '@/context/AuthContext';
import Home from '@/pages/Home';
import Landing from '@/pages/Landing';

export default function RootRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return user ? <Home /> : <Landing />;
}
