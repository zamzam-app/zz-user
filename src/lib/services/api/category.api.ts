import { withoutToken, request } from './axios.config';
import { CategoryListResponse } from '@/types/category';

export const categoryApi = {
  getAll: async (): Promise<CategoryListResponse> => {
    return withoutToken<CategoryListResponse>({
      method: 'GET',
      url: '/category',
    });
  },

  create: async (payload: { name: string; description?: string }) => {
    return request({
      method: 'POST',
      url: '/category',
      data: payload,
    });
  },

  update: async (
    id: string,
    payload: { name?: string; description?: string }
  ) => {
    return request({
      method: 'PATCH',
      url: `/category/${id}`,
      data: payload,
    });
  },

  remove: async (id: string) => {
    return request({
      method: 'DELETE',
      url: `/category/${id}`,
    });
  },
};
