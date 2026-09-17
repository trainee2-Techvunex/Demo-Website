import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import type { Product } from '../../types';
import { fmtINR, placeholderImage, productImageUrl } from '../../utils/format';
import { StarRating } from './StarRating';
import { Badge } from './Badge';
import { useWishlistStore } from '../../store/wishlistStore';
import { useCartStore } from '../../store/cartStore';
import { useToast } from '../../hooks/useToast';

/**
 * Product image: loads a real photo from an online placeholder photo service
 * (picsum.photos), seeded per product so the same product always shows the
 * same picture. If the request fails (offline, network blocked, etc.) it
 * falls back to a generated gradient card instead of a broken-image icon.
 */
export function ProductImage({
  seed,
  hue,
  images,
  index = 0,
  className = '',
  alt = '',
}: {
  seed?: string;
  hue: number;
  images?: string[];
  index?: number;
  className?: string;
  alt?: string;
}) {
  const [failed, setFailed] = useState(false);
  const url = images && images[index] ? images[index] : seed ? productImageUrl(seed, index) : undefined;

  if (failed) {
    return (
      <div
        className={`relative w-full h-full overflow-hidden ${className}`}
        style={{ backgroundImage: `url('${placeholderImage(hue, index)}')`, backgroundSize: 'cover', backgroundPosition: 'center' }}
      />
    );
  }

  return (
    // url may be undefined if neither seed nor images provided — browser will show broken image
    <img
      src={url}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      className={`w-full h-full object-cover ${className}`}
    />
  );
}

export function ProductCard({ product }: { product: Product }) {
  const wished = useWishlistStore((s) => s.has(product.id));
  const toggleWishlist = useWishlistStore((s) => s.toggle);
  const addToCart = useCartStore((s) => s.add);
  const toast = useToast();
  const outOfStock = product.stock <= 0;

  function handleWishlistClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
    toast.show(useWishlistStore.getState().has(product.id) ? 'Added to wishlist' : 'Removed from wishlist', 'heart');
  }

  function handleQuickAdd(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (product.sizes.length) return; // needs variant selection on PDP
    addToCart(product.id, { color: product.colors[0] ?? null, qty: 1 });
    toast.show('Added to cart', 'bag');
  }

  return (
    <div className="group flex flex-col bg-surface-container-lowest border border-slate-border rounded-lg overflow-hidden hover:shadow-[0_8px_30px_rgba(15,23,42,0.06)] transition-shadow">
      <Link to={`/product/${product.slug}`} className="relative block aspect-[3/4] bg-surface-container overflow-hidden">
        <ProductImage images={product.images} seed={product.id} hue={product.hue} index={0} alt={product.name} />
        {outOfStock && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
            <span className="font-label-caps text-label-caps uppercase tracking-wider text-on-surface-variant bg-surface-container-lowest px-3 py-1 rounded border border-slate-border">
              Out of Stock
            </span>
          </div>
        )}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.badges.map((b) => (
            <Badge key={b} label={b} />
          ))}
        </div>
        <button
          aria-label="Toggle wishlist"
          onClick={handleWishlistClick}
          className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center shadow-sm hover:bg-white transition-colors"
        >
          <Heart size={18} className={wished ? 'text-error' : 'text-on-surface-variant'} fill={wished ? 'currentColor' : 'none'} />
        </button>
        <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-200">
          <button
            onClick={handleQuickAdd}
            disabled={outOfStock}
            className="w-full py-2.5 bg-deep-obsidian text-on-primary font-label-caps text-label-caps uppercase tracking-wider hover:bg-charcoal-surface transition-colors disabled:opacity-40"
          >
            Quick Add
          </button>
        </div>
      </Link>
      <Link to={`/product/${product.slug}`} className="flex flex-col gap-1 p-3">
        <span className="font-label-caps text-label-caps text-outline uppercase tracking-wide">{product.brand}</span>
        <span className="font-title-editorial text-title-editorial text-on-surface line-clamp-1">{product.name}</span>
        <div className="flex items-center gap-1">
          <StarRating rating={product.rating} size={12} />
          <span className="font-body-sm text-body-sm text-outline ml-1">({product.reviewCount})</span>
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="font-price-lg text-price-lg text-deep-obsidian">{fmtINR(product.price)}</span>
          {product.discount > 0 && (
            <>
              <span className="font-body-sm text-body-sm text-outline line-through">{fmtINR(product.mrp)}</span>
              <span className="font-label-caps text-label-caps text-error">{product.discount}% OFF</span>
            </>
          )}
        </div>
      </Link>
    </div>
  );
}
