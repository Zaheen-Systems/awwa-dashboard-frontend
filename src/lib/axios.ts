// src/lib/axios.ts
import axios from "axios";
import { parseISO } from "date-fns";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // ✅ get from .env
  headers: {
    "Content-Type": "application/json",
  },
});

// Optional: Add interceptor for auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // or get from your useAuth()
  console.log(token)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle date parsing
// This ensures dates are parsed consistently regardless of timezone
api.interceptors.response.use((response) => {
  if (response.data) {
    response.data = parseDates(response.data);
  }
  return response;
});

// Recursively parse ISO date strings to Date objects
function parseDates(data: any): any {
  if (data === null || data === undefined) {
    return data;
  }

  if (typeof data === "string") {
    // ISO 8601 date format regex
    const isoDateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?$/;
    if (isoDateRegex.test(data)) {
      return parseISO(data);
    }
    return data;
  }

  if (Array.isArray(data)) {
    return data.map(parseDates);
  }

  if (typeof data === "object") {
    const parsed: any = {};
    for (const key in data) {
      parsed[key] = parseDates(data[key]);
    }
    return parsed;
  }

  return data;
}

export default api;
