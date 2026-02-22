import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '@/services/authService';

export default function Signup() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPass) {
      setError("Passwords don't match");
      return;
    }
    
    setLoading(true);
    setError('');
    try {
      await authService.signupWithEmail(email, password);
      navigate('/');
    } catch (err: any) {
      setError('Failed to create account. Email might be in use.');
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
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4 font-sans relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-[10%] -right-[10%] w-[50%] h-[50%] bg-purple-600/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[10%] -left-[10%] w-[40%] h-[40%] bg-pink-600/20 rounded-full blur-[100px]"></div>
      </div>

      <div className="bg-gray-800/80 backdrop-blur-xl p-8 rounded-2xl shadow-2xl w-full max-w-md border border-gray-700 relative z-10">
        <div className="text-center mb-8">
          <Link to="/" className="inline-block mb-6 group">
            <div className="flex items-center justify-center gap-2">
               <div className="w-10 h-10 gradient-bg rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                 <i className="fas fa-bolt text-white text-lg"></i>
               </div>
               <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">ContentFlow</span>
            </div>
          </Link>
          <h1 className="text-2xl font-bold text-white mb-2">Create Account</h1>
          <p className="text-gray-400">Join ContentFlow Pro today</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-lg mb-6 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-gray-700 border border-transparent focus:border-purple-500 rounded-lg px-4 py-2.5 text-white outline-none transition"
              placeholder="you@example.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-700 border border-transparent focus:border-purple-500 rounded-lg px-4 py-2.5 text-white outline-none transition"
              placeholder="••••••••"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Confirm Password</label>
            <input
              type="password"
              value={confirmPass}
              onChange={(e) => setConfirmPass(e.target.value)}
              className="w-full bg-gray-700 border border-transparent focus:border-purple-500 rounded-lg px-4 py-2.5 text-white outline-none transition"
              placeholder="••••••••"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full gradient-bg py-3 rounded-lg font-bold text-white hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-800 text-gray-400">Or continue with</span>
            </div>
          </div>

          <button
            onClick={handleGoogleLogin}
            className="mt-6 w-full bg-white text-gray-900 py-3 rounded-lg font-bold hover:bg-gray-100 transition flex items-center justify-center gap-2"
          >
            <i className="fab fa-google"></i> Google
          </button>
        </div>

        <p className="mt-8 text-center text-sm text-gray-400">
          Already have an account?{' '}
          <Link to="/login" className="text-purple-400 hover:text-purple-300 font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
