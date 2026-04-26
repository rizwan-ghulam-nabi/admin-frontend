// // app/login/page.js
// 'use client';

// import { useState, useEffect } from 'react';
// import { useRouter, useSearchParams } from 'next/navigation';
// import Link from 'next/link';
// import toast from 'react-hot-toast';
// import { useAuthStore } from '@/store/authStore';
// import { 
//   EnvelopeIcon, 
//   LockClosedIcon, 
//   EyeIcon, 
//   EyeSlashIcon,
//   ArrowRightIcon,
//   SparklesIcon 
// } from '@heroicons/react/24/outline';

// // ============================================
// // CIRCULAR POKER CARD LOADER - FIXED
// // ============================================
// const PokerCardLoader = () => {
//   const suits = ['♠', '♥', '♦', '♣'];
//   const [dealtCards, setDealtCards] = useState([]);
//   const [isDealing, setIsDealing] = useState(true);

//   useEffect(() => {
//     const values = ['A', 'K', 'Q', 'J', '10', '9', '8', '7'];
    
//     // Create 5 cards positioned in a circle
//     const cards = Array.from({ length: 5 }, (_, i) => {
//       const angle = (i * 72) - 90; // 360/5 = 72 degrees apart, start from top
//       const radius = 70;
//       const radian = (angle * Math.PI) / 180;
//       const randomSuit = suits[Math.floor(Math.random() * suits.length)];
      
//       return {
//         id: `card-${i}-${Date.now()}`,
//         value: values[Math.floor(Math.random() * values.length)],
//         suit: randomSuit,
//         color: randomSuit === '♥' || randomSuit === '♦' ? 'text-red-500' : 'text-gray-900',
//         rotation: angle,
//         x: Math.cos(radian) * radius,
//         y: Math.sin(radian) * radius,
//         finalRotation: angle + 90,
//       };
//     });

//     // Deal cards one by one with delay
//     cards.forEach((card, index) => {
//       setTimeout(() => {
//         setDealtCards((prev) => {
//           // Prevent duplicate cards
//           if (prev.find(c => c.id === card.id)) return prev;
//           return [...prev, card];
//         });
//         if (index === cards.length - 1) {
//           setIsDealing(false);
//         }
//       }, 400 + index * 300);
//     });

//     // Cleanup
//     return () => {
//       setDealtCards([]);
//       setIsDealing(true);
//     };
//   }, []);

//   return (
//     <div className="relative w-80 h-80 flex items-center justify-center mx-auto">
//       {/* Green felt table */}
//       <div className="absolute inset-0 bg-gradient-to-br from-emerald-800 via-emerald-700 to-green-900 rounded-full shadow-2xl border-8 border-amber-900/60 overflow-hidden">
//         {/* Inner border */}
//         <div className="absolute inset-2 rounded-full border-2 border-amber-700/30"></div>
        
//         {/* Felt texture */}
//         <div className="absolute inset-0 opacity-10" 
//           style={{ 
//             backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)',
//             backgroundSize: '8px 8px'
//           }} 
//         />
        
//         {/* Center marker */}
//         <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
//           <div className="w-8 h-8 rounded-full border-2 border-amber-600/40 flex items-center justify-center">
//             <div className="w-3 h-3 rounded-full bg-amber-600/30"></div>
//           </div>
//         </div>
//       </div>

//       {/* Dealt cards in circle */}
//       {dealtCards.map((card) => (
//         <div
//           key={card.id}
//           className="absolute w-16 h-24 bg-white rounded-lg shadow-2xl border-2 border-gray-300 flex flex-col items-center justify-between p-1.5"
//           style={{
//             left: `calc(50% + ${card.x}px)`,
//             top: `calc(50% + ${card.y}px)`,
//             transform: `translate(-50%, -50%) rotate(${card.finalRotation}deg)`,
//             animation: `cardFloat 3s ease-in-out 0.5s infinite`,
//             zIndex: dealtCards.indexOf(card),
//           }}
//         >
//           <span className={`text-xs font-bold leading-none ${card.color}`}>
//             {card.value}
//           </span>
//           <span className={`text-2xl leading-none ${card.color}`}>
//             {card.suit}
//           </span>
//           <span className={`text-xs font-bold leading-none ${card.color} rotate-180`}>
//             {card.value}
//           </span>
//         </div>
//       ))}

//       {/* Center chip stack */}
//       <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
//         {[0, 1, 2].map((i) => (
//           <div
//             key={`chip-${i}`}
//             className="w-12 h-12 rounded-full bg-gradient-to-br from-red-600 to-red-800 border-4 border-red-500 shadow-lg absolute"
//             style={{
//               top: `${-24 + i * 3}px`,
//               left: `${-24 + i * 3}px`,
//               zIndex: 10 - i,
//               animation: `chipStack 0.5s ease-out ${1.5 + i * 0.2}s both`,
//             }}
//           >
//             <div className="absolute inset-2 rounded-full border-2 border-red-400/50"></div>
//             <div className="absolute inset-4 rounded-full border border-red-300/30"></div>
//           </div>
//         ))}
//       </div>

//       {/* Loading text */}
//       <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
//         <div className="text-center">
//           <p className="text-sm text-white font-semibold animate-pulse tracking-wide">
//             {isDealing ? 'DEALING CARDS...' : 'SHUFFLING...'}
//           </p>
//           <div className="flex justify-center gap-1 mt-1">
//             {[0, 1, 2].map((i) => (
//               <div
//                 key={`dot-${i}`}
//                 className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce"
//                 style={{ animationDelay: `${i * 0.15}s` }}
//               ></div>
//             ))}
//           </div>
//         </div>
//       </div>

//       <style jsx>{`
//         @keyframes cardFloat {
//           0%, 100% { 
//             transform: translate(-50%, -50%) translateY(0); 
//           }
//           50% { 
//             transform: translate(-50%, -50%) translateY(-8px); 
//           }
//         }
//         @keyframes chipStack {
//           from {
//             opacity: 0;
//             transform: translateY(-30px) scale(0);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0) scale(1);
//           }
//         }
//       `}</style>
//     </div>
//   );
// };

// // ============================================
// // FLOATING PARTICLES - Client only
// // ============================================
// const FloatingParticles = () => {
//   const [particles, setParticles] = useState([]);

//   useEffect(() => {
//     const newParticles = Array.from({ length: 20 }, (_, i) => ({
//       id: `particle-${i}-${Date.now()}`,
//       top: `${Math.random() * 100}%`,
//       left: `${Math.random() * 100}%`,
//       animationDelay: `${Math.random() * 5}s`,
//       animationDuration: `${5 + Math.random() * 10}s`,
//       opacity: Math.random() * 0.5 + 0.1
//     }));
//     setParticles(newParticles);
//   }, []);

//   if (particles.length === 0) return null;

//   return (
//     <>
//       {particles.map((particle) => (
//         <div
//           key={particle.id}
//           className="absolute w-1 h-1 bg-white rounded-full animate-float"
//           style={{
//             top: particle.top,
//             left: particle.left,
//             animationDelay: particle.animationDelay,
//             animationDuration: particle.animationDuration,
//             opacity: particle.opacity
//           }}
//         />
//       ))}
//     </>
//   );
// };

// // ============================================
// // MAIN LOGIN PAGE
// // ============================================
// export default function LoginPage() {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const redirectPath = searchParams.get('redirect') || '/dashboard';
  
//   const { login, isAuthenticated, isLoading } = useAuthStore();
  
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [focusedField, setFocusedField] = useState(null);
//   const [mounted, setMounted] = useState(false);

//   useEffect(() => {
//     setMounted(true);
//   }, []);

//   // Redirect if already authenticated
//   useEffect(() => {
//     if (isAuthenticated && !isLoading && mounted) {
//       router.replace(redirectPath);
//     }
//   }, [isAuthenticated, isLoading, router, redirectPath, mounted]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (!email.trim()) {
//       toast.error('Please enter your email address');
//       return;
//     }
//     if (!password) {
//       toast.error('Please enter your password');
//       return;
//     }
    
//     setLoading(true);
//     try {
//       await login(email, password);
//       toast.success('Welcome back! Redirecting...');
//       setTimeout(() => {
//         router.push(redirectPath);
//       }, 500);
//     } catch (error) {
//       toast.error(error.message || 'Invalid credentials. Please try again.');
//       const form = document.getElementById('login-form');
//       form?.classList.add('animate-shake');
//       setTimeout(() => form?.classList.remove('animate-shake'), 500);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Initial loading state
//   if (!mounted) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
//           <p className="text-white mt-4">Loading...</p>
//         </div>
//       </div>
//     );
//   }

//   // Auth loading state - Poker card loader
//   if (isLoading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
//         <div className="text-center space-y-8">
//           <PokerCardLoader />
//           <div className="space-y-2 mt-4">
//             <h1 className="text-3xl font-bold text-white">Admin Portal</h1>
//             <p className="text-gray-400">Preparing your experience...</p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden py-12 px-4 sm:px-6 lg:px-8">
//       {/* Animated background elements */}
//       <div className="absolute inset-0 overflow-hidden">
//         {/* Floating orbs */}
//         <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
//         <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" style={{ animationDelay: '2s' }}></div>
//         <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" style={{ animationDelay: '4s' }}></div>
        
//         {/* Grid pattern */}
//         <div className="absolute inset-0 opacity-10" 
//           style={{ 
//             backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
//             backgroundSize: '60px 60px'
//           }} 
//         />
        
//         {/* Floating particles */}
//         <FloatingParticles />
//       </div>

//       {/* Main card */}
//       <div className="max-w-md w-full relative z-10">
//         {/* Glass card */}
//         <div className="backdrop-blur-xl bg-white/10 rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
//           {/* Header */}
//           <div className="p-8 pb-0">
//             <div className="text-center space-y-3">
//               {/* Logo */}
//               <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl shadow-lg mb-2">
//                 <SparklesIcon className="h-10 w-10 text-white" />
//               </div>
              
//               <h2 className="text-3xl font-bold text-white">Welcome Back</h2>
//               <p className="text-gray-400">Sign in to access your dashboard</p>
//             </div>
//           </div>

//           {/* Form */}
//           <div className="p-8 pt-6">
//             <form id="login-form" onSubmit={handleSubmit} className="space-y-5">
//               {/* Email */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-300 mb-2">
//                   Email Address
//                 </label>
//                 <div className={`relative group transition-all duration-300 ${
//                   focusedField === 'email' ? 'scale-[1.02]' : ''
//                 }`}>
//                   <div className={`absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl blur opacity-25 group-hover:opacity-50 transition-opacity ${
//                     focusedField === 'email' ? 'opacity-50' : ''
//                   }`}></div>
//                   <div className="relative flex items-center">
//                     <EnvelopeIcon className="absolute left-4 h-5 w-5 text-gray-400" />
//                     <input
//                       type="email"
//                       required
//                       value={email}
//                       onChange={(e) => setEmail(e.target.value)}
//                       onFocus={() => setFocusedField('email')}
//                       onBlur={() => setFocusedField(null)}
//                       className="w-full pl-12 pr-4 py-3.5 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
//                       placeholder="admin@example.com"
//                       disabled={loading}
//                     />
//                   </div>
//                 </div>
//               </div>

//               {/* Password */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-300 mb-2">
//                   Password
//                 </label>
//                 <div className={`relative group transition-all duration-300 ${
//                   focusedField === 'password' ? 'scale-[1.02]' : ''
//                 }`}>
//                   <div className={`absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl blur opacity-25 group-hover:opacity-50 transition-opacity ${
//                     focusedField === 'password' ? 'opacity-50' : ''
//                   }`}></div>
//                   <div className="relative flex items-center">
//                     <LockClosedIcon className="absolute left-4 h-5 w-5 text-gray-400" />
//                     <input
//                       type={showPassword ? 'text' : 'password'}
//                       required
//                       value={password}
//                       onChange={(e) => setPassword(e.target.value)}
//                       onFocus={() => setFocusedField('password')}
//                       onBlur={() => setFocusedField(null)}
//                       className="w-full pl-12 pr-12 py-3.5 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
//                       placeholder="••••••••"
//                       disabled={loading}
//                     />
//                     <button
//                       type="button"
//                       onClick={() => setShowPassword(!showPassword)}
//                       className="absolute right-4 text-gray-400 hover:text-white transition-colors"
//                     >
//                       {showPassword ? (
//                         <EyeSlashIcon className="h-5 w-5" />
//                       ) : (
//                         <EyeIcon className="h-5 w-5" />
//                       )}
//                     </button>
//                   </div>
//                 </div>
//               </div>

//               {/* Remember & Forgot */}
//               <div className="flex items-center justify-between text-sm">
//                 <label className="flex items-center text-gray-400 hover:text-gray-300 cursor-pointer">
//                   <input
//                     type="checkbox"
//                     className="w-4 h-4 rounded border-white/20 bg-white/5 text-purple-500 focus:ring-purple-500"
//                   />
//                   <span className="ml-2">Remember me</span>
//                 </label>
//                 <Link
//                   href="/forgot-password"
//                   className="text-purple-400 hover:text-purple-300 transition-colors"
//                 >
//                   Forgot password?
//                 </Link>
//               </div>

//               {/* Submit Button */}
//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="relative w-full group disabled:opacity-70"
//               >
//                 <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl blur opacity-75 group-hover:opacity-100 transition-opacity"></div>
//                 <div className="relative flex items-center justify-center px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl text-white font-medium text-lg transition-transform group-hover:scale-[1.02] group-active:scale-[0.98]">
//                   {loading ? (
//                     <>
//                       <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
//                         <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                         <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
//                       </svg>
//                       Signing in...
//                     </>
//                   ) : (
//                     <>
//                       Sign In
//                       <ArrowRightIcon className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
//                     </>
//                   )}
//                 </div>
//               </button>
//             </form>

//             {/* Divider */}
//             <div className="mt-6 text-center">
//               <span className="text-gray-500 text-sm">
//                 Protected by email verification & 2FA
//               </span>
//             </div>
//           </div>
//         </div>

//         {/* Back to home */}
//         <div className="mt-6 text-center">
//           <Link
//             href="/"
//             className="text-sm text-gray-400 hover:text-white transition-colors"
//           >
//             ← Back to home
//           </Link>
//         </div>
//       </div>

//       {/* CSS Animations */}
//       <style jsx>{`
//         @keyframes blob {
//           0%, 100% { transform: translate(0, 0) scale(1); }
//           33% { transform: translate(30px, -50px) scale(1.1); }
//           66% { transform: translate(-20px, 20px) scale(0.9); }
//         }
//         @keyframes float {
//           0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.5; }
//           50% { transform: translateY(-20px) rotate(180deg); opacity: 1; }
//         }
//         @keyframes shake {
//           0%, 100% { transform: translateX(0); }
//           10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
//           20%, 40%, 60%, 80% { transform: translateX(5px); }
//         }
//         .animate-blob {
//           animation: blob 7s infinite;
//         }
//         .animate-float {
//           animation: float linear infinite;
//         }
//         .animate-shake {
//           animation: shake 0.5s ease-in-out;
//         }
//         ::placeholder {
//           color: rgba(255, 255, 255, 0.3);
//         }
//       `}</style>
//     </div>
//   );
// }
































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

const PokerCardLoader = () => {
  const suits = ['♠', '♥', '♦', '♣'];
  const [dealtCards, setDealtCards] = useState([]);
  const [isDealing, setIsDealing] = useState(true);

  useEffect(() => {
    const values = ['A', 'K', 'Q', 'J', '10', '9', '8', '7'];
    
    const cards = Array.from({ length: 5 }, (_, i) => {
      const angle = (i * 72) - 90;
      const radius = 70;
      const radian = (angle * Math.PI) / 180;
      const randomSuit = suits[Math.floor(Math.random() * suits.length)];
      
      return {
        id: `card-${i}-${Date.now()}`,
        value: values[Math.floor(Math.random() * values.length)],
        suit: randomSuit,
        color: randomSuit === '♥' || randomSuit === '♦' ? 'text-red-500' : 'text-gray-900',
        rotation: angle,
        x: Math.cos(radian) * radius,
        y: Math.sin(radian) * radius,
        finalRotation: angle + 90,
      };
    });

    cards.forEach((card, index) => {
      setTimeout(() => {
        setDealtCards((prev) => {
          if (prev.find(c => c.id === card.id)) return prev;
          return [...prev, card];
        });
        if (index === cards.length - 1) {
          setIsDealing(false);
        }
      }, 400 + index * 300);
    });

    return () => {
      setDealtCards([]);
      setIsDealing(true);
    };
  }, []);

  return (
    <div className="relative w-80 h-80 flex items-center justify-center mx-auto">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-800 via-emerald-700 to-green-900 rounded-full shadow-2xl border-8 border-amber-900/60 overflow-hidden">
        <div className="absolute inset-2 rounded-full border-2 border-amber-700/30"></div>
        <div className="absolute inset-0 opacity-10" 
          style={{ 
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)',
            backgroundSize: '8px 8px'
          }} 
        />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-8 h-8 rounded-full border-2 border-amber-600/40 flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-amber-600/30"></div>
          </div>
        </div>
      </div>

      {dealtCards.map((card) => (
        <div
          key={card.id}
          className="absolute w-16 h-24 bg-white rounded-lg shadow-2xl border-2 border-gray-300 flex flex-col items-center justify-between p-1.5"
          style={{
            left: `calc(50% + ${card.x}px)`,
            top: `calc(50% + ${card.y}px)`,
            transform: `translate(-50%, -50%) rotate(${card.finalRotation}deg)`,
            animation: `cardFloat 3s ease-in-out 0.5s infinite`,
            zIndex: dealtCards.indexOf(card),
          }}
        >
          <span className={`text-xs font-bold leading-none ${card.color}`}>{card.value}</span>
          <span className={`text-2xl leading-none ${card.color}`}>{card.suit}</span>
          <span className={`text-xs font-bold leading-none ${card.color} rotate-180`}>{card.value}</span>
        </div>
      ))}

      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
        {[0, 1, 2].map((i) => (
          <div
            key={`chip-${i}`}
            className="w-12 h-12 rounded-full bg-gradient-to-br from-red-600 to-red-800 border-4 border-red-500 shadow-lg absolute"
            style={{
              top: `${-24 + i * 3}px`,
              left: `${-24 + i * 3}px`,
              zIndex: 10 - i,
              animation: `chipStack 0.5s ease-out ${1.5 + i * 0.2}s both`,
            }}
          >
            <div className="absolute inset-2 rounded-full border-2 border-red-400/50"></div>
            <div className="absolute inset-4 rounded-full border border-red-300/30"></div>
          </div>
        ))}
      </div>

      <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
        <div className="text-center">
          <p className="text-sm text-white font-semibold animate-pulse tracking-wide">
            {isDealing ? 'DEALING CARDS...' : 'SHUFFLING...'}
          </p>
          <div className="flex justify-center gap-1 mt-1">
            {[0, 1, 2].map((i) => (
              <div key={`dot-${i}`} className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }}></div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes cardFloat {
          0%, 100% { transform: translate(-50%, -50%) translateY(0); }
          50% { transform: translate(-50%, -50%) translateY(-8px); }
        }
        @keyframes chipStack {
          from { opacity: 0; transform: translateY(-30px) scale(0); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
};

const FloatingParticles = () => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: `particle-${i}-${Date.now()}`,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 5}s`,
      animationDuration: `${5 + Math.random() * 10}s`,
      opacity: Math.random() * 0.5 + 0.1
    }));
    setParticles(newParticles);
  }, []);

  if (particles.length === 0) return null;

  return (
    <>
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute w-1 h-1 bg-white rounded-full animate-float"
          style={{
            top: particle.top,
            left: particle.left,
            animationDelay: particle.animationDelay,
            animationDuration: particle.animationDuration,
            opacity: particle.opacity
          }}
        />
      ))}
    </>
  );
};

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/dashboard';
  
  const { login, isAuthenticated, isLoading } = useAuthStore();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isAuthenticated && !isLoading && mounted) {
      router.replace(redirectPath);
    }
  }, [isAuthenticated, isLoading, router, redirectPath, mounted]);

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
        toast.success('Verification code sent to your email!');
        router.push('/verify-otp');
      } else if (result.success) {
        toast.success('Login successful!');
        router.push(redirectPath);
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
          <p className="text-white mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-center space-y-8">
          <PokerCardLoader />
          <div className="space-y-2 mt-4">
            <h1 className="text-3xl font-bold text-white">Admin Portal</h1>
            <p className="text-gray-400">Preparing your experience...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden py-12 px-4 sm:px-6 lg:px-8">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" style={{ animationDelay: '4s' }}></div>
        
        <div className="absolute inset-0 opacity-10" 
          style={{ 
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '60px 60px'
          }} 
        />
        
        <FloatingParticles />
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
            <form id="login-form" onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                <div className={`relative group transition-all duration-300 ${focusedField === 'email' ? 'scale-[1.02]' : ''}`}>
                  <div className={`absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl blur opacity-25 group-hover:opacity-50 transition-opacity ${focusedField === 'email' ? 'opacity-50' : ''}`}></div>
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
                  <div className={`absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl blur opacity-25 group-hover:opacity-50 transition-opacity ${focusedField === 'password' ? 'opacity-50' : ''}`}></div>
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
                <div className="relative flex items-center justify-center px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl text-white font-medium text-lg transition-transform group-hover:scale-[1.02] group-active:scale-[0.98]">
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
                      <ArrowRightIcon className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
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
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.5; }
          50% { transform: translateY(-20px) rotate(180deg); opacity: 1; }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        .animate-blob { animation: blob 7s infinite; }
        .animate-float { animation: float linear infinite; }
        .animate-shake { animation: shake 0.5s ease-in-out; }
        ::placeholder { color: rgba(255, 255, 255, 0.3); }
      `}</style>
    </div>
  );
}