// // src/services/product.service.js

// const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api/v1';

// // API request helper for JSON
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
//       // ✅ Create error with full details
//       const error = new Error(data.message || 'Something went wrong');
//       error.status = response.status;
//       error.data = data;
//       error.errors = data.errors;
//       throw error;
//     }
    
//     // ✅ Return full response structure
//     return {
//       success: data.success,
//       data: data.data,
//       message: data.message,
//       pagination: data.pagination
//     };
//   } catch (error) {
//     console.error('API Error:', error.message || error);
//     throw error;
//   }
// };

// // API methods for JSON
// const get = (endpoint, options = {}) => 
//   apiRequest(endpoint, { ...options, method: 'GET' });
  
// const post = (endpoint, body, options = {}) => 
//   apiRequest(endpoint, { ...options, method: 'POST', body: JSON.stringify(body) });
  
// const put = (endpoint, body, options = {}) => 
//   apiRequest(endpoint, { ...options, method: 'PUT', body: JSON.stringify(body) });
  
// const patch = (endpoint, body, options = {}) => 
//   apiRequest(endpoint, { ...options, method: 'PATCH', body: JSON.stringify(body) });
  
// const del = (endpoint, options = {}) => 
//   apiRequest(endpoint, { ...options, method: 'DELETE' });

// // FormData request helper for file uploads
// const formDataRequest = async (endpoint, method, formData) => {
//   const url = `${API_BASE_URL}${endpoint}`;
//   const token = localStorage.getItem('accessToken');
  
//   const headers = {};
//   if (token) {
//     headers['Authorization'] = `Bearer ${token}`;
//   }
  
//   try {
//     const response = await fetch(url, {
//       method,
//       headers,
//       credentials: 'include',
//       body: formData,
//     });
    
//     const data = await response.json();
    
//     if (!response.ok) {
//       // ✅ Proper error with full details
//       const error = new Error(data.message || 'Something went wrong');
//       error.status = response.status;
//       error.data = data;
//       error.errors = data.errors;
//       throw error;
//     }
    
//     // ✅ Return full response
//     return {
//       success: data.success,
//       data: data.data,
//       message: data.message,
//       pagination: data.pagination
//     };
//   } catch (error) {
//     console.error('API Error:', error.message || error);
//     throw error;
//   }
// };

// // Product Service
// export const productService = {
//   // Get all products with filters
//   async getAll(params = {}) {
//     const queryParams = new URLSearchParams();
//     if (params.page) queryParams.append('page', params.page);
//     if (params.limit) queryParams.append('limit', params.limit);
//     if (params.search) queryParams.append('search', params.search);
//     if (params.category) queryParams.append('category', params.category);
//     if (params.status) queryParams.append('status', params.status);
//     if (params.sort) queryParams.append('sort', params.sort);
    
//     const query = queryParams.toString();
//     // ✅ FIX: Remove /admin prefix - your routes are at /products
//     return get(`/products${query ? `?${query}` : ''}`);
//   },

//   // Get single product by ID
//   async getById(id) {
//     // ✅ FIX: Remove /admin prefix
//     return get(`/products/${id}`);
//   },

//   // Create product - supports both JSON and FormData
//   async create(data) {
//     // ✅ FIX: Remove /admin prefix
//     if (data instanceof FormData) {
//       return formDataRequest('/products', 'POST', data);
//     }
//     return post('/products', data);
//   },

//   // Update product - supports both JSON and FormData
//   async update(id, data) {
//     // ✅ FIX: Remove /admin prefix
//     if (data instanceof FormData) {
//       return formDataRequest(`/products/${id}`, 'PUT', data);
//     }
//     return put(`/products/${id}`, data);
//   },

//   // Delete product
//   async delete(id) {
//     // ✅ FIX: Remove /admin prefix
//     return del(`/products/${id}`);
//   },

//   // Bulk update products
//   async bulkUpdate(productIds, updateData) {
//     return post('/products/bulk-update', { productIds, updateData });
//   },

//   // Update product stock
//   async updateStock(id, stock) {
//     return patch(`/products/${id}/stock`, { stock });
//   },

//   // Get low stock products
//   async getLowStock(threshold = 10) {
//     return get(`/products/low-stock?threshold=${threshold}`);
//   },
// };











// src/services/product.service.js

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api/v1';

// ✅ Helper to get token from multiple sources
const getToken = () => {
  // Try localStorage first
  let token = localStorage.getItem('accessToken');
  
  // If not in localStorage, try cookies
  if (!token) {
    token = localStorage.getItem('adminToken'); // Alternative name
  }
  
  // If not in localStorage, try sessionStorage
  if (!token) {
    token = sessionStorage.getItem('accessToken');
  }
  
  return token;
};

// API request helper for JSON
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getToken(); // ✅ Use helper function
  
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
      const error = new Error(data.message || 'Something went wrong');
      error.status = response.status;
      error.data = data;
      throw error;
    }
    
    return {
      success: data.success,
      data: data.data,
      message: data.message,
      pagination: data.pagination
    };
  } catch (error) {
    console.error('API Error:', error.message || error);
    throw error;
  }
};

// FormData request helper
const formDataRequest = async (endpoint, method, formData) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getToken(); // ✅ Use helper function
  
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
    
    const data = await response.json();
    
    if (!response.ok) {
      const error = new Error(data.message || 'Something went wrong');
      error.status = response.status;
      error.data = data;
      throw error;
    }
    
    return {
      success: data.success,
      data: data.data,
      message: data.message,
      pagination: data.pagination
    };
  } catch (error) {
    console.error('API Error:', error.message || error);
    throw error;
  }
};

// Rest of your code remains the same...
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

// Product Service
export const productService = {
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
    return get(`/products/${id}`);
  },

  async create(data) {
    if (data instanceof FormData) {
      return formDataRequest('/products', 'POST', data);
    }
    return post('/products', data);
  },

  async update(id, data) {
    if (data instanceof FormData) {
      return formDataRequest(`/products/${id}`, 'PUT', data);
    }
    return put(`/products/${id}`, data);
  },

  async delete(id) {
    return del(`/products/${id}`);
  },

  async bulkUpdate(productIds, updateData) {
    return post('/products/bulk-update', { productIds, updateData });
  },

  async updateStock(id, stock) {
    return patch(`/products/${id}/stock`, { stock });
  },

  async getLowStock(threshold = 10) {
    return get(`/products/low-stock?threshold=${threshold}`);
  },
};
