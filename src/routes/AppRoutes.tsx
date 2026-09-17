import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { HomePage } from '../pages/HomePage';
import { ShopPage } from '../pages/ShopPage';
import { ProductDetailsPage } from '../pages/ProductDetailsPage';
import { SearchPage } from '../pages/SearchPage';
import { WishlistPage } from '../pages/WishlistPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { OrderSuccessPage } from '../pages/OrderSuccessPage';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { AccountPage } from '../pages/AccountPage';
import { TrackOrderPage } from '../pages/TrackOrderPage';
import { Categories } from '../pages/Categories';

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
      <Route path="*" element={<Categories />} />
    </Routes>
  );
}