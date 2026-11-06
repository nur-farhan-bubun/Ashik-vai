export interface ProductReview {
  author: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  verified: boolean;
}

export interface ProductSpec {
  label: string;
  value: string;
}

export interface ProductColor {
  name: string;
  hex: string;
  tailwindBg: string;
}

export type ProductCategory = 'Audio & Tech' | 'Minimalist Apparel' | 'Home & Living';

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: ProductCategory;
  price: number;
  originalPrice: number;
  rating: number;
  reviewCount: number;
  badge?: string;
  description: string;
  images: string[];
  colors: ProductColor[];
  sizes?: string[];
  inStock: boolean;
  specs: ProductSpec[];
  reviews: ProductReview[];
  createdAt: string;
}

export interface CartItem {
  id: string; // Composite key: `${productId}-${selectedColor}-${selectedSize || 'default'}`
  productId: string;
  product: Product;
  color: string;
  size?: string;
  quantity: number;
  price: number;
}

export type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'rating-desc' | 'newest';

export interface FilterState {
  categories: ProductCategory[];
  priceRange: [number, number];
  minRating: number;
  selectedColor?: string;
  selectedSize?: string;
  searchQuery: string;
}

export const FREE_SHIPPING_THRESHOLD = 150;
export const STANDARD_SHIPPING_FEE = 12;

export const VALID_PROMO_CODES: Record<string, { percent: number; label: string }> = {
  SAVE20: { percent: 20, label: '20% Off Storewide' },
  WELCOME10: { percent: 10, label: '10% Welcome Discount' },
  AURA15: { percent: 15, label: '15% Member Discount' },
};

export function calculateSubtotal(items: CartItem[]): number {
  return items.reduce((acc, item) => acc + item.price * item.quantity, 0);
}

export function calculateDiscount(
  subtotal: number,
  code: string
): { discountAmount: number; isValid: boolean; discountPercent: number; label: string } {
  const normalized = code.trim().toUpperCase();
  const match = VALID_PROMO_CODES[normalized];
  if (!match || subtotal <= 0) {
    return { discountAmount: 0, isValid: false, discountPercent: 0, label: '' };
  }
  const discountAmount = Math.round((subtotal * (match.percent / 100)) * 100) / 100;
  return {
    discountAmount,
    isValid: true,
    discountPercent: match.percent,
    label: match.label,
  };
}

export function calculateShipping(subtotal: number, threshold = FREE_SHIPPING_THRESHOLD): number {
  if (subtotal <= 0) return 0;
  return subtotal >= threshold ? 0 : STANDARD_SHIPPING_FEE;
}

export function filterProducts(products: Product[], filters: FilterState): Product[] {
  return products.filter((product) => {
    // Category match
    if (filters.categories.length > 0 && !filters.categories.includes(product.category)) {
      return false;
    }

    // Price range match
    if (product.price < filters.priceRange[0] || product.price > filters.priceRange[1]) {
      return false;
    }

    // Rating match
    if (filters.minRating > 0 && product.rating < filters.minRating) {
      return false;
    }

    // Color match
    if (filters.selectedColor && !product.colors.some((c) => c.name.toLowerCase() === filters.selectedColor?.toLowerCase())) {
      return false;
    }

    // Size match
    if (filters.selectedSize && (!product.sizes || !product.sizes.includes(filters.selectedSize))) {
      return false;
    }

    // Search query match
    if (filters.searchQuery.trim()) {
      const q = filters.searchQuery.trim().toLowerCase();
      const matchName = product.name.toLowerCase().includes(q);
      const matchBrand = product.brand.toLowerCase().includes(q);
      const matchCategory = product.category.toLowerCase().includes(q);
      const matchDesc = product.description.toLowerCase().includes(q);
      if (!matchName && !matchBrand && !matchCategory && !matchDesc) {
        return false;
      }
    }

    return true;
  });
}

export function sortProducts(products: Product[], sortBy: SortOption): Product[] {
  const list = [...products];
  switch (sortBy) {
    case 'price-asc':
      return list.sort((a, b) => a.price - b.price);
    case 'price-desc':
      return list.sort((a, b) => b.price - a.price);
    case 'rating-desc':
      return list.sort((a, b) => b.rating - a.rating);
    case 'newest':
      return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    case 'featured':
    default:
      return list;
  }
}
