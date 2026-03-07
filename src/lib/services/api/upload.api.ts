import { request } from './axios.config';
import { UPLOAD } from './endpoints';
import type { SignatureResponse } from '@/types/upload';

export async function getUploadSignature(
  folder?: string
): Promise<SignatureResponse> {
  return request<SignatureResponse>({
    method: 'GET',
    url: UPLOAD.SIGNATURE,
    params: folder ? { folder } : undefined,
  });
}
