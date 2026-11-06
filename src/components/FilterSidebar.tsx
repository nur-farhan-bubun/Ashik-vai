import { Filter, RotateCcw, Star, X } from 'lucide-react';
import { FilterState, ProductCategory } from '../utils/ecommerce';
import { CATEGORIES } from '../data/products';

interface FilterSidebarProps {
  filters: FilterState;
  onFilterChange: (newFilters: Partial<FilterState>) => void;
  onResetFilters: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

const AVAILABLE_COLORS = [
  { name: 'Graphite', hex: '#1E293B', bg: 'bg-slate-800' },
  { name: 'Silver', hex: '#CBD5E1', bg: 'bg-slate-300' },
  { name: 'Navy', hex: '#0F172A', bg: 'bg-slate-900' },
  { name: 'Charcoal', hex: '#334155', bg: 'bg-slate-700' },
  { name: 'Sandstone', hex: '#E2E8F0', bg: 'bg-stone-200' },
  { name: 'Amber', hex: '#D97706', bg: 'bg-amber-600' },
];

const AVAILABLE_SIZES = ['S', 'M', 'L', 'XL', '20 Liter', 'Standard'];

export function FilterSidebar({
  filters,
  onFilterChange,
  onResetFilters,
  mobileOpen,
  onCloseMobile,
}: FilterSidebarProps) {
  const handleCategoryToggle = (category: ProductCategory) => {
    const exists = filters.categories.includes(category);
    const updated = exists
      ? filters.categories.filter((c) => c !== category)
      : [...filters.categories, category];
    onFilterChange({ categories: updated });
  };

  const handleMaxPriceChange = (value: number) => {
    onFilterChange({ priceRange: [filters.priceRange[0], value] });
  };

  const content = (
    <div className="space-y-6">
      {/* Header with Reset */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-700" />
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Filters</h2>
        </div>
        <button
          type="button"
          onClick={onResetFilters}
          className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-indigo-600 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>

      {/* Category Checkboxes */}
      <div>
        <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-3">
          Collections
        </h3>
        <div className="space-y-2">
          {CATEGORIES.map((cat) => {
            const isChecked = filters.categories.includes(cat.id);
            return (
              <label
                key={cat.id}
                className="flex items-center justify-between text-xs sm:text-sm text-slate-700 hover:text-slate-900 cursor-pointer group py-1"
              >
                <div className="flex items-center gap-2.5">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => handleCategoryToggle(cat.id)}
                    className="w-4 h-4 rounded-md border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer accent-indigo-600"
                  />
                  <span className={isChecked ? 'font-semibold text-slate-900' : ''}>
                    {cat.name}
                  </span>
                </div>
                <span className="text-xs text-slate-400 tabular-nums">({cat.count})</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Price Range Slider */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
            Max Price
          </h3>
          <span className="text-xs font-bold text-slate-900 tabular-nums">
            ${filters.priceRange[1]}
          </span>
        </div>
        <input
          type="range"
          min="50"
          max="400"
          step="10"
          value={filters.priceRange[1]}
          onChange={(e) => handleMaxPriceChange(Number(e.target.value))}
          className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
        />
        <div className="flex justify-between text-[11px] text-slate-400 mt-1 tabular-nums">
          <span>$50</span>
          <span>$200</span>
          <span>$400</span>
        </div>
      </div>

      {/* Rating Filter */}
      <div>
        <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-2.5">
          Minimum Rating
        </h3>
        <div className="space-y-1.5">
          {[4.8, 4.5, 4.0].map((starThreshold) => {
            const isSelected = filters.minRating === starThreshold;
            return (
              <button
                key={starThreshold}
                type="button"
                onClick={() => onFilterChange({ minRating: isSelected ? 0 : starThreshold })}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                  isSelected
                    ? 'bg-amber-50 text-amber-900 font-semibold border border-amber-200'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{starThreshold}+ Stars</span>
                </div>
                {isSelected && <span className="text-[11px] text-amber-700">Active</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Color Filter */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">Color</h3>
          {filters.selectedColor && (
            <button
              onClick={() => onFilterChange({ selectedColor: undefined })}
              className="text-[11px] text-indigo-600 hover:underline"
            >
              Clear
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {AVAILABLE_COLORS.map((col) => {
            const isSelected = filters.selectedColor?.toLowerCase() === col.name.toLowerCase();
            return (
              <button
                key={col.name}
                type="button"
                onClick={() =>
                  onFilterChange({
                    selectedColor: isSelected ? undefined : col.name,
                  })
                }
                title={col.name}
                className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${col.bg} ${
                  isSelected
                    ? 'ring-2 ring-indigo-600 ring-offset-2 scale-110'
                    : 'hover:scale-105 border border-slate-300'
                }`}
                aria-label={`Filter by color ${col.name}`}
              >
                {isSelected && <span className="w-2 h-2 rounded-full bg-white shadow-xs" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Size Filter */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">Size / Spec</h3>
          {filters.selectedSize && (
            <button
              onClick={() => onFilterChange({ selectedSize: undefined })}
              className="text-[11px] text-indigo-600 hover:underline"
            >
              Clear
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-1.5">
          {AVAILABLE_SIZES.map((size) => {
            const isSelected = filters.selectedSize === size;
            return (
              <button
                key={size}
                type="button"
                onClick={() =>
                  onFilterChange({
                    selectedSize: isSelected ? undefined : size,
                  })
                }
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
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
    </div>
  );

  return (
    <>
      {/* Desktop Sticky Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 pr-6">
        <div className="sticky top-28 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          {content}
        </div>
      </aside>

      {/* Mobile Drawer / Sheet */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="fixed inset-y-0 right-0 w-full max-w-xs bg-white shadow-2xl p-6 overflow-y-auto flex flex-col z-50">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-200">
              <span className="font-bold text-slate-900 text-base">Filter Catalog</span>
              <button
                onClick={onCloseMobile}
                className="p-1.5 text-slate-500 hover:text-slate-900 rounded-lg"
                aria-label="Close filters"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {content}
            <div className="mt-8 pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={onCloseMobile}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl shadow-md transition-colors"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
