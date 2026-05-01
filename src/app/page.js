// app/page.js
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Check for token directly
    const token = Cookies.get('accessToken') || 
                  (typeof window !== 'undefined' && localStorage.getItem('accessToken'));
    
    if (token) {
      // Has token - go to dashboard
      router.replace('/dashboard');
    } else {
      // No token - go to login
      router.replace('/login');
    }
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600 font-medium">Checking authentication...</p>
      </div>
    </div>
  );
}