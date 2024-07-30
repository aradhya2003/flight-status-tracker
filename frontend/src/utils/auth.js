import { jwtDecode } from 'jwt-decode';  

export const authenticateUser = async (email, password) => {
  try {
    const response = await fetch('http://localhost:5000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: email, password }),
    });

    if (!response.ok) {
      throw new Error('Failed to authenticate');
    }

    const data = await response.json();
    localStorage.setItem('token', data.access_token);

    const userRole = data.role || 'user';
    localStorage.setItem('userRole', userRole);

    if (userRole === 'admin') {
      localStorage.setItem('isAdmin', 'true');
    } else {
      localStorage.removeItem('isAdmin');
    }


    window.location.href = 'http://localhost:3000/flight-status';

    return true;
  } catch (error) {
    console.error('Error authenticating user:', error);
    return false;
  }
};

export const registerUser = async (username, password) => {
  try {
    const response = await fetch('http://localhost:5000/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      throw new Error('Registration failed');
    }

    return response.json(); 
  } catch (error) {
    console.error('Registration request failed:', error);
    throw error;
  }
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('userRole'); 
  window.location.href = '/';
};
