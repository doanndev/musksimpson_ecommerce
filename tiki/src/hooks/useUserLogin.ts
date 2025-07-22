'use client';

import { useCurrentUserQuery } from '@/api/user/query';
import { useAuthStore } from '@/stores/authStore';
import { useEffect } from 'react';

export const useUserLogin = () => {
  const { token, refreshToken, setUser, clearAuth } = useAuthStore();

  const { data, refetch, isError, ...rest } = useCurrentUserQuery();

  useEffect(() => {
    if (data) {
      setUser(data);
    }
  }, [data, setUser]);

  useEffect(() => {
    if (isError) {
      clearAuth();
    }
  }, [isError]);

  return {
    isLoggedIn: Boolean(data),
    user: data,
    token: token || '',
    refreshToken: refreshToken || '',
    refetch,
    ...rest,
  };
};
