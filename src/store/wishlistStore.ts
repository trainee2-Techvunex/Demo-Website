import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WishlistState {
  items: string[]; // product ids
  add: (productId: string) => void;
  remove: (productId: string) => void;
  toggle: (productId: string) => void;
  has: (productId: string) => boolean;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      add: (productId) => {
        if (get().items.includes(productId)) return;
        set({ items: [...get().items, productId] });
      },
      remove: (productId) => set({ items: get().items.filter((id) => id !== productId) }),
      toggle: (productId) => {
        if (get().items.includes(productId)) get().remove(productId);
        else get().add(productId);
      },
      has: (productId) => get().items.includes(productId),
    }),
    { name: 'ecommerce_demo_wishlist_v1' }
  )
);
