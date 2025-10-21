'use client';

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { User, Tenant, LoginCredentials } from '@/types';
import { apiClient } from '@/lib/api';
import { AuthService } from '@/lib/auth';

interface AuthContextType {
  user: User | null;
  tenant: Tenant | null;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    if (AuthService.isAuthenticated()) {
      try {
        const userData = await apiClient.getCurrentUser();
        setUser(userData.user);
        setTenant(userData.tenant);
      } catch (error) {
        // Token might be invalid, clear storage
        AuthService.clearTokens();
      }
    }
    setIsLoading(false);
  };

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    try {
      const authResponse = await apiClient.login(credentials);
      
      AuthService.setToken(authResponse.token);
      AuthService.setRefreshToken(authResponse.refresh_token);
      if (authResponse.tenant?.id) {
        AuthService.setTenantId(authResponse.tenant.id);
      }
      
      setUser(authResponse.user);
      setTenant(authResponse.tenant);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await apiClient.logout();
    } catch (error) {
      // Continue with logout even if API call fails
    } finally {
      AuthService.clearTokens();
      setUser(null);
      setTenant(null);
      setIsLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    tenant,
    isLoading,
    login,
    logout,
    isAuthenticated: AuthService.isAuthenticated(),
  };

  return (
    <AuthContext.Provider value={value}>
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
