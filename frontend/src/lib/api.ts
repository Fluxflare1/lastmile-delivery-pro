import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1",
});

api.interceptors.request.use((config) => {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});



// frontend/src/lib/api.ts
axios.interceptors.request.use((config) => {
  config.headers['X-Tenant-ID'] = process.env.NEXT_PUBLIC_TENANT_ID || 'global';
  config.headers['X-Correlation-ID'] = crypto.randomUUID();
  return config;
});
