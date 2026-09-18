import { Link, useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';
import { Heart, Package, Trash2, User, ShieldCheck, KeyRound } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useOrderStore } from '../store/orderStore';
import { useWishlistStore } from '../store/wishlistStore';
import { useAddressStore } from '../store/addressStore';
import { useCartStore } from '../store/cartStore';
import { authService } from '../services/orderCheckoutAuthService';
import { useToast } from '../hooks/useToast';
import { getProduct } from '../data/products';
import { fmtINR } from '../utils/format';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { EmptyState } from '../components/common/EmptyState';
import { ProductCard } from '../components/common/ProductCard';

const TABS: { id: string; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'orders', label: 'Orders' },
  { id: 'wishlist', label: 'Wishlist' },
  { id: 'addresses', label: 'Addresses' },
  { id: 'profile', label: 'Profile' },
  { id: 'security', label: 'Security' },
];

export function AccountPage() {
  const { tab = 'overview', orderId } = useParams<{ tab?: string; orderId?: string }>();
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();
  const toast = useToast();

  function handleLogout() {
    authService.logout().then(() => {
      toast.show('Logged out');
      navigate('/');
    });
  }

  if (!user) {
    return (
      <div className="max-w-[500px] mx-auto px-margin-mobile py-space-2xl">
        <EmptyState icon={User} title="Sign in to view your account" message="Log in to see your orders, wishlist and saved addresses." ctaLabel="Sign In" ctaPath="/login" />
      </div>
    );
  }

  return (
    <div className="max-w-[1100px] mx-auto px-margin-mobile md:px-margin-tablet py-space-lg">
      <Breadcrumb items={[{ label: 'Home', path: '/' }, { label: 'Account' }]} />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-space-lg mt-space-md">
        <aside className="flex md:flex-col gap-1 overflow-x-auto md:overflow-visible">
          <div className="hidden md:flex flex-col gap-1 p-space-md border border-slate-border rounded-lg mb-2">
            <span className="font-label-md text-label-md font-semibold text-on-surface">{user.name}</span>
            <span className="font-body-sm text-body-sm text-on-surface-variant">{user.email}</span>
          </div>
          {TABS.map((t) => (
            <Link
              key={t.id}
              to={t.id === 'overview' ? '/account' : `/account/${t.id}`}
              className={`px-4 py-2.5 rounded font-label-md text-label-md whitespace-nowrap ${tab === t.id ? 'bg-deep-obsidian text-white' : 'text-on-surface hover:bg-surface-container'}`}
            >
              {t.label}
            </Link>
          ))}
          <button onClick={handleLogout} className="px-4 py-2.5 rounded font-label-md text-label-md text-error hover:bg-error/5 text-left whitespace-nowrap">
            Logout
          </button>
        </aside>

        <div className="md:col-span-3">
          {tab === 'orders' && orderId && <OrderDetails orderId={orderId} />}
          {tab === 'orders' && !orderId && <OrdersList />}
          {tab === 'wishlist' && <WishlistTab />}
          {tab === 'addresses' && <AddressesTab />}
          {tab === 'profile' && <ProfileTab />}
          {tab === 'security' && <SecurityTab />}
          {tab === 'overview' && <OverviewTab />}
        </div>
      </div>
    </div>
  );
}

function OverviewTab() {
  const user = useAuthStore((s) => s.user)!;
  const orders = useOrderStore((s) => s.orders);
  const wishlistCount = useWishlistStore((s) => s.items.length);
  const addressCount = useAddressStore((s) => s.addresses.length);

  return (
    <div className="flex flex-col gap-space-md">
      <div className="p-space-lg border border-slate-border rounded-lg">
        <h3 className="font-headline-sm text-headline-sm font-semibold text-deep-obsidian mb-2">Profile</h3>
        <p className="font-body-sm text-body-sm text-on-surface-variant">Name: {user.name}</p>
        <p className="font-body-sm text-body-sm text-on-surface-variant">Email: {user.email}</p>
      </div>
      <div className="grid grid-cols-3 gap-space-sm">
        <div className="p-space-md border border-slate-border rounded-lg text-center">
          <p className="font-headline-sm text-headline-sm font-semibold text-deep-obsidian">{orders.length}</p>
          <p className="font-body-sm text-body-sm text-on-surface-variant">Orders</p>
        </div>
        <div className="p-space-md border border-slate-border rounded-lg text-center">
          <p className="font-headline-sm text-headline-sm font-semibold text-deep-obsidian">{wishlistCount}</p>
          <p className="font-body-sm text-body-sm text-on-surface-variant">Wishlist</p>
        </div>
        <div className="p-space-md border border-slate-border rounded-lg text-center">
          <p className="font-headline-sm text-headline-sm font-semibold text-deep-obsidian">{addressCount}</p>
          <p className="font-body-sm text-body-sm text-on-surface-variant">Addresses</p>
        </div>
      </div>
    </div>
  );
}

function OrdersList() {
  const orders = useOrderStore((s) => s.orders);
  const addToCart = useCartStore((s) => s.add);
  const toast = useToast();

  function buyAgain(orderId: string) {
    const order = orders.find((o) => o.id === orderId);
    if (!order) return;
    let added = 0;
    order.items.forEach((it) => {
      const product = getProduct(it.productId);
      if (product && product.stock > 0) {
        addToCart(product.id, { size: it.size, color: it.color, qty: 1 });
        added++;
      }
    });
    toast.show(added ? 'Items added to bag' : 'Items currently unavailable', added ? 'bag' : 'error');
  }

  if (!orders.length) {
    return <EmptyState icon={Package} title="No orders yet" message="When you place an order, it will show up here." ctaLabel="Start Shopping" ctaPath="/shop" />;
  }

  return (
    <div className="flex flex-col gap-space-sm">
      {orders.map((o) => (
        <div key={o.id} className="p-space-md border border-slate-border rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <p className="font-label-md text-label-md font-semibold text-on-surface">{o.id}</p>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              {new Date(o.date).toDateString()} · {o.items.length} item(s) · {fmtINR(o.amounts.total)}
            </p>
            <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-champagne-light text-secondary font-label-caps text-[10px] uppercase">{o.status}</span>
          </div>
          <div className="flex gap-2">
            <Link to={`/account/orders/${o.id}`} className="px-4 py-2 border border-slate-border rounded font-label-md text-label-md hover:bg-surface-container transition-colors">
              Details
            </Link>
            <Link to={`/track-order?id=${o.id}`} className="px-4 py-2 border border-slate-border rounded font-label-md text-label-md hover:bg-surface-container transition-colors">
              Track
            </Link>
            <button onClick={() => buyAgain(o.id)} className="px-4 py-2 bg-deep-obsidian text-on-primary rounded font-label-md text-label-md hover:bg-charcoal-surface transition-colors">
              Buy Again
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

function OrderDetails({ orderId }: { orderId: string }) {
  const order = useOrderStore((s) => s.getById(orderId));
  const addToCart = useCartStore((s) => s.add);
  const toast = useToast();

  if (!order) {
    return <EmptyState icon={Package} title="Order not found" message="We couldn't find that order." ctaLabel="View All Orders" ctaPath="/account/orders" />;
  }

  function buyAgain() {
    let added = 0;
    order!.items.forEach((it) => {
      const product = getProduct(it.productId);
      if (product && product.stock > 0) {
        addToCart(product.id, { size: it.size, color: it.color, qty: 1 });
        added++;
      }
    });
    toast.show(added ? 'Items added to bag' : 'Items currently unavailable', added ? 'bag' : 'error');
  }

  return (
    <div className="flex flex-col gap-space-md">
      <Link to="/account/orders" className="font-body-sm text-body-sm text-secondary underline self-start">
        ← Back to Orders
      </Link>
      <div className="p-space-lg border border-slate-border rounded-lg">
        <div className="flex justify-between items-center mb-space-sm">
          <span className="font-label-md text-label-md font-semibold text-deep-obsidian">{order.id}</span>
          <span className="px-2 py-0.5 rounded-full bg-champagne-light text-secondary font-label-caps text-[10px] uppercase">{order.status}</span>
        </div>
        <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-sm">Placed on {new Date(order.date).toDateString()}</p>
        <div className="flex flex-col gap-2 border-t border-slate-border pt-2">
          {order.items.map((it, i) => (
            <div key={i} className="flex justify-between font-body-sm text-body-sm text-on-surface-variant">
              <span>
                {it.name} × {it.qty}
                {it.size ? ` (${it.size})` : ''}
              </span>
              <span>{fmtINR(it.lineTotal)}</span>
            </div>
          ))}
        </div>
        <div className="flex justify-between font-headline-sm text-headline-sm font-bold text-deep-obsidian pt-2 mt-2 border-t border-slate-border">
          <span>Total</span>
          <span>{fmtINR(order.amounts.total)}</span>
        </div>
        <p className="font-body-sm text-body-sm text-on-surface-variant mt-space-sm">
          Delivering to: {order.address.fullName}, {order.address.city}, {order.address.state} - {order.address.pincode}
        </p>
        <p className="font-body-sm text-body-sm text-on-surface-variant">
          Payment: <span className="capitalize">{order.paymentMethod}</span>
        </p>
      </div>
      <div className="flex gap-2">
        <Link to={`/track-order?id=${order.id}`} className="px-5 py-2.5 bg-deep-obsidian text-on-primary rounded font-label-md text-label-md">
          Track Order
        </Link>
        <button onClick={buyAgain} className="px-5 py-2.5 border border-slate-border rounded font-label-md text-label-md">
          Buy Again
        </button>
      </div>
    </div>
  );
}

function WishlistTab() {
  const ids = useWishlistStore((s) => s.items);
  const products = ids.map(getProduct).filter((p): p is NonNullable<typeof p> => p !== null);

  if (!products.length) {
    return <EmptyState icon={Heart} title="Your wishlist is empty" message="Save items you love for later." ctaLabel="Discover Products" ctaPath="/shop" />;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-space-md">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}

function AddressesTab() {
  const addresses = useAddressStore((s) => s.addresses);
  const remove = useAddressStore((s) => s.remove);
  const toast = useToast();

  return (
    <div className="flex flex-col gap-space-sm">
      {addresses.length === 0 ? (
        <p className="font-body-md text-body-md text-on-surface-variant">No saved addresses yet.</p>
      ) : (
        addresses.map((a) => (
          <div key={a.id} className="p-space-md border border-slate-border rounded-lg flex justify-between items-start gap-2">
            <div>
              <p className="font-label-md text-label-md font-semibold text-on-surface">
                {a.fullName} <span className="px-2 py-0.5 rounded-full bg-surface-container font-label-caps text-[10px] uppercase text-on-surface-variant ml-1">{a.addressType}</span>
              </p>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                {a.house}, {a.street}, {a.city}, {a.state} - {a.pincode}
              </p>
            </div>
            <button
              onClick={() => {
                remove(a.id);
                toast.show('Address removed');
              }}
              className="text-outline hover:text-error"
            >
              <Trash2 size={20} />
            </button>
          </div>
        ))
      )}
      <Link to="/checkout" className="self-start font-label-md text-label-md text-secondary underline mt-2">
        + Add address during checkout
      </Link>
    </div>
  );
}

function ProfileTab() {
  const user = useAuthStore((s) => s.user)!;
  const updateProfile = useAuthStore((s) => s.updateProfile);
  const toast = useToast();
  const [name, setName] = useState(user.name);
  const [nameError, setNameError] = useState<string | null>(null);

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (name.trim().length < 2) {
      setNameError('Name must be at least 2 characters.');
      return;
    }
    setNameError(null);
    updateProfile({ name: name.trim() });
    toast.show('Profile updated');
  }

  return (
    <div className="flex flex-col gap-space-md">
      <div className="p-space-lg border border-slate-border rounded-lg">
        <h3 className="font-headline-sm text-headline-sm font-semibold text-deep-obsidian mb-space-md">Edit Profile</h3>
        <form onSubmit={handleSave} className="flex flex-col gap-space-sm max-w-sm">
          <label className="flex flex-col gap-1">
            <span className="font-body-sm text-body-sm text-on-surface-variant">Full Name</span>
            <input
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setNameError(null);
              }}
              className={`px-3 py-2 border rounded font-body-md text-body-md focus:outline-none focus:border-secondary ${nameError ? 'border-error' : 'border-slate-border'}`}
            />
            {nameError && <span className="font-body-sm text-body-sm text-error">{nameError}</span>}
          </label>
          <label className="flex flex-col gap-1">
            <span className="font-body-sm text-body-sm text-on-surface-variant">Email Address</span>
            <input value={user.email} disabled className="px-3 py-2 border border-slate-border rounded font-body-md text-body-md bg-surface-container text-outline" />
            <span className="font-body-sm text-body-sm text-outline">Email is used as your account identifier and can't be changed in this demo.</span>
          </label>
          <button type="submit" className="self-start px-6 py-2.5 mt-1 bg-deep-obsidian text-on-primary font-label-md text-label-md rounded hover:bg-charcoal-surface transition-colors">
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}

function SecurityTab() {
  const toast = useToast();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    if (newPassword.length < 8) {
      setError('New password must be at least 8 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('New password and confirmation do not match.');
      return;
    }
    setError(null);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    toast.show('Password updated');
  }

  return (
    <div className="flex flex-col gap-space-md">
      <div className="p-space-lg border border-slate-border rounded-lg">
        <div className="flex items-center gap-2 mb-space-md">
          <KeyRound size={20} className="text-secondary" />
          <h3 className="font-headline-sm text-headline-sm font-semibold text-deep-obsidian">Change Password</h3>
        </div>
        <form onSubmit={handleChangePassword} className="flex flex-col gap-space-sm max-w-sm">
          <label className="flex flex-col gap-1">
            <span className="font-body-sm text-body-sm text-on-surface-variant">Current Password</span>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="px-3 py-2 border border-slate-border rounded font-body-md text-body-md focus:outline-none focus:border-secondary"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="font-body-sm text-body-sm text-on-surface-variant">New Password</span>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className={`px-3 py-2 border rounded font-body-md text-body-md focus:outline-none focus:border-secondary ${error ? 'border-error' : 'border-slate-border'}`}
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="font-body-sm text-body-sm text-on-surface-variant">Confirm New Password</span>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`px-3 py-2 border rounded font-body-md text-body-md focus:outline-none focus:border-secondary ${error ? 'border-error' : 'border-slate-border'}`}
            />
          </label>
          {error && <span className="font-body-sm text-body-sm text-error">{error}</span>}
          <button type="submit" className="self-start px-6 py-2.5 mt-1 bg-deep-obsidian text-on-primary font-label-md text-label-md rounded hover:bg-charcoal-surface transition-colors">
            Update Password
          </button>
        </form>
        <p className="font-body-sm text-body-sm text-outline mt-space-md">This is a frontend demo — no password is actually stored or verified.</p>
      </div>

      <div className="p-space-lg border border-slate-border rounded-lg flex items-start gap-3">
        <ShieldCheck size={20} className="text-secondary shrink-0 mt-0.5" />
        <div>
          <h3 className="font-label-md text-label-md font-semibold text-on-surface mb-1">Account Security</h3>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Your session and saved data (cart, wishlist, addresses, orders) are stored only in this browser and are never shared with third parties.
          </p>
        </div>
      </div>
    </div>
  );
}