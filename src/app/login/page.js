// app/login/page.js
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/store/authStore';
import { 
  EnvelopeIcon, 
  LockClosedIcon, 
  EyeIcon, 
  EyeSlashIcon,
  ArrowRightIcon,
  SparklesIcon 
} from '@heroicons/react/24/outline';
import ThorHammer from '@/components/ThorHammer';

const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
    <div className="text-center space-y-6">
      <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl shadow-lg mx-auto">
        <SparklesIcon className="h-10 w-10 text-white" />
      </div>
      <div className="relative w-12 h-12 mx-auto">
        <div className="absolute inset-0 rounded-full border-4 border-white/20"></div>
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-purple-500 animate-spin"></div>
      </div>
      <div>
        <h1 className="text-3xl font-bold text-white">Admin Portal</h1>
        <p className="text-gray-400 mt-2">Loading your experience...</p>
      </div>
    </div>
  </div>
);

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/dashboard';
  
  const { login, isAuthenticated, isLoading, isInitialized } = useAuthStore();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [redirecting, setRedirecting] = useState(false);
  const [showThorHammer, setShowThorHammer] = useState(false);

  // Only redirect if just logged in (not on page load)
  useEffect(() => {
    const justLoggedIn = sessionStorage.getItem('justLoggedIn');
    
    if (isInitialized && isAuthenticated && justLoggedIn === 'true' && !redirecting && !showThorHammer) {
      // If animation already played, redirect directly
      setRedirecting(true);
      sessionStorage.removeItem('justLoggedIn');
      router.replace(redirectPath);
    }
  }, [isInitialized, isAuthenticated, redirecting, router, redirectPath, showThorHammer]);

  const handleThorHammerComplete = () => {
    setShowThorHammer(false);
    toast.success('Login successful!');
    router.push(redirectPath);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast.error('Please enter your email address');
      return;
    }
    if (!password) {
      toast.error('Please enter your password');
      return;
    }
    
    setLoading(true);
    try {
      const result = await login(email, password);
      console.log('Login result:', result);
      
      if (result.requiresOTP) {
        sessionStorage.setItem('justLoggedIn', 'true');
        toast.success('Verification code sent to your email!');
        router.push('/verify-otp');
      } else if (result.success) {
        sessionStorage.setItem('justLoggedIn', 'true');
        setShowThorHammer(true); // Show animation
        // Redirect happens in handleThorHammerComplete
      }
    } catch (error) {
      console.error('Login error:', error);
      
      if (error.message === 'Failed to fetch') {
        toast.error('Cannot connect to server. Please check your connection.');
      } else {
        toast.error(error.message || 'Invalid credentials');
      }
    } finally {
      setLoading(false);
    }
  };

  // Show loading while checking auth state
  if (!isInitialized || isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden py-12 px-4 sm:px-6 lg:px-8">
        {/* Background effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" style={{ animationDelay: '4s' }}></div>
        </div>

        <div className="max-w-md w-full relative z-10">
          <div className="backdrop-blur-xl bg-white/10 rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
            <div className="p-8 pb-0">
              <div className="text-center space-y-3">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl shadow-lg mb-2">
                  <SparklesIcon className="h-10 w-10 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-white">Welcome Back</h2>
                <p className="text-gray-400">Sign in to access your dashboard</p>
              </div>
            </div>

            <div className="p-8 pt-6">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                  <div className={`relative group transition-all duration-300 ${focusedField === 'email' ? 'scale-[1.02]' : ''}`}>
                    <div className="relative flex items-center">
                      <EnvelopeIcon className="absolute left-4 h-5 w-5 text-gray-400" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onFocus={() => setFocusedField('email')}
                        onBlur={() => setFocusedField(null)}
                        className="w-full pl-12 pr-4 py-3.5 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
                        placeholder="admin@example.com"
                        disabled={loading}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                  <div className={`relative group transition-all duration-300 ${focusedField === 'password' ? 'scale-[1.02]' : ''}`}>
                    <div className="relative flex items-center">
                      <LockClosedIcon className="absolute left-4 h-5 w-5 text-gray-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onFocus={() => setFocusedField('password')}
                        onBlur={() => setFocusedField(null)}
                        className="w-full pl-12 pr-12 py-3.5 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
                        placeholder="••••••••"
                        disabled={loading}
                      />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 text-gray-400 hover:text-white transition-colors">
                        {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center text-gray-400 hover:text-gray-300 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 rounded border-white/20 bg-white/5 text-purple-500 focus:ring-purple-500" />
                    <span className="ml-2">Remember me</span>
                  </label>
                  <Link href="/forgot-password" className="text-purple-400 hover:text-purple-300 transition-colors">Forgot password?</Link>
                </div>

                <button type="submit" disabled={loading} className="relative w-full group disabled:opacity-70">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl blur opacity-75 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative flex items-center justify-center px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl text-white font-medium text-lg transition-transform">
                    {loading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                        </svg>
                        Signing in...
                      </>
                    ) : (
                      <>
                        Sign In
                        <ArrowRightIcon className="ml-2 h-5 w-5" />
                      </>
                    )}
                  </div>
                </button>
              </form>

              <div className="mt-6 text-center">
                <span className="text-gray-500 text-sm">Protected by email verification & 2FA</span>
              </div>
            </div>
          </div>

          <div className="mt-6 text-center">
            <Link href="/" className="text-sm text-gray-400 hover:text-white transition-colors">← Back to home</Link>
          </div>
        </div>

        <style jsx>{`
          @keyframes blob {
            0%, 100% { transform: translate(0, 0) scale(1); }
            33% { transform: translate(30px, -50px) scale(1.1); }
            66% { transform: translate(-20px, 20px) scale(0.9); }
          }
          .animate-blob { animation: blob 7s infinite; }
          ::placeholder { color: rgba(255, 255, 255, 0.3); }
        `}</style>
      </div>

      {/* Thor Hammer Animation */}
      <ThorHammer 
        show={showThorHammer} 
        onComplete={handleThorHammerComplete} 
      />
    </>
  );
}