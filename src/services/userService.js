// services/userService.js
import api from './api';

export const userService = {
  // Get all users
  getAllUsers: (params = {}) => {
    return api.get('/admin/users', params);
  },

  // Get single user
  getUserById: (id) => {
    return api.get(`/admin/users/${id}`);
  },

  // Create user
  createUser: (userData) => {
    return api.post('/admin/users', userData);
  },

  // Update user
  updateUser: (id, userData) => {
    return api.put(`/admin/users/${id}`, userData);
  },

  // Update user status
  updateUserStatus: (id, status, reason = '') => {
    return api.patch(`/admin/users/${id}/status`, { status, reason });
  },

  // Delete user
  deleteUser: (id) => {
    return api.delete(`/admin/users/${id}`);
  },

  // Get user stats
  getUserStats: () => {
    return api.get('/admin/users/stats');
  },

  // Get user orders
  getUserOrders: (id, params = {}) => {
    return api.get(`/admin/users/${id}/orders`, params);
  },

  // Export users
  exportUsers: async (format = 'csv', filters = {}) => {
    const queryString = new URLSearchParams({ format, ...filters }).toString();
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api/v1';
    const url = `${API_BASE_URL}/admin/users/export?${queryString}`;
    
    const token = typeof window !== 'undefined' 
      ? (localStorage.getItem('accessToken') || Cookies.get('accessToken'))
      : null;
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) throw new Error('Export failed');
    
    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = `users-export-${Date.now()}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(downloadUrl);
  }
}; 