import { PRODUCTS, getProduct } from '../data/products';
import { CATEGORIES } from '../data/categories';
import type { Product, ProductFilters, Category } from '../types';

export const productService = {
  getProducts(filters: ProductFilters = {}): Promise<Product[]> {
    return new Promise((resolve) => {
      let list = PRODUCTS.slice();
      if (filters.category) list = list.filter((p) => p.category === filters.category);
      if (filters.subcategory) list = list.filter((p) => p.subcategory === filters.subcategory);
      if (filters.brands?.length) list = list.filter((p) => filters.brands!.includes(p.brand));
      if (filters.sizes?.length) list = list.filter((p) => p.sizes.some((s) => filters.sizes!.includes(s)));
      if (filters.colors?.length) list = list.filter((p) => p.colors.some((c) => filters.colors!.includes(c)));
      if (filters.minPrice != null) list = list.filter((p) => p.price >= filters.minPrice!);
      if (filters.maxPrice != null) list = list.filter((p) => p.price <= filters.maxPrice!);
      if (filters.minRating) list = list.filter((p) => p.rating >= filters.minRating!);
      if (filters.minDiscount) list = list.filter((p) => p.discount >= filters.minDiscount!);
      if (filters.inStockOnly) list = list.filter((p) => p.stock > 0);
      if (filters.query) {
        const q = filters.query.toLowerCase();
        list = list.filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            p.brand.toLowerCase().includes(q) ||
            p.category.toLowerCase().includes(q) ||
            p.subcategory.toLowerCase().includes(q)
        );
      }
      switch (filters.sort) {
        case 'price-asc': list.sort((a, b) => a.price - b.price); break;
        case 'price-desc': list.sort((a, b) => b.price - a.price); break;
        case 'rating': list.sort((a, b) => b.rating - a.rating); break;
        case 'discount': list.sort((a, b) => b.discount - a.discount); break;
        case 'newest': list.sort((a, b) => b.id.localeCompare(a.id)); break;
        default: break;
      }
      setTimeout(() => resolve(list), 0);
    });
  },

  getProductBySlug(slug: string): Promise<Product | null> {
    return new Promise((resolve) => setTimeout(() => resolve(getProduct(slug)), 0));
  },

  getCategories(): Promise<Category[]> {
    return new Promise((resolve) => setTimeout(() => resolve(CATEGORIES), 0));
  },

  searchSuggestions(query: string): Promise<Product[]> {
    return new Promise((resolve) => {
      const q = query.toLowerCase().trim();
      if (!q) return resolve([]);
      const matches = PRODUCTS.filter(
        (p) => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
      ).slice(0, 6);
      setTimeout(() => resolve(matches), 0);
    });
  },
};
