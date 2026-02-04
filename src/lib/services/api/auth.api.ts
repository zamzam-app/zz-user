import { SignInPayload, AuthResponse } from '@/types';
import { authEndpoints } from './endpoints';
import { request } from './axios.config';

export const authApi = {
  login: async (payload: SignInPayload): Promise<AuthResponse> => {
    return request<AuthResponse>({
      method: 'POST',
      url: authEndpoints.login,
      data: payload,
    });
  },

  logout: async () => {
    return request({
      method: 'POST',
      url: authEndpoints.logout,
    });
  },
};
