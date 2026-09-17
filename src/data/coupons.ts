import type { Coupon } from '../types';

export const COUPONS: Coupon[] = [
  { code: 'WELCOME10', type: 'percent', value: 10, maxDiscount: 1500, minOrder: 0, label: '10% off (up to ₹1,500)' },
  { code: 'SAVE500', type: 'flat', value: 500, maxDiscount: 500, minOrder: 4999, label: '₹500 off on orders above ₹4,999' },
  { code: 'FIRSTORDER', type: 'percent', value: 15, maxDiscount: 2000, minOrder: 1999, label: '15% off your first order' },
];

export const SUPPORTED_PINCODES = new Set([
  '110001', '400001', '560001', '700001', '600001', '380001', '411001', '282001', '282002', '226001', '500001', '302001',
]);

export const TRENDING_SEARCHES = [
  'Linen Overshirt', 'Noise-Cancelling Buds', 'Leather Loafer', 'Silk Slip Dress', 'Smart Chronograph',
];
