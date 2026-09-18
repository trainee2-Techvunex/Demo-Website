import { useState } from 'react';
import { Link } from 'react-router-dom';
import { LumenLogo } from '../common/LumenLogo';
import { CATEGORIES } from '../../data/categories';

const PAYMENT_BADGES = ['VISA', 'MASTERCARD', 'RUPAY', 'UPI', 'AMEX'];

export function Footer() {
  const [subscribed, setSubscribed] = useState(false);

  return (
    <footer className="w-full bg-surface-container-lowest border-t border-slate-border mt-space-3xl">
      <div className="max-w-[1440px] mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin pt-space-2xl pb-space-xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-space-xl">
          <div className="flex flex-col">
            <div className="mb-3">
              <LumenLogo height={28} />
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed mb-4">
              Architectural luxury retail engineered for discerning global clientele — a frontend demo experience.
            </p>
            <span className="font-label-caps text-label-caps text-secondary uppercase tracking-widest">An Initiative of Techvunex Innovations</span>
          </div>

          <div className="flex flex-col gap-2.5">
            <h4 className="font-label-caps text-label-caps uppercase tracking-wider text-deep-obsidian font-semibold mb-1">Shop</h4>
            {CATEGORIES.map((c) => (
              <Link key={c.id} to={`/shop/${c.id}`} className="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface transition-colors">
                {c.name}
              </Link>
            ))}
          </div>

          <div className="flex flex-col gap-2.5">
            <h4 className="font-label-caps text-label-caps uppercase tracking-wider text-deep-obsidian font-semibold mb-1">Customer Care</h4>
            <Link to="/track-order" className="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface transition-colors">
              Track Your Order
            </Link>
            <Link to="/account/orders" className="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface transition-colors">
              Order History
            </Link>
            <Link to="/wishlist" className="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface transition-colors">
              Wishlist
            </Link>
          </div>

          <div className="flex flex-col gap-3">
            <h4 className="font-label-caps text-label-caps uppercase tracking-wider text-deep-obsidian font-semibold mb-1">VIP Atelier Invitation</h4>
            <p className="font-body-sm text-body-sm text-on-surface-variant">Receive private previews and limited batch access.</p>
            <form
              className="flex flex-col gap-2 mt-1"
              onSubmit={(e) => {
                e.preventDefault();
                setSubscribed(true);
              }}
            >
              <div className="flex">
                <input
                  type="email"
                  required
                  placeholder="Enter your email"
                  className="flex-1 px-3 py-2 bg-surface-container-low border border-slate-border font-body-sm text-body-sm rounded-l focus:outline-none focus:border-secondary"
                />
                <button type="submit" className="px-4 py-2 bg-deep-obsidian text-on-primary font-label-md text-label-md rounded-r hover:bg-charcoal-surface transition-colors">
                  Join
                </button>
              </div>
              {subscribed && <span className="font-label-caps text-label-caps text-secondary">✓ Invitation confirmed. Welcome to VIRAT.</span>}
            </form>
          </div>
        </div>

        <div className="border-t border-slate-border mt-space-xl pt-space-md flex flex-col lg:flex-row items-center justify-between gap-4">
          <p className="font-body-sm text-body-sm text-outline text-center lg:text-left">
            © {new Date().getFullYear()} VIRAT Demo. Designed &amp; Developed by <span className="font-semibold text-deep-obsidian">Techvunex Innovations</span>.
          </p>
          <div className="flex items-center gap-3 font-label-caps text-label-caps text-outline uppercase tracking-wider">
            {PAYMENT_BADGES.map((b) => (
              <span key={b} className="px-2 py-1 rounded bg-surface-container border border-slate-border">
                {b}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
