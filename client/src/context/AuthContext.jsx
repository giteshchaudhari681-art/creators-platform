import { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {

    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      try {

        setToken(storedToken);
        setUser(JSON.parse(storedUser));

      } catch (error) {

        console.error('Error parsing user data:', error);

        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }

    setLoading(false);

  }, []);

  const login = (userData, userToken) => {

    setUser(userData);
    setToken(userToken);

    localStorage.setItem('token', userToken);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {

    setUser(null);
    setToken(null);

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
    loading,
    login,
    logout,
    isAuthenticated
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {

  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
};