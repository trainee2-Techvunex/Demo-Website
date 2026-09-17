import { SUPPORTED_PINCODES } from '../data/coupons';
import { useOrderStore } from '../store/orderStore';
import { useAuthStore } from '../store/authStore';
import type { Order, OrderDraft, PincodeCheckResult } from '../types';

export const checkoutService = {
  checkPincode(pincode: string): Promise<PincodeCheckResult> {
    return new Promise((resolve) => {
      const valid = /^\d{6}$/.test(pincode);
      const supported = valid && SUPPORTED_PINCODES.has(pincode);
      setTimeout(
        () =>
          resolve({
            valid,
            supported,
            message: !valid
              ? 'Enter a valid 6-digit pincode.'
              : supported
              ? 'Delivery available at this pincode.'
              : 'Sorry, delivery is currently unavailable at this pincode.',
            expectedDate: supported ? new Date(Date.now() + 4 * 86400000).toDateString() : null,
            codAvailable: supported,
          }),
        300
      );
    });
  },

  placeOrder(draft: OrderDraft): Promise<Order> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(orderService.createOrder(draft)), 1200);
    });
  },
};

export const orderService = {
  createOrder(draft: OrderDraft): Order {
    const now = new Date();
    const orderId =
      'TVX' +
      now.getFullYear() +
      String(now.getMonth() + 1).padStart(2, '0') +
      String(now.getDate()).padStart(2, '0') +
      String(Math.floor(Math.random() * 9000) + 1000);
    const order: Order = {
      id: orderId,
      date: now.toISOString(),
      items: draft.items,
      amounts: draft.amounts,
      paymentMethod: draft.paymentMethod,
      address: draft.address,
      status: 'confirmed',
      estimatedDelivery: new Date(now.getTime() + (draft.amounts.deliveryMethod === 'express' ? 2 : 5) * 86400000).toDateString(),
    };
    useOrderStore.getState().addOrder(order);
    return order;
  },
};

export const authService = {
  login(email: string, password: string): Promise<void> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!email || !password) return reject(new Error('Email and password are required.'));
        useAuthStore.getState().login(email);
        resolve();
      }, 500);
    });
  },
  register(name: string, email: string, password: string): Promise<void> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!name || !email || !password) return reject(new Error('All fields are required.'));
        useAuthStore.getState().register(name, email);
        resolve();
      }, 500);
    });
  },
  logout(): Promise<void> {
    return new Promise((resolve) => {
      useAuthStore.getState().logout();
      setTimeout(resolve, 100);
    });
  },
};
