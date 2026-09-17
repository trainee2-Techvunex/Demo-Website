import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { uid } from '../utils/format';
import type { Address } from '../types';

interface AddressState {
  addresses: Address[];
  selectedId: string | null;
  add: (address: Omit<Address, 'id'>) => Address;
  update: (id: string, patch: Partial<Address>) => void;
  remove: (id: string) => void;
  select: (id: string) => void;
  getSelected: () => Address | null;
}

export const useAddressStore = create<AddressState>()(
  persist(
    (set, get) => ({
      addresses: [],
      selectedId: null,
      add: (address) => {
        const withId: Address = { ...address, id: uid('addr') };
        set({ addresses: [...get().addresses, withId], selectedId: get().selectedId ?? withId.id });
        return withId;
      },
      update: (id, patch) => set({ addresses: get().addresses.map((a) => (a.id === id ? { ...a, ...patch } : a)) }),
      remove: (id) => {
        const addresses = get().addresses.filter((a) => a.id !== id);
        let selectedId = get().selectedId;
        if (selectedId === id) selectedId = addresses.length ? addresses[0].id : null;
        set({ addresses, selectedId });
      },
      select: (id) => set({ selectedId: id }),
      getSelected: () => get().addresses.find((a) => a.id === get().selectedId) ?? null,
    }),
    { name: 'ecommerce_demo_addresses_v1' }
  )
);
