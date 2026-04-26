// services/auth.service.js
import api from './api';

export const authService = {
  login: async (email, password) => {
    console.log('🔑 Login API call:', { email });
    const response = await api.post('/admin/auth/login', { email, password });
    console.log('📦 Login API response:', response);
    return response;
  },

  verifyOTP: async (email, otp, tempToken) => {
    console.log('🔐 Verify OTP API call:', { email, otp, tempToken });
    const response = await api.post('/admin/auth/verify-otp', {
      email,
      otp,
      tempToken,
    });
    console.log('📦 Verify OTP API response:', response);
    return response;
  },

  resendOTP: async (email) => {
    console.log('📧 Resend OTP API call:', { email });
    const response = await api.post('/admin/auth/resend-otp', { email });
    console.log('📦 Resend OTP API response:', response);
    return response;
  },

  verify2FALogin: async (code, tempToken) => {
    console.log('🔒 Verify 2FA API call:', { code, tempToken });
    const response = await api.post('/admin/auth/verify-2fa', {
      code,
      tempToken,
    });
    console.log('📦 Verify 2FA API response:', response);
    return response;
  },

  getProfile: async () => {
    const response = await api.get('/admin/auth/profile');
    return response;
  },

  logout: async () => {
    const response = await api.post('/admin/auth/logout');
    return response;
  },

  updateProfile: async (data) => {
    const response = await api.put('/admin/auth/profile', data);
    return response;
  },

  changePassword: async (currentPassword, newPassword) => {
    const response = await api.put('/admin/auth/change-password', {
      currentPassword,
      newPassword,
    });
    return response;
  },

  enable2FA: async () => {
    const response = await api.post('/admin/auth/2fa/enable');
    return response;
  },

  verify2FA: async (code) => {
    const response = await api.post('/admin/auth/2fa/verify', { code });
    return response;
  },

  disable2FA: async (code) => {
    const response = await api.post('/admin/auth/2fa/disable', { code });
    return response;
  },
};