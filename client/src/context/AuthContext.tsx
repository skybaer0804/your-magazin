'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { api } from '@/utils/api';
import { getToken, setToken, setUser, getUser, logout as authLogout } from '@/utils/auth';
import { User } from '@/types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    const token = getToken();
    if (!token) {
      setUserState(null);
      setLoading(false);
      return;
    }
    try {
      const { data } = await api.get('/auth/me');
      setUserState(data);
      setUser(data);
    } catch {
      setUserState(null);
      authLogout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = getToken();
    if (token) {
      refreshUser();
    } else {
      const savedUser = getUser();
      setUserState(savedUser);
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const { data } = await api.post('/auth/login', { email, password });
    setToken(data.token);
    setUser(data.user);
    setUserState(data.user);
  };

  const register = async (email: string, password: string, name: string) => {
    const { data } = await api.post('/auth/register', { email, password, name });
    setToken(data.token);
    setUser(data.user);
    setUserState(data.user);
  };

  const logout = () => {
    authLogout();
    setUserState(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
