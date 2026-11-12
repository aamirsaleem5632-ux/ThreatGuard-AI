'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { api, setAuthToken, getAuthToken } from '@/lib/api';
import { User, AuthResponse } from '@/lib/types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<AuthResponse>;
  register: (payload: {
    fullName: string;
    email: string;
    password: string;
    confirmPassword?: string;
    organizationName?: string;
  }) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<User | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = useCallback(async (): Promise<User | null> => {
    const existingToken = getAuthToken();
    if (!existingToken) {
      setUser(null);
      setToken(null);
      setIsLoading(false);
      return null;
    }

    try {
      const currentUser = await api.getCurrentUser();
      setUser(currentUser);
      setToken(existingToken);
      return currentUser;
    } catch (err) {
      console.warn('Session expired or invalid:', err);
      setAuthToken(null);
      setUser(null);
      setToken(null);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = async (email: string, password: string, rememberMe: boolean = false): Promise<AuthResponse> => {
    setIsLoading(true);
    try {
      const res = await api.login({ email, password, remember_me: rememberMe });
      setUser(res.user);
      setToken(res.access_token);
      return res;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (payload: {
    fullName: string;
    email: string;
    password: string;
    confirmPassword?: string;
    organizationName?: string;
  }): Promise<AuthResponse> => {
    setIsLoading(true);
    try {
      const res = await api.register({
        full_name: payload.fullName,
        email: payload.email,
        password: payload.password,
        confirm_password: payload.confirmPassword,
        organization_name: payload.organizationName
      });
      setUser(res.user);
      setToken(res.access_token);
      return res;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await api.logout();
    } catch (e) {
      // Clear local state regardless of backend response
      setAuthToken(null);
    } finally {
      setUser(null);
      setToken(null);
      setIsLoading(false);
      router.push('/login');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        refreshUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

