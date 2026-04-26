// store/authStore.js
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
      isInitialized: false,
      requiresOTP: false,
      requiresTwoFactor: false,
      tempToken: null,
      loginEmail: '',

      initialize: () => {
        if (get().isInitialized) {
          console.log('Already initialized');
          return;
        }

        console.log('🚀 Initializing auth...');
        
        const token = Cookies.get('accessToken') || localStorage.getItem('accessToken');
        console.log('Token exists:', !!token);
        
        if (token) {
          set({ 
            isAuthenticated: true, 
            isInitialized: true 
          });
          
          get().fetchProfile().catch((error) => {
            console.error('Profile fetch failed:', error);
            if (error?.response?.status === 401 || error?.response?.status === 403) {
              get().logout();
            }
          });
        } else {
          set({ 
            isAuthenticated: false, 
            isInitialized: true 
          });
        }
      },

      login: async (email, password) => {
        set({ isLoading: true, loginEmail: email });
        try {
          console.log('🔑 Attempting login for:', email);
          const response = await authService.login(email, password);
          console.log('📦 Full login response:', response);
          
          // Check ALL possible response structures for OTP
          const data = response.data || response;
          const requiresOTP = response.requiresOTP || 
                             data.requiresOTP ||
                             response.requiresOtp ||
                             data.requiresOtp ||
                             response.needOTP ||
                             data.needOTP;
          
          const tempToken = response.tempToken || 
                           data.tempToken ||
                           response.temp_token ||
                           data.temp_token;
          
          console.log('OTP check:', { requiresOTP, tempToken });
          
          if (requiresOTP) {
            console.log('📧 OTP required');
            set({
              requiresOTP: true,
              tempToken: tempToken,
              loginEmail: email,
              isLoading: false,
            });
            return { requiresOTP: true };
          }
          
          // Check for direct token (no OTP)
          const token = response.token || 
                       data.token ||
                       response.accessToken ||
                       data.accessToken;
          
          if (token) {
            console.log('✅ Direct login success');
            const refreshToken = response.refreshToken || data.refreshToken;
            const permissions = response.permissions || data.permissions || [];
            const user = response.user || data.user || response.admin || data.admin;
            
            get().saveTokens(token, refreshToken, permissions);
            
            set({
              user: user,
              permissions: permissions,
              isAuthenticated: true,
              isLoading: false,
            });
            
            return { success: true };
          }
          
          console.error('Unexpected login response structure:', response);
          set({ isLoading: false });
          throw new Error('Invalid response from server');
          
        } catch (error) {
          console.error('❌ Login error:', error);
          set({ isLoading: false });
          throw error;
        }
      },

      verifyOTP: async (email, otp) => {
        set({ isLoading: true });
        try {
          const { tempToken } = get();
          console.log('🔐 Verifying OTP:', { email, otp, tempToken });
          
          const response = await authService.verifyOTP(email, otp, tempToken);
          console.log('📦 Full OTP response:', response);
          
          const data = response.data || response;
          
          // Check for 2FA
          const requiresTwoFactor = response.requiresTwoFactor ||
                                   data.requiresTwoFactor ||
                                   response.requires2FA ||
                                   data.requires2FA;
          
          if (requiresTwoFactor) {
            console.log('🔒 2FA required');
            const newTempToken = response.tempToken || data.tempToken || tempToken;
            set({
              requiresOTP: false,
              requiresTwoFactor: true,
              tempToken: newTempToken,
              isLoading: false,
            });
            return { requiresTwoFactor: true };
          }
          
          // Get token - check ALL possible paths
          const token = response.token || 
                       data.token ||
                       response.accessToken ||
                       data.accessToken;
          
          console.log('Token found:', !!token);
          
          if (!token) {
            console.error('❌ No token in OTP response!', response);
            throw new Error('No authentication token received');
          }
          
          const refreshToken = response.refreshToken || data.refreshToken;
          const permissions = response.permissions || data.permissions || [];
          const user = response.user || data.user || response.admin || data.admin;
          
          console.log('✅ OTP verified, saving tokens');
          get().saveTokens(token, refreshToken, permissions);
          
          set({
            user: user,
            permissions: permissions,
            isAuthenticated: true,
            requiresOTP: false,
            tempToken: null,
            isLoading: false,
          });
          
          return { success: true };
          
        } catch (error) {
          console.error('❌ OTP verification error:', error);
          set({ isLoading: false });
          throw error;
        }
      },

      saveTokens: (token, refreshToken, permissions) => {
        console.log('💾 Saving tokens...');
        
        Cookies.set('accessToken', token, { 
          expires: 7, 
          path: '/',
          sameSite: 'lax',
          secure: false 
        });
        
        if (refreshToken) {
          Cookies.set('refreshToken', refreshToken, { 
            expires: 30, 
            path: '/',
            sameSite: 'lax',
            secure: false 
          });
        }
        
        if (permissions && permissions.length > 0) {
          Cookies.set('admin_permissions', JSON.stringify(permissions), { 
            expires: 7, 
            path: '/',
            sameSite: 'lax',
            secure: false 
          });
        }
        
        localStorage.setItem('accessToken', token);
        if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
        if (permissions && permissions.length > 0) {
          localStorage.setItem('admin_permissions', JSON.stringify(permissions));
        }
        
        console.log('✅ Tokens saved');
      },

      resendOTP: async () => {
        const { loginEmail } = get();
        console.log('📧 Resending OTP to:', loginEmail);
        return authService.resendOTP(loginEmail);
      },

      verify2FALogin: async (twoFactorCode) => {
        set({ isLoading: true });
        try {
          const { tempToken } = get();
          console.log('🔒 Verifying 2FA:', { twoFactorCode, tempToken });
          
          const response = await authService.verify2FALogin(twoFactorCode, tempToken);
          console.log('📦 2FA response:', response);
          
          const data = response.data || response;
          const token = data.token || response.token || data.accessToken;
          const refreshToken = data.refreshToken || response.refreshToken;
          const permissions = data.permissions || response.permissions || [];
          const user = data.user || response.user || data.admin || response.admin;
          
          if (token) {
            get().saveTokens(token, refreshToken, permissions);
          }
          
          set({
            user: user,
            permissions: permissions,
            isAuthenticated: true,
            requiresTwoFactor: false,
            tempToken: null,
            isLoading: false,
          });
          
          return { success: true };
        } catch (error) {
          console.error('❌ 2FA error:', error);
          set({ isLoading: false });
          throw error;
        }
      },

      logout: async () => {
        set({
          user: null,
          permissions: [],
          isAuthenticated: false,
          isLoading: false,
          requiresOTP: false,
          requiresTwoFactor: false,
          tempToken: null,
          loginEmail: '',
          isInitialized: false,
        });

        try {
          await authService.logout();
        } catch (error) {
          console.error('Logout API error:', error);
        } finally {
          Cookies.remove('accessToken', { path: '/' });
          Cookies.remove('refreshToken', { path: '/' });
          Cookies.remove('admin_permissions', { path: '/' });
          
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('admin_permissions');
          localStorage.removeItem('auth-storage');
          
          if (typeof window !== 'undefined') {
            sessionStorage.clear();
            window.location.replace('/login');
          }
        }
      },

      fetchProfile: async () => {
        if (!get().isAuthenticated) {
          console.log('Not authenticated, skipping profile fetch');
          return null;
        }

        try {
          const response = await authService.getProfile();
          const data = response.data || response;
          set({ 
            user: data.user || data.admin || data,
            permissions: data.role?.permissions || data.permissions || [],
            isAuthenticated: true,
          });
          return data;
        } catch (error) {
          if (error?.response?.status === 401 || error?.response?.status === 403) {
            get().logout();
          }
          throw error;
        }
      },

      updateProfile: async (data) => {
        const response = await authService.updateProfile(data);
        set({ user: response.data || response });
        return response.data || response;
      },

      changePassword: (currentPassword, newPassword) => 
        authService.changePassword(currentPassword, newPassword),

      enable2FA: () => authService.enable2FA(),
      verify2FA: (code) => authService.verify2FA(code),
      disable2FA: (code) => authService.disable2FA(code),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        permissions: state.permissions,
      }),
      skipHydration: true,
    }
  )
);