

export interface User {
  id: string;
  email: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  role: string;
  profilePicture?: string;
  phone?: string | null;
  status?: number;
  title?: string;
  education?: string;
  coverImage?: string;
  city?: string;
  logo?: string;
  state?: string;
  postalCode?: string;
  uniId?: string;
  uniPhone?: string;
  website?: string;
  description?: string;
  street?: string;
  companyId?: string;
  roleId?: string;
  university?: {
    id: string;
    name: string;
    logo?: string;
  };
}

export type SignInPayload = {
  email: string;
  password: string;
};

export interface GenericApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

export interface ApiError {
  message: string;
  status: number;
  errors: Record<string, string[]> | null;
}

export interface SignUpPayload {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
}
