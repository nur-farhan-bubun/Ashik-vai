import { useState, useEffect } from 'react';
import { X, Star, ShoppingBag, Heart, Shield, Truck, RotateCcw, Check, Sparkles } from 'lucide-react';
import { Product } from '../utils/ecommerce';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, color: string, size?: string, quantity?: number) => void;
  onBuyNow: (product: Product, color: string, size?: string, quantity?: number) => void;
  isWishlisted: boolean;
  onToggleWishlist: (product: Product) => void;
}

type TabType = 'overview' | 'specs' | 'reviews';

export function ProductDetailModal({
  product,
  onClose,
  onAddToCart,
  onBuyNow,
  isWishlisted,
  onToggleWishlist,
}: ProductDetailModalProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string | undefined>(undefined);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [addedAnimation, setAddedAnimation] = useState(false);

  // Initialize or reset selections when product changes
  useEffect(() => {
    if (product) {
      setSelectedImageIndex(0);
      setSelectedColor(product.colors[0]?.name || '');
      setSelectedSize(product.sizes ? product.sizes[0] : undefined);
      setQuantity(1);
      setActiveTab('overview');
      setAddedAnimation(false);
    }
  }, [product]);

  // Handle escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        onClose();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!product) return null;

  const discountPercent =
    product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 0;

  const handleAddToCart = () => {
    onAddToCart(product, selectedColor, selectedSize, quantity);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1500);
  };

  const handleBuyNow = () => {
    onBuyNow(product, selectedColor, selectedSize, quantity);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="flex min-h-full items-center justify-center p-3 sm:p-6 lg:p-8">
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="product-detail-heading"
          className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-200 my-8"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2 text-slate-400 hover:text-slate-800 rounded-full bg-white/80 hover:bg-slate-100 transition-colors shadow-xs"
            aria-label="Close product details"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Top Section: Gallery & Purchase Module */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 p-6 sm:p-8 border-b border-slate-200">
            {/* Left: Image Gallery */}
            <div className="flex flex-col gap-3">
              {/* Main Image */}
              <div className="relative aspect-4/3 w-full bg-slate-100 rounded-xl overflow-hidden border border-slate-200/80">
                <img
                  src={product.images[selectedImageIndex] || product.images[0]}
                  alt={`${product.name} view`}
                  className="w-full h-full object-cover object-center transition-all duration-300"
                  referrerPolicy="no-referrer"
                />
                {discountPercent > 0 && (
                  <span className="absolute top-3 left-3 px-2.5 py-1 text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200/80 rounded-md">
                    Save {discountPercent}%
                  </span>
                )}
              </div>

              {/* Thumbnails */}
              {product.images.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {product.images.map((img, idx) => (
                    <button
                      key={img}
                      type="button"
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`relative w-18 h-14 rounded-lg overflow-hidden border-2 transition-all shrink-0 ${
                        selectedImageIndex === idx
                          ? 'border-indigo-600 ring-2 ring-indigo-600/30'
                          : 'border-slate-200 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={img}
                        alt="Thumbnail"
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Trust micro-callouts */}
              <div className="grid grid-cols-3 gap-2 pt-3 text-[11px] text-slate-600">
                <div className="flex items-center gap-1.5 p-2 rounded-lg bg-slate-50">
                  <Truck className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                  <span>Free shipping</span>
                </div>
                <div className="flex items-center gap-1.5 p-2 rounded-lg bg-slate-50">
                  <RotateCcw className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                  <span>30-Day returns</span>
                </div>
                <div className="flex items-center gap-1.5 p-2 rounded-lg bg-slate-50">
                  <Shield className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                  <span>2-Yr warranty</span>
                </div>
              </div>
            </div>

            {/* Right: Contiguous Purchase Module */}
            <div className="flex flex-col">
              {/* Category & Rating */}
              <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                <span className="font-semibold uppercase tracking-wider text-slate-400">
                  {product.category}
                </span>
                <div className="flex items-center gap-1 text-amber-500">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="font-bold text-slate-900 tabular-nums text-sm">
                    {product.rating}
                  </span>
                  <span className="text-slate-500">({product.reviewCount} customer reviews)</span>
                </div>
              </div>

              {/* Product Title */}
              <h1 id="product-detail-heading" className="text-2xl font-bold text-slate-900 tracking-tight leading-snug">
                {product.name}
              </h1>
              <p className="text-xs text-slate-500 mt-1">By {product.brand}</p>

              {/* Pricing */}
              <div className="mt-4 flex items-baseline gap-3">
                <span className="text-3xl font-extrabold text-slate-900 tabular-nums">
                  ${product.price}
                </span>
                {product.originalPrice > product.price && (
                  <span className="text-lg text-slate-400 line-through tabular-nums">
                    ${product.originalPrice}
                  </span>
                )}
                <span className="text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md font-semibold">
                  In Stock & Ready to Ship
                </span>
              </div>

              <div className="h-px bg-slate-200/80 my-5" />

              {/* Color Swatch Selection */}
              <div className="mb-4">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-semibold text-slate-900">Color:</span>
                  <span className="text-slate-600 font-medium">{selectedColor}</span>
                </div>
                <div className="flex items-center gap-3">
                  {product.colors.map((color) => {
                    const isSelected = selectedColor === color.name;
                    return (
                      <button
                        key={color.name}
                        type="button"
                        onClick={() => setSelectedColor(color.name)}
                        className={`group relative flex items-center gap-2 p-1 rounded-xl transition-all ${
                          isSelected
                            ? 'ring-2 ring-indigo-600 ring-offset-2'
                            : 'hover:opacity-80'
                        }`}
                        title={color.name}
                      >
                        <span
                          className={`w-7 h-7 rounded-lg border border-slate-300 shadow-xs flex items-center justify-center ${color.tailwindBg}`}
                        >
                          {isSelected && <span className="w-2 h-2 rounded-full bg-white shadow-xs" />}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Size Buttons (if applicable) */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="mb-5">
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-semibold text-slate-900">Size / Option:</span>
                    <span className="text-slate-500">Standard fit</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => {
                      const isSelected = selectedSize === size;
                      return (
                        <button
                          key={size}
                          type="button"
                          onClick={() => setSelectedSize(size)}
                          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                            isSelected
                              ? 'bg-slate-900 text-white shadow-xs'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }`}
                        >
                          {size}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Quantity Stepper & Wishlist */}
              <div className="flex items-center gap-4 mb-6">
                <div>
                  <label htmlFor="quantity-selector" className="block text-xs font-semibold text-slate-900 mb-1.5">
                    Quantity:
                  </label>
                  <div id="quantity-selector" className="inline-flex items-center border border-slate-300 rounded-xl bg-white shadow-2xs">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      disabled={quantity <= 1}
                      className="px-3 py-2 text-slate-600 hover:text-slate-900 disabled:opacity-30 disabled:cursor-not-allowed font-medium"
                      aria-label="Decrease quantity"
                    >
                      -
                    </button>
                    <span className="px-3 py-2 text-xs font-bold text-slate-900 tabular-nums min-w-[32px] text-center">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => q + 1)}
                      className="px-3 py-2 text-slate-600 hover:text-slate-900 font-medium"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="pt-5">
                  <button
                    type="button"
                    onClick={() => onToggleWishlist(product)}
                    className={`inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl border text-xs font-medium transition-colors ${
                      isWishlisted
                        ? 'border-rose-200 bg-rose-50 text-rose-600'
                        : 'border-slate-300 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500' : ''}`} />
                    <span>{isWishlisted ? 'Saved to Wishlist' : 'Add to Wishlist'}</span>
                  </button>
                </div>
              </div>

              {/* CTAs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-auto">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className={`py-3.5 px-4 rounded-xl font-semibold text-sm shadow-md flex items-center justify-center gap-2 transition-all duration-150 active:scale-95 ${
                    addedAnimation
                      ? 'bg-emerald-600 text-white'
                      : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                  }`}
                >
                  {addedAnimation ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Added to Bag!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>Add to Cart</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleBuyNow}
                  className="py-3.5 px-4 rounded-xl font-semibold text-sm bg-slate-900 hover:bg-slate-800 text-white shadow-md transition-all active:scale-95"
                >
                  Buy Now
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Tabbed Section: Product Overview, Specifications, Customer Reviews */}
          <div className="p-6 sm:p-8 bg-slate-50/50">
            {/* Tabs */}
            <div className="flex items-center gap-1 p-1 bg-slate-200/70 rounded-xl max-w-md mb-6">
              <button
                type="button"
                onClick={() => setActiveTab('overview')}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors ${
                  activeTab === 'overview'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Overview
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('specs')}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors ${
                  activeTab === 'specs'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Specifications
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('reviews')}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors ${
                  activeTab === 'reviews'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Reviews ({product.reviewCount})
              </button>
            </div>

            {/* Tab 1: Overview */}
            {activeTab === 'overview' && (
              <div className="space-y-4 max-w-2xl text-sm text-slate-700 leading-relaxed">
                <p>{product.description}</p>
                <div className="p-4 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                    Key Highlights
                  </h4>
                  <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside">
                    <li>Constructed with premium circular materials and low-impact finishes</li>
                    <li>Designed in Copenhagen and calibrated for precision endurance</li>
                    <li>Passes strict durability drop and thermal shock verification standards</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Tab 2: Specifications Table */}
            {activeTab === 'specs' && (
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden max-w-2xl">
                <table className="w-full text-left text-xs">
                  <tbody>
                    {product.specs.map((spec, i) => (
                      <tr
                        key={spec.label}
                        className={i % 2 === 0 ? 'bg-slate-50/60' : 'bg-white'}
                      >
                        <td className="py-3 px-4 font-semibold text-slate-600 w-1/3 border-b border-slate-100">
                          {spec.label}
                        </td>
                        <td className="py-3 px-4 text-slate-900 font-medium border-b border-slate-100 tabular-nums">
                          {spec.value}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Tab 3: Customer Reviews with Star Distribution */}
            {activeTab === 'reviews' && (
              <div className="space-y-6">
                {/* Rating Distribution Card */}
                <div className="p-5 bg-white rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-6 items-center">
                  <div className="text-center sm:border-r sm:border-slate-200 sm:pr-6">
                    <span className="text-4xl font-extrabold text-slate-900 tabular-nums">
                      {product.rating}
                    </span>
                    <div className="flex justify-center items-center gap-1 text-amber-400 my-1.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <p className="text-xs text-slate-500">Based on {product.reviewCount} verified reviews</p>
                  </div>

                  {/* Distribution bars */}
                  <div className="sm:col-span-2 space-y-1.5 text-xs">
                    {[
                      { stars: 5, pct: 85 },
                      { stars: 4, pct: 12 },
                      { stars: 3, pct: 2 },
                      { stars: 2, pct: 1 },
                      { stars: 1, pct: 0 },
                    ].map((row) => (
                      <div key={row.stars} className="flex items-center gap-2">
                        <span className="w-12 text-slate-600 font-medium tabular-nums">{row.stars} star</span>
                        <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-amber-400 rounded-full"
                            style={{ width: `${row.pct}%` }}
                          />
                        </div>
                        <span className="w-8 text-right text-slate-400 tabular-nums">{row.pct}%</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Individual reviews */}
                <div className="space-y-3">
                  {product.reviews.map((rev) => (
                    <div
                      key={rev.author}
                      className="p-4 bg-white rounded-xl border border-slate-200/80 shadow-2xs"
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-xs text-slate-900">{rev.author}</span>
                          {rev.verified && (
                            <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                              <Check className="w-3 h-3" />
                              Verified Buyer
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-slate-400">{rev.date}</span>
                      </div>
                      <div className="flex items-center gap-1 text-amber-400 mb-1.5">
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 mb-1">{rev.title}</h4>
                      <p className="text-xs text-slate-600 leading-relaxed">{rev.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
