import React from 'react';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bg-gray-900 border-t border-gray-800 py-6 text-sm">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 gradient-bg rounded-lg flex items-center justify-center shadow-lg">
                <i className="fas fa-bolt text-white text-[10px]"></i>
              </div>
              <span className="text-base font-bold text-white">ContentFlow</span>
            </div>
            <p className="text-gray-400 leading-relaxed text-xs">
              AI-powered content creation suite for modern creators. Idea to publish in minutes.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold text-white mb-3 text-xs uppercase tracking-wider">Product</h4>
            <ul className="space-y-1.5 text-gray-400 text-xs">
              <li><Link to="/ideas" className="hover:text-purple-400 transition-colors">Idea Generator</Link></li>
              <li><Link to="/script" className="hover:text-purple-400 transition-colors">AI Script Writer</Link></li>
              <li><Link to="/automation" className="hover:text-purple-400 transition-colors">Workflow Automation</Link></li>
              <li><Link to="/pricing" className="hover:text-purple-400 transition-colors">Pricing</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-3 text-xs uppercase tracking-wider">Resources</h4>
            <ul className="space-y-1.5 text-gray-400 text-xs">
              <li><Link to="/api" className="hover:text-purple-400 transition-colors">API Documentation</Link></li>
              <li><Link to="/usage" className="hover:text-purple-400 transition-colors">System Status</Link></li>
              <li><a href="#" className="hover:text-purple-400 transition-colors">Community</a></li>
              <li><a href="#" className="hover:text-purple-400 transition-colors">Help Center</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-3 text-xs uppercase tracking-wider">Legal</h4>
            <ul className="space-y-1.5 text-gray-400 text-xs">
              <li><Link to="/privacy" className="hover:text-purple-400 transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-purple-400 transition-colors">Terms of Service</Link></li>
              <li><Link to="/privacy" className="hover:text-purple-400 transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
          <p className="text-gray-500">© 2024 ContentFlow Pro. All rights reserved.</p>
          <div className="flex gap-4 text-gray-400">
            <a href="#" className="hover:text-white transition-colors"><i className="fab fa-twitter"></i></a>
            <a href="#" className="hover:text-white transition-colors"><i className="fab fa-github"></i></a>
            <a href="#" className="hover:text-white transition-colors"><i className="fab fa-discord"></i></a>
            <a href="#" className="hover:text-white transition-colors"><i className="fab fa-youtube"></i></a>
          </div>
        </div>
      </div>
    </footer>
  );
}
