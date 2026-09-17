import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Order } from '../types';

interface OrderState {
  orders: Order[];
  addOrder: (order: Order) => void;
  getById: (id: string) => Order | null;
}

export const useOrderStore = create<OrderState>()(
  persist(
    (set, get) => ({
      orders: [],
      addOrder: (order) => set({ orders: [order, ...get().orders] }),
      getById: (id) => get().orders.find((o) => o.id === id) ?? null,
    }),
    { name: 'ecommerce_demo_orders_v1' }
  )
);
