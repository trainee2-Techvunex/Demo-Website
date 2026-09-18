import { lazy } from 'react';
import { Routes, Route } from 'react-router-dom';

const HomePage = lazy(() => import('../pages/HomePage').then((m) => ({ default: m.HomePage })));
const ShopPage = lazy(() => import('../pages/ShopPage').then((m) => ({ default: m.ShopPage })));
const ProductDetailsPage = lazy(() => import('../pages/ProductDetailsPage').then((m) => ({ default: m.ProductDetailsPage })));
const SearchPage = lazy(() => import('../pages/SearchPage').then((m) => ({ default: m.SearchPage })));
const WishlistPage = lazy(() => import('../pages/WishlistPage').then((m) => ({ default: m.WishlistPage })));
const CartPage = lazy(() => import('../pages/CartPage').then((m) => ({ default: m.CartPage })));
const CheckoutPage = lazy(() => import('../pages/CheckoutPage').then((m) => ({ default: m.CheckoutPage })));
const OrderSuccessPage = lazy(() => import('../pages/OrderSuccessPage').then((m) => ({ default: m.OrderSuccessPage })));
const LoginPage = lazy(() => import('../pages/LoginPage').then((m) => ({ default: m.LoginPage })));
const RegisterPage = lazy(() => import('../pages/RegisterPage').then((m) => ({ default: m.RegisterPage })));
const AccountPage = lazy(() => import('../pages/AccountPage').then((m) => ({ default: m.AccountPage })));
const TrackOrderPage = lazy(() => import('../pages/TrackOrderPage').then((m) => ({ default: m.TrackOrderPage })));
const Categories = lazy(() => import('../pages/Categories').then((m) => ({ default: m.Categories })));

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/shop" element={<ShopPage />} />
      <Route path="/shop/:category" element={<ShopPage />} />
      <Route path="/product/:slug" element={<ProductDetailsPage />} />
      <Route path="/search" element={<SearchPage />} />
      <Route path="/wishlist" element={<WishlistPage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/order-success" element={<OrderSuccessPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/account" element={<AccountPage />} />
      <Route path="/account/:tab" element={<AccountPage />} />
      <Route path="/account/:tab/:orderId" element={<AccountPage />} />
      <Route path="/track-order" element={<TrackOrderPage />} />
      <Route path="/categories" element={<Categories />} />
      <Route path="*" element={<Categories />} />
    </Routes>
  );
}