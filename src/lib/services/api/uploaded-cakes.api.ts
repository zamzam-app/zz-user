import { withoutToken } from './axios.config';
import { uploadedCakesEndpoints } from './endpoints';

export interface CreateUploadedCakePayload {
  name: string;
  phone: string;
  referenceImageUrl: string;
  description: string;
}

export interface UploadedCakeResponse {
  _id: string;
  userId: string;
  name: string;
  phone: string;
  referenceImageUrl: string;
  description: string;
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
