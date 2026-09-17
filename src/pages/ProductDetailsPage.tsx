import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Heart, Minus, Plus, ShoppingBag, ChevronDown, Truck, ShieldCheck } from 'lucide-react';
import { getProduct, PRODUCTS } from '../data/products';
import { fmtINR } from '../utils/format';
import { StarRating } from '../components/common/StarRating';
import { ProductImage } from '../components/common/ProductCard';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { ProductCard } from '../components/common/ProductCard';
import { Categories } from './Categories';
import { useCartStore } from '../store/cartStore';
import { useWishlistStore } from '../store/wishlistStore';
import { useRecentStore } from '../store/recentStore';
import { useToast } from '../hooks/useToast';
import { checkoutService } from '../services/orderCheckoutAuthService';
import type { PincodeCheckResult } from '../types';

function Accordion({ title, children, defaultOpen = false }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div>
      <button onClick={() => setOpen((o) => !o)} className="w-full flex items-center justify-between py-space-sm text-left">
        <span className="font-label-md text-label-md text-on-surface font-semibold">{title}</span>
        <ChevronDown size={20} className={`text-outline transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && <div className="font-body-sm text-body-sm text-on-surface-variant pb-space-sm">{children}</div>}
    </div>
  );
}

export function ProductDetailsPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const product = slug ? getProduct(slug) : null;
  const toast = useToast();
  const addToCart = useCartStore((s) => s.add);
  const wished = useWishlistStore((s) => (product ? s.has(product.id) : false));
  const toggleWishlist = useWishlistStore((s) => s.toggle);
  const track = useRecentStore((s) => s.track);
  const recentList = useRecentStore((s) => s.list);

  const [activeImage, setActiveImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string | null>(product?.colors[0] ?? null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [qty, setQty] = useState(1);
  const [sizeError, setSizeError] = useState(false);
  const [pincode, setPincode] = useState('');
  const [pincodeResult, setPincodeResult] = useState<PincodeCheckResult | null>(null);
  const [checkingPincode, setCheckingPincode] = useState(false);

  useEffect(() => {
    if (!product) return;
    setActiveImage(0);
    setSelectedColor(product.colors[0] ?? null);
    setSelectedSize(null);
    setQty(1);
    setSizeError(false);
    setPincodeResult(null);
    track(product.id);
    window.scrollTo({ top: 0 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product?.id]);

  if (!product) return <Categories />;

  const related = PRODUCTS.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);
  const recentlyViewed = recentList(product.id).slice(0, 4);

  function validateOptions() {
    if (product!.sizes.length && !selectedSize) {
      setSizeError(true);
      return false;
    }
    return true;
  }

  function handleAddToCart() {
    if (!validateOptions()) return;
    addToCart(product!.id, { size: selectedSize, color: selectedColor, qty });
    toast.show('Added to bag', 'bag');
  }

  function handleBuyNow() {
    if (!validateOptions()) return;
    addToCart(product!.id, { size: selectedSize, color: selectedColor, qty });
    navigate('/checkout');
  }

  function handlePincodeCheck() {
    setCheckingPincode(true);
    checkoutService.checkPincode(pincode.trim()).then((res) => {
      setPincodeResult(res);
      setCheckingPincode(false);
    });
  }

  return (
    <div className="max-w-[1440px] mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin py-space-lg">
      <Breadcrumb items={[{ label: 'Home', path: '/' }, { label: product.categoryName, path: `/shop/${product.category}` }, { label: product.name }]} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-space-xl mt-space-md">
        <div className="flex flex-col gap-3">
          <div className="relative aspect-[3/4] rounded-lg overflow-hidden border border-slate-border bg-surface-container">
            <ProductImage images={product.images} seed={product.id} hue={product.hue} index={activeImage} alt={product.name} />
          </div>
          <div className="flex gap-2 overflow-x-auto">
            {Array.from({ length: product.images?.length ?? 1 }).map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveImage(i)}
                className={`w-16 h-20 shrink-0 rounded border overflow-hidden ${i === activeImage ? 'border-deep-obsidian' : 'border-slate-border'}`}
              >
                <ProductImage images={product.images} seed={product.id} hue={product.hue} index={i} alt={`${product.name} ${i + 1}`} />
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-space-sm">
          <span className="font-label-caps text-label-caps text-secondary uppercase tracking-widest">{product.brand}</span>
          <h1 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-deep-obsidian font-light">{product.name}</h1>
          <div className="flex items-center gap-2">
            <StarRating rating={product.rating} size={16} />
            <span className="font-body-sm text-body-sm text-outline">
              {product.rating} ({product.reviewCount} reviews)
            </span>
          </div>
          <div className="flex items-center gap-3 mt-1">
            <span className="font-price-lg text-price-lg text-deep-obsidian text-2xl">{fmtINR(product.price)}</span>
            {product.discount > 0 && (
              <>
                <span className="font-body-md text-body-md text-outline line-through">{fmtINR(product.mrp)}</span>
                <span className="font-label-caps text-label-caps text-error">{product.discount}% OFF</span>
              </>
            )}
          </div>
          <p className="font-body-md text-body-md text-on-surface-variant mt-2">{product.description}</p>

          <div className="mt-3">
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

          {product.sizes.length > 0 && (
            <div className="mt-3">
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

          <div className={`mt-2 font-body-sm text-body-sm ${product.stock > 0 && product.stock <= 5 ? 'text-error' : product.stock === 0 ? 'text-outline' : 'text-secondary'}`}>
            {product.stock === 0 ? 'Out of stock' : product.stock <= 5 ? `Only ${product.stock} left — order soon` : 'In stock'}
          </div>

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
            <button
              onClick={handleBuyNow}
              disabled={product.stock === 0}
              className="flex-1 py-3.5 border border-deep-obsidian text-deep-obsidian font-label-md text-label-md rounded hover:bg-surface-container transition-all disabled:opacity-40"
            >
              Buy Now
            </button>
          </div>

          <div className="mt-space-md p-space-md border border-slate-border rounded-lg bg-surface-container-low">
            <p className="font-label-md text-label-md text-on-surface font-semibold mb-2">Check Delivery</p>
            <div className="flex gap-2">
              <input
                value={pincode}
                onChange={(e) => setPincode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                maxLength={6}
                placeholder="Enter 6-digit pincode"
                className="flex-1 px-3 py-2 border border-slate-border rounded font-body-sm text-body-sm focus:outline-none focus:border-secondary"
              />
              <button onClick={handlePincodeCheck} className="px-4 py-2 bg-deep-obsidian text-on-primary rounded font-label-md text-label-md">
                Check
              </button>
            </div>
            <div className="mt-2 font-body-sm text-body-sm">
              {checkingPincode && <span className="text-outline">Checking...</span>}
              {!checkingPincode && pincodeResult && !pincodeResult.supported && <span className="text-error">{pincodeResult.message}</span>}
              {!checkingPincode && pincodeResult && pincodeResult.supported && (
                <div className="flex flex-col gap-0.5 text-secondary">
                  <span className="flex items-center gap-1">
                    <Truck size={16} />
                    Delivery available — arrives by {pincodeResult.expectedDate}
                  </span>
                  <span className="flex items-center gap-1 text-on-surface-variant">
                    <ShieldCheck size={16} />
                    Free delivery {pincodeResult.codAvailable ? '· COD available' : ''}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="mt-space-md flex flex-col divide-y divide-slate-border border-t border-b border-slate-border">
            <Accordion title="Composition & Specifications" defaultOpen>
              {Object.entries(product.specifications).map(([k, v]) => (
                <div key={k} className="flex justify-between py-1">
                  <span className="text-on-surface-variant">{k}</span>
                  <span className="text-on-surface font-medium">{v}</span>
                </div>
              ))}
            </Accordion>
            <Accordion title="Care Guide">
              <ul className="list-disc pl-4 flex flex-col gap-1">
                {product.features.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
            </Accordion>
            <Accordion title="Shipping & Returns">
              <p>
                Standard delivery: {product.delivery.standardDays}. Express delivery: {product.delivery.expressDays}. Easy 7-day returns on unused items.
              </p>
            </Accordion>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-space-2xl">
          <h2 className="font-headline-md text-headline-md text-deep-obsidian font-light mb-space-md">You May Also Like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-space-md">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {recentlyViewed.length > 0 && (
        <section className="mt-space-2xl mb-space-xl">
          <h2 className="font-headline-md text-headline-md text-deep-obsidian font-light mb-space-md">Recently Viewed</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-space-md">
            {recentlyViewed.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}