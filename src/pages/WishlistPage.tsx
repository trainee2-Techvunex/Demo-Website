import { Heart } from 'lucide-react';
import { useWishlistStore } from '../store/wishlistStore';
import { useCartStore } from '../store/cartStore';
import { useToast } from '../hooks/useToast';
import { getProduct } from '../data/products';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { ProductCard } from '../components/common/ProductCard';
import { EmptyState } from '../components/common/EmptyState';

export function WishlistPage() {
  const ids = useWishlistStore((s) => s.items);
  const removeFromWishlist = useWishlistStore((s) => s.remove);
  const addToCart = useCartStore((s) => s.add);
  const toast = useToast();
  const products = ids.map(getProduct).filter((p): p is NonNullable<typeof p> => p !== null);

  function moveToCart(productId: string) {
    const product = getProduct(productId);
    if (!product) return;
    addToCart(productId, { size: product.sizes[0] ?? null, color: product.colors[0] ?? null, qty: 1 });
    removeFromWishlist(productId);
    toast.show('Moved to bag', 'bag');
  }

  return (
    <div className="max-w-[1440px] mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin py-space-lg">
      <Breadcrumb items={[{ label: 'Home', path: '/' }, { label: 'Wishlist' }]} />
      <h1 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-deep-obsidian font-light mt-3 mb-space-md">My Wishlist ({products.length})</h1>
      {products.length === 0 ? (
        <EmptyState icon={Heart} title="Your wishlist is empty" message="Save items you love so you can find them easily later." ctaLabel="Discover Products" ctaPath="/shop" />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-space-md">
          {products.map((p) => (
            <div key={p.id} className="flex flex-col gap-2">
              <ProductCard product={p} />
              <button onClick={() => moveToCart(p.id)} className="w-full py-2 border border-slate-border rounded font-label-md text-label-md hover:bg-surface-container transition-colors">
                Move to Bag
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
