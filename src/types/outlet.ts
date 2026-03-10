import type { FormData } from '@/types/form';

/** Table info returned when the QR token is a table token. */
export interface OutletTableInfo {
  _id: string;
  name: string;
}

/** Response shape for GET /outlet/by-qr/:qrToken */
export interface OutletByQrTokenResult {
  _id: string;
  name: string;
  form: FormData | null;
  table?: OutletTableInfo | null;
}
