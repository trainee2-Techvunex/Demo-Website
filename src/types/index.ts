export interface ProductSpecifications {
  Material: string;
  Origin: string;
  Care: string;
}

export interface ProductDelivery {
  standardDays: string;
  expressDays: string;
}

export type Badge = 'NEW' | 'BESTSELLER' | 'TRENDING' | 'LIMITED' | 'SALE';

export interface Product {
  id: string;
  slug: string;
  name: string;
  brand: string;
  description: string;
  category: string;
  categoryName: string;
  subcategory: string;
  price: number;
  mrp: number;
  discount: number;
  rating: number;
  reviewCount: number;
  stock: number;
  colors: string[];
  sizes: string[];
  specifications: ProductSpecifications;
  features: string[];
  delivery: ProductDelivery;
  badges: Badge[];
  icon: string;
  hue: number;
  imageCount: number;
  images?: string[];
}

export interface Category {
  id: string;
  name: string;
  subs: string[];
}

export interface Coupon {
  code: string;
  type: 'percent' | 'flat';
  value: number;
  maxDiscount: number;
  minOrder: number;
  label: string;
}

export interface CartItem {
  id: string;
  productId: string;
  size: string | null;
  color: string | null;
  qty: number;
}

export interface CartLine extends CartItem {
  product: Product;
  lineTotal: number;
}

export interface CartTotals {
  lines: CartLine[];
  subtotal: number;
  mrpTotal: number;
  productDiscount: number;
  couponDiscount: number;
  deliveryCharge: number;
  total: number;
  deliveryMethod: DeliveryMethod;
  couponCode: string | null;
}

export type DeliveryMethod = 'standard' | 'express';
export type PaymentMethod = 'upi' | 'card' | 'netbanking' | 'wallet' | 'cod';
export type AddressType = 'Home' | 'Work' | 'Other';

export interface Address {
  id: string;
  fullName: string;
  mobile: string;
  pincode: string;
  house: string;
  street: string;
  landmark?: string;
  city: string;
  state: string;
  addressType: AddressType;
}

export interface User {
  name: string;
  email: string;
  joined: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  qty: number;
  size: string | null;
  color: string | null;
  lineTotal: number;
}

export interface OrderAmounts {
  subtotal: number;
  discount: number;
  delivery: number;
  total: number;
  deliveryMethod: DeliveryMethod;
}

export type OrderStage = 'confirmed' | 'packed' | 'shipped' | 'out_for_delivery' | 'delivered';

export interface Order {
  id: string;
  date: string;
  items: OrderItem[];
  amounts: OrderAmounts;
  paymentMethod: PaymentMethod;
  address: Address;
  status: string;
  estimatedDelivery: string;
}

export interface OrderDraft {
  items: OrderItem[];
  amounts: OrderAmounts;
  paymentMethod: PaymentMethod;
  address: Address;
}

export interface PincodeCheckResult {
  valid: boolean;
  supported: boolean;
  message: string;
  expectedDate: string | null;
  codAvailable: boolean;
}

export interface ProductFilters {
  category?: string | null;
  subcategory?: string | null;
  brands?: string[];
  sizes?: string[];
  colors?: string[];
  minPrice?: number | null;
  maxPrice?: number | null;
  minRating?: number | null;
  minDiscount?: number | null;
  inStockOnly?: boolean;
  query?: string | null;
  sort?: SortOption;
}

export type SortOption = 'recommended' | 'newest' | 'price-asc' | 'price-desc' | 'rating' | 'discount';
