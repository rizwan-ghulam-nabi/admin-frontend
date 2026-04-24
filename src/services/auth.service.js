import api from './api';

export const authService = {
  login: (email, password) => api.post('/admin/auth/login', { email, password }),
  verifyOTP: (email, otp, tempToken) => api.post('/admin/auth/verify-otp', { email, otp, tempToken }),
  resendOTP: (email) => api.post('/admin/auth/resend-otp', { email }),
  verify2FALogin: (twoFactorCode, tempToken) => api.post('/admin/auth/verify-2fa-login', { twoFactorCode, tempToken }),
  logout: () => api.post('/admin/auth/logout'),
  refreshToken: (refreshToken) => api.post('/admin/auth/refresh-token', { refreshToken }),
  getProfile: () => api.get('/admin/auth/profile'),
  updateProfile: (data) => api.put('/admin/auth/profile', data),
  changePassword: (currentPassword, newPassword) => api.post('/admin/auth/change-password', { currentPassword, newPassword }),
  enable2FA: () => api.post('/admin/auth/enable-2fa'),
  verify2FA: (code) => api.post('/admin/auth/verify-2fa', { code }),
  disable2FA: (code) => api.post('/admin/auth/disable-2fa', { code }),
};