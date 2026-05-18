export interface ProductPricingRow {
  quantityValue: number;
  quantityUnit: 'kg';
  amount: number;
  currency: 'INR';
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  /**
   * @deprecated Legacy property. Use `pricing` instead.
   * This is kept as a temporary optional fallback during the migration phase.
   */
  price?: number;
  pricing: ProductPricingRow[];
  category: string;
  categoryList?: string[];
  images: string[];
  isActive: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductMeta {
  total: number;
  currentPage: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  limit: number;
}

export interface ProductListResponse {
  data: Product[];
  meta: ProductMeta;
}

/** Response shape for GET /product/:id (same as list: data array + meta). */
export type ProductByIdResponse = ProductListResponse;
