// src/services/refundService.js
import axios from 'axios';
import { getAuthToken } from './authService';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api/v1';

// Create axios instance with auth
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const refundService = {
  // Get all refunds
  getRefunds: async (params = {}) => {
    const response = await api.get('/refunds', { params });
    return response.data;
  },

  // Get single refund
  getRefundById: async (id) => {
    const response = await api.get(`/refunds/${id}`);
    return response.data;
  },

  // Create refund
  createRefund: async (refundData) => {
    const response = await api.post('/refunds', refundData);
    return response.data;
  },

  // Update refund status
  updateRefundStatus: async (id, statusData) => {
    const response = await api.patch(`/refunds/${id}/status`, statusData);
    return response.data;
  },

  // Get refund statistics
  getRefundStats: async (params = {}) => {
    const response = await api.get('/refunds/stats', { params });
    return response.data;
  },

  // Get refund trends
  getRefundTrends: async (params = {}) => {
    const response = await api.get('/refunds/trends', { params });
    return response.data;
  },

  // Get refunds by reason
  getRefundByReason: async (params = {}) => {
    const response = await api.get('/refunds/by-reason', { params });
    return response.data;
  },

  // Get refund rate
  getRefundRate: async (params = {}) => {
    const response = await api.get('/refunds/rate', { params });
    return response.data;
  },

  // Export refunds
  exportRefundsExcel: async (params = {}) => {
    const response = await api.get('/refunds/export/excel', {
      params,
      responseType: 'blob',
    });
    
    // Download file
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `refunds-${new Date().toISOString().split('T')[0]}.xlsx`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  },

  exportRefundsPDF: async (params = {}) => {
    const response = await api.get('/refunds/export/pdf', {
      params,
      responseType: 'blob',
    });
    
    // Download file
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `refunds-${new Date().toISOString().split('T')[0]}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  },
};