export type QuestionType =
  | 'short_answer'
  | 'paragraph'
  | 'multiple_choice'
  | 'checkbox'
  | 'rating';

export interface FormOption {
  text: string;
}

export interface FormQuestion {
  _id: string;
  isActive: boolean;
  isDeleted: boolean;
  type: QuestionType;
  title: string;
  isRequired: boolean;
  options?: FormOption[];
  maxRatings?: number;
  starStep?: number;
  hint?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface FormData {
  _id: string;
  isActive: boolean;
  isDeleted: boolean;
  title: string;
  questions: FormQuestion[];
  version?: number;
  outletId?: string;
  createdAt?: string;
  updatedAt?: string;
}
