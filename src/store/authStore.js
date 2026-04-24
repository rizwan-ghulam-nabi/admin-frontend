'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authService } from '@/services/auth.service';
import Cookies from 'js-cookie';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      permissions: [],
      isAuthenticated: false,
      isLoading: false,
      requiresOTP: false,
      requiresTwoFactor: false,
      tempToken: null,
      loginEmail: '',

      initialize: () => {
        // ✅ Check multiple sources for token
        const token = Cookies.get('accessToken') || localStorage.getItem('accessToken');
        if (token) {
          set({ isAuthenticated: true });
          get().fetchProfile().catch(() => get().logout());
        }
      },

      login: async (email, password) => {
        set({ isLoading: true });
        try {
          const response = await authService.login(email, password);
          
          if (response.requiresOTP) {
            set({
              requiresOTP: true,
              tempToken: response.tempToken,
              loginEmail: response.email || email,
              isLoading: false,
            });
            return { requiresOTP: true };
          }
          
          set({ isLoading: false });
          return { success: true };
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      verifyOTP: async (email, otp) => {
        set({ isLoading: true });
        try {
          const { tempToken } = get();
          const response = await authService.verifyOTP(email, otp, tempToken);
          
          if (response.requiresTwoFactor) {
            set({
              requiresOTP: false,
              requiresTwoFactor: true,
              tempToken: response.tempToken,
              isLoading: false,
            });
            return { requiresTwoFactor: true };
          }
          
          if (response.data?.token) {
            const token = response.data.token;
            const refreshToken = response.data.refreshToken;
            const permissions = response.data.permissions || [];
            
            // ✅ Save to cookies with less restrictive settings
            Cookies.set('accessToken', token, { 
              expires: 7, 
              path: '/',
              sameSite: 'lax',
              secure: false 
            });
            Cookies.set('refreshToken', refreshToken, { 
              expires: 30, 
              path: '/',
              sameSite: 'lax',
              secure: false 
            });
            Cookies.set('admin_permissions', JSON.stringify(permissions), { 
              expires: 7, 
              path: '/',
              sameSite: 'lax',
              secure: false 
            });
            
            // ✅ ALSO save to localStorage (backup)
            localStorage.setItem('accessToken', token);
            localStorage.setItem('refreshToken', refreshToken);
            localStorage.setItem('admin_permissions', JSON.stringify(permissions));
            
            console.log('✅ Token saved to cookies and localStorage');
          }
          
          set({
            user: response.data?.admin,
            permissions: response.data?.permissions || [],
            isAuthenticated: true,
            requiresOTP: false,
            tempToken: null,
            loginEmail: '',
            isLoading: false,
          });
          
          return { success: true };
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      resendOTP: async () => {
        const { loginEmail } = get();
        return authService.resendOTP(loginEmail);
      },

      verify2FALogin: async (twoFactorCode) => {
        set({ isLoading: true });
        try {
          const { tempToken } = get();
          const response = await authService.verify2FALogin(twoFactorCode, tempToken);
          
          if (response.data?.token) {
            const token = response.data.token;
            const refreshToken = response.data.refreshToken;
            const permissions = response.data.permissions || [];
            
            // ✅ Save to cookies with less restrictive settings
            Cookies.set('accessToken', token, { 
              expires: 7, 
              path: '/',
              sameSite: 'lax',
              secure: false 
            });
            Cookies.set('refreshToken', refreshToken, { 
              expires: 30, 
              path: '/',
              sameSite: 'lax',
              secure: false 
            });
            Cookies.set('admin_permissions', JSON.stringify(permissions), { 
              expires: 7, 
              path: '/',
              sameSite: 'lax',
              secure: false 
            });
            
            // ✅ ALSO save to localStorage
            localStorage.setItem('accessToken', token);
            localStorage.setItem('refreshToken', refreshToken);
            localStorage.setItem('admin_permissions', JSON.stringify(permissions));
            
            console.log('✅ Token saved to cookies and localStorage');
          }
          
          set({
            user: response.data?.admin,
            permissions: response.data?.permissions || [],
            isAuthenticated: true,
            requiresTwoFactor: false,
            tempToken: null,
            isLoading: false,
          });
          
          return { success: true };
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: async () => {
        try {
          await authService.logout();
        } catch (error) {
          console.error('Logout error:', error);
        } finally {
          // ✅ Clear cookies
          Cookies.remove('accessToken', { path: '/' });
          Cookies.remove('refreshToken', { path: '/' });
          Cookies.remove('admin_permissions', { path: '/' });
          
          // ✅ Clear localStorage
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('admin_permissions');
          localStorage.removeItem('auth-storage');
          
          set({
            user: null,
            permissions: [],
            isAuthenticated: false,
            requiresOTP: false,
            requiresTwoFactor: false,
            tempToken: null,
            loginEmail: '',
          });
        }
      },

      fetchProfile: async () => {
        try {
          const response = await authService.getProfile();
          set({ user: response.data, permissions: response.data?.role?.permissions || [] });
          return response.data;
        } catch (error) {
          throw error;
        }
      },

      updateProfile: async (data) => {
        const response = await authService.updateProfile(data);
        set({ user: response.data });
        return response.data;
      },

      changePassword: (currentPassword, newPassword) => 
        authService.changePassword(currentPassword, newPassword),

      enable2FA: () => authService.enable2FA(),
      verify2FA: (code) => authService.verify2FA(code),
      disable2FA: (code) => authService.disable2FA(code),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, permissions: state.permissions }),
    }
  )
);