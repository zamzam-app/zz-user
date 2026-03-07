import type { SignatureResponse, CloudinaryUploadResult } from '@/types/upload';

export async function uploadImageToCloudinary(
  file: File,
  params: SignatureResponse
): Promise<CloudinaryUploadResult> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('api_key', params.apiKey);
  formData.append('timestamp', String(params.timestamp));
  formData.append('signature', params.signature);
  formData.append('folder', params.folder);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${params.cloudName}/image/upload`,
    { method: 'POST', body: formData }
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    const message =
      (err as { error?: { message?: string } })?.error?.message ||
      res.statusText ||
      'Upload failed';
    throw new Error(message);
  }

  const data = (await res.json()) as { secure_url: string; public_id: string };
  return { secure_url: data.secure_url, public_id: data.public_id };
}
