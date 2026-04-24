// const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api/v1';

// export const api = {
//   async request(endpoint, options = {}) {
//     const url = `${API_BASE_URL}${endpoint}`;
    
//     const token = localStorage.getItem('accessToken');
    
//     const headers = {
//       'Content-Type': 'application/json',
//       ...options.headers,
//     };
    
//     if (token) {
//       headers['Authorization'] = `Bearer ${token}`;
//     }
    
//     const config = {
//       ...options,
//       headers,
//       credentials: 'include',
//     };
    
//     try {
//       const response = await fetch(url, config);
//       const data = await response.json();
      
//       if (!response.ok) {
//         throw new Error(data.message || 'Something went wrong');
//       }
      
//       return data;
//     } catch (error) {
//       console.error('API Error:', error);
//       throw error;
//     }
//   },
  
//   get(endpoint, options = {}) {
//     return this.request(endpoint, { ...options, method: 'GET' });
//   },
  
//   post(endpoint, body, options = {}) {
//     return this.request(endpoint, {
//       ...options,
//       method: 'POST',
//       body: JSON.stringify(body),
//     });
//   },
  
//   put(endpoint, body, options = {}) {
//     return this.request(endpoint, {
//       ...options,
//       method: 'PUT',
//       body: JSON.stringify(body),
//     });
//   },
  
//   delete(endpoint, options = {}) {
//     return this.request(endpoint, { ...options, method: 'DELETE' });
//   },
// };

// export default api;











const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api/v1';

export const api = {
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };
    
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
  },
  
  get: (endpoint, options) => api.request(endpoint, { ...options, method: 'GET' }),
  post: (endpoint, body, options) => api.request(endpoint, { ...options, method: 'POST', body: JSON.stringify(body) }),
  put: (endpoint, body, options) => api.request(endpoint, { ...options, method: 'PUT', body: JSON.stringify(body) }),
  patch: (endpoint, body, options) => api.request(endpoint, { ...options, method: 'PATCH', body: JSON.stringify(body) }),
  delete: (endpoint, options) => api.request(endpoint, { ...options, method: 'DELETE' }),
};

export default api;