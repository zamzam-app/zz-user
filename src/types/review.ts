/** One answered question in a review (no per-response complaint fields). */
export interface UserResponse {
  questionId: string;
  answer: string | string[] | number;
}

/** Payload for POST /review. Server computes overallRating; do not send it. */
export interface CreateReviewDto {
  formId: string;
  userId?: string;
  outletId: string;
  response: UserResponse[];
}

/** Minimal create response shape so we can read server-computed overallRating. */
export interface CreateReviewResponse {
  overallRating: number;
  [key: string]: unknown;
}
