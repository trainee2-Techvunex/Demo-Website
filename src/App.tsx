import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { CartDrawer } from './components/layout/CartDrawer';
import { SearchModal } from './components/layout/SearchModal';
import { TechvunexPitch } from './components/layout/TechvunexPitch';
import { AppRoutes } from './routes/AppRoutes';

export default function App() {
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const location = useLocation();

  // Close the cart drawer and scroll to top on every navigation.
  useEffect(() => {
    setCartOpen(false);
    window.scrollTo({ top: 0 });
  }, [location.pathname, location.search]);

  return (
    <>
      <Header onOpenSearch={() => setSearchOpen(true)} onOpenCart={() => setCartOpen(true)} />
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />

      <main className="w-full pt-28 bg-surface" style={{ minHeight: '60vh' }}>
        <AppRoutes />
      </main>

      <Footer />
      <TechvunexPitch />
    </>
  );
}
