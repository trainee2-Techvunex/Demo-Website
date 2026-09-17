import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SearchX } from 'lucide-react';
import { productService } from '../services/productService';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { ProductCard } from '../components/common/ProductCard';
import { EmptyState } from '../components/common/EmptyState';
import type { Product } from '../types';

export function SearchPage() {
  const [params] = useSearchParams();
  const query = params.get('q') ?? '';
  const [results, setResults] = useState<Product[]>([]);

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }
    productService.getProducts({ query }).then(setResults);
  }, [query]);

  return (
    <div className="max-w-[1440px] mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin py-space-lg">
      <Breadcrumb items={[{ label: 'Home', path: '/' }, { label: 'Search' }]} />
      <h1 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-deep-obsidian font-light mt-3 mb-1">Search Results</h1>
      <p className="font-body-md text-body-md text-on-surface-variant mb-space-md">{query ? `Showing results for "${query}"` : 'Enter a search term to find products.'}</p>
      {query && (
        <p className="font-body-sm text-body-sm text-outline mb-space-md">
          {results.length} result{results.length === 1 ? '' : 's'}
        </p>
      )}
      {query && results.length === 0 ? (
        <EmptyState icon={SearchX} title="No results found" message={`We couldn't find anything matching "${query}". Try a different search term.`} ctaLabel="Browse All Products" ctaPath="/shop" />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-space-md">
          {results.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
