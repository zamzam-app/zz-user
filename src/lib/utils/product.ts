import { Product } from '../../types/product';

/**
 * Validates and extracts a clean list of numeric amounts from a product's pricing array.
 * Safely filters out invalid, non-numeric, negative, or empty entries.
 */
export function getValidPricingAmounts(
  product: Partial<Product> | null | undefined
): number[] {
  if (!product || !product.pricing || !Array.isArray(product.pricing)) {
    return [];
  }

  return product.pricing
    .map((row) =>
      row && typeof row.amount === 'number' ? row.amount : Number(row?.amount)
    )
    .filter(
      (amount) => typeof amount === 'number' && !isNaN(amount) && amount >= 0
    );
}

/**
 * Computes the minimum pricing amount for a given product.
 * Returns null if no valid pricing configuration is found.
 */
export function getMinimumProductPrice(
  product: Partial<Product> | null | undefined
): number | null {
  const validAmounts = getValidPricingAmounts(product);
  if (validAmounts.length === 0) {
    return null;
  }
  return Math.min(...validAmounts);
}

/**
 * Generates a localized and normalized display label for a product's price.
 * Standard format: "Starts at ₹X / kg"
 * Falls back to "Price unavailable" if no valid price can be derived.
 */
export function getProductPriceLabel(
  product: Partial<Product> | null | undefined
): string {
  const minPrice = getMinimumProductPrice(product);
  if (minPrice === null) {
    return 'Price unavailable';
  }
  return `Starts at ₹${minPrice} / kg`;
}
