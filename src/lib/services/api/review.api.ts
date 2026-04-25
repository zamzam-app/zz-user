import type {
  CreateReviewDto,
  CreateReviewResponse,
  QueryRatingsSummaryDto,
  QueryReviewDto,
  RatingsSummaryResponse,
  ReviewListResponse,
  SubmitReviewWithOtpDto,
} from '@/types/review';
import { request, withoutToken } from './axios.config';
import { reviewEndpoints } from './endpoints';

export const reviewApi = {
  getAll: async (query: QueryReviewDto = {}): Promise<ReviewListResponse> => {
    return request<ReviewListResponse>({
      method: 'GET',
      url: reviewEndpoints.list,
      params: query,
    });
  },

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

  getRatingsSummary: async (
    query: QueryRatingsSummaryDto = {}
  ): Promise<RatingsSummaryResponse> => {
    return withoutToken<RatingsSummaryResponse>({
      method: 'GET',
      url: reviewEndpoints.ratingSummary,
      params: query,
      skipAuthRedirect: true,
    });
  },
};
