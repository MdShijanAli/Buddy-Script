import axios from "axios";
import type {
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosResponse,
  AxiosRequestConfig,
} from "axios";
import { apiRoutes } from "./apiRoutes";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "";

let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;

const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
});

// Request interceptor to attach access token
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("authToken");
    if (token && config && config.headers) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Helper to refresh token once and queue requests
async function refreshAccessToken(): Promise<string | null> {
  if (isRefreshing && refreshPromise) return refreshPromise;
  isRefreshing = true;
  refreshPromise = new Promise((resolve) => {
    (async () => {
      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) {
          localStorage.removeItem("authToken");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("user");
          resolve(null);
          isRefreshing = false;
          refreshPromise = null;
          return;
        }

        const resp = await axios.post(apiRoutes.auth.refreshToken, {
          refresh_token: refreshToken,
        });

        const data = resp?.data;
        const newAccess = data?.access_token ?? null;
        const newRefresh = data?.refresh_token ?? null;

        if (newAccess || newRefresh) {
          if (newAccess) localStorage.setItem("authToken", newAccess);
          if (newRefresh) localStorage.setItem("refreshToken", newRefresh);
        }

        resolve(newAccess);
      } catch (err) {
        localStorage.removeItem("authToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
        resolve(null);
      } finally {
        isRefreshing = false;
        refreshPromise = null;
      }
    })();
  });

  return refreshPromise;
}

// Response interceptor to handle 401 and try refresh
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error) => {
    const originalRequest = error?.config;
    if (!originalRequest) return Promise.reject(error);

    // If unauthorized, try to refresh token once
    if (error?.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const newAccess = await refreshAccessToken();
      if (newAccess) {
        originalRequest.headers["Authorization"] = `Bearer ${newAccess}`;
        return axiosInstance(originalRequest);
      }
      // No token -> redirect to login
      window.location.href = "/login";
    }

    return Promise.reject(error);
  },
);

// Simple helpers
const apiClient = {
  instance: axiosInstance,
  get: <T = unknown>(url: string, config?: AxiosRequestConfig) =>
    axiosInstance.get<T>(url, config),
  post: <T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ) => axiosInstance.post<T>(url, data, config),
  put: <T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ) => axiosInstance.put<T>(url, data, config),
  patch: <T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ) => axiosInstance.patch<T>(url, data, config),
  delete: <T = unknown>(url: string, config?: AxiosRequestConfig) =>
    axiosInstance.delete<T>(url, config),
};

export default apiClient;
