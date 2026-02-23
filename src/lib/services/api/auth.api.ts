import { SignInPayload, AuthResponse } from '@/types';
import { authEndpoints } from './endpoints';
import { request } from './axios.config';

export const authApi = {
  login: async (payload: SignInPayload): Promise<AuthResponse> => {
    const response = await request<AuthResponse>({
      method: 'POST',
      url: authEndpoints.login,
      data: payload,
    });

    return response.data;
  },

  logout: async () => {
    const response = await request({
      method: 'POST',
      url: authEndpoints.logout,
    });

    return response.data;
  },
};