// components/ThorHammer.jsx
'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ThorHammer({ show, onComplete }) {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    if (!show) return;
    
    const timers = [
      setTimeout(() => setStage(1), 100),   // Overlay fades in
      setTimeout(() => setStage(2), 400),   // Logo appears
      setTimeout(() => setStage(3), 800),   // Checkmark animates
      setTimeout(() => setStage(4), 1300),  // Text appears
      setTimeout(() => { if (onComplete) onComplete(); }, 2500),
    ];

    return () => timers.forEach(clearTimeout);
  }, [show]);

  if (!show) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[999] flex items-center justify-center">
        
        {/* Dark overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: stage >= 1 ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 bg-slate-900/95 backdrop-blur-md"
        />

        {/* Subtle grid pattern */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: stage >= 1 ? 0.03 : 0 }}
          className="absolute inset-0"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '60px 60px'
          }}
        />

        {/* Subtle glow */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: stage >= 2 ? 0.15 : 0, scale: stage >= 2 ? 1.5 : 0.5 }}
          transition={{ duration: 1.5 }}
          className="absolute w-[500px] h-[500px] rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 blur-3xl"
        />

        {/* Main content */}
        <div className="relative z-10 text-center">
          
          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0, rotate: -90 }}
            animate={{ 
              scale: stage >= 2 ? 1 : 0, 
              rotate: stage >= 2 ? 0 : -90 
            }}
            transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
            className="mx-auto mb-8"
          >
            {/* Outer ring */}
            <div className="relative w-24 h-24 mx-auto">
              {/* Animated ring */}
              <motion.svg 
                viewBox="0 0 100 100" 
                className="absolute inset-0 w-full h-full -rotate-90"
              >
                <motion.circle
                  cx="50" cy="50" r="45"
                  fill="none"
                  stroke="url(#successGradient)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: stage >= 2 ? 1 : 0 }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                />
                <defs>
                  <linearGradient id="successGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#818cf8" />
                    <stop offset="100%" stopColor="#a78bfa" />
                  </linearGradient>
                </defs>
              </motion.svg>

              {/* Checkmark */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: stage >= 3 ? 1 : 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 15, delay: 0.2 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <svg viewBox="0 0 24 24" className="w-14 h-14" fill="none">
                  <motion.path
                    d="M5 13l4 4L19 7"
                    stroke="url(#checkGradient)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: stage >= 3 ? 1 : 0 }}
                    transition={{ duration: 0.4, delay: 0.3 }}
                  />
                  <defs>
                    <linearGradient id="checkGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#34d399" />
                      <stop offset="100%" stopColor="#10b981" />
                    </linearGradient>
                  </defs>
                </svg>
              </motion.div>
            </div>
          </motion.div>

          {/* Text */}
          {stage >= 4 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">
                Signed In Successfully
              </h1>
              <p className="text-slate-400 text-sm">
                Redirecting to your dashboard...
              </p>
            </motion.div>
          )}
        </div>

        {/* Loading bar */}
        {stage >= 4 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="absolute bottom-12 left-1/2 -translate-x-1/2 w-48"
          >
            <div className="h-0.5 bg-slate-700 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 1.2, delay: 0.5, ease: 'easeInOut' }}
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
              />
            </div>
          </motion.div>
        )}
      </div>
    </AnimatePresence>
  );
}