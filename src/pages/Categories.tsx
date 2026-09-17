import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowRight, Sparkles, Truck, ShieldCheck, RefreshCw, Headset } from 'lucide-react';
import { PRODUCTS } from '../data/products';
import { CATEGORIES } from '../data/categories';
import { ProductCard, ProductImage } from '../components/common/ProductCard';

const SERVICE_HIGHLIGHTS = [
  { icon: Truck, title: 'Free Shipping', desc: 'On orders above ₹999' },
  { icon: ShieldCheck, title: 'Secure Payments', desc: '256-bit encrypted checkout' },
  { icon: RefreshCw, title: 'Easy Returns', desc: '7-day return window' },
  { icon: Headset, title: '24/7 Support', desc: 'Always here to help' },
];

export function Categories() {
  const { pathname } = useLocation();

  // If the URL looks like /shop/<something>, lead with that exact category.
  const attemptedCategoryId = pathname.startsWith('/shop/') ? pathname.split('/')[2] : undefined;
  const matchedCategory = CATEGORIES.find((c) => c.id === attemptedCategoryId);

  const trending = (() => {
    const pool = matchedCategory ? PRODUCTS.filter((p) => p.category === matchedCategory.id) : PRODUCTS;
    const featured = pool.filter((p) => p.badges.includes('BESTSELLER') || p.badges.includes('TRENDING'));
    return (featured.length ? featured : pool).slice(0, 4);
  })();

  return (
    <div className="flex flex-col w-full">
      {/* Hero */}
      <section className="relative w-full overflow-hidden bg-surface-container-low">
        <div className="max-w-[900px] mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin pt-space-2xl pb-space-xl flex flex-col items-center text-center gap-3">
          <span className="inline-flex items-center gap-2 px-3 py-1 bg-champagne-light rounded-full mb-2">
            <Sparkles size={13} className="text-champagne-gold" />
            <span className="font-label-caps text-label-caps tracking-widest uppercase text-secondary">Curated Edit</span>
          </span>
          <h1 className="font-display-hero text-display-hero text-deep-obsidian tracking-tight font-light">
            {matchedCategory ? (
              <>
                Discover <span className="font-normal italic text-secondary">{matchedCategory.name}.</span>
              </>
            ) : (
              <>
                Explore Every <span className="font-normal italic text-secondary">Category.</span>
              </>
            )}
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl leading-relaxed">
            {matchedCategory
              ? `Thoughtfully selected ${matchedCategory.name.toLowerCase()} pieces, curated for modern living.`
              : 'From fashion to lifestyle to technology — browse our full collection, curated for modern living.'}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 mt-4 w-full sm:w-auto">
            <Link
              to={matchedCategory ? `/shop/${matchedCategory.id}` : '/shop'}
              className="w-full sm:w-auto px-8 py-4 bg-deep-obsidian text-on-primary font-label-md text-label-md rounded-full text-center hover:bg-charcoal-surface transition-all shadow-md flex items-center justify-center gap-2"
            >
              <span>{matchedCategory ? `Shop ${matchedCategory.name}` : 'Shop Collection'}</span>
              <ArrowRight size={18} />
            </Link>
            <Link
              to="/"
              className="w-full sm:w-auto px-8 py-4 bg-surface-container-lowest text-deep-obsidian font-label-md text-label-md rounded-full text-center hover:bg-surface-variant transition-all shadow-sm flex items-center justify-center gap-2"
            >
              <span>Back to Home</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-[1440px] mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin py-space-xl w-full">
        <div className="flex items-end justify-between mb-space-lg">
          <div>
            <span className="font-label-caps text-label-caps text-secondary uppercase tracking-widest">Shop By</span>
            <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-deep-obsidian font-light mt-1">All Categories</h2>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-space-md">
          {CATEGORIES.map((c) => {
            const sample = PRODUCTS.find((p) => p.category === c.id);
            if (!sample) return null;
            const isActive = c.id === matchedCategory?.id;
            return (
              <Link key={c.id} to={`/shop/${c.id}`} className="group flex flex-col gap-2">
                <div
                  className={`aspect-square rounded-lg overflow-hidden border relative ${
                    isActive ? 'border-champagne-gold ring-2 ring-champagne-gold/40' : 'border-slate-border'
                  }`}
                >
                  <ProductImage images={sample.images} seed={sample.id} hue={sample.hue} index={0} alt={c.name} />
                  <div className="absolute inset-0 bg-deep-obsidian/0 group-hover:bg-deep-obsidian/10 transition-colors" />
                </div>
                <span className="font-label-md text-label-md text-on-surface font-medium text-center">{c.name}</span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Trending / category-relevant products */}
      {trending.length > 0 && (
        <section className="max-w-[1440px] mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin py-space-xl w-full">
          <div className="flex items-end justify-between mb-space-lg">
            <div>
              <span className="font-label-caps text-label-caps text-secondary uppercase tracking-widest">Handpicked</span>
              <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-deep-obsidian font-light mt-1">
                {matchedCategory ? `Popular in ${matchedCategory.name}` : 'Trending Now'}
              </h2>
            </div>
            <Link
              to={matchedCategory ? `/shop/${matchedCategory.id}` : '/shop'}
              className="font-label-md text-label-md text-deep-obsidian underline underline-offset-4 hover:text-secondary hidden sm:inline"
            >
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-space-md">
            {trending.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Service / trust cards */}
      <section className="max-w-[1440px] mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin pb-space-2xl grid grid-cols-2 md:grid-cols-4 gap-space-md w-full">
        {SERVICE_HIGHLIGHTS.map(({ icon: Icon, title, desc }) => (
          <div key={title} className="flex flex-col items-center text-center gap-2 p-space-md bg-surface-container-lowest border border-slate-border rounded-lg">
            <Icon size={28} className="text-champagne-gold" />
            <span className="font-label-md text-label-md text-on-surface font-semibold">{title}</span>
            <span className="font-body-sm text-body-sm text-on-surface-variant">{desc}</span>
          </div>
        ))}
      </section>
    </div>
  );
}