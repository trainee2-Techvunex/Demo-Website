import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Truck, ShieldCheck, RefreshCw, Headset, Star } from 'lucide-react';
import { PRODUCTS } from '../data/products';
import { CATEGORIES } from '../data/categories';
import { ProductCard, ProductImage } from '../components/common/ProductCard';

const TRUST_BENEFITS = [
  { icon: Truck, title: 'Free Shipping', desc: 'On orders above ₹999' },
  { icon: ShieldCheck, title: 'Secure Payments', desc: '256-bit encrypted checkout' },
  { icon: RefreshCw, title: 'Easy Returns', desc: '7-day return window' },
  { icon: Headset, title: '24/7 Support', desc: 'Always here to help' },
];

export function HomePage() {
  const trending = (() => {
    const featured = PRODUCTS.filter((p) => p.badges.includes('BESTSELLER') || p.badges.includes('TRENDING'));
    return (featured.length ? featured : PRODUCTS).slice(0, 4);
  })();
  const flash = PRODUCTS.filter((p) => p.discount >= 25).slice(0, 2);

  return (
    <div className="flex flex-col w-full">
      <section className="w-full bg-deep-obsidian text-surface-container-lowest py-2.5 overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-margin-mobile md:px-margin flex items-center justify-between font-label-caps text-label-caps tracking-widest uppercase">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-champagne-gold animate-pulse" />
            <span className="text-champagne-gold">LUMEN Techvunex Capsule</span>
          </div>
          <div className="hidden md:flex items-center gap-2 text-champagne-light">
            <ShieldCheck size={15} className="text-champagne-gold" />
            <span>Honest Demo Pricing</span>
          </div>
        </div>
      </section>

      <section className="relative w-full overflow-hidden bg-surface-container-low">
        <div className="max-w-[1440px] mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin pt-space-xl md:pt-space-2xl pb-space-2xl md:pb-space-3xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-center">
            <div className="lg:col-span-6 flex flex-col items-start z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-champagne-light rounded-full mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-champagne-gold" />
                <span className="font-label-caps text-label-caps tracking-widest uppercase text-secondary">SS/25 Techvunex Edition</span>
              </div>
              <h1 className="font-display-hero text-display-hero text-deep-obsidian tracking-tight font-light mb-6">
                Style That Moves <br className="hidden sm:inline" />
                <span className="font-normal italic text-secondary">With You.</span>
              </h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl mb-8 leading-relaxed">
                Discover thoughtfully selected fashion, lifestyle, and technology products designed for modern living — a frontend commerce demo by Techvunex Innovations.
              </p>
              <div className="flex flex-wrap items-center gap-4 mb-12 w-full sm:w-auto">
                <Link
                  to="/shop"
                  className="w-full sm:w-auto px-8 py-4 bg-deep-obsidian text-on-primary font-label-md text-label-md rounded-full text-center hover:bg-charcoal-surface transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <span>Shop Collection</span>
                  <ArrowRight size={18} />
                </Link>
                <a
                  href="#categories-section"
                  className="w-full sm:w-auto px-8 py-4 bg-surface-container-lowest text-deep-obsidian font-label-md text-label-md rounded-full text-center hover:bg-surface-variant transition-all shadow-sm flex items-center justify-center"
                >
                  Explore Categories
                </a>
              </div>
              <div className="w-full pt-8 grid grid-cols-3 gap-4 bg-surface-container-lowest/80 rounded-xl p-5 backdrop-blur-sm shadow-sm">
                <div className="flex flex-col">
                  <span className="font-headline-sm text-headline-sm text-deep-obsidian font-semibold">100k+</span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">Happy Customers</span>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-1">
                    <span className="font-headline-sm text-headline-sm text-deep-obsidian font-semibold">4.9/5</span>
                    <Star size={16} className="text-champagne-gold" fill="currentColor" />
                  </div>
                  <span className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">Verified Reviews</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-headline-sm text-headline-sm text-deep-obsidian font-semibold">{PRODUCTS.length}</span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">Curated Products</span>
                </div>
              </div>
            </div>
            <div className="lg:col-span-6 relative h-[340px] md:h-[440px]">
              <div className="absolute inset-0 rounded-xl overflow-hidden border border-slate-border shadow-[0_24px_64px_rgba(15,23,42,0.08)]">
                <ProductImage images={PRODUCTS[0].images} seed={PRODUCTS[0].id} hue={PRODUCTS[0].hue} index={0} alt={PRODUCTS[0].name} />
              </div>
              <div className="absolute -bottom-6 -left-6 w-40 h-52 rounded-xl overflow-hidden border-4 border-surface-container-lowest shadow-[0_24px_64px_rgba(15,23,42,0.12)] hidden sm:block">
                <ProductImage images={PRODUCTS[6].images} seed={PRODUCTS[6].id} hue={PRODUCTS[6].hue} index={0} alt={PRODUCTS[6].name} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-[1440px] mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin py-space-2xl grid grid-cols-2 md:grid-cols-4 gap-space-md">
        {TRUST_BENEFITS.map(({ icon: Icon, title, desc }) => (
          <div key={title} className="flex flex-col items-center text-center gap-2 p-space-md bg-surface-container-lowest border border-slate-border rounded-lg">
            <Icon size={28} className="text-champagne-gold" />
            <span className="font-label-md text-label-md text-on-surface font-semibold">{title}</span>
            <span className="font-body-sm text-body-sm text-on-surface-variant">{desc}</span>
          </div>
        ))}
      </section>

      <section id="categories-section" className="max-w-[1440px] mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin py-space-xl">
        <div className="flex items-end justify-between mb-space-lg">
          <div>
            <span className="font-label-caps text-label-caps text-secondary uppercase tracking-widest">Curated Edit</span>
            <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-deep-obsidian font-light mt-1">Shop By Category</h2>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-space-md">
          {CATEGORIES.map((c) => {
            const sample = PRODUCTS.find((p) => p.category === c.id)!;
            return (
              <Link key={c.id} to={`/shop/${c.id}`} className="group flex flex-col gap-2">
                <div className="aspect-square rounded-lg overflow-hidden border border-slate-border relative">
                  <ProductImage images={sample.images} seed={sample.id} hue={sample.hue} index={0} alt={c.name} />
                  <div className="absolute inset-0 bg-deep-obsidian/0 group-hover:bg-deep-obsidian/10 transition-colors" />
                </div>
                <span className="font-label-md text-label-md text-on-surface font-medium text-center">{c.name}</span>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="max-w-[1440px] mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin py-space-xl">
        <div className="flex items-end justify-between mb-space-lg">
          <div>
            <span className="font-label-caps text-label-caps text-secondary uppercase tracking-widest">Handpicked</span>
            <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-deep-obsidian font-light mt-1">Trending Now</h2>
          </div>
          <Link to="/shop" className="font-label-md text-label-md text-deep-obsidian underline underline-offset-4 hover:text-secondary hidden sm:inline">
            View All →
          </Link>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-space-md">
          {trending.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {flash.length > 0 && (
        <section className="max-w-[1440px] mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin py-space-xl">
          <div className="bg-deep-obsidian rounded-xl p-space-lg md:p-space-xl flex flex-col md:flex-row items-center justify-between gap-space-md mb-space-lg">
            <div>
              <span className="font-label-caps text-label-caps text-champagne-gold uppercase tracking-widest">Limited Time</span>
              <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-white font-light mt-1">Flash Sale</h2>
            </div>
            <span className="font-body-md text-body-md text-white/70">Up to 40% off select pieces — while stocks last.</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
            {flash.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      <section className="relative w-full h-[280px] md:h-[360px] overflow-hidden mt-space-xl">
        <ProductImage images={PRODUCTS[3].images} seed={PRODUCTS[3].id} hue={PRODUCTS[3].hue} index={0} className="absolute inset-0" alt="" />
        <div className="absolute inset-0 bg-deep-obsidian/40 flex flex-col items-center justify-center text-center px-6">
          <span className="font-label-caps text-label-caps text-champagne-gold uppercase tracking-widest mb-2">Techvunex Edition</span>
          <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-white font-light mb-4">Upgrade Your Everyday</h2>
          <Link to="/shop" className="px-8 py-3 bg-white text-deep-obsidian font-label-md text-label-md rounded-full hover:bg-surface-container transition-colors">
            Shop New Arrivals
          </Link>
        </div>
      </section>
    </div>
  );
}
