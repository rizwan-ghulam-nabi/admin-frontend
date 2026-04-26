// src/services/product.service.js

// const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api/v1';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api/v1/admin';
console.log('🔧 API_BASE_URL:', API_BASE_URL); // ADD THIS LINE



// ============================================
// TOKEN HELPER - Get token from multiple sources
// ============================================
const getToken = () => {
  if (typeof window === 'undefined') return null;
  
  let token = null;
  
  // Check localStorage
  try {
    token = localStorage.getItem('accessToken');
    if (!token) token = localStorage.getItem('adminToken');
    if (!token) token = localStorage.getItem('token');
  } catch (e) {
    console.warn('localStorage not available');
  }
  
  // Check sessionStorage
  if (!token) {
    try {
      token = sessionStorage.getItem('accessToken');
      if (!token) token = sessionStorage.getItem('adminToken');
    } catch (e) {
      console.warn('sessionStorage not available');
    }
  }
  
  return token;
};

// ============================================
// JSON API REQUEST
// ============================================
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getToken();
  
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
    
    // Handle empty responses
    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      data = { message: text || 'Unknown error' };
    }
    
    if (!response.ok) {
      const error = new Error(data.message || data.error || `Request failed with status ${response.status}`);
      error.status = response.status;
      error.data = data;
      error.errors = data.errors;
      throw error;
    }
    
    return {
      success: data.success !== undefined ? data.success : true,
      data: data.data,
      message: data.message || '',
      pagination: data.pagination || null,
    };
  } catch (error) {
    if (error.status) {
      // API error - already formatted
      throw error;
    }
    // Network error
    console.error('Network Error:', error.message);
    throw new Error('Network error. Please check your connection.');
  }
};

// ============================================
// FORM DATA REQUEST (for file uploads)
// ============================================
const formDataRequest = async (endpoint, method, formData) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getToken();
  
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
    
    // Handle empty responses
    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      data = { message: text || 'Unknown error' };
    }
    
    if (!response.ok) {
      const error = new Error(data.message || data.error || `Upload failed with status ${response.status}`);
      error.status = response.status;
      error.data = data;
      error.errors = data.errors;
      throw error;
    }
    
    console.log('✅ FormData upload success:', endpoint);
    
    return {
      success: data.success !== undefined ? data.success : true,
      data: data.data,
      message: data.message || 'Upload successful',
      pagination: data.pagination || null,
    };
  } catch (error) {
    if (error.status) {
      throw error;
    }
    console.error('Upload Error:', error.message);
    throw new Error('Upload failed. Please try again.');
  }
};

// ============================================
// HTTP METHOD HELPERS
// ============================================
const get = (endpoint, options = {}) => 
  apiRequest(endpoint, { ...options, method: 'GET' });

const post = (endpoint, body, options = {}) => 
  apiRequest(endpoint, { ...options, method: 'POST', body: JSON.stringify(body) });

const put = (endpoint, body, options = {}) => 
  apiRequest(endpoint, { ...options, method: 'PUT', body: JSON.stringify(body) });

const patch = (endpoint, body, options = {}) => 
  apiRequest(endpoint, { ...options, method: 'PATCH', body: JSON.stringify(body) });

const del = (endpoint, options = {}) => 
  apiRequest(endpoint, { ...options, method: 'DELETE' });

// ============================================
// PRODUCT SERVICE
// ============================================
export const productService = {
  // Get all products with filters and pagination
  async getAll(params = {}) {
    const queryParams = new URLSearchParams();
    
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.search) queryParams.append('search', params.search);
    if (params.category) queryParams.append('category', params.category);
    if (params.status) queryParams.append('status', params.status);
    if (params.sort) queryParams.append('sort', params.sort);
    
    const query = queryParams.toString();
    return get(`/products${query ? `?${query}` : ''}`);
  },

  // Get single product by ID
  async getById(id) {
    if (!id) throw new Error('Product ID is required');
    return get(`/products/${id}`);
  },

  // Create product (JSON or FormData)
  async create(data) {
    if (!data) throw new Error('Product data is required');
    
    if (data instanceof FormData) {
      return formDataRequest('/products', 'POST', data);
    }
    return post('/products', data);
  },

  // Update product (JSON or FormData)
  async update(id, data) {
    if (!id) throw new Error('Product ID is required');
    if (!data) throw new Error('Product data is required');
    
    if (data instanceof FormData) {
      return formDataRequest(`/products/${id}`, 'PUT', data);
    }
    return put(`/products/${id}`, data);
  },

  // Delete product
  async delete(id) {
    if (!id) throw new Error('Product ID is required');
    return del(`/products/${id}`);
  },

  // Bulk update products
  async bulkUpdate(productIds, updateData) {
    if (!productIds || !productIds.length) throw new Error('Product IDs are required');
    return post('/products/bulk-update', { productIds, updateData });
  },

  // Update product stock
  async updateStock(id, stock) {
    if (!id) throw new Error('Product ID is required');
    if (stock === undefined || stock === null) throw new Error('Stock value is required');
    return patch(`/products/${id}/stock`, { stock });
  },

  // Get low stock products
  async getLowStock(threshold = 10) {
    return get(`/products/low-stock?threshold=${threshold}`);
  },
};

// ============================================
// DEFAULT EXPORT
// ============================================
export default productService;