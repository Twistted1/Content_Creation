import React from 'react';
import { Link } from 'react-router-dom';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-app border-t border-gray-800 text-gray-400 py-4 mt-8">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-[2fr_1fr_1fr_1fr] gap-x-8 lg:gap-x-12 gap-y-6 mb-3">
          <div className="md:pr-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 gradient-bg rounded-lg flex items-center justify-center shadow-lg shadow-purple-500/20">
                <i className="fas fa-bolt text-white text-xs"></i>
              </div>
              <span className="text-lg font-bold text-white">ContentFlow</span>
            </div>
            <p className="text-sm text-gray-500 mb-3">
              The ultimate AI-powered content creation suite for creators, by creators.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-white transition"><i className="fab fa-twitter"></i></a>
              <a href="#" className="text-gray-400 hover:text-white transition"><i className="fab fa-instagram"></i></a>
              <a href="#" className="text-gray-400 hover:text-white transition"><i className="fab fa-youtube"></i></a>
              <a href="#" className="text-gray-400 hover:text-white transition"><i className="fab fa-linkedin"></i></a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold mb-3">Product</h4>
            <ul className="space-y-1.5 text-sm">
              <li><Link to="/features" className="hover:text-purple-400 transition">Features</Link></li>
              <li><Link to="/pricing" className="hover:text-purple-400 transition">Pricing</Link></li>
              <li><Link to="/roadmap" className="hover:text-purple-400 transition">Roadmap</Link></li>
              <li><Link to="/showcase" className="hover:text-purple-400 transition">Showcase</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-3">Resources</h4>
            <ul className="space-y-1.5 text-sm">
              <li><Link to="/blog" className="hover:text-purple-400 transition">Blog</Link></li>
              <li><Link to="/community" className="hover:text-purple-400 transition">Community</Link></li>
              <li><Link to="/help" className="hover:text-purple-400 transition">Help Center</Link></li>
              <li><Link to="/api" className="hover:text-purple-400 transition">API Docs</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-3">Company</h4>
            <ul className="space-y-1.5 text-sm">
              <li><Link to="/about" className="hover:text-purple-400 transition">About Us</Link></li>
              <li><Link to="/careers" className="hover:text-purple-400 transition">Careers</Link></li>
              <li><Link to="/legal/privacy" className="hover:text-purple-400 transition">Privacy Policy</Link></li>
              <li><Link to="/legal/terms" className="hover:text-purple-400 transition">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-3 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-600">
            &copy; {currentYear} ContentFlow Inc. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs text-gray-500">
            <Link to="/legal/privacy" className="hover:text-gray-300">Privacy</Link>
            <Link to="/legal/terms" className="hover:text-gray-300">Terms</Link>
            <Link to="/legal/cookies" className="hover:text-gray-300">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
