import React from 'react';
import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans flex flex-col">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900/80 backdrop-blur-md border-b border-gray-800 h-20">
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 gradient-bg rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20">
              <i className="fas fa-bolt text-white text-lg"></i>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              ContentFlow
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-gray-300 hover:text-white font-medium px-4 py-2 transition">
              Log In
            </Link>
            <Link 
              to="/signup" 
              className="gradient-bg px-6 py-2.5 rounded-full font-bold shadow-lg shadow-purple-500/20 hover:scale-105 transition transform"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative pt-24 pb-12 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/40 via-gray-900 to-gray-900 pointer-events-none"></div>
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-block px-4 py-1.5 rounded-full bg-gray-800/50 border border-gray-700 text-sm font-medium text-purple-300 mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            ✨ YOUR ALL-IN-ONE SOLUTION
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight animate-in fade-in slide-in-from-bottom-6 duration-1000">
            Create Viral Content <br />
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">10x Faster</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
            From idea generation to script writing, voiceovers, and publishing. ContentFlow is the all-in-one workspace for modern creators.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
            <Link 
              to="/signup" 
              className="w-full sm:w-auto px-8 py-4 gradient-bg rounded-xl font-bold text-lg shadow-xl shadow-purple-500/20 hover:scale-105 transition"
            >
              Start Creating for Free
            </Link>
            <Link 
              to="/login" 
              className="w-full sm:w-auto px-8 py-4 bg-gray-800 border border-gray-700 rounded-xl font-bold text-lg hover:bg-gray-700 transition"
            >
              Live Demo
            </Link>
          </div>
        </div>
      </header>

      {/* Features Grid */}
      <section className="py-20 px-6 bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Everything You Need</h2>
            <p className="text-gray-400">Replace 5 different tools with one cohesive workflow.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon="lightbulb" 
              color="text-yellow-400"
              bg="bg-yellow-400/10"
              title="AI Idea Generator" 
              desc="Never run out of ideas. Get trending topics tailored to your niche instantly."
            />
            <FeatureCard 
              icon="pen-fancy" 
              color="text-purple-400"
              bg="bg-purple-400/10"
              title="Smart Script Writer" 
              desc="Turn ideas into full scripts with hooks, body, and CTAs in seconds."
            />
            <FeatureCard 
              icon="layer-group" 
              color="text-cyan-400"
              bg="bg-cyan-400/10"
              title="All-In-One Workspace" 
              desc="Stop switching tabs. Manage your entire content lifecycle in one unified dashboard."
            />
            <FeatureCard 
              icon="microphone" 
              color="text-pink-400"
              bg="bg-pink-400/10"
              title="AI Voiceovers" 
              desc="Generate human-like voiceovers or clone your own voice for authentic narration."
            />
            <FeatureCard 
              icon="robot" 
              color="text-blue-400"
              bg="bg-blue-400/10"
              title="Teleprompter" 
              desc="Record like a pro with voice-tracking auto-scroll technology."
            />
            <FeatureCard 
              icon="chart-line" 
              color="text-green-400"
              bg="bg-green-400/10"
              title="Analytics Dashboard" 
              desc="Track your growth and performance across all platforms in one place."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-blue-900/20 pointer-events-none"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10 bg-gray-800/50 backdrop-blur-xl p-12 rounded-3xl border border-white/10">
          <h2 className="text-4xl font-bold mb-6">Ready to Scale Your Content?</h2>
          <p className="text-xl text-gray-300 mb-8">Join thousands of creators who are saving 20+ hours a week with ContentFlow.</p>
          <Link 
            to="/signup" 
            className="inline-block px-10 py-4 gradient-bg rounded-xl font-bold text-xl shadow-lg hover:shadow-purple-500/30 transition transform hover:-translate-y-1"
          >
            Get Started Now
          </Link>
          <p className="mt-6 text-sm text-gray-400">No credit card required • Cancel anytime</p>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, color, bg, title, desc }: any) {
  return (
    <div className="bg-gray-800 p-8 rounded-2xl border border-gray-700 hover:border-gray-600 transition group">
      <div className={`w-14 h-14 ${bg} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition duration-300`}>
        <i className={`fas fa-${icon} text-2xl ${color}`}></i>
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-gray-400 leading-relaxed">{desc}</p>
    </div>
  );
}
