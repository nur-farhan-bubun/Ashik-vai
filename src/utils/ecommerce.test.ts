import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateSubtotal,
  calculateDiscount,
  calculateShipping,
  filterProducts,
  sortProducts,
  Product,
  CartItem,
  FilterState,
} from './ecommerce.ts';

const dummyProductA: Product = {
  id: 'prod-1',
  name: 'Studio Wireless Headphones',
  brand: 'AURA Sound',
  category: 'Audio & Tech',
  price: 249,
  originalPrice: 299,
  rating: 4.8,
  reviewCount: 142,
  description: 'High-end ANC headphones with precision acoustic drivers.',
  images: ['/img1.jpg'],
  colors: [{ name: 'Graphite', hex: '#1e293b', tailwindBg: 'bg-slate-800' }],
  inStock: true,
  specs: [{ label: 'Battery', value: '40 hours' }],
  reviews: [],
  createdAt: '2026-01-15T00:00:00Z',
};

const dummyProductB: Product = {
  id: 'prod-2',
  name: 'Ceramic Pour-Over Dripper',
  brand: 'Kōbō Living',
  category: 'Home & Living',
  price: 65,
  originalPrice: 80,
  rating: 4.6,
  reviewCount: 38,
  description: 'Handcrafted ceramic dripper.',
  images: ['/img2.jpg'],
  colors: [{ name: 'Oatmeal', hex: '#f5f5f4', tailwindBg: 'bg-stone-100' }],
  sizes: ['Standard', 'Large'],
  inStock: true,
  specs: [],
  reviews: [],
  createdAt: '2026-02-10T00:00:00Z',
};

const dummyProductC: Product = {
  id: 'prod-3',
  name: 'Heavyweight Minimalist Tee',
  brand: 'AURA Studio',
  category: 'Minimalist Apparel',
  price: 48,
  originalPrice: 55,
  rating: 4.9,
  reviewCount: 210,
  description: 'Organic combed cotton boxy tee.',
  images: ['/img3.jpg'],
  colors: [
    { name: 'Graphite', hex: '#1e293b', tailwindBg: 'bg-slate-800' },
    { name: 'White', hex: '#ffffff', tailwindBg: 'bg-white' },
  ],
  sizes: ['S', 'M', 'L', 'XL'],
  inStock: true,
  specs: [],
  reviews: [],
  createdAt: '2026-03-01T00:00:00Z',
};

test('calculateSubtotal sums up correctly', () => {
  const items: CartItem[] = [
    { id: '1', productId: 'prod-1', product: dummyProductA, color: 'Graphite', quantity: 2, price: 249 },
    { id: '2', productId: 'prod-2', product: dummyProductB, color: 'Oatmeal', quantity: 1, price: 65 },
  ];
  assert.equal(calculateSubtotal(items), 249 * 2 + 65);
});

test('calculateDiscount applies valid code SAVE20 and rejects invalid codes', () => {
  const resValid = calculateDiscount(100, 'SAVE20');
  assert.equal(resValid.isValid, true);
  assert.equal(resValid.discountAmount, 20);
  assert.equal(resValid.discountPercent, 20);

  const resInvalid = calculateDiscount(100, 'FAKECODE');
  assert.equal(resInvalid.isValid, false);
  assert.equal(resInvalid.discountAmount, 0);
});

test('calculateShipping waives shipping for orders >= $150', () => {
  assert.equal(calculateShipping(0), 0);
  assert.equal(calculateShipping(100), 12);
  assert.equal(calculateShipping(150), 0);
  assert.equal(calculateShipping(300), 0);
});

test('filterProducts handles category, price range, and search filtering', () => {
  const products = [dummyProductA, dummyProductB, dummyProductC];
  const filterAudio: FilterState = {
    categories: ['Audio & Tech'],
    priceRange: [0, 500],
    minRating: 0,
    searchQuery: '',
  };
  const audioFiltered = filterProducts(products, filterAudio);
  assert.equal(audioFiltered.length, 1);
  assert.equal(audioFiltered[0].id, 'prod-1');

  const filterSearch: FilterState = {
    categories: [],
    priceRange: [0, 500],
    minRating: 0,
    searchQuery: 'cotton',
  };
  const searchFiltered = filterProducts(products, filterSearch);
  assert.equal(searchFiltered.length, 1);
  assert.equal(searchFiltered[0].id, 'prod-3');
});

test('sortProducts sorts correctly by price asc/desc and rating', () => {
  const products = [dummyProductA, dummyProductB, dummyProductC];
  const sortedAsc = sortProducts(products, 'price-asc');
  assert.equal(sortedAsc[0].price, 48);
  assert.equal(sortedAsc[2].price, 249);

  const sortedRating = sortProducts(products, 'rating-desc');
  assert.equal(sortedRating[0].rating, 4.9);
});
