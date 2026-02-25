import { request, fileUploadRequest } from './axios.config';
import { ProductListResponse } from '../../../types/product';

export const productApi = {
  getAll: async (): Promise<ProductListResponse> => {
    return request<ProductListResponse>({
      method: 'GET',
      url: '/product',
    });
  },

  getById: async (id: string) => {
    return request({
      method: 'GET',
      url: `/product/${id}`,
    });
  },

  create: async (payload: FormData) => {
    return fileUploadRequest({
      method: 'POST',
      url: '/product',
      data: payload,
    });
  },

  update: async (id: string, payload: FormData) => {
    return fileUploadRequest({
      method: 'PUT',
      url: `/product/${id}`,
      data: payload,
    });
  },

  delete: async (id: string) => {
    return request({
      method: 'DELETE',
      url: `/product/${id}`,
    });
  },
};
