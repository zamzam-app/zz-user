import { SignInPayload, AuthResponse } from '@/types';
import { authEndpoints } from './endpoints';
import { request, withoutToken } from './axios.config';

export type RequestOtpPayload = {
  phoneNumber: string;
};

export type VerifyOtpPayload = {
  phoneNumber: string;
  otp: string;
  name?: string;
  email?: string;
  dob?: string;
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

  requestOtp: async (
    payload: RequestOtpPayload
  ): Promise<{ message: string }> => {
    return withoutToken({
      method: 'POST',
      url: authEndpoints.requestOtp,
      data: payload,
      skipAuthRedirect: true,
    });
  },

  verifyOtp: async (payload: VerifyOtpPayload): Promise<AuthResponse> => {
    return withoutToken<AuthResponse>({
      method: 'POST',
      url: authEndpoints.verifyOtp,
      data: payload,
      skipAuthRedirect: true,
    });
  },
};
