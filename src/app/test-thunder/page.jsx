// app/test-thunder/page.jsx
'use client';

import { useState, useEffect } from 'react';
import ThorHammer from '@/components/ThorHammer';

export default function TestPage() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Auto-trigger after 1 second
    const timer = setTimeout(() => setShow(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <div className="min-h-screen bg-black flex items-center justify-center">
        <button 
          onClick={() => setShow(true)}
          className="px-8 py-4 bg-yellow-500 text-black text-xl font-bold rounded-xl"
        >
          ⚡ STRIKE! ⚡
        </button>
      </div>
      <ThorHammer show={show} onComplete={() => console.log('Done!')} />
    </>
  );
}