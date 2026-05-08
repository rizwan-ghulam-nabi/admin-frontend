// store/authStore.js
'use client';

import { create } from 'zustand';
import { authService } from '@/services/auth.service';
import Cookies from 'js-cookie';

export const useAuthStore = create((set, get) => ({
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
    // STOP if already initialized
    if (get().isInitialized) return;

    console.log('🚀 Auth init...');
    
    const token = Cookies.get('accessToken') || localStorage.getItem('accessToken');
    
    if (token) {
      set({ isAuthenticated: true, isInitialized: true });
      
      // Try to fetch profile
      authService.getProfile()
        .then(res => {
          const data = res.data || res;
          set({ user: data.user || data.admin || data });
        })
        .catch(() => {
          // Silently fail - don't redirect
          console.log('Profile fetch failed, but staying on page');
        });
    } else {
      set({ isAuthenticated: false, isInitialized: true });
    }
  },

  login: async (email, password) => {
    set({ isLoading: true, loginEmail: email });
    try {
      const response = await authService.login(email, password);
      const data = response.data || response;
      
      // Check OTP
      const requiresOTP = response.requiresOTP || data.requiresOTP || data.requiresOtp;
      if (requiresOTP) {
        set({
          requiresOTP: true,
          tempToken: response.tempToken || data.tempToken,
          isLoading: false,
        });
        return { requiresOTP: true };
      }
      
      // Direct login
      const token = response.token || data.token || response.accessToken || data.accessToken;
      if (token) {
        get().saveTokens(token, response.refreshToken || data.refreshToken);
        set({
          user: response.user || data.user || response.admin || data.admin,
          isAuthenticated: true,
          isLoading: false,
        });
        return { success: true };
      }
      
      throw new Error('No token received');
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
      const data = response.data || response;
      
      // Check 2FA
      const requiresTwoFactor = response.requiresTwoFactor || data.requiresTwoFactor || data.requires2FA;
      if (requiresTwoFactor) {
        set({
          requiresOTP: false,
          requiresTwoFactor: true,
          tempToken: response.tempToken || data.tempToken || tempToken,
          isLoading: false,
        });
        return { requiresTwoFactor: true };
      }
      
      const token = response.token || data.token || response.accessToken || data.accessToken;
      if (token) {
        get().saveTokens(token, response.refreshToken || data.refreshToken);
        set({
          user: response.user || data.user || response.admin || data.admin,
          isAuthenticated: true,
          requiresOTP: false,
          tempToken: null,
          isLoading: false,
        });
        return { success: true };
      }
      
      throw new Error('No token received');
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  verify2FALogin: async (twoFactorCode) => {
    set({ isLoading: true });
    try {
      const { tempToken } = get();
      const response = await authService.verify2FALogin(twoFactorCode, tempToken);
      const data = response.data || response;
      
      const token = data.token || response.token || data.accessToken;
      if (token) {
        get().saveTokens(token, data.refreshToken || response.refreshToken);
      }
      
      set({
        user: data.user || response.user || data.admin || response.admin,
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

  saveTokens: (token, refreshToken) => {
    Cookies.set('accessToken', token, { expires: 7, path: '/' });
    if (refreshToken) {
      Cookies.set('refreshToken', refreshToken, { expires: 30, path: '/' });
    }
    localStorage.setItem('accessToken', token);
    if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
  },

  resendOTP: async () => {
    const { loginEmail } = get();
    return authService.resendOTP(loginEmail);
  },

  logout: async () => {
    // Clear everything
    Cookies.remove('accessToken', { path: '/' });
    Cookies.remove('refreshToken', { path: '/' });
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    
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
    
    // Only redirect if not on login page
    if (window.location.pathname !== '/login') {
      window.location.href = '/login';
    }
  },

  fetchProfile: async () => {
    if (!get().isAuthenticated) return null;
    try {
      const response = await authService.getProfile();
      const data = response.data || response;
      set({ user: data.user || data.admin || data });
      return data;
    } catch {
      return null;
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
}));