import React, { useState } from 'react';
import { Heart, ShoppingBag, Star, Check } from 'lucide-react';
import { Product } from '../utils/ecommerce';

interface ProductCardProps {
  product: Product;
  onOpenDetail: (product: Product) => void;
  onAddToCart: (product: Product, e: React.MouseEvent) => void;
  isWishlisted: boolean;
  onToggleWishlist: (product: Product, e: React.MouseEvent) => void;
}

export function ProductCard({
  product,
  onOpenDetail,
  onAddToCart,
  isWishlisted,
  onToggleWishlist,
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const discountPercent =
    product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 0;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product, e);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1400);
  };

  // Select image based on hover state (secondary hover preview)
  const currentImage = isHovered && product.images[1] ? product.images[1] : product.images[0];

  return (
    <article
      onClick={() => onOpenDetail(product)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative flex flex-col bg-white rounded-xl border border-slate-200/80 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer overflow-hidden"
    >
      {/* Product Image Container with Secondary Hover Preview */}
      <div className="relative aspect-4/3 w-full bg-slate-100 overflow-hidden">
        <img
          src={currentImage}
          alt={product.name}
          className="w-full h-full object-cover object-center transition-all duration-300 group-hover:scale-105"
          referrerPolicy="no-referrer"
          loading="lazy"
        />

        {/* Badges Overlay */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.badge && (
            <span className="px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-white bg-slate-900/90 backdrop-blur-xs rounded-md shadow-xs">
              {product.badge}
            </span>
          )}
          {discountPercent > 0 && (
            <span className="px-2 py-0.5 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/60 rounded-md">
              -{discountPercent}%
            </span>
          )}
        </div>

        {/* Wishlist Heart Button */}
        <button
          type="button"
          onClick={(e) => onToggleWishlist(product, e)}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all duration-200 z-10 ${
            isWishlisted
              ? 'bg-white text-rose-500 shadow-md scale-105'
              : 'bg-white/80 hover:bg-white text-slate-600 hover:text-rose-500 shadow-xs'
          }`}
          aria-label={isWishlisted ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
        >
          <Heart
            className={`w-4 h-4 transition-transform duration-200 active:scale-75 ${
              isWishlisted ? 'fill-rose-500 text-rose-500' : ''
            }`}
          />
        </button>

        {/* Quick Add To Cart Hover Pill / Button */}
        <div className="absolute bottom-3 inset-x-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 sm:block hidden">
          <button
            type="button"
            onClick={handleQuickAdd}
            className={`w-full py-2.5 px-4 text-xs font-semibold rounded-lg shadow-md flex items-center justify-center gap-1.5 transition-all duration-150 active:scale-95 ${
              justAdded
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-900/95 hover:bg-slate-900 text-white backdrop-blur-xs'
            }`}
          >
            {justAdded ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Added to Bag</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Quick Add</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Card Body & Metadata */}
      <div className="p-4 flex flex-col flex-1">
        {/* Category & Rating */}
        <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
          <span className="font-medium uppercase tracking-wider text-[11px] text-slate-400">
            {product.category}
          </span>
          <div className="flex items-center gap-1 text-amber-500">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="font-semibold text-slate-700 tabular-nums text-xs">
              {product.rating}
            </span>
            <span className="text-slate-400 tabular-nums text-[11px]">
              ({product.reviewCount})
            </span>
          </div>
        </div>

        {/* Product Title */}
        <h3 className="font-semibold text-sm text-slate-900 line-clamp-1 group-hover:text-indigo-600 transition-colors">
          {product.name}
        </h3>

        {/* Brand */}
        <p className="text-xs text-slate-500 mt-0.5">{product.brand}</p>

        {/* Color swatches preview */}
        <div className="flex items-center gap-1.5 mt-2.5">
          {product.colors.slice(0, 3).map((col) => (
            <span
              key={col.name}
              className={`w-3 h-3 rounded-full border border-slate-300 shadow-2xs ${col.tailwindBg}`}
              title={col.name}
            />
          ))}
          {product.colors.length > 3 && (
            <span className="text-[10px] text-slate-400">+{product.colors.length - 3}</span>
          )}
        </div>

        {/* Price & Mobile Add CTA */}
        <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-base font-bold text-slate-900 tabular-nums">
              ${product.price}
            </span>
            {product.originalPrice > product.price && (
              <span className="text-xs text-slate-400 line-through tabular-nums">
                ${product.originalPrice}
              </span>
            )}
          </div>

          {/* Mobile visible Quick Add Button */}
          <button
            type="button"
            onClick={handleQuickAdd}
            className="sm:hidden p-2 text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg active:scale-95 transition-colors"
            aria-label={`Add ${product.name} to cart`}
          >
            {justAdded ? <Check className="w-4 h-4 text-emerald-600" /> : <ShoppingBag className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </article>
  );
}
