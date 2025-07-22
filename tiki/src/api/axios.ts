import { env } from '@/lib/env';
import { ROUTES } from '@/lib/routes';
import { useAuthStore } from '@/stores/authStore';
import type { PaginatedResponse, SuccessResponse } from '@/types';
import axios, { type AxiosResponse, type InternalAxiosRequestConfig } from 'axios';
import { refreshTokenRequest } from './auth/request';

let refreshTokenPromise: Promise<string | null> | null = null;

const instance = axios.create({
  baseURL: env.API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  },
});

const onRefreshToken = async (): Promise<string | null> => {
  const store = useAuthStore.getState();
  const refreshToken = store.refreshToken;

  if (!refreshToken) {
    store.clearAuth();
    return null;
  }

  try {
    const res = await refreshTokenRequest(refreshToken);
    if (!res?.token || !res?.refreshToken) {
      return null;
    }
    store.setToken(res.token);
    store.setRefreshToken(res.refreshToken);
    return res?.token;
  } catch (e: any) {
    console.error('Refresh token error:', e);
    store.clearAuth();
    window.location.href = ROUTES.HOME;
    return null;
  }
};

const handleError = async (error: any) => {
  const originalRequest = error.config;
  const dataAxios = error?.response;

  if ((dataAxios?.status === 401 || dataAxios?.data?.meta?.error === 'Unauthorized') && !originalRequest._retry) {
    originalRequest._retry = true;

    if (!refreshTokenPromise) {
      refreshTokenPromise = onRefreshToken();
    }

    try {
      const token = await refreshTokenPromise;
      refreshTokenPromise = null;

      if (token) {
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return instance(originalRequest);
      }
    } catch (e) {
      refreshTokenPromise = null;
      return Promise.reject(error);
    }
  }

  const { data } = error?.response || {};
  return Promise.reject(data?.data || data?.meta || error);
};

// Request interceptor
instance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = useAuthStore.getState().token;
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
instance.interceptors.response.use((response: AxiosResponse) => {
  const { statusCode } = response.data || {};
  if (statusCode === 200) {
    return response.data;
  }
  return response;
}, handleError);

export default instance;

export const getSuccessResponse = <T>(data: AxiosResponse) => {
  const res = data as unknown as SuccessResponse<T>;
  return res.data;
};

export const getPaginatedResponse = <T>(data: AxiosResponse) => {
  const res = data as unknown as PaginatedResponse<T>;
  return {
    items: res.data.items,
    meta: res.data.meta,
  };
};
