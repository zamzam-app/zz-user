import { request } from './axios.config';
import { customizationEndpoints } from './endpoints';
import { CustomizationListResponse } from '@/types/customization';

export const customizationApi = {
  /**
   * Fetch customization options.
   * @param types Optional array of types to filter by (e.g., ['shape', 'flavor', 'decoration'])
   */
  getAll: async (types?: string[]): Promise<CustomizationListResponse> => {
    let url = customizationEndpoints.list;
    if (types && types.length > 0) {
      url += `?type=${types.join(',')}`;
    }

    return request<CustomizationListResponse>({
      method: 'GET',
      url,
      skipAuthRedirect: true,
    });
  },
};
