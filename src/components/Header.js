'use client';

import { useAuthStore } from '@/store/authStore';
import { Bars3Icon } from '@heroicons/react/24/outline';

export default function Header({ setSidebarOpen }) {
  const { user } = useAuthStore();

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white border-b-4 border-primary-600">
      <div className="flex items-center">
        <button
          onClick={() => setSidebarOpen(true)}
          className="text-gray-500 focus:outline-none lg:hidden"
        >
          <Bars3Icon className="h-6 w-6" />
        </button>
        <h2 className="ml-4 text-lg font-medium text-gray-700 hidden lg:block">
          Welcome back, {user?.name || 'Admin'}
        </h2>
      </div>

      <div className="flex items-center">
        <span className="text-gray-700 mr-4 hidden sm:block">{user?.email}</span>
      </div>
    </header>
  );
}