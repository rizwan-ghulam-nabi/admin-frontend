'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/store/authStore';
import { ShieldCheckIcon } from '@heroicons/react/24/outline';

export default function Verify2FAPage() {
  const router = useRouter();
  const { verify2FALogin, isAuthenticated, isLoading } = useAuthStore();
  
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) router.push('/dashboard');
  }, [isAuthenticated, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!code || code.length !== 6) return toast.error('Please enter a valid 6-digit code');
    
    setLoading(true);
    try {
      await verify2FALogin(code);
      toast.success('Login successful!');
      router.push('/dashboard');
    } catch (error) {
      toast.error(error.message || 'Invalid 2FA code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg"><ShieldCheckIcon className="h-8 w-8 text-white" /></div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Two-Factor Authentication</h2>
          <p className="mt-2 text-sm text-gray-600">Enter the code from your authenticator app</p>
        </div>
        
        <div className="bg-white py-8 px-6 shadow-xl rounded-2xl">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <input type="text" inputMode="numeric" pattern="[0-9]*" maxLength="6" required value={code} onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, ''))} className="block w-full px-3 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-3xl tracking-widest font-mono" placeholder="000000" disabled={loading || isLoading} autoFocus />
            <button type="submit" disabled={loading || isLoading || code.length !== 6} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50">{loading || isLoading ? 'Verifying...' : 'Verify & Sign in'}</button>
          </form>
        </div>
      </div>
    </div>
  );
}