"use client";

import { useState, useEffect, createContext, useContext } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const res = await api.get('/auth/me');
      setUser(res.data);
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    await api.post('/auth/login', { email, password });
    await checkUser();
    router.push('/dashboard');
  };

  const signup = async (email, password, fullName) => {
    await api.post('/auth/signup', { email, password, full_name: fullName });
    await login(email, password);
  };

  const logout = async () => {
    await api.post('/auth/logout');
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
