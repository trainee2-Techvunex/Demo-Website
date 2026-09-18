import { Link } from 'react-router-dom';
import { CATEGORIES } from '../../data/categories';
import { PRODUCTS } from '../../data/products';
import { ProductImage } from '../common/ProductCard';
import { fmtINR } from '../../utils/format';

/**
 * Hover-revealed mega menu for a single top-nav category link.
 * Shows the category's subcategories plus a couple of featured/trending
 * products from that category so the menu feels editorial rather than a
 * plain dropdown list.
 */
export function MegaMenu({ categoryId, onNavigate }: { categoryId: string; onNavigate: () => void }) {
  const category = CATEGORIES.find((c) => c.id === categoryId);
  if (!category) return null;

  const featured = PRODUCTS.filter((p) => p.category === categoryId)
    .sort((a, b) => (b.badges.includes('TRENDING') ? 1 : 0) - (a.badges.includes('TRENDING') ? 1 : 0))
    .slice(0, 2);

  return (
    <div
      className="absolute left-0 top-full w-full bg-surface-container-lowest border-b border-slate-border shadow-[0_24px_48px_rgba(15,23,42,0.08)]"
      role="menu"
    >
      <div className="max-w-[1440px] mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin py-space-lg grid grid-cols-12 gap-space-lg">
        <div className="col-span-4">
          <span className="font-label-caps text-label-caps uppercase tracking-widest text-outline">
            Shop {category.name}
          </span>
          <div className="flex flex-col gap-2 mt-space-sm">
            <Link
              to={`/shop/${category.id}`}
              onClick={onNavigate}
              className="font-title-editorial text-title-editorial text-deep-obsidian hover:text-secondary transition-colors"
            >
              All {category.name}
            </Link>
            {category.subs.map((sub) => (
              <Link
                key={sub}
                to={`/shop/${category.id}?sub=${encodeURIComponent(sub)}`}
                onClick={onNavigate}
                className="font-body-md text-body-md text-on-surface-variant hover:text-on-surface transition-colors"
              >
                {sub}
              </Link>
            ))}
          </div>
        </div>

        <div className="col-span-8 grid grid-cols-2 gap-space-md">
          {featured.map((p) => (
            <Link
              key={p.id}
              to={`/product/${p.slug}`}
              onClick={onNavigate}
              className="group flex gap-space-sm items-center p-space-sm rounded-lg hover:bg-surface-container transition-colors"
            >
              <div className="w-16 h-20 shrink-0 rounded overflow-hidden border border-slate-border">
                <ProductImage images={p.images} seed={p.id} hue={p.hue} index={0} alt={p.name} />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-label-caps text-label-caps text-outline uppercase tracking-wide">{p.brand}</span>
                <span className="font-label-md text-label-md text-on-surface line-clamp-1">{p.name}</span>
                <span className="font-body-sm text-body-sm text-deep-obsidian font-semibold mt-0.5">{fmtINR(p.price)}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}