import type {
  CreateReviewDto,
  CreateReviewResponse,
  SubmitReviewWithOtpDto,
} from '@/types/review';
import { request, withoutToken } from './axios.config';
import { reviewEndpoints } from './endpoints';

export const reviewApi = {
  create: async (payload: CreateReviewDto): Promise<CreateReviewResponse> => {
    return request({
      method: 'POST',
      url: reviewEndpoints.create,
      data: payload,
    });
  },

  submitWithOtp: async (
    payload: SubmitReviewWithOtpDto
  ): Promise<CreateReviewResponse> => {
    return withoutToken({
      method: 'POST',
      url: reviewEndpoints.submitWithOtp,
      data: payload,
      skipAuthRedirect: true,
    });
  },
};
