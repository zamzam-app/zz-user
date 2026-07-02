export type CustomizationType = 'shape' | 'flavor' | 'decoration';

export interface CakeCustomizationOption {
  _id: string;
  name: string;
  price: number;
  currency: string;
  type: CustomizationType;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CustomizationListResponse {
  data: CakeCustomizationOption[];
  meta: {
    total: number;
    currentPage: number;
    hasPrevPage: boolean;
    hasNextPage: boolean;
    limit: number;
  };
}
