/** Complaint status (review-level only). */
export type ComplaintStatus = 'pending' | 'resolved' | 'dismissed';

/** One answered question in a review (no per-response complaint fields). */
export interface UserResponse {
  questionId: string;
  answer: string | string[] | number;
}

/** Alias for API/list shapes. */
export type IUserResponse = UserResponse;

/** Payload for POST /review. Server computes overallRating; do not send it. */
export interface CreateReviewDto {
  formId: string;
  userId?: string;
  outletId: string;
  response: UserResponse[];
  isComplaint?: boolean;
  complaintReason?: string;
}

/** Minimal create response shape so we can read server-computed overallRating. */
export interface CreateReviewResponse {
  overallRating: number;
  [key: string]: unknown;
}

/** Full review resource (list/detail responses). */
export interface IReview {
  _id?: string;
  isActive: boolean;
  isDeleted: boolean;
  userId: string;
  outletId: string;
  userResponses: IUserResponse[];
  overallRating: number;
  formId?: string;
  isComplaint?: boolean;
  complaintStatus?: ComplaintStatus;
  complaintReason?: string;
  resolvedAt?: string;
  resolvedBy?: string;
  resolutionNotes?: string;
  createdAt?: string;
  updatedAt?: string;
}
