import type { FormData } from '@/types/form';
import { withoutToken } from './axios.config';
import { formEndpoints } from './endpoints';

export const formApi = {
  getFormById: async (id: string): Promise<FormData> => {
    return withoutToken<FormData>({
      method: 'GET',
      url: formEndpoints.getById(id),
    });
  },
};
