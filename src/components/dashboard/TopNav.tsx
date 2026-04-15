import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { authService } from '@/services/authService';
import { useTheme } from '@/hooks/useTheme';

export function TopNav() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    });
  }, []);

  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult: any) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the install prompt');
        }
        setDeferredPrompt(null);
      });
    }
  };

  const location = useLocation();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('notifications');
    if (saved) {
      return JSON.parse(saved);
    }
    return [
      { id: 1, type: 'success', title: 'Video Export Complete', desc: '"Tech Review" is ready to download', time: '2m ago', link: '/production', read: false },
      { id: 2, type: 'info', title: 'Script Generated', desc: 'AI finished writing "My Vlog"', time: '1h ago', link: '/script', read: false },
      { id: 3, type: 'warning', title: 'Storage Warning', desc: 'You are using 80% of your storage', time: '5h ago', link: '/settings', read: true },
    ];
  });

  useEffect(() => {
    localStorage.setItem('notifications', JSON.stringify(notifications));
  }, [notifications]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleNotificationClick = (id: number) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    setIsNotificationsOpen(false);
    navigate(notifications.find(n => n.id === id)?.link || '/');
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  const isActive = (path: string) => {
    return location.pathname === path 
      ? 'text-purple-600 dark:text-white bg-purple-50 dark:bg-gray-800' 
      : 'text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-white hover:bg-purple-50 dark:hover:bg-gray-800/50';
  };

  const mainNavItems = [
    { name: 'Dashboard', path: '/' },
    { name: 'Ideas', path: '/ideas' },
    { name: 'Script', path: '/script' },
    { name: 'Podcast', path: '/podcast' },
    { name: 'Teleprompter', path: '/teleprompter' },
    { name: 'Production', path: '/production' },
    { name: 'Publish', path: '/publish' },
    { name: 'Analytics', path: '/analytics' },
    { name: 'Automation', path: '/automation' },
  ];

  const secondaryNavItems = [
    { name: 'Monetization', path: '/monetization' },
    { name: 'Pricing', path: '/pricing' },
    { name: 'Affiliate', path: '/affiliate' },
    { name: 'White-label', path: '/admin' },
    { name: 'System Status', path: '/admin/status' },
    { name: 'Usage', path: '/usage' },
    { name: 'API Docs', path: '/api' },
  ];

  if (!user) return null; // Or render a simplified nav for logged out users

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 h-16 transition-colors duration-200">
      <div className="max-w-[1920px] mx-auto px-6 h-full">
        <div className="flex items-center justify-between h-full">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 w-[240px]">
            <div className="w-9 h-9 gradient-bg rounded-lg flex items-center justify-center shadow-lg shadow-purple-500/20">
              <i className="fas fa-bolt text-white text-sm"></i>
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-purple-600 to-blue-500 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
              ContentFlow
            </span>
          </Link>

          {/* Center Navigation */}
          <div className="hidden xl:flex items-center justify-center flex-1 px-8">
            <div className="flex items-center bg-gray-100/50 dark:bg-gray-900/50 rounded-full p-1 border border-gray-200 dark:border-gray-800">
              {mainNavItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "px-4 py-1.5 rounded-full transition-all text-sm font-medium whitespace-nowrap",
                    isActive(item.path)
                  )}
                >
                  {item.name}
                </Link>
              ))}
              
              {/* More Menu */}
              <div className="relative group px-4 py-1.5 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-white cursor-pointer">
                <span>More <i className="fas fa-chevron-down text-xs ml-1"></i></span>
                <div className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl hidden group-hover:block p-2">
                  {secondaryNavItems.map(item => (
                    <Link key={item.path} to={item.path} className="block px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-white">
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center justify-end gap-4 w-[240px]">
             {!isOnline && (
               <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-red-500/10 border border-red-500/30 rounded-full">
                 <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                 <span className="text-xs text-red-400 font-medium">Offline</span>
               </div>
             )}

             {/* Theme Toggle */}
             <button
              onClick={toggleTheme}
              className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-white transition-colors"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              <i className={`fas fa-${theme === 'dark' ? 'sun' : 'moon'}`}></i>
            </button>

            <Link 
              to="/pricing" 
              className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-full text-xs font-bold text-yellow-600 dark:text-yellow-400 hover:text-yellow-700 dark:hover:text-white hover:border-yellow-400 transition-all"
            >
              <i className="fas fa-crown"></i> Upgrade
            </Link>

            {deferredPrompt ? (
              <button 
                onClick={handleInstallClick}
                className="w-9 h-9 flex items-center justify-center rounded-full bg-purple-500/20 text-purple-600 dark:text-purple-400 hover:bg-purple-500 hover:text-white transition-colors animate-pulse"
                title="Install App"
              >
                <i className="fas fa-download"></i>
              </button>
            ) : (
              <Link to="/mobile" className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-white transition-colors" title="Mobile App">
                <i className="fas fa-mobile-alt"></i>
              </Link>
            )}
            
            {/* Notifications */}
            <div className="relative" ref={notificationRef}>
              <button 
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-white transition-colors relative"
              >
                <i className="fas fa-bell"></i>
                {unreadCount > 0 && (
                  <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-gray-900 animate-pulse"></span>
                )}
              </button>
              
              {isNotificationsOpen && (
                <div className="absolute right-0 top-full mt-4 w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl z-50 overflow-hidden ring-1 ring-black/5">
                  <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                    <h3 className="font-bold text-sm text-gray-900 dark:text-white">Notifications</h3>
                    <button onClick={markAllRead} className="text-xs text-purple-600 dark:text-purple-400 hover:text-purple-500 cursor-pointer">Mark all read</button>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.length === 0 ? (
                       <div className="p-8 text-center text-gray-500 text-sm">No new notifications</div>
                    ) : (
                      notifications.map((note) => (
                        <div 
                          key={note.id}
                          className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer border-b border-gray-100 dark:border-gray-700/50 transition-colors ${!note.read ? 'bg-purple-50/50 dark:bg-gray-700/20' : ''}`} 
                          onClick={() => handleNotificationClick(note.id)}
                        >
                          <div className="flex gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                              note.type === 'success' ? 'bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400' :
                              note.type === 'warning' ? 'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-600 dark:text-yellow-400' :
                              'bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400'
                            }`}>
                              <i className={`fas fa-${
                                note.type === 'success' ? 'check' :
                                note.type === 'warning' ? 'exclamation-triangle' :
                                'info'
                              } text-xs`}></i>
                            </div>
                            <div>
                              <p className={`text-sm font-medium ${!note.read ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>{note.title}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-500 mb-1">{note.desc}</p>
                              <p className="text-[10px] text-gray-400 dark:text-gray-600">{note.time}</p>
                            </div>
                            {!note.read && (
                              <div className="w-2 h-2 rounded-full bg-purple-500 mt-1 ml-auto"></div>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
            
            <div className="h-6 w-px bg-gray-200 dark:bg-gray-800"></div>

            {/* Profile */}
            <div className="relative" ref={profileRef}>
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 hover:opacity-80 transition-opacity"
              >
                <div className="w-8 h-8 gradient-bg rounded-full flex items-center justify-center text-sm font-bold text-white shadow-md">
                  {user.email?.charAt(0).toUpperCase()}
                </div>
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 top-full mt-4 w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl z-50 overflow-hidden ring-1 ring-black/5">
                  <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{user.email}</p>
                    <p className="text-xs text-gray-500">Pro Plan</p>
                  </div>
                  <div className="p-2">
                    <Link to="/settings" className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-purple-600 dark:hover:text-white rounded-lg group">
                      <i className="fas fa-cog w-4 text-gray-400 group-hover:text-purple-500 transition-colors"></i> Settings
                    </Link>
                    <Link to="/profile" className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-white rounded-lg group">
                      <i className="fas fa-user w-4 text-gray-400 group-hover:text-blue-500 transition-colors"></i> Profile
                    </Link>
                    <div className="h-px bg-gray-200 dark:bg-gray-700 my-1"></div>
                    <button 
                      onClick={handleLogout}
                      className="w-full text-left flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg"
                    >
                      <i className="fas fa-sign-out-alt w-4"></i> Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
