'use client';

import { useRouter } from 'next/navigation';
import { SignInPayload } from '@/types';
import { useState } from 'react';
import { isError } from '@/lib/utils/error.util';
import { authApi } from '@/lib/services/api/auth.api';
import { cookieService } from '@/lib/services/cookie.service';
import { storage } from '@/lib/services/storage';
import { message } from 'antd';

/**
 * @returns signIn()
 */
export function useSignIn() {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);

  const signIn = async (payload: SignInPayload) => {
    setLoading(true);
    try {
      if (!loading) {
        const response = await authApi.login(payload);
        storage.setToken(response.accessToken);
        cookieService.setAccessToken(response.accessToken);
        router.push('/home');
      }
    } catch (error) {
      setLoading(false);
      const errorMessage = isError(error)
        ? error.message
        : 'Failed operation please try again later';
      message.error(errorMessage);
      console.log(error);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    signIn,
  };
}
