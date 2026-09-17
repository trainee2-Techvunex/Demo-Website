import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, Search, Heart, ShoppingBag, User } from 'lucide-react';
import { LumenLogo } from '../common/LumenLogo';
import { CATEGORIES } from '../../data/categories';
import { useWishlistStore } from '../../store/wishlistStore';
import { useCartTotals } from '../../store/cartStore';
import { fmtINR } from '../../utils/format';

const NAV_LINKS = [
  { path: '/', label: 'Home' },
  { path: '/shop', label: 'Shop All' },
  { path: '/shop/men', label: 'Men' },
  { path: '/shop/women', label: 'Women' },
  { path: '/shop/electronics', label: 'Electronics' },
  { path: '/shop/accessories', label: 'Accessories' },
];

export function Header({ onOpenSearch, onOpenCart }: { onOpenSearch: () => void; onOpenCart: () => void }) {
  const { pathname } = useLocation();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const wishlistCount = useWishlistStore((s) => s.items.length);
  const cart = useCartTotals();
  const cartCount = cart.lines.reduce((sum, l) => sum + l.qty, 0);

  return (
    <header className="fixed top-0 inset-x-0 z-50">
      <div className="bg-deep-obsidian text-on-primary border-b border-white/10 px-margin-mobile md:px-margin-tablet lg:px-margin">
        <div className="h-9 max-w-[1440px] mx-auto flex items-center justify-between font-body-sm text-body-sm">
          <div className="hidden lg:flex items-center gap-space-md text-outline-variant">
            <span className="flex items-center gap-1 font-label-caps text-label-caps uppercase tracking-wider text-champagne-gold">
              <span className="w-1.5 h-1.5 rounded-full bg-champagne-gold animate-pulse" />
              Techvunex Atelier
            </span>
          </div>
          <div className="flex-1 text-center font-label-md text-label-md tracking-wide text-surface-container-lowest">
            <span className="font-label-caps text-label-caps tracking-widest uppercase bg-white/10 px-2 py-0.5 rounded text-champagne-gold mr-2">
              Demo
            </span>
            Free Shipping on Orders Above ₹999 <span className="text-white/30 px-1">•</span> Use Code{' '}
            <span className="underline font-semibold text-white">FIRSTORDER</span> for 15% off
          </div>
          <div className="hidden sm:flex items-center gap-space-md font-label-md text-label-md text-outline-variant">
            <span>INR (₹)</span>
          </div>
        </div>
      </div>

      <div className="bg-surface-container-lowest/90 backdrop-blur-xl border-b border-slate-border shadow-[0_8px_30px_rgba(15,23,42,0.04)]">
        <div className="h-20 max-w-[1440px] mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin flex items-center justify-between gap-space-md">
          <div className="flex items-center gap-3">
            <button
              aria-label="Menu"
              className="xl:hidden w-10 h-10 flex items-center justify-center text-deep-obsidian"
              onClick={() => setMobileNavOpen((v) => !v)}
            >
              <Menu size={24} />
            </button>
            <Link to="/" className="flex items-center gap-2">
              <LumenLogo height={32} />
            </Link>
          </div>

          <nav className="hidden xl:flex items-center gap-space-lg">
            {NAV_LINKS.map((link) => {
              const active = pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`py-2 font-label-md text-[16px] transition-colors ${
                    active ? 'text-deep-obsidian font-semibold border-b-2 border-champagne-gold' : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-space-sm md:gap-space-md">
            <button
              aria-label="Search"
              onClick={onOpenSearch}
              className="w-10 h-10 rounded-full flex items-center justify-center text-on-surface-variant hover:text-deep-obsidian hover:bg-surface-container transition-colors"
            >
              <Search size={22} />
            </button>
            <Link
              to="/wishlist"
              aria-label="Wishlist"
              className="relative w-10 h-10 rounded-full flex items-center justify-center text-on-surface-variant hover:text-deep-obsidian hover:bg-surface-container transition-colors"
            >
              <Heart size={22} />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-champagne-gold text-deep-obsidian font-label-caps text-[10px] rounded-full flex items-center justify-center font-bold">
                  {wishlistCount}
                </span>
              )}
            </Link>
            <button
              aria-label="Cart"
              onClick={onOpenCart}
              className="flex items-center gap-2 pl-3 pr-4 py-2 rounded-full border border-slate-border hover:border-deep-obsidian bg-surface-container-lowest transition-all"
            >
              <div className="relative flex items-center">
                <ShoppingBag size={20} className="text-deep-obsidian" />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 w-4 h-4 bg-deep-obsidian text-on-primary font-label-caps text-[10px] rounded-full flex items-center justify-center font-medium">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="hidden md:inline font-label-md text-label-md text-deep-obsidian font-semibold">{fmtINR(cart.subtotal)}</span>
            </button>
            <Link to="/account" aria-label="Account" className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <User size={18} className="text-on-primary" />
            </Link>
          </div>
        </div>

        {mobileNavOpen && (
          <div className="xl:hidden border-t border-slate-border bg-surface-container-lowest px-margin-mobile py-space-md flex flex-col gap-1">
            <Link to="/" onClick={() => setMobileNavOpen(false)} className="py-2 font-label-md text-label-md text-on-surface border-b border-slate-border/60">
              Home
            </Link>
            <Link to="/shop" onClick={() => setMobileNavOpen(false)} className="py-2 font-label-md text-label-md text-on-surface border-b border-slate-border/60">
              Shop All
            </Link>
            {CATEGORIES.map((c) => (
              <Link
                key={c.id}
                to={`/shop/${c.id}`}
                onClick={() => setMobileNavOpen(false)}
                className="py-2 font-label-md text-label-md text-on-surface border-b border-slate-border/60"
              >
                {c.name}
              </Link>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}
