
// services/api.js
import Cookies from 'js-cookie';

// const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api/v1';
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api/v1/admin';
export const api = {
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const token = Cookies.get('accessToken') || 
                  (typeof window !== 'undefined' && localStorage.getItem('accessToken'));
    
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
    };
    
    console.log(`🌐 API ${options.method || 'GET'} ${url}`);
    
    try {
      const response = await fetch(url, config);
      const data = await response.json();
      
      console.log(`📦 Response from ${endpoint}:`, data);
      
      if (!response.ok) {
        if (response.status === 401) {
          console.error('401 Unauthorized');
        }
        throw new Error(data.message || data.error || 'Something went wrong');
      }
      
      return data;
    } catch (error) {
      console.error(`❌ API Error (${endpoint}):`, error.message);
      throw error;
    }
  },
  
  get: (endpoint, options = {}) => 
    api.request(endpoint, { ...options, method: 'GET' }),
    
  post: (endpoint, body, options = {}) => 
    api.request(endpoint, { ...options, method: 'POST', body: JSON.stringify(body) }),
    
  put: (endpoint, body, options = {}) => 
    api.request(endpoint, { ...options, method: 'PUT', body: JSON.stringify(body) }),
    
  patch: (endpoint, body, options = {}) => 
    api.request(endpoint, { ...options, method: 'PATCH', body: JSON.stringify(body) }),
    
  delete: (endpoint, options = {}) => 
    api.request(endpoint, { ...options, method: 'DELETE' }),
};

export default api;