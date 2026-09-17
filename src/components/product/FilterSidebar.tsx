import React from 'react';
import { Link } from 'react-router-dom';
import { CATEGORIES } from '../../data/categories';
import type { ProductFilters } from '../../types';

const PRICE_RANGES: [number, number, string][] = [
  [0, 3000, 'Under ₹3,000'],
  [3000, 6000, '₹3,000 – ₹6,000'],
  [6000, 10000, '₹6,000 – ₹10,000'],
  [10000, 999999, 'Above ₹10,000'],
];

export interface ShopFilterState {
  category: string | null;
  brands: string[];
  sizes: string[];
  colors: string[];
  minPrice: number | null;
  maxPrice: number | null;
  minRating: number | null;
  minDiscount: number | null;
  inStockOnly: boolean;
}

interface FilterSidebarProps {
  filters: ShopFilterState;
  onChange: (patch: Partial<ShopFilterState>) => void;
  onClearAll: () => void;
  brandOptions: string[];
  sizeOptions: string[];
  colorOptions: string[];
}

export function FilterSidebar({ filters, onChange, onClearAll, brandOptions, sizeOptions, colorOptions }: FilterSidebarProps) {
  function toggleInArray(key: 'sizes' | 'colors', value: string) {
    const current = filters[key];
    onChange({ [key]: current.includes(value) ? current.filter((v) => v !== value) : [...current, value] } as Partial<ShopFilterState>);
  }

  return (
    <div className="flex flex-col gap-space-lg">
      <div className="flex items-center justify-between">
        <span className="font-label-caps text-label-caps uppercase tracking-wider text-deep-obsidian font-semibold">Filters</span>
        <button onClick={onClearAll} className="font-body-sm text-body-sm text-outline hover:text-error">
          Clear All
        </button>
      </div>

      <div>
        <p className="font-label-md text-label-md text-on-surface font-semibold mb-2">Category</p>
        <div className="flex flex-col gap-1.5">
          <Link to="/shop" className={`font-body-sm text-body-sm ${!filters.category ? 'text-deep-obsidian font-semibold' : 'text-on-surface-variant'} hover:text-on-surface`}>
            All Products
          </Link>
          {CATEGORIES.map((c) => (
            <Link
              key={c.id}
              to={`/shop/${c.id}`}
              className={`font-body-sm text-body-sm ${filters.category === c.id ? 'text-deep-obsidian font-semibold' : 'text-on-surface-variant'} hover:text-on-surface`}
            >
              {c.name}
            </Link>
          ))}
        </div>
      </div>

      <div>
        <p className="font-label-md text-label-md text-on-surface font-semibold mb-2">Availability</p>
        <label className="flex items-center gap-2 font-body-sm text-body-sm text-on-surface-variant">
          <input type="checkbox" checked={filters.inStockOnly} onChange={(e) => onChange({ inStockOnly: e.target.checked })} />
          In Stock Only
        </label>
      </div>

      <div>
        <p className="font-label-md text-label-md text-on-surface font-semibold mb-2">Price Range</p>
        <div className="flex flex-col gap-2">
          {PRICE_RANGES.map(([min, max, label]) => (
            <label key={label} className="flex items-center gap-2 font-body-sm text-body-sm text-on-surface-variant">
              <input
                type="radio"
                name="price-range"
                checked={filters.minPrice === min && filters.maxPrice === max}
                onChange={() => onChange({ minPrice: min, maxPrice: max })}
              />
              {label}
            </label>
          ))}
        </div>
      </div>

      <div>
        <p className="font-label-md text-label-md text-on-surface font-semibold mb-2">Brand</p>
        <div className="flex flex-col gap-1.5 max-h-40 overflow-y-auto pr-1">
          {brandOptions.map((b) => (
            <label key={b} className="flex items-center gap-2 font-body-sm text-body-sm text-on-surface-variant">
              <input
                type="checkbox"
                checked={filters.brands.includes(b)}
                onChange={() => onChange({ brands: filters.brands.includes(b) ? filters.brands.filter((x) => x !== b) : [...filters.brands, b] })}
              />
              {b}
            </label>
          ))}
        </div>
      </div>

      {sizeOptions.length > 0 && (
        <div>
          <p className="font-label-md text-label-md text-on-surface font-semibold mb-2">Size</p>
          <div className="flex flex-wrap gap-2">
            {sizeOptions.map((s) => (
              <button
                key={s}
                onClick={() => toggleInArray('sizes', s)}
                className={`px-3 py-1.5 rounded border font-body-sm text-body-sm transition-colors ${
                  filters.sizes.includes(s) ? 'bg-deep-obsidian text-white border-deep-obsidian' : 'border-slate-border text-on-surface hover:border-deep-obsidian'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      <div>
        <p className="font-label-md text-label-md text-on-surface font-semibold mb-2">Color</p>
        <div className="flex flex-wrap gap-2">
          {colorOptions.map((c) => (
            <button
              key={c}
              onClick={() => toggleInArray('colors', c)}
              className={`px-3 py-1.5 rounded-full border font-body-sm text-body-sm transition-colors ${
                filters.colors.includes(c) ? 'bg-deep-obsidian text-white border-deep-obsidian' : 'border-slate-border text-on-surface hover:border-deep-obsidian'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="font-label-md text-label-md text-on-surface font-semibold mb-2">Customer Rating</p>
        <div className="flex flex-col gap-1.5">
          {[4, 3].map((r) => (
            <label key={r} className="flex items-center gap-2 font-body-sm text-body-sm text-on-surface-variant">
              <input type="radio" name="rating-filter" checked={filters.minRating === r} onChange={() => onChange({ minRating: r })} />
              {r}★ &amp; above
            </label>
          ))}
        </div>
      </div>

      <div>
        <p className="font-label-md text-label-md text-on-surface font-semibold mb-2">Discount</p>
        <div className="flex flex-col gap-1.5">
          {[10, 20, 30].map((d) => (
            <label key={d} className="flex items-center gap-2 font-body-sm text-body-sm text-on-surface-variant">
              <input type="radio" name="discount-filter" checked={filters.minDiscount === d} onChange={() => onChange({ minDiscount: d })} />
              {d}% or more
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

export const DEFAULT_FILTERS: Omit<ShopFilterState, 'category'> = {
  brands: [],
  sizes: [],
  colors: [],
  minPrice: null,
  maxPrice: null,
  minRating: null,
  minDiscount: null,
  inStockOnly: false,
};

export function filtersToQuery(filters: ShopFilterState, sort: string, query?: string | null): ProductFilters {
  return {
    category: filters.category,
    brands: filters.brands,
    sizes: filters.sizes,
    colors: filters.colors,
    minPrice: filters.minPrice,
    maxPrice: filters.maxPrice,
    minRating: filters.minRating,
    minDiscount: filters.minDiscount,
    inStockOnly: filters.inStockOnly,
    query,
    sort: sort as ProductFilters['sort'],
  };
}
