import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '@/services/authService';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('demo@contentflow.com');
  const [password, setPassword] = useState('demo123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await authService.loginWithEmail(email, password);
      navigate('/');
    } catch (err: any) {
      if (
          (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') 
          && email === 'demo@contentflow.com'
      ) {
         // Auto-create demo user if missing
         try {
            await authService.signupWithEmail(email, password);
            navigate('/');
            return;
         } catch(e) {}
      }
      console.error(err);
      setError('Failed to login. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await authService.loginWithGoogle();
      navigate('/');
    } catch (err: any) {
      setError('Google Sign-In failed.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex font-sans overflow-hidden">
      {/* Left Sidebar */}
      <div className="w-80 bg-[#1a1b26] p-8 flex flex-col justify-between border-r border-gray-800 hidden md:flex">
        <div>
          <Link to="/" className="flex items-center gap-3 mb-12">
            <div className="w-8 h-8 gradient-bg rounded-lg flex items-center justify-center shadow-lg">
              <i className="fas fa-bolt text-white text-sm"></i>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold text-white leading-none">ContentFlow</span>
              <span className="text-[10px] text-gray-400">Complete Content Automation</span>
            </div>
          </Link>

          <div className="space-y-2">
            <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-xl flex items-center gap-3 cursor-pointer">
              <i className="fas fa-sign-in-alt text-purple-400"></i>
              <div>
                <h3 className="text-sm font-bold text-white">Sign In</h3>
                <p className="text-[10px] text-gray-400">Access your account</p>
              </div>
            </div>
            
            <Link to="/signup" className="p-3 hover:bg-gray-800 rounded-xl flex items-center gap-3 cursor-pointer transition-colors group">
              <i className="fas fa-user-plus text-gray-500 group-hover:text-gray-300"></i>
              <div>
                <h3 className="text-sm font-bold text-gray-500 group-hover:text-gray-300">Create Account</h3>
                <p className="text-[10px] text-gray-600 group-hover:text-gray-500">Start free trial</p>
              </div>
            </Link>
          </div>

          <div className="mt-12">
            <p className="text-xs text-gray-500 mb-4">Or continue with</p>
            <div className="flex gap-3">
              <button onClick={handleGoogleLogin} className="flex-1 bg-white text-gray-900 py-2 rounded-lg text-sm font-bold hover:bg-gray-100 transition flex items-center justify-center gap-2">
                <i className="fab fa-google"></i> Google
              </button>
              <button className="flex-1 bg-[#5865F2] text-white py-2 rounded-lg text-sm font-bold hover:bg-[#4752C4] transition flex items-center justify-center gap-2">
                <i className="fab fa-discord"></i> Discord
              </button>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-900/40 to-blue-900/40 border border-white/5 p-4 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <i className="fas fa-gift text-purple-400"></i>
            <span className="text-sm font-bold text-white">Limited Offer</span>
          </div>
          <p className="text-xs text-gray-400 mb-2">Get 50% off your first month with code:</p>
          <div className="bg-black/30 p-2 rounded text-center font-mono text-xs text-purple-300 border border-purple-500/20">
            WELCOME50
          </div>
        </div>
      </div>

      {/* Right Content */}
      <div className="flex-1 bg-[#13141c] flex items-center justify-center p-8 relative">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-white mb-2 flex items-center justify-center gap-2">
              Welcome back! <span className="text-2xl">👋</span>
            </h1>
            <p className="text-gray-400">Sign in to continue creating content</p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-lg mb-6 text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleEmailLogin} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#1a1b26] border border-gray-800 focus:border-purple-500 rounded-xl px-4 py-3 text-white outline-none transition placeholder-gray-600"
                placeholder="john@example.com"
                required
              />
            </div>
            
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">Password</label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#1a1b26] border border-gray-800 focus:border-purple-500 rounded-xl px-4 py-3 text-white outline-none transition placeholder-gray-600"
                  placeholder="••••••••••••"
                  required
                />
                <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                  <i className="fas fa-eye"></i>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-700 bg-gray-800 text-purple-500 focus:ring-offset-0 focus:ring-purple-500" 
                />
                <span className="text-sm text-gray-400">Remember me</span>
              </label>
              <Link to="/forgot-password" className="text-sm text-purple-400 hover:text-purple-300 font-medium">
                Forgot password?
              </Link>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#6366f1] hover:bg-[#5558e6] text-white py-3.5 rounded-xl font-bold transition disabled:opacity-50 shadow-lg shadow-indigo-900/20"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-500">
            Don't have an account?{' '}
            <Link to="/signup" className="text-purple-400 hover:text-purple-300 font-medium">
              Sign up
            </Link>
          </p>
        </div>

        {/* Top right notification/badge if needed */}
        <div className="absolute top-4 right-4 bg-gray-800/50 text-xs text-gray-400 px-3 py-1 rounded-full border border-gray-700">
           Download Project as Zip File
        </div>
      </div>
    </div>
  );
}
