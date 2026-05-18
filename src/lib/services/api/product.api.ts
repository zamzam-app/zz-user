import { request, fileUploadRequest } from './axios.config';
import {
  ProductListResponse,
  ProductByIdResponse,
  Product,
  ProductPricingRow,
} from '../../../types/product';

/**
 * Temporary Migration Adapter: Normalizes individual product data.
 * Ensures the UI components always receive the updated pricing array schema,
 * while safely mapping legacy single-scalar price configurations.
 *
 * TODO: Remove this mapping layer once the backend and databases are fully migrated
 * to the new `pricing` array schema and legacy `price` fields are removed.
 */
function normalizeProduct(product: unknown): Product {
  const p = product as Record<string, unknown>;
  if (!product || typeof product !== 'object') {
    return {
      _id: '',
      name: '',
      description: '',
      price: 0,
      pricing: [],
      category: '',
      categoryList: [],
      images: [],
      isActive: false,
      isDeleted: false,
      createdAt: '',
      updatedAt: '',
    };
  }

  const legacyPrice =
    typeof p.price === 'number'
      ? p.price
      : p.price
        ? Number(p.price)
        : undefined;

  let normalizedPricing: ProductPricingRow[] = [];

  // 1. If new schema `pricing` array is present and is valid
  if (Array.isArray(p.pricing) && p.pricing.length > 0) {
    normalizedPricing = p.pricing.map((row: unknown) => {
      const r = row as Record<string, unknown> | null | undefined;
      const quantityValue =
        typeof r?.quantityValue === 'number'
          ? r.quantityValue
          : r?.quantityValue
            ? Number(r.quantityValue)
            : 1;

      const amount =
        typeof r?.amount === 'number'
          ? r.amount
          : r?.amount
            ? Number(r.amount)
            : 0;

      return {
        quantityValue: isNaN(quantityValue) ? 1 : quantityValue,
        quantityUnit: r?.quantityUnit === 'kg' ? 'kg' : 'kg',
        amount: isNaN(amount) ? 0 : amount,
        currency: r?.currency === 'INR' ? 'INR' : 'INR',
      };
    });
  }
  // 2. Backward compatibility fallback: Backend returns legacy `price` but no `pricing` array
  else if (legacyPrice !== undefined && !isNaN(legacyPrice)) {
    normalizedPricing = [
      {
        quantityValue: 1,
        quantityUnit: 'kg',
        amount: legacyPrice,
        currency: 'INR',
      },
    ];
  }

  return {
    ...p,
    _id: typeof p._id === 'string' ? p._id : '',
    name: typeof p.name === 'string' ? p.name : '',
    description: typeof p.description === 'string' ? p.description : '',
    category: typeof p.category === 'string' ? p.category : '',
    categoryList: Array.isArray(p.categoryList)
      ? (p.categoryList as string[])
      : [],
    images: Array.isArray(p.images) ? (p.images as string[]) : [],
    isActive:
      typeof p.isActive === 'boolean' ? p.isActive : Boolean(p.isActive),
    isDeleted:
      typeof p.isDeleted === 'boolean' ? p.isDeleted : Boolean(p.isDeleted),
    createdAt: typeof p.createdAt === 'string' ? p.createdAt : '',
    updatedAt: typeof p.updatedAt === 'string' ? p.updatedAt : '',
    // Keep legacy `price` as a temporary fallback for UI components still reading it
    price: legacyPrice ?? (normalizedPricing[0]?.amount || 0),
    pricing: normalizedPricing,
  } as Product;
}

/**
 * Normalizes API response structures. Handles standard list responses as well
 * as direct single product objects if returned directly.
 */
function normalizeProductResponse<T extends ProductListResponse>(
  response: T
): T {
  if (!response) return response;

  if (response && Array.isArray(response.data)) {
    return {
      ...response,
      data: response.data.map(normalizeProduct),
    };
  }

  // Fallback in case raw product is directly returned
  if (response && typeof response === 'object' && '_id' in response) {
    return normalizeProduct(response) as unknown as T;
  }

  return response;
}

export const productApi = {
  getAll: async (): Promise<ProductListResponse> => {
    const response = await request<ProductListResponse>({
      method: 'GET',
      url: '/product',
    });
    return normalizeProductResponse(response);
  },

  getById: async (id: string): Promise<ProductByIdResponse> => {
    const response = await request<ProductByIdResponse>({
      method: 'GET',
      url: `/product/${id}`,
      skipAuthRedirect: true,
    });
    return normalizeProductResponse(response);
  },

  create: async (payload: FormData) => {
    return fileUploadRequest({
      method: 'POST',
      url: '/product',
      data: payload,
    });
  },

  update: async (id: string, payload: FormData) => {
    return fileUploadRequest({
      method: 'PUT',
      url: `/product/${id}`,
      data: payload,
    });
  },

  delete: async (id: string) => {
    return request({
      method: 'DELETE',
      url: `/product/${id}`,
    });
  },
};
