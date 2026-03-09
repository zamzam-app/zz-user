import type { CreateReviewDto, CreateReviewResponse } from '@/types/review';
import { request } from './axios.config';
import { reviewEndpoints } from './endpoints';

export const reviewApi = {
  create: async (payload: CreateReviewDto): Promise<CreateReviewResponse> => {
    return request({
      method: 'POST',
      url: reviewEndpoints.create,
      data: payload,
    });
  },
};
