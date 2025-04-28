const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/auth';



// Register a new user
export const register = async (userData) => {
  const response = await fetch(`${API_URL}/api/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.detail || 'Registration failed');
  }
  
  return data;
};

// Login and get token
export const login = async (email, password) => {
  // Create form data (as per API specification)
  const formData = new URLSearchParams();
  formData.append('username', email);
  formData.append('password', password);
  
  const response = await fetch(`${API_URL}/api/auth/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: formData.toString(),
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.detail || 'Login failed');
  }
  
  return data;
};

// Logout user
export const logout = async () => {
  // Get token from localStorage
  const token = JSON.parse(localStorage.getItem('heliaUser'))?.token;
  
  if (token) {
    try {
      const response = await fetch(`${API_URL}/api/auth/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        const data = await response.json();
        console.error('Logout error:', data.detail || 'Logout failed on server');
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  }
  
  // Even if the server request fails, we should clear local storage
  return true;
};

// Get current user profile
export const getProfile = async () => {
  // Get token from localStorage
  const token = JSON.parse(localStorage.getItem('heliaUser'))?.token;
  
  if (!token) {
    throw new Error('No authentication token found');
  }
  
  const response = await fetch(`${API_URL}/api/auth/me`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.detail || 'Failed to get profile');
  }
  
  return data;
};