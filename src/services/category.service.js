
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api/v1';

// API request helper
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
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }
    
    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// API methods
const get = (endpoint, options = {}) => {
  return apiRequest(endpoint, { ...options, method: 'GET' });
};

const post = (endpoint, body, options = {}) => {
  return apiRequest(endpoint, { 
    ...options, 
    method: 'POST', 
    body: JSON.stringify(body) 
  });
};

const put = (endpoint, body, options = {}) => {
  return apiRequest(endpoint, { 
    ...options, 
    method: 'PUT', 
    body: JSON.stringify(body) 
  });
};

const patch = (endpoint, body, options = {}) => {
  return apiRequest(endpoint, { 
    ...options, 
    method: 'PATCH', 
    body: JSON.stringify(body) 
  });
};

const del = (endpoint, options = {}) => {
  return apiRequest(endpoint, { ...options, method: 'DELETE' });
};

// Category Service
export const categoryService = {
  async getAll(params = {}) {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.search) queryParams.append('search', params.search);
    if (params.parent) queryParams.append('parent', params.parent);
    
    const query = queryParams.toString();
    const endpoint = `/admin/categories${query ? `?${query}` : ''}`;
    
    return get(endpoint);
  },

  async getTree() {
    return get('/admin/categories/tree');
  },

  async getById(id) {
    return get(`/admin/categories/${id}`);
  },

  async create(data) {
    return post('/admin/categories', data);
  },

  async update(id, data) {
    return put(`/admin/categories/${id}`, data);
  },

  async delete(id) {
    return del(`/admin/categories/${id}`);
  },

  async reorder(categories) {
    return post('/admin/categories/reorder', { categories });
  },
};






