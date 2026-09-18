import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Lock, Minus, Plus, ShoppingBag } from 'lucide-react';
import { useCartStore, useCartTotals } from '../store/cartStore';
import { useWishlistStore } from '../store/wishlistStore';
import { useToast } from '../hooks/useToast';
import { fmtINR } from '../utils/format';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { EmptyState } from '../components/common/EmptyState';
import { ProductImage } from '../components/common/ProductCard';
import { FreeShippingProgress } from '../components/cart/FreeShippingProgress';
import { COUPONS } from '../data/coupons';
import type { CartLine } from '../types';

export function CartPage() {
  const cart = useCartTotals();
  const setQty = useCartStore((s) => s.setQty);
  const removeLine = useCartStore((s) => s.remove);
  const clearCart = useCartStore((s) => s.clear);
  const applyCoupon = useCartStore((s) => s.applyCoupon);
  const removeCoupon = useCartStore((s) => s.removeCoupon);
  const wishlistAdd = useWishlistStore((s) => s.add);
  const toast = useToast();
  const [couponInput, setCouponInput] = useState('');

  function moveToWishlist(line: CartLine) {
    wishlistAdd(line.productId);
    removeLine(line.id);
    toast.show('Saved for later', 'heart');
  }

  function handleApplyCoupon() {
    const res = applyCoupon(couponInput);
    toast.show(res.message, res.ok ? 'offer' : 'error');
  }

  return (
    <div className="max-w-[1440px] mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin py-space-lg">
      <Breadcrumb items={[{ label: 'Home', path: '/' }, { label: 'Cart' }]} />
      <h1 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-deep-obsidian font-light mt-3 mb-space-md">Shopping Bag ({cart.lines.length})</h1>

      {cart.lines.length === 0 ? (
        <EmptyState icon={ShoppingBag} title="Your bag is empty" message="Looks like you haven't added anything yet." ctaLabel="Continue Shopping" ctaPath="/shop" />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg">
          <div className="lg:col-span-8 flex flex-col gap-space-md">
            {cart.lines.map((line) => (
              <div key={line.id} className="flex gap-space-md p-space-md border border-slate-border rounded-lg">
                <Link to={`/product/${line.product.slug}`} className="w-24 h-28 shrink-0 rounded border border-slate-border overflow-hidden">
                  <ProductImage images={line.product.images} seed={line.product.id} hue={line.product.hue} index={0} alt={line.product.name} />
                </Link>
                <div className="flex-1 flex flex-col justify-between min-w-0">
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <Link to={`/product/${line.product.slug}`} className="font-title-editorial text-title-editorial text-on-surface font-medium hover:underline">
                        {line.product.name}
                      </Link>
                      <p className="font-body-sm text-body-sm text-outline mt-0.5">
                        {line.product.brand} {line.color ? `| Color: ${line.color}` : ''} {line.size ? `| Size: ${line.size}` : ''}
                      </p>
                    </div>
                    <span className="font-label-md text-label-md font-semibold text-on-surface shrink-0">{fmtINR(line.lineTotal)}</span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <div className="flex items-center border border-slate-border rounded">
                      <button onClick={() => setQty(line.id, line.qty - 1)} className="px-3 py-1 text-outline hover:text-on-surface">
                        <Minus size={14} />
                      </button>
                      <span className="px-3 font-label-md text-label-md">{line.qty}</span>
                      <button onClick={() => setQty(line.id, line.qty + 1)} className="px-3 py-1 text-outline hover:text-on-surface">
                        <Plus size={14} />
                      </button>
                    </div>
                    <div className="flex items-center gap-4">
                      <button onClick={() => moveToWishlist(line)} className="font-label-caps text-label-caps text-outline hover:text-secondary transition-colors uppercase tracking-wider">
                        Save for Later
                      </button>
                      <button
                        onClick={() => {
                          removeLine(line.id);
                          toast.show('Removed from cart', 'trash');
                        }}
                        className="font-label-caps text-label-caps text-outline hover:text-error transition-colors uppercase tracking-wider"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <button
              onClick={() => {
                clearCart();
                toast.show('Cart cleared', 'trash');
              }}
              className="self-start font-label-caps text-label-caps text-outline hover:text-error uppercase tracking-wider"
            >
              Clear Cart
            </button>
          </div>

          <div className="lg:col-span-4">
            <div className="p-space-lg border border-slate-border rounded-lg bg-surface-container-lowest flex flex-col gap-space-sm sticky top-28">
              <h3 className="font-headline-sm text-headline-sm font-semibold text-deep-obsidian mb-1">Order Summary</h3>
              <FreeShippingProgress subtotal={cart.subtotal} /> 
              <div className="flex gap-2">
                <input
                  value={cart.couponCode ?? couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  disabled={!!cart.couponCode}
                  placeholder="Coupon code"
                  className="flex-1 px-3 py-2 border border-slate-border rounded font-body-sm text-body-sm focus:outline-none focus:border-secondary disabled:bg-surface-container"
                />
                {cart.couponCode ? (
                  <button
                    onClick={() => {
                      removeCoupon();
                      toast.show('Coupon removed');
                    }}
                    className="px-4 py-2 bg-surface-container font-label-md text-label-md text-error rounded hover:bg-surface-container-high transition-colors"
                  >
                    Remove
                  </button>
                ) : (
                  <button onClick={handleApplyCoupon} className="px-4 py-2 bg-surface-container font-label-md text-label-md text-on-surface rounded hover:bg-surface-container-high transition-colors">
                    Apply
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {COUPONS.map((c) => (
                  <span
                    key={c.code}
                    onClick={() => setCouponInput(c.code)}
                    className="px-2 py-1 rounded bg-champagne-light text-secondary font-label-caps text-[10px] uppercase cursor-pointer"
                  >
                    {c.code}
                  </span>
                ))}
              </div>
              <div className="border-t border-slate-border pt-3 mt-2 flex flex-col gap-1.5">
                <div className="flex justify-between font-body-sm text-body-sm text-outline">
                  <span>MRP Total</span>
                  <span>{fmtINR(cart.mrpTotal)}</span>
                </div>
                <div className="flex justify-between font-body-sm text-body-sm text-secondary">
                  <span>Product Discount</span>
                  <span>-{fmtINR(cart.productDiscount)}</span>
                </div>
                {cart.couponDiscount > 0 && (
                  <div className="flex justify-between font-body-sm text-body-sm text-secondary">
                    <span>Coupon Discount</span>
                    <span>-{fmtINR(cart.couponDiscount)}</span>
                  </div>
                )}
                <div className="flex justify-between font-body-sm text-body-sm text-outline">
                  <span>Delivery</span>
                  <span className={cart.deliveryCharge === 0 ? 'text-champagne-gold font-semibold' : ''}>{cart.deliveryCharge === 0 ? 'Free' : fmtINR(cart.deliveryCharge)}</span>
                </div>
                <div className="flex justify-between font-headline-sm text-headline-sm font-bold text-deep-obsidian pt-2 border-t border-slate-border">
                  <span>Total</span>
                  <span>{fmtINR(cart.total)}</span>
                </div>
              </div>
              <Link
                to="/checkout"
                className="w-full py-3.5 mt-2 bg-deep-obsidian text-on-primary font-label-md text-label-md rounded flex items-center justify-center gap-2 hover:bg-charcoal-surface transition-all"
              >
                <Lock size={18} />
                Proceed to Checkout
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
