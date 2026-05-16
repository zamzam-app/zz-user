import { withoutToken } from './axios.config';
import { uploadedCakesEndpoints } from './endpoints';

export interface CreateUploadedCakePayload {
  prompt: string;
  imageUrl: string;
  phone: string;
  dob?: string;
  gender?: string;
}

export interface UploadedCakeResponse {
  _id: string;
  userId: string;
  prompt: string;
  imageUrl: string;
  phone: string;
  dob?: string;
  gender?: string;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export const uploadedCakesApi = {
  create: async (
    payload: CreateUploadedCakePayload
  ): Promise<UploadedCakeResponse> => {
    return withoutToken<UploadedCakeResponse>({
      method: 'POST',
      url: uploadedCakesEndpoints.create,
      data: payload,
      skipAuthRedirect: true,
    });
  },
};
