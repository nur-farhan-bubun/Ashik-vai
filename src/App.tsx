import React, { useState, useMemo } from 'react';
import { SlidersHorizontal, ChevronDown, PackageOpen, RotateCcw } from 'lucide-react';
import { ToastProvider, useToast } from './components/Toast';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { FilterSidebar } from './components/FilterSidebar';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { WishlistDrawer } from './components/WishlistDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { PRODUCTS } from './data/products';
import {
  Product,
  CartItem,
  FilterState,
  SortOption,
  ProductCategory,
  filterProducts,
  sortProducts,
  calculateSubtotal,
} from './utils/ecommerce';

function Storefront() {
  const { showToast } = useToast();

  // Filters State
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    priceRange: [50, 400],
    minRating: 0,
    selectedColor: undefined,
    selectedSize: undefined,
    searchQuery: '',
  });

  // Sorting State
  const [sortBy, setSortBy] = useState<SortOption>('featured');

  // Cart State (Initialized with 1 sample item so cart drawer has rich initial state)
  const [cart, setCart] = useState<CartItem[]>([
    {
      id: `${PRODUCTS[0].id}-${PRODUCTS[0].colors[0].name}-default`,
      productId: PRODUCTS[0].id,
      product: PRODUCTS[0],
      color: PRODUCTS[0].colors[0].name,
      quantity: 1,
      price: PRODUCTS[0].price,
    },
  ]);

  // Wishlist State (Initialized with 1 saved item)
  const [wishlist, setWishlist] = useState<Product[]>([PRODUCTS[2]]);

  // Modals / Drawers State
  const [selectedProductDetail, setSelectedProductDetail] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [promoCode, setPromoCode] = useState<string>('SAVE20');

  // Computed Cart metrics
  const cartSubtotal = useMemo(() => calculateSubtotal(cart), [cart]);
  const cartCount = useMemo(() => cart.reduce((sum, item) => sum + item.quantity, 0), [cart]);

  // Filtered & Sorted Product list
  const displayedProducts = useMemo(() => {
    const filtered = filterProducts(PRODUCTS, filters);
    return sortProducts(filtered, sortBy);
  }, [filters, sortBy]);

  // Helper: selected category for header and hero
  const currentCategorySelection: ProductCategory | 'all' =
    filters.categories.length === 1 ? filters.categories[0] : 'all';

  const handleSelectCategoryFromNav = (cat: ProductCategory | 'all') => {
    if (cat === 'all') {
      setFilters((prev) => ({ ...prev, categories: [] }));
    } else {
      setFilters((prev) => ({ ...prev, categories: [cat] }));
    }
  };

  const handleFilterChange = (updates: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...updates }));
  };

  const handleResetFilters = () => {
    setFilters({
      categories: [],
      priceRange: [50, 400],
      minRating: 0,
      selectedColor: undefined,
      selectedSize: undefined,
      searchQuery: '',
    });
    setSortBy('featured');
    showToast('Filters reset', 'All product filters have been cleared.', 'info');
  };

  // Cart handlers
  const handleAddToCart = (
    product: Product,
    selectedColor?: string,
    selectedSize?: string,
    quantity = 1,
    e?: React.MouseEvent
  ) => {
    if (e) e.stopPropagation();
    const color = selectedColor || product.colors[0]?.name || 'Standard';
    const compositeId = `${product.id}-${color}-${selectedSize || 'default'}`;

    setCart((prev) => {
      const existing = prev.find((item) => item.id === compositeId);
      if (existing) {
        return prev.map((item) =>
          item.id === compositeId ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [
        ...prev,
        {
          id: compositeId,
          productId: product.id,
          product,
          color,
          size: selectedSize,
          quantity,
          price: product.price,
        },
      ];
    });

    showToast('Added to Bag', `${quantity}x ${product.name} (${color}) added.`, 'success');
  };

  const handleBuyNow = (product: Product, color: string, size?: string, quantity = 1) => {
    handleAddToCart(product, color, size, quantity);
    setSelectedProductDetail(null);
    setIsCheckoutOpen(true);
  };

  const handleUpdateCartQuantity = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const nextQty = item.quantity + delta;
            return nextQty > 0 ? { ...item, quantity: nextQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveCartItem = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
    showToast('Item removed', 'Product removed from your shopping bag.', 'info');
  };

  const handleClearCart = () => {
    setCart([]);
  };

  // Wishlist handlers
  const handleToggleWishlist = (product: Product, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const exists = wishlist.some((item) => item.id === product.id);
    if (exists) {
      setWishlist((prev) => prev.filter((item) => item.id !== product.id));
      showToast('Removed from Wishlist', `${product.name} removed.`, 'info');
    } else {
      setWishlist((prev) => [...prev, product]);
      showToast('Saved to Wishlist', `${product.name} added to your saved list.`, 'success');
    }
  };

  const handleMoveWishlistToCart = (product: Product) => {
    handleAddToCart(product);
    setWishlist((prev) => prev.filter((p) => p.id !== product.id));
  };

  // Promo code verification
  const handleApplyPromoCode = (code: string) => {
    const validCodes = ['SAVE20', 'WELCOME10', 'AURA15'];
    if (validCodes.includes(code.toUpperCase())) {
      setPromoCode(code.toUpperCase());
      showToast('Promo Code Applied', `Discount code ${code.toUpperCase()} successfully applied!`, 'success');
      return true;
    }
    return false;
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900 selection:bg-indigo-500 selection:text-white">
      {/* 1. Global Header */}
      <Header
        searchQuery={filters.searchQuery}
        onSearchChange={(q) => handleFilterChange({ searchQuery: q })}
        cartCount={cartCount}
        cartSubtotal={cartSubtotal}
        wishlistCount={wishlist.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        selectedCategory={currentCategorySelection}
        onSelectCategory={handleSelectCategoryFromNav}
      />

      {/* 2. Homepage Hero Banner & Category Pills */}
      <Hero
        selectedCategory={currentCategorySelection}
        onSelectCategory={handleSelectCategoryFromNav}
        onExploreClick={() => {
          const el = document.getElementById('catalog-section');
          el?.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* 3. Product Grid & Listing Section */}
      <main id="catalog-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Desktop Filter Sidebar & Mobile Drawer trigger */}
          <FilterSidebar
            filters={filters}
            onFilterChange={handleFilterChange}
            onResetFilters={handleResetFilters}
            mobileOpen={isMobileFilterOpen}
            onCloseMobile={() => setIsMobileFilterOpen(false)}
          />

          {/* Catalog Listing Area */}
          <div className="flex-1 w-full">
            {/* Top Toolbar: Result Count, Active Filter Tags, Sort Dropdown & Mobile Filter Trigger */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-sm font-bold text-slate-900 tabular-nums">
                  Showing {displayedProducts.length} {displayedProducts.length === 1 ? 'Product' : 'Products'}
                </span>

                {/* Active category pill */}
                {filters.categories.length > 0 && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-semibold">
                    {filters.categories.join(', ')}
                    <button
                      type="button"
                      onClick={() => handleFilterChange({ categories: [] })}
                      className="hover:text-indigo-900"
                      aria-label="Remove category filter"
                    >
                      ×
                    </button>
                  </span>
                )}

                {/* Active price filter pill */}
                {filters.priceRange[1] < 400 && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold">
                    Under ${filters.priceRange[1]}
                    <button
                      type="button"
                      onClick={() => handleFilterChange({ priceRange: [50, 400] })}
                      className="hover:text-slate-900"
                      aria-label="Remove price filter"
                    >
                      ×
                    </button>
                  </span>
                )}

                {/* Active rating filter pill */}
                {filters.minRating > 0 && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 text-xs font-semibold">
                    ★ {filters.minRating}+
                    <button
                      type="button"
                      onClick={() => handleFilterChange({ minRating: 0 })}
                      className="hover:text-amber-950"
                      aria-label="Remove rating filter"
                    >
                      ×
                    </button>
                  </span>
                )}

                {/* Active search filter */}
                {filters.searchQuery && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold">
                    "{filters.searchQuery}"
                    <button
                      type="button"
                      onClick={() => handleFilterChange({ searchQuery: '' })}
                      className="hover:text-slate-900"
                      aria-label="Clear search filter"
                    >
                      ×
                    </button>
                  </span>
                )}
              </div>

              {/* Controls: Mobile filter button & Sort Dropdown */}
              <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                {/* Mobile Filter Toggle */}
                <button
                  type="button"
                  onClick={() => setIsMobileFilterOpen(true)}
                  className="lg:hidden inline-flex items-center gap-2 px-3 py-2 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl transition-colors"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  <span>Filters</span>
                </button>

                {/* Sort dropdown */}
                <div className="flex items-center gap-2">
                  <label htmlFor="sort-select" className="text-xs font-medium text-slate-500 whitespace-nowrap hidden sm:inline">
                    Sort by:
                  </label>
                  <div className="relative">
                    <select
                      id="sort-select"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as SortOption)}
                      className="appearance-none bg-slate-100 hover:bg-slate-200/70 text-slate-800 text-xs font-semibold pl-3 pr-8 py-2 rounded-xl border border-transparent focus:border-indigo-500 outline-none cursor-pointer transition-colors"
                    >
                      <option value="featured">Featured Picks</option>
                      <option value="price-asc">Price: Low to High</option>
                      <option value="price-desc">Price: High to Low</option>
                      <option value="rating-desc">Highest Rated</option>
                      <option value="newest">Newest Arrivals</option>
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>

            {/* Product Cards Grid */}
            {displayedProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayedProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onOpenDetail={(prod) => setSelectedProductDetail(prod)}
                    onAddToCart={(prod, e) => handleAddToCart(prod, undefined, undefined, 1, e)}
                    isWishlisted={wishlist.some((w) => w.id === product.id)}
                    onToggleWishlist={handleToggleWishlist}
                  />
                ))}
              </div>
            ) : (
              /* Empty Results State */
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-lg mx-auto my-8">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400 mb-4">
                  <PackageOpen className="w-8 h-8" />
                </div>
                <h3 className="text-base font-bold text-slate-900">No matching products found</h3>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                  We couldn’t find any items matching your selected criteria. Try loosening your price limit, clearing active search keywords, or resetting filters.
                </p>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset All Filters</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* 4. Product Detail Modal */}
      <ProductDetailModal
        product={selectedProductDetail}
        onClose={() => setSelectedProductDetail(null)}
        onAddToCart={(prod, color, size, qty) => handleAddToCart(prod, color, size, qty)}
        onBuyNow={handleBuyNow}
        isWishlisted={Boolean(selectedProductDetail && wishlist.some((w) => w.id === selectedProductDetail.id))}
        onToggleWishlist={handleToggleWishlist}
      />

      {/* 5. Slide-Over Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
        promoCode={promoCode}
        onApplyPromoCode={handleApplyPromoCode}
      />

      {/* 6. Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cart}
        promoCode={promoCode}
        onClearCart={handleClearCart}
      />

      {/* 7. Wishlist Drawer */}
      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlist={wishlist}
        onRemoveFromWishlist={(prod) => handleToggleWishlist(prod)}
        onMoveToCart={handleMoveWishlistToCart}
      />

      {/* Global Clean Editorial Footer */}
      <footer className="mt-20 border-t border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-3">
              <span className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
                AURA
              </span>
              <p className="text-xs text-slate-500 leading-relaxed max-w-xs">
                Minimalist everyday tools, acoustical hardware, and modern living staples engineered for durability and quiet focus.
              </p>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">Collections</h4>
              <ul className="text-xs text-slate-600 space-y-2">
                <li>
                  <button onClick={() => handleSelectCategoryFromNav('Audio & Tech')} className="hover:text-indigo-600">
                    Audio & Tech
                  </button>
                </li>
                <li>
                  <button onClick={() => handleSelectCategoryFromNav('Minimalist Apparel')} className="hover:text-indigo-600">
                    Minimalist Apparel
                  </button>
                </li>
                <li>
                  <button onClick={() => handleSelectCategoryFromNav('Home & Living')} className="hover:text-indigo-600">
                    Home & Living
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">Customer Care</h4>
              <ul className="text-xs text-slate-600 space-y-2">
                <li><a href="#" className="hover:text-indigo-600">Complimentary Global Shipping</a></li>
                <li><a href="#" className="hover:text-indigo-600">30-Day Hassle-Free Returns</a></li>
                <li><a href="#" className="hover:text-indigo-600">Warranty & Hardware Support</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">Exclusive Dispatch</h4>
              <p className="text-xs text-slate-500 mb-3">Receive early access to seasonal limited runs.</p>
              <form onSubmit={(e) => { e.preventDefault(); showToast('Subscribed', 'Thank you for joining our newsletter dispatch.', 'success'); }} className="flex gap-2">
                <input
                  type="email"
                  placeholder="name@domain.com"
                  required
                  className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg flex-1 outline-none focus:border-indigo-500"
                />
                <button
                  type="submit"
                  className="px-3.5 py-2 bg-slate-900 text-white text-xs font-semibold rounded-lg hover:bg-slate-800 transition-colors shrink-0"
                >
                  Join
                </button>
              </form>
            </div>
          </div>

          <div className="mt-12 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
            <p>© 2026 AURA Inc. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <a href="#" className="hover:text-slate-600">Privacy Policy</a>
              <a href="#" className="hover:text-slate-600">Terms of Service</a>
              <a href="#" className="hover:text-slate-600">Accessibility</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <Storefront />
    </ToastProvider>
  );
}
