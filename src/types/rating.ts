export interface ResponseDto {
  questionId: string;
  answer: string | string[] | number;
  isComplaint?: boolean;
}

export type RatingType = 'complaint' | 'review';

export interface CreateRatingDto {
  formId: string;
  userId: string;
  outletId: string;
  response: ResponseDto[];
  totalRatings?: number;
  overallRating?: number;
  type?: RatingType;
}
