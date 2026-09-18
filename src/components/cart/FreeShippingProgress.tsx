import { Truck } from 'lucide-react';
import { fmtINR } from '../../utils/format';

/** Matches the ₹999 free-shipping threshold used in cartStore's delivery charge calculation. */
const FREE_SHIPPING_THRESHOLD = 999;

export function FreeShippingProgress({ subtotal }: { subtotal: number }) {
  if (subtotal <= 0) return null;
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const pct = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);

  return (
    <div className="flex flex-col gap-1.5">
      <p className="flex items-center gap-1.5 font-body-sm text-body-sm text-on-surface-variant">
        <Truck size={15} className="text-secondary shrink-0" />
        {remaining > 0 ? (
          <span>
            <span className="font-semibold text-deep-obsidian">{fmtINR(remaining)}</span> away from free shipping
          </span>
        ) : (
          <span className="text-secondary font-semibold">You've unlocked free shipping!</span>
        )}
      </p>
      <div className="w-full h-1.5 rounded-full bg-surface-container overflow-hidden">
        <div className="h-full bg-champagne-gold rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}