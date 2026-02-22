import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "@/pages/Home";
import Ideas from "@/pages/Ideas";
import Script from "@/pages/Script";
import Production from "@/pages/Production";
import Publish from "@/pages/Publish";
import Analytics from "@/pages/Analytics";
import Automation from "@/pages/Automation";
import Pricing from "@/pages/Pricing";
import Affiliate from "@/pages/Affiliate";
import Admin from "@/pages/Admin";
import Settings from "@/pages/Settings";
import MobilePrototype from "@/pages/MobilePrototype";
import Usage from "@/pages/Usage";
import ApiDocs from "@/pages/ApiDocs";
import Monetization from "@/pages/Monetization";
import Podcast from "@/pages/Podcast";
import Profile from "@/pages/Profile";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import Landing from "@/pages/Landing";
import NotFound from "@/pages/NotFound";
import Privacy from "@/pages/Privacy";
import Terms from "@/pages/Terms";
import ServiceStatus from "@/pages/ServiceStatus";
import Teleprompter from "@/pages/Teleprompter";
import ProtectedRoute from "@/components/ProtectedRoute";
import RootRoute from "@/components/RootRoute";
import { TopNav } from "@/components/dashboard/TopNav";

const PlaceholderPage = ({ title }: { title: string }) => (
  <div className="min-h-screen bg-gray-900 text-white font-sans pt-24 pb-8">
    <TopNav />
    <div className="max-w-7xl mx-auto px-4 fade-in py-20 text-center">
      <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">{title}</h1>
      <p className="text-gray-400 text-lg mb-8">This module is coming soon to ContentFlow Pro.</p>
      <div className="w-24 h-1 bg-gray-800 mx-auto rounded-full overflow-hidden">
        <div className="h-full bg-blue-500 w-1/2 animate-[shimmer_2s_infinite]"></div>
      </div>
    </div>
  </div>
);

import { Footer } from "@/components/Footer";

// ...

import { AuthProvider } from "@/context/AuthContext";

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-200 overflow-x-hidden">
          <div className="flex-grow">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<RootRoute />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/landing" element={<Landing />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            
            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/ideas" element={<Ideas />} />
              <Route path="/script" element={<Script />} />
              <Route path="/production" element={<Production />} />
              <Route path="/publish" element={<Publish />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/automation" element={<Automation />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/affiliate" element={<Affiliate />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/admin/status" element={<ServiceStatus />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/mobile" element={<MobilePrototype />} />
              <Route path="/usage" element={<Usage />} />
              <Route path="/api" element={<ApiDocs />} />
              <Route path="/monetization" element={<Monetization />} />
              <Route path="/podcast" element={<Podcast />} />
              <Route path="/teleprompter" element={<Teleprompter />} />
              <Route path="/profile" element={<Profile />} />
            </Route>
            
            {/* 404 Fallback */}
            <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}
