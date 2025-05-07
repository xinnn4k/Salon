const API_URL = 'https://your-api-url.com/api'; // Replace with your API URL

export const api = {
  // Get the auth token from localStorage
  getToken: () => localStorage.getItem('authToken'),

  // Headers for authenticated requests
  authHeaders: () => ({
    Authorization: `Bearer ${localStorage.getItem('authToken')}`,
    'Content-Type': 'application/json',
  }),

  // Generic request method
  async request(endpoint: string, method = 'GET', data: any = null) {
    const url = `${API_URL}${endpoint}`;
    const options: RequestInit = {
      method,
      headers: this.authHeaders(),
    };

    if (data) {
      options.body = JSON.stringify(data);
    }

    const response = await fetch(url, options);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'API request failed');
    }
    
    return response.json();
  },

  // Auth methods
  auth: {
    login: (email: string, password: string) => 
      api.request('/auth/login', 'POST', { email, password }),
    
    register: (email: string, password: string, name: string) => 
      api.request('/auth/register', 'POST', { email, password, name }),
    
    logout: () => api.request('/auth/logout', 'POST'),
    
    getCurrentUser: () => api.request('/auth/me'),
  },
};