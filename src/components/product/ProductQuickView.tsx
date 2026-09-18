import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { X, Minus, Plus, Heart, ShoppingBag } from 'lucide-react';
import type { Product } from '../../types';
import { fmtINR } from '../../utils/format';
import { StarRating } from '../common/StarRating';
import { ProductImage } from '../common/ProductCard';
import { useCartStore } from '../../store/cartStore';
import { useWishlistStore } from '../../store/wishlistStore';
import { useToast } from '../../hooks/useToast';

export function ProductQuickView({ product, onClose }: { product: Product | null; onClose: () => void }) {
  const addToCart = useCartStore((s) => s.add);
  const wished = useWishlistStore((s) => (product ? s.has(product.id) : false));
  const toggleWishlist = useWishlistStore((s) => s.toggle);
  const toast = useToast();

  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [qty, setQty] = useState(1);
  const [sizeError, setSizeError] = useState(false);

  useEffect(() => {
    if (product) {
      setSelectedColor(product.colors[0] ?? null);
      setSelectedSize(null);
      setQty(1);
      setSizeError(false);
    }
  }, [product]);

  if (!product) return null;

  function handleAddToCart() {
    if (product!.sizes.length && !selectedSize) {
      setSizeError(true);
      return;
    }
    addToCart(product!.id, { size: selectedSize, color: selectedColor, qty });
    toast.show('Added to bag', 'bag');
    onClose();
  }

  return (
    <div className="fixed inset-0 z-[95] bg-deep-obsidian/60 backdrop-blur-sm flex items-center justify-center px-margin-mobile" onClick={onClose}>
      <div
        className="relative w-full max-w-3xl max-h-[88vh] overflow-y-auto bg-surface-container-lowest rounded-xl border border-slate-border shadow-[0_24px_64px_rgba(15,23,42,0.18)] grid grid-cols-1 md:grid-cols-2"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          aria-label="Close quick view"
          onClick={onClose}
          className="absolute md:hidden top-3 right-3 z-10 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center shadow-sm"
        >
          <X size={20} />
        </button>

        <div className="relative aspect-[3/4] md:aspect-auto md:h-full bg-surface-container">
          <ProductImage images={product.images} seed={product.id} hue={product.hue} index={0} alt={product.name} />
        </div>

        <div className="relative flex flex-col gap-space-sm p-space-lg">
          <button
            aria-label="Close quick view"
            onClick={onClose}
            className="hidden md:flex absolute top-4 right-4 w-9 h-9 rounded-full items-center justify-center text-outline hover:text-on-surface hover:bg-surface-container transition-colors"
          >
            <X size={20} />
          </button>

          <span className="font-label-caps text-label-caps text-secondary uppercase tracking-widest">{product.brand}</span>
          <h2 className="font-headline-sm text-headline-sm text-deep-obsidian font-medium pr-8">{product.name}</h2>
          <div className="flex items-center gap-2">
            <StarRating rating={product.rating} size={14} />
            <span className="font-body-sm text-body-sm text-outline">({product.reviewCount})</span>
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
          <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-3 mt-1">{product.description}</p>

          {product.colors.length > 0 && (
            <div className="mt-2">
              <p className="font-label-md text-label-md text-on-surface font-semibold mb-2">
                Color: <span className="font-normal text-on-surface-variant">{selectedColor}</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((c) => (
                  <button
                    key={c}
                    onClick={() => setSelectedColor(c)}
                    className={`px-3 py-1.5 rounded-full border font-body-sm text-body-sm transition-colors ${
                      selectedColor === c ? 'bg-deep-obsidian text-white border-deep-obsidian' : 'border-slate-border text-on-surface hover:border-deep-obsidian'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}

          {product.sizes.length > 0 && (
            <div className="mt-2">
              <p className="font-label-md text-label-md text-on-surface font-semibold mb-2">Size</p>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => {
                      setSelectedSize(s);
                      setSizeError(false);
                    }}
                    className={`w-11 h-11 rounded border font-label-md text-label-md transition-colors ${
                      selectedSize === s ? 'bg-deep-obsidian text-white border-deep-obsidian' : 'border-slate-border text-on-surface hover:border-deep-obsidian'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
              {sizeError && <p className="font-body-sm text-body-sm text-error mt-1.5">Please select a size to continue.</p>}
            </div>
          )}

          <div className="flex items-center gap-3 mt-3">
            <div className="flex items-center border border-slate-border rounded">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="px-3 py-2 text-outline hover:text-on-surface">
                <Minus size={16} />
              </button>
              <span className="px-3 font-label-md text-label-md">{qty}</span>
              <button onClick={() => setQty((q) => Math.min(product.stock, q + 1))} className="px-3 py-2 text-outline hover:text-on-surface">
                <Plus size={16} />
              </button>
            </div>
            <button
              onClick={() => {
                toggleWishlist(product.id);
                toast.show(useWishlistStore.getState().has(product.id) ? 'Added to wishlist' : 'Removed from wishlist', 'heart');
              }}
              className="w-11 h-11 rounded border border-slate-border flex items-center justify-center hover:border-deep-obsidian transition-colors"
            >
              <Heart size={20} className={wished ? 'text-error' : 'text-on-surface-variant'} fill={wished ? 'currentColor' : 'none'} />
            </button>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mt-2">
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="flex-1 py-3.5 bg-deep-obsidian text-on-primary font-label-md text-label-md rounded flex items-center justify-center gap-2 hover:bg-charcoal-surface transition-all disabled:opacity-40"
            >
              <ShoppingBag size={18} />
              Add to Bag
            </button>
            <Link
              to={`/product/${product.slug}`}
              onClick={onClose}
              className="flex-1 py-3.5 border border-deep-obsidian text-deep-obsidian font-label-md text-label-md rounded flex items-center justify-center hover:bg-surface-container transition-all"
            >
              View Full Details
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}