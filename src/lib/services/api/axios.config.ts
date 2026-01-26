import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosProgressEvent,
} from 'axios';
import { cookieService } from '../cookie.service';
import { ApiError } from '@/types';

const baseURL = process.env.NEXT_PUBLIC_BASE_URL || '/api';

interface ApiOptions extends AxiosRequestConfig {
  url?: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  data?: unknown;
}

const onSuccess = (response: AxiosResponse): unknown => {
  const newAccessToken =
    response.headers['new-access-token'] ||
    response.headers['New-Access-Token'];

  if (newAccessToken) {
    cookieService.setAccessToken(newAccessToken);
  }

  return {
    ...response.data,
    status: response.status,
  };
};

const onError = (error: AxiosError<ApiError>): never => {
  if (error?.status === 401 || error?.response?.status === 401) {
    window.location.href = `/login`;
    localStorage.clear();
  }

  if (error?.code === 'ERR_NETWORK') {
    throw {
      message: 'Network error. Please check your connection.',
      status: 0,
      errors: null,
    } satisfies ApiError;
  }
  throw (
    error?.response?.data ?? {
      message: 'Unexpected error',
      status: error.response?.status ?? 500,
      errors: null,
    }
  );
};

const createClient = (headers?: Record<string, string>): AxiosInstance =>
  axios.create({
    baseURL,
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  });

export async function apiRequest<T = unknown>({
  ...options
}: ApiOptions): Promise<T> {
  const token = cookieService.getAccessToken() ?? '';
  const client = createClient(
    token ? { Authorization: `Bearer ${token}` } : undefined
  );

  return client(options).then(onSuccess).catch(onError) as Promise<T>;
}

export async function withoutToken<T = unknown>({
  ...options
}: ApiOptions): Promise<T> {
  const client = createClient();
  return client(options).then(onSuccess).catch(onError) as Promise<T>;
}

export async function fileUploadRequest<T = unknown>({
  ...options
}: ApiOptions): Promise<T> {
  const token = cookieService.getAccessToken() ?? '';

  const client = axios.create({
    baseURL,
    withCredentials: true,
    headers: {
      'Content-Type': 'multipart/form-data',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  return client(options).then(onSuccess).catch(onError) as Promise<T>;
}

export async function uploadToPresignedUrl(
  uploadUrl: string,
  file: File,
  onProgress?: (percent: number) => void
) {
  return axios.put(uploadUrl, file, {
    headers: {
      'Content-Type': file.type,
    },
    onUploadProgress: (progressEvent: AxiosProgressEvent) => {
      if (!onProgress || !progressEvent.total) return;
      const percent = Math.round(
        (progressEvent.loaded * 100) / progressEvent.total
      );
      onProgress(percent);
    },
  });
}

export const request = apiRequest;

export { baseURL };
