'use client';

import { useState, useCallback } from 'react';
import { getUploadSignature } from '@/lib/services/api/upload.api';
import { uploadImageToCloudinary } from '@/lib/services/api/cloudinary';

export interface UseImageUploadResult {
  upload: (file: File) => Promise<string>;
  loading: boolean;
  error: Error | null;
  clearError: () => void;
}

export function useImageUpload(folder?: string): UseImageUploadResult {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const upload = useCallback(
    async (file: File): Promise<string> => {
      setLoading(true);
      setError(null);
      try {
        const params = await getUploadSignature(folder);
        const { secure_url } = await uploadImageToCloudinary(file, params);
        return secure_url;
      } catch (err) {
        const next = err instanceof Error ? err : new Error('Upload failed');
        setError(next);
        throw next;
      } finally {
        setLoading(false);
      }
    },
    [folder]
  );

  const clearError = useCallback(() => setError(null), []);

  return { upload, loading, error, clearError };
}
