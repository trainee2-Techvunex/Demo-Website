import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { productService } from '../../services/productService';
import { fmtINR } from '../../utils/format';
import { ProductImage } from '../common/ProductCard';
import { useSearchHistoryStore } from '../../store/searchHistoryStore';
import { TRENDING_SEARCHES } from '../../data/coupons';
import type { Product } from '../../types';

export function SearchModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState('');
  const [matches, setMatches] = useState<Product[]>([]);
  const [searching, setSearching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const recent = useSearchHistoryStore((s) => s.terms);
  const addRecent = useSearchHistoryStore((s) => s.add);
  const clearRecent = useSearchHistoryStore((s) => s.clear);

  useEffect(() => {
    if (open) {
      setQuery('');
      setMatches([]);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  useEffect(() => {
    if (!query.trim()) {
      setMatches([]);
      setSearching(false);
      return;
    }
    setSearching(true);
    const handle = setTimeout(() => {
      productService.searchSuggestions(query).then((res) => {
        setMatches(res);
        setSearching(false);
      });
    }, 200);
    return () => clearTimeout(handle);
  }, [query]);

  function runSearch(term: string) {
    addRecent(term);
    onClose();
    navigate(`/search?q=${encodeURIComponent(term)}`);
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80] bg-deep-obsidian/70 backdrop-blur-md flex items-start justify-center pt-28 px-margin-mobile" onClick={onClose}>
      <div className="w-full max-w-3xl bg-surface-container-lowest rounded-xl border border-slate-border shadow-[0_24px_64px_rgba(15,23,42,0.12)] overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="p-space-lg border-b border-slate-border flex items-center gap-space-md">
          <Search size={26} className="text-outline" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && query.trim()) runSearch(query.trim());
            }}
            placeholder="Search products, brands, categories..."
            className="w-full bg-transparent font-title-editorial text-title-editorial text-on-surface focus:outline-none placeholder:text-outline"
          />
          <button onClick={onClose} className="text-outline hover:text-on-surface transition-colors p-1">
            <X size={24} />
          </button>
        </div>

        <div className="p-space-lg bg-surface-container-lowest flex flex-col gap-space-md max-h-[60vh] overflow-y-auto">
          {!query.trim() ? (
            <>
              {recent.length > 0 && (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="font-label-caps text-label-caps uppercase text-outline tracking-wider">Recent Searches</span>
                    <button onClick={clearRecent} className="font-body-sm text-body-sm text-outline hover:text-error">
                      Clear
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {recent.map((t) => (
                      <span
                        key={t}
                        onClick={() => runSearch(t)}
                        className="px-3 py-1.5 rounded-full border border-slate-border font-body-sm text-body-sm text-on-surface hover:border-deep-obsidian cursor-pointer transition-colors"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              <div className="flex flex-col gap-2">
                <span className="font-label-caps text-label-caps uppercase text-outline tracking-wider">Trending Searches</span>
                <div className="flex flex-wrap gap-2">
                  {TRENDING_SEARCHES.map((t) => (
                    <span
                      key={t}
                      onClick={() => runSearch(t)}
                      className="px-3 py-1.5 rounded-full border border-slate-border font-body-sm text-body-sm text-on-surface hover:border-deep-obsidian cursor-pointer transition-colors"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </>
          ) : matches.length === 0 ? (
            <p className="font-body-md text-body-md text-on-surface-variant py-4">
              {searching ? 'Searching…' : `No matches for "${query}". Press Enter to see full search results.`}
            </p>
          ) : (
            <div className="flex flex-col gap-1">
              {matches.map((p) => (
                <Link
                  key={p.id}
                  to={`/product/${p.slug}`}
                  onClick={() => {
                    addRecent(query);
                    onClose();
                  }}
                  className="flex items-center gap-3 p-2 rounded hover:bg-surface-container transition-colors"
                >
                  <div className="w-12 h-14 rounded overflow-hidden border border-slate-border shrink-0">
                    <ProductImage images={p.images} seed={p.id} hue={p.hue} index={0} alt={p.name} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-label-md text-label-md text-on-surface line-clamp-1">{p.name}</p>
                    <p className="font-body-sm text-body-sm text-outline">{p.brand}</p>
                  </div>
                  <span className="font-label-md text-label-md font-semibold text-on-surface">{fmtINR(p.price)}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}