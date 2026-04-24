'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  HomeIcon,
  UserIcon,
  ShieldCheckIcon,
  ArrowRightOnRectangleIcon,
  ShoppingBagIcon,
  TagIcon,
} from '@heroicons/react/24/outline';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';


const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Profile', href: '/profile', icon: UserIcon },
  { name: 'Categories', href: '/categories', icon: TagIcon }, // ✅
  { name: 'Security', href: '/security', icon: ShieldCheckIcon },
  { name: 'Products', href: '/products', icon: ShoppingBagIcon}
];

export default function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const pathname = usePathname();
  const { logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      router.push('/login');
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  return (
    <>
      <div 
        className={`fixed inset-0 z-20 transition-opacity bg-black opacity-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`} 
        onClick={() => setSidebarOpen(false)} 
      />
      
      <div className={`fixed inset-y-0 left-0 z-30 w-64 overflow-y-auto bg-gray-900 transition duration-300 transform lg:translate-x-0 lg:static lg:inset-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-center mt-8">
          <span className="text-white text-2xl mx-2 font-semibold">Admin Panel</span>
        </div>

        <nav className="mt-10">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-6 py-2 mt-4 text-gray-100 hover:bg-gray-700 hover:bg-opacity-25 ${isActive ? 'bg-gray-700 bg-opacity-25 border-l-4 border-primary-500' : ''}`}
              >
                <item.icon className="h-5 w-5" />
                <span className="mx-3">{item.name}</span>
              </Link>
            );
          })}
          
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-6 py-2 mt-4 text-gray-100 hover:bg-gray-700 hover:bg-opacity-25"
          >
            <ArrowRightOnRectangleIcon className="h-5 w-5" />
            <span className="mx-3">Logout</span>
          </button>
        </nav>
      </div>
    </>
  );
}