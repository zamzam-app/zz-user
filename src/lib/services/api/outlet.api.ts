import type { OutletByQrTokenResult } from '@/types/outlet';
import { normalizeFormResponse } from './form.api';
import { withoutToken } from './axios.config';
import { outletEndpoints } from './endpoints';

export const outletApi = {
  getByQrToken: async (qrToken: string): Promise<OutletByQrTokenResult> => {
    const response = await withoutToken<OutletByQrTokenResult>({
      method: 'GET',
      url: outletEndpoints.getByQrToken(qrToken),
    });
    return response.form
      ? { ...response, form: normalizeFormResponse(response.form) }
      : response;
  },
};
