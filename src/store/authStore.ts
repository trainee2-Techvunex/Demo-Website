import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '../types';

interface AuthState {
  user: User | null;
  login: (email: string) => void;
  register: (name: string, email: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      login: (email) => set({ user: { name: email.split('@')[0], email, joined: new Date().toISOString() } }),
      register: (name, email) => set({ user: { name, email, joined: new Date().toISOString() } }),
      logout: () => set({ user: null }),
    }),
    { name: 'ecommerce_demo_auth_v1' }
  )
);
