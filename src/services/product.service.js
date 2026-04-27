// src/services/product.service.js

// const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api/v1';

// // API request helper
// const apiRequest = async (endpoint, options = {}) => {
//   const url = `${API_BASE_URL}${endpoint}`;
  
//   const token = localStorage.getItem('accessToken');
  
//   const headers = {
//     'Content-Type': 'application/json',
//     ...options.headers,
//   };
  
//   if (token) {
//     headers['Authorization'] = `Bearer ${token}`;
//   }
  
//   const config = {
//     ...options,
//     headers,
//     credentials: 'include',
//   };
  
//   try {
//     const response = await fetch(url, config);
//     const data = await response.json();
    
//     if (!response.ok) {
//       throw new Error(data.message || 'Something went wrong');
//     }
    
//     return data;
//   } catch (error) {
//     console.error('API Error:', error);
//     throw error;
//   }
// };

// // API methods
// const get = (endpoint, options = {}) => {
//   return apiRequest(endpoint, { ...options, method: 'GET' });
// };

// const post = (endpoint, body, options = {}) => {
//   return apiRequest(endpoint, { 
//     ...options, 
//     method: 'POST', 
//     body: JSON.stringify(body) 
//   });
// };

// const put = (endpoint, body, options = {}) => {
//   return apiRequest(endpoint, { 
//     ...options, 
//     method: 'PUT', 
//     body: JSON.stringify(body) 
//   });
// };

// const patch = (endpoint, body, options = {}) => {
//   return apiRequest(endpoint, { 
//     ...options, 
//     method: 'PATCH', 
//     body: JSON.stringify(body) 
//   });
// };

// const del = (endpoint, options = {}) => {
//   return apiRequest(endpoint, { ...options, method: 'DELETE' });
// };

// // Product Service
// export const productService = {
//   async getAll(params = {}) {
//     const queryParams = new URLSearchParams();
//     if (params.page) queryParams.append('page', params.page);
//     if (params.limit) queryParams.append('limit', params.limit);
//     if (params.search) queryParams.append('search', params.search);
//     if (params.category) queryParams.append('category', params.category);
//     if (params.status) queryParams.append('status', params.status);
//     if (params.sort) queryParams.append('sort', params.sort);
    
//     const query = queryParams.toString();
//     return get(`/admin/products${query ? `?${query}` : ''}`);
//   },

//   async getById(id) {
//     return get(`/admin/products/${id}`);
//   },

//   async create(data) {
//     return post('/admin/products', data);
//   },

//   async update(id, data) {
//     return put(`/admin/products/${id}`, data);
//   },

//   async delete(id) {
//     return del(`/admin/products/${id}`);
//   },

//   async bulkUpdate(productIds, updateData) {
//     return post('/admin/products/bulk-update', { productIds, updateData });
//   },

//   async updateStock(id, stock) {
//     return patch(`/admin/products/${id}/stock`, { stock });
//   },

//   async getLowStock(threshold = 10) {
//     return get(`/admin/products/low-stock?threshold=${threshold}`);
//   },
// };

















const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api/v1';

// API request helper for JSON
const apiRequest = async (endpoint, options = {}) => {
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
    
    // Handle empty responses
    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      data = { message: text || 'Unknown error' };
    }
    
    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }
    
    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// API methods for JSON
const get = (endpoint, options = {}) => apiRequest(endpoint, { ...options, method: 'GET' });
const post = (endpoint, body, options = {}) => apiRequest(endpoint, { ...options, method: 'POST', body: JSON.stringify(body) });
const put = (endpoint, body, options = {}) => apiRequest(endpoint, { ...options, method: 'PUT', body: JSON.stringify(body) });
const patch = (endpoint, body, options = {}) => apiRequest(endpoint, { ...options, method: 'PATCH', body: JSON.stringify(body) });
const del = (endpoint, options = {}) => apiRequest(endpoint, { ...options, method: 'DELETE' });

// FormData request helper for file uploads
const formDataRequest = async (endpoint, method, formData) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = localStorage.getItem('accessToken');
  
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
      throw new Error(data.message || 'Something went wrong');
    }
    
    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Product Service
export const productService = {
  // Get all products with filters
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

  async getById(id) {
    return get(`/admin/products/${id}`);
  },

  // Create product - supports both JSON and FormData
  async create(data) {
    if (!data) throw new Error('Product data is required');
    
    if (data instanceof FormData) {
      return formDataRequest('/products', 'POST', data);
    }
    return post('/products', data);
  },

  // Update product - supports both JSON and FormData
  async update(id, data) {
    if (!id) throw new Error('Product ID is required');
    if (!data) throw new Error('Product data is required');
    
    if (data instanceof FormData) {
      return formDataRequest(`/products/${id}`, 'PUT', data);
    }
    return put(`/products/${id}`, data);
  },

  async delete(id) {
    return del(`/admin/products/${id}`);
  },

  async bulkUpdate(productIds, updateData) {
    return post('/admin/products/bulk-update', { productIds, updateData });
  },

  async updateStock(id, stock) {
    return patch(`/admin/products/${id}/stock`, { stock });
  },

  async getLowStock(threshold = 10) {
    return get(`/products/low-stock?threshold=${threshold}`);
  },
};