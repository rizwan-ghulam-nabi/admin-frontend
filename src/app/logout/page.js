// 'use client';

// import { useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import { useAuthStore } from '@/store/authStore';

// export default function LogoutPage() {
//   const router = useRouter();
//   const logout = useAuthStore((state) => state.logout);

//   useEffect(() => {
//     const doLogout = async () => {
//       await logout();
//       router.push('/login');
//       router.refresh();
//     };
    
//     doLogout();
//   }, [logout, router]);

//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
//       <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
//       <p className="text-gray-600">Logging out...</p>
//     </div>
//   );
// }









'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

export default function LogoutPage() {
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);

  useEffect(() => {
    const doLogout = async () => {
      await logout();
      router.push('/login');
    };
    doLogout();
  }, [logout, router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
      <p className="text-gray-600">Logging out...</p>
    </div>
  );
}