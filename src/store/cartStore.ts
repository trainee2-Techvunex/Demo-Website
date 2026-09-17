import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getProduct } from '../data/products';
import { COUPONS } from '../data/coupons';
import { uid } from '../utils/format';
import type { CartItem, CartTotals, DeliveryMethod } from '../types';

interface CartState {
  items: CartItem[];
  coupon: string | null;
  deliveryMethod: DeliveryMethod;
  add: (productId: string, opts: { size?: string | null; color?: string | null; qty?: number }) => void;
  remove: (lineId: string) => void;
  setQty: (lineId: string, qty: number) => void;
  clear: () => void;
  applyCoupon: (code: string) => { ok: boolean; message: string };
  removeCoupon: () => void;
  setDeliveryMethod: (method: DeliveryMethod) => void;
  moveToWishlistIds: (lineId: string) => string | null; // returns productId to hand off to wishlist store
}

function lineKey(productId: string, size?: string | null, color?: string | null) {
  return [productId, size ?? '', color ?? ''].join('::');
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      coupon: null,
      deliveryMethod: 'standard',

      add: (productId, opts) => {
        const product = getProduct(productId);
        if (!product) return;
        const qty = opts.qty ?? 1;
        const key = lineKey(productId, opts.size, opts.color);
        const items = get().items.slice();
        const idx = items.findIndex((it) => lineKey(it.productId, it.size, it.color) === key);
        const maxStock = product.stock || 0;
        if (idx > -1) {
          items[idx] = { ...items[idx], qty: Math.min(items[idx].qty + qty, maxStock) };
        } else {
          items.push({ id: uid('ci'), productId, size: opts.size ?? null, color: opts.color ?? null, qty: Math.min(qty, maxStock) });
        }
        set({ items });
      },

      remove: (lineId) => set({ items: get().items.filter((it) => it.id !== lineId) }),

      setQty: (lineId, qty) => {
        const items = get().items.map((it) => {
          if (it.id !== lineId) return it;
          const product = getProduct(it.productId);
          const max = product ? product.stock : 99;
          return { ...it, qty: Math.max(1, Math.min(qty, max || 1)) };
        });
        set({ items });
      },

      clear: () => set({ items: [], coupon: null, deliveryMethod: 'standard' }),

      applyCoupon: (code) => {
        const coupon = COUPONS.find((c) => c.code.toUpperCase() === code.toUpperCase().trim());
        if (!coupon) return { ok: false, message: 'Invalid coupon code.' };
        const totals = computeTotalsFor(get().items, null, get().deliveryMethod);
        if (totals.subtotal < coupon.minOrder) {
          return { ok: false, message: `Add items worth ${coupon.minOrder - totals.subtotal} more to use this coupon.` };
        }
        set({ coupon: coupon.code });
        return { ok: true, message: `Coupon ${coupon.code} applied!` };
      },

      removeCoupon: () => set({ coupon: null }),

      setDeliveryMethod: (method) => set({ deliveryMethod: method }),

      moveToWishlistIds: (lineId) => {
        const line = get().items.find((it) => it.id === lineId);
        get().remove(lineId);
        return line ? line.productId : null;
      },
    }),
    {
      name: 'ecommerce_demo_cart_v1',
      partialize: (state) => ({ items: state.items, coupon: state.coupon, deliveryMethod: state.deliveryMethod }),
    }
  )
);

function computeTotalsFor(items: CartItem[], coupon: string | null, deliveryMethod: DeliveryMethod): CartTotals {
  let subtotal = 0;
  let mrpTotal = 0;
  const lines = items
    .map((it) => {
      const product = getProduct(it.productId);
      if (!product) return null;
      const lineTotal = product.price * it.qty;
      subtotal += lineTotal;
      mrpTotal += product.mrp * it.qty;
      return { ...it, product, lineTotal };
    })
    .filter((l): l is NonNullable<typeof l> => l !== null);

  const productDiscount = Math.max(0, mrpTotal - subtotal);
  let couponDiscount = 0;
  if (coupon) {
    const c = COUPONS.find((x) => x.code === coupon);
    if (c && subtotal >= c.minOrder) {
      couponDiscount = c.type === 'percent' ? Math.min(subtotal * (c.value / 100), c.maxDiscount) : c.value;
    }
  }
  const deliveryCharge = deliveryMethod === 'express' ? 149 : subtotal > 0 && subtotal < 999 ? 79 : 0;
  const total = Math.max(0, subtotal - couponDiscount + deliveryCharge);

  return { lines, subtotal, mrpTotal, productDiscount, couponDiscount, deliveryCharge, total, deliveryMethod, couponCode: coupon };
}

/** Selector hook: derive full cart totals (lines joined with product data, discounts, etc). */
export function useCartTotals(): CartTotals {
  const items = useCartStore((s) => s.items);
  const coupon = useCartStore((s) => s.coupon);
  const deliveryMethod = useCartStore((s) => s.deliveryMethod);
  return computeTotalsFor(items, coupon, deliveryMethod);
}
