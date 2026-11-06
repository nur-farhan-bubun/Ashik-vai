import { ArrowRight, Sparkles, ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import { ProductCategory } from '../utils/ecommerce';
import { CATEGORIES, HERO_IMAGE } from '../data/products';

interface HeroProps {
  selectedCategory: ProductCategory | 'all';
  onSelectCategory: (cat: ProductCategory | 'all') => void;
  onExploreClick: () => void;
}

export function Hero({ selectedCategory, onSelectCategory, onExploreClick }: HeroProps) {
  return (
    <section className="relative overflow-hidden pt-4 pb-10 sm:pb-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Large Hero Banner Container */}
        <div className="relative rounded-2xl overflow-hidden bg-slate-900 text-white shadow-xl min-h-[460px] lg:min-h-[520px] flex items-center">
          {/* Background Image with Measured Scrim Gradient */}
          <div className="absolute inset-0 z-0">
            <img
              src={HERO_IMAGE}
              alt="Curated minimalist workspace with premium audio equipment and accessories"
              className="w-full h-full object-cover object-center opacity-45 scale-105 hover:scale-100 transition-transform duration-1000 ease-out"
              referrerPolicy="no-referrer"
            />
            {/* Scrim: Dark gradient ensuring high text contrast */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/75 to-slate-950/20" />
            <div className="absolute inset-0 bg-radial-at-c from-transparent to-slate-950/40" />
          </div>

          {/* Hero Content */}
          <div className="relative z-10 max-w-2xl px-6 py-12 sm:px-10 lg:px-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-indigo-300 text-xs font-semibold tracking-wide uppercase mb-5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Autumn/Winter Collection 2026</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white text-balance leading-[1.15]">
              Engineered for Focus. Crafted for Everyday Living.
            </h1>

            <p className="mt-4 text-base sm:text-lg text-slate-300 font-normal leading-relaxed text-balance max-w-xl">
              Immerse yourself in precision audio, architectural organic apparel, and Japanese-inspired artisanal home objects. Free shipping worldwide on qualifying orders.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={onExploreClick}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 transition-all duration-200 active:scale-95 group"
              >
                <span>Explore Catalog</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                type="button"
                onClick={() => onSelectCategory('Audio & Tech')}
                className="inline-flex items-center justify-center px-5 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-medium text-sm backdrop-blur-md border border-white/20 transition-all duration-200 active:scale-95"
              >
                Audio & Tech Spotlight
              </button>
            </div>
          </div>
        </div>

        {/* Featured Category Pills Grid with Hover Lift Effects */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-3.5">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Browse by Curated Category
            </h2>
            <span className="text-xs text-slate-400 font-medium">Click to filter store</span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {/* "All" button */}
            <button
              type="button"
              onClick={() => onSelectCategory('all')}
              className={`p-4 rounded-xl text-left transition-all duration-200 cursor-pointer border ${
                selectedCategory === 'all'
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-md scale-[1.02]'
                  : 'bg-white hover:bg-slate-50 text-slate-900 border-slate-200/80 shadow-xs hover:shadow-md hover:-translate-y-0.5'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold">All Items</span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-md ${
                    selectedCategory === 'all'
                      ? 'bg-white/20 text-white font-bold'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  10
                </span>
              </div>
              <p
                className={`text-xs mt-1.5 truncate ${
                  selectedCategory === 'all' ? 'text-indigo-100' : 'text-slate-500'
                }`}
              >
                Complete collection
              </p>
            </button>

            {/* Individual categories */}
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => onSelectCategory(cat.id)}
                  className={`p-4 rounded-xl text-left transition-all duration-200 cursor-pointer border ${
                    isSelected
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-md scale-[1.02]'
                      : 'bg-white hover:bg-slate-50 text-slate-900 border-slate-200/80 shadow-xs hover:shadow-md hover:-translate-y-0.5'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold truncate">{cat.name}</span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-md shrink-0 ml-1.5 ${
                        isSelected
                          ? 'bg-white/20 text-white font-bold'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {cat.count}
                    </span>
                  </div>
                  <p
                    className={`text-xs mt-1.5 truncate ${
                      isSelected ? 'text-indigo-100' : 'text-slate-500'
                    }`}
                  >
                    {cat.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Trust Badges / Quantitative Rigor */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">Complimentary Worldwide Shipping</p>
              <p className="text-xs text-slate-500">Free courier delivery on orders over $150</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">30-Day In-Home Trial</p>
              <p className="text-xs text-slate-500">Zero hassle return policy with prepaid label</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">2-Year Precision Warranty</p>
              <p className="text-xs text-slate-500">Comprehensive manufacturer coverage</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
