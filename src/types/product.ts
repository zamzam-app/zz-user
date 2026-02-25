export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
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
