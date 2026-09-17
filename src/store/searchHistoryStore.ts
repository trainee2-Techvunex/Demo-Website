import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SearchHistoryState {
  terms: string[];
  add: (term: string) => void;
  clear: () => void;
}

export const useSearchHistoryStore = create<SearchHistoryState>()(
  persist(
    (set, get) => ({
      terms: [],
      add: (term) => {
        const t = term.trim();
        if (!t) return;
        const terms = [t, ...get().terms.filter((x) => x.toLowerCase() !== t.toLowerCase())].slice(0, 8);
        set({ terms });
      },
      clear: () => set({ terms: [] }),
    }),
    { name: 'ecommerce_demo_recent_searches_v1' }
  )
);
