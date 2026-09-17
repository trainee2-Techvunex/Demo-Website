import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { SlidersHorizontal, X } from 'lucide-react';
import { productService } from '../services/productService';
import { getBrandsForCategory } from '../data/products';
import { CATEGORIES } from '../data/categories';
import { PRODUCTS } from '../data/products';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { ProductCard } from '../components/common/ProductCard';
import { EmptyState } from '../components/common/EmptyState';
import { FilterSidebar, DEFAULT_FILTERS, filtersToQuery, type ShopFilterState } from '../components/product/FilterSidebar';
import { fmtINR } from '../utils/format';
import { SearchX } from 'lucide-react';
import type { Product, SortOption } from '../types';

export function ShopPage() {
  const { category } = useParams<{ category?: string }>();
  const [filters, setFilters] = useState<ShopFilterState>({ category: category ?? null, ...DEFAULT_FILTERS });
  const [sort, setSort] = useState<SortOption>('recommended');
  const [products, setProducts] = useState<Product[]>([]);
  const [mobileSheetOpen, setMobileSheetOpen] = useState(false);

  // Reset filters when the category route param changes (but not on every filter tweak)
  useEffect(() => {
    setFilters({ category: category ?? null, ...DEFAULT_FILTERS });
    setSort('recommended');
  }, [category]);

  useEffect(() => {
    productService.getProducts(filtersToQuery(filters, sort)).then(setProducts);
  }, [filters, sort]);

  const scope = filters.category ? PRODUCTS.filter((p) => p.category === filters.category) : PRODUCTS;
  const brandOptions = useMemo(() => getBrandsForCategory(filters.category), [filters.category]);
  const sizeOptions = useMemo(() => Array.from(new Set(scope.flatMap((p) => p.sizes))).sort(), [scope]);
  const colorOptions = useMemo(() => Array.from(new Set(scope.flatMap((p) => p.colors))).sort(), [scope]);

  const catLabel = filters.category ? CATEGORIES.find((c) => c.id === filters.category)?.name ?? 'Shop' : 'All Products';

  function patchFilters(patch: Partial<ShopFilterState>) {
    setFilters((f) => ({ ...f, ...patch }));
  }
  function clearAll() {
    setFilters({ category: filters.category, ...DEFAULT_FILTERS });
  }

  const activeChips: { label: string; clear: () => void }[] = [];
  if (filters.inStockOnly) activeChips.push({ label: 'In Stock', clear: () => patchFilters({ inStockOnly: false }) });
  if (filters.minPrice != null) {
    activeChips.push({
      label: `${fmtINR(filters.minPrice)} - ${filters.maxPrice! >= 999999 ? '+' : fmtINR(filters.maxPrice!)}`,
      clear: () => patchFilters({ minPrice: null, maxPrice: null }),
    });
  }
  filters.brands.forEach((b) => activeChips.push({ label: b, clear: () => patchFilters({ brands: filters.brands.filter((x) => x !== b) }) }));
  filters.sizes.forEach((s) => activeChips.push({ label: `Size ${s}`, clear: () => patchFilters({ sizes: filters.sizes.filter((x) => x !== s) }) }));
  filters.colors.forEach((c) => activeChips.push({ label: c, clear: () => patchFilters({ colors: filters.colors.filter((x) => x !== c) }) }));
  if (filters.minRating) activeChips.push({ label: `${filters.minRating}★+`, clear: () => patchFilters({ minRating: null }) });
  if (filters.minDiscount) activeChips.push({ label: `${filters.minDiscount}%+ off`, clear: () => patchFilters({ minDiscount: null }) });

  return (
    <div className="max-w-[1440px] mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin py-space-lg">
      <Breadcrumb items={[{ label: 'Home', path: '/' }, { label: 'Shop', path: '/shop' }, ...(filters.category ? [{ label: catLabel }] : [])]} />
      <h1 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-deep-obsidian font-light mt-3 mb-space-md">{catLabel}</h1>

      <div className="flex items-center justify-between gap-space-md mb-space-md flex-wrap">
        <div className="flex flex-wrap gap-2">
          {activeChips.map((chip, i) => (
            <span key={i} onClick={chip.clear} className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-surface-container border border-slate-border font-body-sm text-body-sm text-on-surface cursor-pointer">
              {chip.label}
              <X size={14} />
            </span>
          ))}
        </div>
        <div className="flex items-center gap-3 ml-auto">
          <button onClick={() => setMobileSheetOpen(true)} className="lg:hidden flex items-center gap-1 px-3 py-2 border border-slate-border rounded font-label-md text-label-md">
            <SlidersHorizontal size={18} />
            Filters
          </button>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOption)}
            className="px-3 py-2 border border-slate-border rounded font-label-md text-label-md bg-surface-container-lowest"
          >
            <option value="recommended">Recommended</option>
            <option value="newest">Newest</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Top Rated</option>
            <option value="discount">Highest Discount</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg">
        <aside className="hidden lg:block lg:col-span-3">
          <FilterSidebar filters={filters} onChange={patchFilters} onClearAll={clearAll} brandOptions={brandOptions} sizeOptions={sizeOptions} colorOptions={colorOptions} />
        </aside>
        <div className="lg:col-span-9">
          <p className="font-body-sm text-body-sm text-outline mb-space-md">
            {products.length} product{products.length === 1 ? '' : 's'} found
          </p>
          {products.length === 0 ? (
            <EmptyState icon={SearchX} title="No products match these filters" message="Try adjusting or clearing your filters to see more results." ctaLabel="Clear Filters" ctaPath="/shop" />
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-space-md">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>

      {mobileSheetOpen && (
        <div className="fixed inset-0 z-[85]">
          <div className="absolute inset-0 bg-deep-obsidian/50" onClick={() => setMobileSheetOpen(false)} />
          <div className="absolute inset-x-0 bottom-0 max-h-[85vh] bg-surface-container-lowest rounded-t-xl flex flex-col">
            <div className="p-space-md border-b border-slate-border flex items-center justify-between">
              <span className="font-headline-sm text-headline-sm font-semibold">Filters</span>
              <button onClick={() => setMobileSheetOpen(false)} className="text-outline">
                <X size={22} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-space-md">
              <FilterSidebar filters={filters} onChange={patchFilters} onClearAll={clearAll} brandOptions={brandOptions} sizeOptions={sizeOptions} colorOptions={colorOptions} />
            </div>
            <div className="p-space-md border-t border-slate-border flex gap-2">
              <button onClick={clearAll} className="flex-1 py-3 border border-slate-border rounded font-label-md text-label-md">
                Clear All
              </button>
              <button onClick={() => setMobileSheetOpen(false)} className="flex-1 py-3 bg-deep-obsidian text-on-primary rounded font-label-md text-label-md">
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
