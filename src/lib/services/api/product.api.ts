import { request } from './axios.config';
import { ProductListResponse } from '../../../types/product';

export const productApi = {
  getAll: async (): Promise<ProductListResponse> => {
    const response = await request.get<ProductListResponse>('/product');
    return response.data;
  },

  getById: async (id: string) => {
    const response = await request.get(`/product/${id}`);
    return response.data;
  },

  create: async (payload: FormData) => {
    const response = await request.post('/product', payload, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  update: async (id: string, payload: FormData) => {
    const response = await request.put(`/product/${id}`, payload, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  delete: async (id: string) => {
    const response = await request.delete(`/product/${id}`);
    return response.data;
  },
};
