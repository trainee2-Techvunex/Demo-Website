import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getProduct } from '../data/products';
import type { Product } from '../types';

interface RecentState {
  ids: string[];
  track: (productId: string) => void;
  list: (excludeId?: string) => Product[];
}

export const useRecentStore = create<RecentState>()(
  persist(
    (set, get) => ({
      ids: [],
      track: (productId) => {
        const ids = [productId, ...get().ids.filter((id) => id !== productId)].slice(0, 12);
        set({ ids });
      },
      list: (excludeId) =>
        get()
          .ids.filter((id) => id !== excludeId)
          .map(getProduct)
          .filter((p): p is Product => p !== null),
    }),
    { name: 'ecommerce_demo_recent_v1' }
  )
);
