"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axiosInstance";
import { parseApiError } from "../utils/errorHandler";

interface User { id: string; email: string; name: string; user_type: string; tenant_id?: string; }
interface Tenant { id: string; name: string; brand_logo: string; }

interface AuthContextType {
  user: User | null;
  tenant: Tenant | null;
  loading: boolean;
  login: (email: string, password: string, user_type: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);
export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [loading, setLoading] = useState(true);

  const showToast = (message: string) => {
    window.dispatchEvent(new CustomEvent("toast", { detail: message }));
  };

  const fetchProfile = async () => {
    try {
      const res = await api.get("/api/v1/auth/me");
      setUser(res.data.data.user);
      setTenant(res.data.data.tenant);
    } catch (err) {
      logout();
      const { message } = parseApiError(err);
      showToast(`Session expired: ${message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) fetchProfile();
    else setLoading(false);
  }, []);

  const login = async (email: string, password: string, user_type: string) => {
    try {
      const res = await api.post("/api/v1/auth/login", { email, password, user_type });
      const data = res.data.data;

      localStorage.setItem("access_token", data.token);
      localStorage.setItem("refresh_token", data.refresh_token);
      localStorage.setItem("tenant_id", data.tenant?.id || "");

      setUser(data.user);
      setTenant(data.tenant);

      showToast("Login successful!");
    } catch (err) {
      const { message } = parseApiError(err);
      showToast(`Login failed: ${message}`);
      throw err;
    }
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
    setTenant(null);
    showToast("You have been logged out.");
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ user, tenant, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
