import type { CreateRatingDto } from '@/types/rating';
import { request } from './axios.config';
import { ratingEndpoints } from './endpoints';

export const ratingApi = {
  create: async (payload: CreateRatingDto): Promise<unknown> => {
    return request({
      method: 'POST',
      url: ratingEndpoints.create,
      data: payload,
    });
  },
};
