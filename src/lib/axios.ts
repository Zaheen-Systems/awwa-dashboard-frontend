// src/lib/axios.ts
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // ✅ get from .env
  headers: {
    "Content-Type": "application/json",
  },
});

// Optional: Add interceptor for auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // or get from your useAuth()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
