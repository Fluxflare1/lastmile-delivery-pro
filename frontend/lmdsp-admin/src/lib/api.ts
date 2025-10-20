import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "https://api.lastmile-delivery-pro.com",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem("access_token");
  const tenant = localStorage.getItem("tenant_id");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  if (tenant) config.headers["X-Tenant-ID"] = tenant;
  config.headers["X-Client-Version"] = "1.0.0";
  return config;
});

api.interceptors.response.use(
  res => res,
  async error => {
    if (error.response?.status === 401) {
      const refresh = localStorage.getItem("refresh_token");
      if (refresh) {
        const res = await axios.post(`${api.defaults.baseURL}/api/v1/auth/refresh`, { refresh_token: refresh });
        const newToken = res.data.data.token;
        localStorage.setItem("access_token", newToken);
        error.config.headers.Authorization = `Bearer ${newToken}`;
        return api.request(error.config);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
