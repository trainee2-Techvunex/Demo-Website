import React from 'react';
import { Link } from 'react-router-dom';
import { X, Lock, Minus, Plus } from 'lucide-react';
import { useCartStore, useCartTotals } from '../../store/cartStore';
import { useWishlistStore } from '../../store/wishlistStore';
import { useToast } from '../../hooks/useToast';
import { fmtINR } from '../../utils/format';
import { ProductImage } from '../common/ProductCard';
import { EmptyState } from '../common/EmptyState';
import { ShoppingBag } from 'lucide-react';
import type { CartLine } from '../../types';

export function CartDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const cart = useCartTotals();
  const setQty = useCartStore((s) => s.setQty);
  const removeLine = useCartStore((s) => s.remove);
  const wishlistAdd = useWishlistStore((s) => s.add);
  const toast = useToast();

  function moveToWishlist(line: CartLine) {
    wishlistAdd(line.productId);
    removeLine(line.id);
    toast.show('Moved to wishlist', 'heart');
  }

  return (
    <div
      className={`fixed inset-y-0 right-0 z-[90] w-full max-w-md bg-surface-container-lowest border-l border-slate-border shadow-[0_24px_64px_rgba(15,23,42,0.18)] transition-transform duration-300 ease-out flex flex-col ${
        open ? '' : 'translate-x-full'
      }`}
    >
      <div className="p-space-lg border-b border-slate-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-headline-sm text-headline-sm font-semibold text-deep-obsidian">Your Cart</span>
          <span className="px-2 py-0.5 rounded-full bg-champagne-light text-secondary font-label-caps text-label-caps">{cart.lines.length} Items</span>
        </div>
        <button onClick={onClose} className="text-outline hover:text-on-surface transition-colors">
          <X size={24} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-space-lg flex flex-col gap-space-md">
        {cart.lines.length === 0 ? (
          <EmptyState icon={ShoppingBag} title="Your cart is empty" message="Add something you love to get started." ctaLabel="Continue Shopping" ctaPath="/shop" />
        ) : (
          cart.lines.map((line) => (
            <div key={line.id} className="flex gap-space-md pb-space-md border-b border-slate-border">
              <Link to={`/product/${line.product.slug}`} onClick={onClose} className="w-20 h-24 shrink-0 rounded border border-slate-border overflow-hidden">
                <ProductImage images={line.product.images} seed={line.product.id} hue={line.product.hue} index={0} alt={line.product.name} />
              </Link>
              <div className="flex-1 flex flex-col justify-between min-w-0">
                <div>
                  <div className="flex justify-between items-start gap-2">
                    <h4 className="font-title-editorial text-title-editorial text-on-surface font-medium line-clamp-1">{line.product.name}</h4>
                    <span className="font-label-md text-label-md font-semibold text-on-surface shrink-0">{fmtINR(line.lineTotal)}</span>
                  </div>
                  <p className="font-body-sm text-body-sm text-outline mt-0.5">
                    {line.color ? `Color: ${line.color}` : ''}
                    {line.color && line.size ? ' | ' : ''}
                    {line.size ? `Size: ${line.size}` : ''}
                  </p>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <div className="flex items-center border border-slate-border rounded">
                    <button onClick={() => setQty(line.id, line.qty - 1)} className="px-2 py-0.5 text-outline hover:text-on-surface">
                      <Minus size={14} />
                    </button>
                    <span className="px-2 font-label-md text-label-md">{line.qty}</span>
                    <button onClick={() => setQty(line.id, line.qty + 1)} className="px-2 py-0.5 text-outline hover:text-on-surface">
                      <Plus size={14} />
                    </button>
                  </div>
                  <div className="flex items-center gap-3">
                    <button onClick={() => moveToWishlist(line)} className="font-label-caps text-label-caps text-outline hover:text-secondary transition-colors uppercase tracking-wider">
                      Save
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
          ))
        )}
      </div>

      {cart.lines.length > 0 && (
        <div className="p-space-lg border-t border-slate-border bg-surface-container-lowest flex flex-col gap-space-sm">
          <div className="flex justify-between font-body-sm text-body-sm text-outline mt-2">
            <span>Subtotal</span>
            <span className="text-on-surface font-medium">{fmtINR(cart.subtotal)}</span>
          </div>
          {cart.couponDiscount > 0 && (
            <div className="flex justify-between font-body-sm text-body-sm text-secondary">
              <span>Coupon Discount</span>
              <span className="font-medium">-{fmtINR(cart.couponDiscount)}</span>
            </div>
          )}
          <div className="flex justify-between font-body-sm text-body-sm text-outline">
            <span>Delivery</span>
            <span className={cart.deliveryCharge === 0 ? 'text-champagne-gold font-semibold' : 'text-on-surface font-medium'}>
              {cart.deliveryCharge === 0 ? 'Free' : fmtINR(cart.deliveryCharge)}
            </span>
          </div>
          <div className="flex justify-between font-headline-sm text-headline-sm font-bold text-deep-obsidian pt-2 border-t border-slate-border">
            <span>Total</span>
            <span>{fmtINR(cart.total)}</span>
          </div>
          <Link to="/cart" onClick={onClose} className="w-full py-3 border border-slate-border text-deep-obsidian font-label-md text-label-md rounded text-center hover:bg-surface-container transition-colors">
            View Cart
          </Link>
          <Link
            to="/checkout"
            onClick={onClose}
            className="w-full py-3.5 bg-deep-obsidian text-on-primary font-label-md text-label-md rounded flex items-center justify-center gap-2 hover:bg-charcoal-surface transition-all"
          >
            <Lock size={18} />
            <span>Proceed to Checkout</span>
          </Link>
        </div>
      )}
    </div>
  );
}
