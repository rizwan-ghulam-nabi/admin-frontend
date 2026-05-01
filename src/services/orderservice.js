const API_BASE_URL = 'http://localhost:5001/api/v1/admin';

const getToken = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('accessToken');
};

const fetchAPI = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getToken();
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers,
  };
  
  const config = {
    ...options,
    headers,
    credentials: 'include',
  };
  
  console.log('📡 Calling:', url);
  
  const response = await fetch(url, config);
  
  if (response.status === 401) {
    localStorage.removeItem('accessToken');
    window.location.href = '/login';
    throw new Error('Unauthorized');
  }
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || `HTTP ${response.status}`);
  }
  
  return data;
};

export const orderService = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetchAPI(`/orders${query ? `?${query}` : ''}`, { method: 'GET' });
  },
  getById: (id) => fetchAPI(`/orders/${id}`, { method: 'GET' }),
  updateStatus: (id, status, note = '') => 
    fetchAPI(`/orders/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status, note }) }),
  updatePaymentStatus: (id, paymentStatus, transactionId = '') => 
    fetchAPI(`/orders/${id}/payment`, { method: 'PATCH', body: JSON.stringify({ paymentStatus, transactionId }) }),
  cancel: (id, reason = '') => 
    fetchAPI(`/orders/${id}/cancel`, { method: 'POST', body: JSON.stringify({ reason }) }),
  getStats: (period = 'month') => 
    fetchAPI(`/orders/stats?period=${period}`, { method: 'GET' }),
  bulkUpdate: (orderIds, status, note = '') => 
    fetchAPI('/orders/bulk-update', { method: 'POST', body: JSON.stringify({ orderIds, status, note }) }),
  generateInvoice: (id) => `${API_BASE_URL}/orders/${id}/invoice`,
};