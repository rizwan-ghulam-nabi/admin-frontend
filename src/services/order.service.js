const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api/v1';

// Simple fetch wrapper
const fetchAPI = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = localStorage.getItem('accessToken');
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const config = {
    ...options,
    headers,
    credentials: 'include',
  };
  
  try {
    const response = await fetch(url, config);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'API Error');
    }
    
    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Order Service
export const orderService = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetchAPI(`/admin/orders${query ? `?${query}` : ''}`, { method: 'GET' });
  },
  
  getById: (id) => {
    return fetchAPI(`/admin/orders/${id}`, { method: 'GET' });
  },
  
  updateStatus: (id, status, note = '') => {
    return fetchAPI(`/admin/orders/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, note }),
    });
  },
  
  updatePaymentStatus: (id, paymentStatus, transactionId = '') => {
    return fetchAPI(`/admin/orders/${id}/payment`, {
      method: 'PATCH',
      body: JSON.stringify({ paymentStatus, transactionId }),
    });
  },
  
  cancel: (id, reason = '') => {
    return fetchAPI(`/admin/orders/${id}/cancel`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
  },
  
  getStats: (period = 'month') => {
    return fetchAPI(`/admin/orders/stats?period=${period}`, { method: 'GET' });
  },
  
  bulkUpdate: (orderIds, status, note = '') => {
    return fetchAPI('/admin/orders/bulk-update', {
      method: 'POST',
      body: JSON.stringify({ orderIds, status, note }),
    });
  },
  
  generateInvoice: (id) => {
    return `${API_BASE_URL}/admin/orders/${id}/invoice`;
  },
};