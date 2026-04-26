'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/store/authStore';
import { ShieldCheckIcon, ArrowLeftIcon, EnvelopeIcon } from '@heroicons/react/24/outline';

export default function VerifyOTPPage() {
  const router = useRouter();
  const { verifyOTP, resendOTP, loginEmail, isAuthenticated, isLoading } = useAuthStore();
  
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);
  const [resendLoading, setResendLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const inputRefs = useRef([]);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (isAuthenticated && !isLoading && mounted) {
      router.replace('/dashboard');
    }
  }, [isAuthenticated, isLoading, router, mounted]);

  useEffect(() => {
    if (mounted && !loginEmail) {
      router.replace('/login');
    }
  }, [loginEmail, router, mounted]);

  useEffect(() => {
    let interval;
    if (resendTimer > 0) {
      interval = setInterval(() => setResendTimer(prev => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = otp.split('');
    newOtp[index] = value;
    setOtp(newOtp.join(''));
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) inputRefs.current[index - 1]?.focus();
    if (e.key === 'ArrowLeft' && index > 0) inputRefs.current[index - 1]?.focus();
    if (e.key === 'ArrowRight' && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const data = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, 6);
    setOtp(data);
    if (data.length === 6) inputRefs.current[5]?.focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) {
      toast.error('Please enter the complete 6-digit code');
      return;
    }
    setLoading(true);
    try {
      const result = await verifyOTP(loginEmail, otp);
      if (result.requiresTwoFactor) {
        toast.success('OTP verified! Please complete 2FA.');
        router.push('/verify-2fa');
      } else if (result.success) {
        toast.success('Login successful!');
        router.push('/dashboard');
      }
    } catch (error) {
      toast.error(error.message || 'Invalid code');
      setOtp('');
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendTimer > 0) return;
    setResendLoading(true);
    try {
      await resendOTP();
      toast.success('Code resent!');
      setResendTimer(60);
      setOtp('');
    } catch (error) {
      toast.error(error.message || 'Failed to resend');
    } finally {
      setResendLoading(false);
    }
  };

  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
            <ShieldCheckIcon className="h-8 w-8 text-white" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Verify Your Identity</h2>
          <div className="mt-2 flex items-center justify-center gap-2 text-sm text-gray-600">
            <EnvelopeIcon className="h-4 w-4" />
            <span>Code sent to <strong className="text-blue-600">{loginEmail}</strong></span>
          </div>
        </div>
        
        <div className="bg-white py-8 px-6 shadow-xl rounded-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div onPaste={handlePaste}>
              <label className="block text-sm font-medium text-gray-700 mb-4 text-center">
                Enter 6-digit verification code
              </label>
              <div className="flex gap-2 justify-center mb-4">
                {[0, 1, 2, 3, 4, 5].map((index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={otp[index] || ''}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    disabled={loading}
                    className="w-12 h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none bg-white"
                    autoFocus={index === 0}
                  />
                ))}
              </div>
              <p className="text-center text-xs text-gray-500">
                {otp.length === 6 ? '✓ Code complete' : `${6 - otp.length} digits remaining`}
              </p>
            </div>

            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              className="w-full py-3 px-4 rounded-lg text-white font-medium bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 transition-all"
            >
              {loading ? 'Verifying...' : 'Verify & Sign In'}
            </button>

            <div className="text-center space-y-3">
              <button
                type="button"
                onClick={handleResend}
                disabled={resendTimer > 0 || resendLoading}
                className="text-sm text-blue-600 hover:text-blue-700 disabled:text-gray-400"
              >
                {resendLoading ? 'Sending...' : resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend Code'}
              </button>

              <div>
                <button
                  type="button"
                  onClick={() => router.push('/login')}
                  className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
                  disabled={loading}
                >
                  <ArrowLeftIcon className="h-4 w-4 mr-1" />
                  Back to login
                </button>
              </div>
            </div>
          </form>
        </div>
        
        <p className="text-center text-xs text-gray-500">Check your spam folder if you don&rsquo;t see the email</p>
      </div>
    </div>
  );
}