import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchProfile = async () => {
    try {
      const res = await axios.get('/api/auth/profile');
      setUser(res.data);
    } catch (error) {
      logout();
    } finally {
      setLoading(false);
    }
  };

  const sendOTP = async (phone) => {
    const res = await axios.post('/api/auth/send-otp', { phone });
    return res.data;
  };

  const verifyOTP = async (phone, otp) => {
    const res = await axios.post('/api/auth/verify-otp', { phone, otp });
    const { token, user } = res.data;
    localStorage.setItem('token', token);
    setToken(token);
    setUser(user);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    return res.data;
  };

  const updateProfile = async (data) => {
    const res = await axios.put('/api/auth/profile', data);
    setUser(res.data);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, sendOTP, verifyOTP, updateProfile, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
