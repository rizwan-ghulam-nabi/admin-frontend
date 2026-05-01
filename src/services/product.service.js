/// 27/04/2026

// services/product.service.js

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api/v1';

// Token helper - check cookies AND localStorage
const getToken = () => {
  if (typeof window === 'undefined') return null;
  
  // Check cookies first
  try {
    const cookies = document.cookie.split('; ');
    const tokenCookie = cookies.find(row => row.startsWith('accessToken='));
    if (tokenCookie) return tokenCookie.split('=')[1];
  } catch (e) {}
  
  // Check localStorage
  try {
    const token = localStorage.getItem('accessToken');
    if (token) return token;
  } catch (e) {}
  
  return null;
};

// API request helper for JSON
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getToken();
  
  console.log('🌐 API Request:', options.method || 'GET', url);
  
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
    
    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      data = { message: text || 'Unknown error' };
    }
    
    if (!response.ok) {
      console.error('❌ API Error:', response.status, data);
      throw new Error(data.message || data.error || `HTTP ${response.status}`);
    }
    
    return data;
  } catch (error) {
    console.error('❌ API Error:', error.message);
    throw error;
  }
};

// HTTP Methods
const get = (endpoint, options = {}) => apiRequest(endpoint, { ...options, method: 'GET' });
const post = (endpoint, body, options = {}) => apiRequest(endpoint, { ...options, method: 'POST', body: JSON.stringify(body) });
const put = (endpoint, body, options = {}) => apiRequest(endpoint, { ...options, method: 'PUT', body: JSON.stringify(body) });
const patch = (endpoint, body, options = {}) => apiRequest(endpoint, { ...options, method: 'PATCH', body: JSON.stringify(body) });
const del = (endpoint, options = {}) => apiRequest(endpoint, { ...options, method: 'DELETE' });

// FormData request helper for file uploads
const formDataRequest = async (endpoint, method, formData) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getToken();
  
  console.log('🌐 FormData Request:', method, url);
  
  const headers = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  try {
    const response = await fetch(url, {
      method,
      headers,
      credentials: 'include',
      body: formData,
    });
    
    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      data = { message: text || 'Unknown error' };
    }
    
    if (!response.ok) {
      console.error('❌ Upload Error:', response.status, data);
      throw new Error(data.message || data.error || 'Upload failed');
    }
    
    return data;
  } catch (error) {
    console.error('❌ Upload Error:', error.message);
    throw error;
  }
};

// ============================================
// PRODUCT SERVICE - ALL ENDPOINTS FIXED
// ============================================
export const productService = {
  // ✅ FIXED: Added /admin/ prefix
  async getAll(params = {}) {
    const queryParams = new URLSearchParams();
    
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.search) queryParams.append('search', params.search);
    if (params.category) queryParams.append('category', params.category);
    if (params.status) queryParams.append('status', params.status);
    if (params.sort) queryParams.append('sort', params.sort);
    
    const query = queryParams.toString();
    return get(`/admin/products${query ? `?${query}` : ''}`);
  },

  // ✅ FIXED: Get single product
  async getById(id) {
    if (!id) throw new Error('Product ID is required');
    return get(`/admin/products/${id}`);
  },

  // ✅ FIXED: Create product
  async create(data) {
    if (!data) throw new Error('Product data is required');
    
    if (data instanceof FormData) {
      return formDataRequest('/admin/products', 'POST', data);
    }
    return post('/admin/products', data);
  },

  // ✅ FIXED: Update product
  async update(id, data) {
    if (!id) throw new Error('Product ID is required');
    if (!data) throw new Error('Product data is required');
    
    if (data instanceof FormData) {
      return formDataRequest(`/admin/products/${id}`, 'PUT', data);
    }
    return put(`/admin/products/${id}`, data);
  },

  // ✅ FIXED: Delete product
  async delete(id) {
    if (!id) throw new Error('Product ID is required');
    console.log('🗑️ Deleting product:', id);
    return del(`/admin/products/${id}`);
  },

  // ✅ FIXED: Bulk update
  async bulkUpdate(productIds, updateData) {
    if (!productIds || !productIds.length) throw new Error('Product IDs are required');
    return post('/admin/products/bulk-update', { productIds, updateData });
  },

  // ✅ FIXED: Update stock
  async updateStock(id, stock) {
    if (!id) throw new Error('Product ID is required');
    return patch(`/admin/products/${id}/stock`, { stock });
  },

  // ✅ FIXED: Low stock
  async getLowStock(threshold = 10) {
    return get(`/admin/products/low-stock?threshold=${threshold}`);
  },
};

export default productService;