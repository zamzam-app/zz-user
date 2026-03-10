import type { OutletByQrTokenResult } from '@/types/outlet';
import { withoutToken } from './axios.config';
import { outletEndpoints } from './endpoints';

export const outletApi = {
  getByQrToken: async (qrToken: string): Promise<OutletByQrTokenResult> => {
    return withoutToken<OutletByQrTokenResult>({
      method: 'GET',
      url: outletEndpoints.getByQrToken(qrToken),
    });
  },
};
