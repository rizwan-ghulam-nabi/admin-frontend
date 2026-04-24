// 'use client';

// import { useEffect } from 'react';
// import { useAuthStore } from '@/store/authStore';
// import { Toaster } from 'react-hot-toast';

// export default function Providers({ children }) {
//   const initialize = useAuthStore((state) => state.initialize);

//   useEffect(() => {
//     initialize();
//   }, []);

//   return (
//     <>
//       {children}
//       <Toaster position="top-right" />
//     </>
//   );
// }








'use client';

import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from '@/store/authStore';

export default function Providers({ children }) {
  const initialize = useAuthStore((state) => state.initialize);

  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <>
      {children}
      <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
    </>
  );
}
