import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './authContextObject';

const readStoredAuth = () => {
  const storedToken = localStorage.getItem('token');
  const storedUser = localStorage.getItem('user');

  if (!storedToken || !storedUser) {
    return { user: null, token: null };
  }

  try {
    return {
      token: storedToken,
      user: JSON.parse(storedUser),
    };
  } catch (error) {
    console.error('Error parsing user data:', error);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return { user: null, token: null };
  }
};

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState(readStoredAuth);

  const navigate = useNavigate();
  const { user, token } = authState;

  const login = (userData, userToken) => {
    setAuthState({ user: userData, token: userToken });

    localStorage.setItem('token', userToken);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setAuthState({ user: null, token: null });

    localStorage.removeItem('token');
    localStorage.removeItem('user');

    navigate('/login');
  };

  const isAuthenticated = () => {

    return !!token && !!user;
  };

  const value = {
    user,
    token,
    loading: false,
    login,
    logout,
    isAuthenticated,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
