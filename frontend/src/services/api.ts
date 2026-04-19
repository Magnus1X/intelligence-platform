import axios from "axios";

// Ensure baseURL always ends with /api
const rawUrl = import.meta.env.VITE_API_URL ?? "";
const baseURL = rawUrl
  ? rawUrl.replace(/\/api\/?$/, "") + "/api"  // normalize — avoid double /api
  : "/api";

const api = axios.create({ baseURL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
