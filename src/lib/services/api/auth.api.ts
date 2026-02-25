import { SignInPayload, AuthResponse } from '@/types';
import { authEndpoints } from './endpoints';
import { request, withoutToken } from './axios.config';

export type VerifyOtpPayload = {
  phoneNumber: string;
  otp: string;
};

export const authApi = {
  login: async (payload: SignInPayload): Promise<AuthResponse> => {
    return request<AuthResponse>({
      method: 'POST',
      url: authEndpoints.login,
      data: payload,
    });
  },

  logout: async (): Promise<{ message: string }> => {
    return request({
      method: 'POST',
      url: authEndpoints.logout,
    });
  },

  verifyOtp: async (payload: VerifyOtpPayload): Promise<AuthResponse> => {
    return withoutToken<AuthResponse>({
      method: 'POST',
      url: authEndpoints.verifyOtp,
      data: payload,
    });
  },
};
