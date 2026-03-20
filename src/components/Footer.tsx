import React from 'react';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bg-gray-900 border-t border-gray-800 py-6 text-sm mt-auto">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-8">
          {/* Block 1: Brand */}
          <div className="flex flex-col gap-4">
            <div className="flex flex-col">
              <span className="text-base font-bold text-white flex items-center mb-1">
                ContentFlow <span className="ml-1.5 text-[8px] bg-amber-500/20 text-amber-500 border border-amber-500/50 px-1 py-0.5 rounded tracking-wider uppercase">PRO</span>
              </span>
              <p className="text-gray-400 text-xs leading-relaxed">
                AI-powered content creation suite for modern creators. Idea to publish in minutes.
              </p>
            </div>
            <div className="flex gap-4 text-gray-400">
              <a href="https://x.com/novusexchange" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors"><i className="fab fa-twitter"></i></a>
              <a href="https://instagram.com/novusexchange" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors"><i className="fab fa-instagram"></i></a>
              <a href="https://tiktok.com/@marcioeditions" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors"><i className="fab fa-tiktok"></i></a>
              <a href="https://youtube.com/@novusexchange" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors"><i className="fab fa-youtube"></i></a>
              <a href="#" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors"><i className="fab fa-discord"></i></a>
              <a href="https://novusexchange.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors"><i className="fas fa-globe"></i></a>
            </div>
          </div>

          {/* Block 2: Services/Products */}
          <div>
            <h4 className="font-bold text-white mb-4 text-[10px] uppercase tracking-widest">Services</h4>
            <ul className="space-y-2 text-gray-400 text-xs">
              <li><Link to="/ideas" className="hover:text-purple-400 transition-colors">Idea Generator</Link></li>
              <li><Link to="/script" className="hover:text-purple-400 transition-colors">AI Script Writer</Link></li>
              <li><Link to="/podcast" className="hover:text-purple-400 transition-colors">Podcast Studio</Link></li>
              <li><Link to="/pricing" className="hover:text-purple-400 transition-colors">Pricing Plans</Link></li>
            </ul>
          </div>

          {/* Block 3: Resources */}
          <div>
            <h4 className="font-bold text-white mb-4 text-[10px] uppercase tracking-widest">Resources</h4>
            <ul className="space-y-2 text-gray-400 text-xs">
              <li><Link to="/api" className="hover:text-purple-400 transition-colors">API Documentation</Link></li>
              <li><Link to="/usage" className="hover:text-purple-400 transition-colors">System Status</Link></li>
              <li><a href="#" className="hover:text-purple-400 transition-colors">Community Hub</a></li>
              <li><a href="#" className="hover:text-purple-400 transition-colors">Help Center</a></li>
            </ul>
          </div>

          {/* Block 4: Legal bits */}
          <div>
            <h4 className="font-bold text-white mb-4 text-[10px] uppercase tracking-widest">Legal Bits</h4>
            <ul className="space-y-2 text-gray-400 text-xs">
              <li><Link to="/privacy" className="hover:text-purple-400 transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-purple-400 transition-colors">Terms of Service</Link></li>
              <li><Link to="/privacy" className="hover:text-purple-400 transition-colors">Cookie Policy</Link></li>
              <li><a href="#" className="hover:text-purple-400 transition-colors">Security</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-gray-800 flex justify-between items-center text-[10px]">
          <p className="text-gray-500">© 2024 ContentFlow Pro. All rights reserved.</p>
          <p className="text-gray-600 italic font-medium tracking-tight">Idea to Publish in Minutes</p>
        </div>
      </div>
    </footer>
  );
}
