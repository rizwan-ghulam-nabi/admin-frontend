import { useAuthStore } from '@/store/authStore';

export const useAuth = () => {
  const { 
    user, 
    permissions, 
    isAuthenticated, 
    isLoading, 
    login, 
    loginWith2FA,
    logout, 
    hasPermission 
  } = useAuthStore();

  return {
    user,
    permissions,
    isAuthenticated,
    isLoading,
    login,
    loginWith2FA,
    logout,
    hasPermission: (permission) => {
      if (!permissions || permissions.length === 0) return false;
      return permissions.includes(permission) || permissions.includes('*');
    },
  };
};