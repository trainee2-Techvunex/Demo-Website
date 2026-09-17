import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import { useOrderStore } from '../store/orderStore';
import { fmtINR } from '../utils/format';
import { Categories } from './Categories';

export function OrderSuccessPage() {
  const [params] = useSearchParams();
  const orderId = params.get('id') ?? '';
  const order = useOrderStore((s) => s.getById(orderId));

  if (!order) return <Categories />;

  return (
    <div className="max-w-[760px] mx-auto px-margin-mobile py-space-2xl flex flex-col items-center text-center gap-3">
      <CheckCircle2 size={64} className="text-secondary" />
      <h1 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-deep-obsidian font-light">Order Confirmed!</h1>
      <p className="font-body-md text-body-md text-on-surface-variant">Thank you — your order has been placed successfully.</p>

      <div className="w-full text-left p-space-lg border border-slate-border rounded-lg mt-space-md">
        <div className="flex justify-between items-center mb-space-sm">
          <span className="font-label-md text-label-md text-on-surface-variant">Order ID</span>
          <span className="font-label-md text-label-md font-semibold text-deep-obsidian">{order.id}</span>
        </div>
        <div className="flex flex-col gap-2 border-t border-slate-border pt-2">
          {order.items.map((it, i) => (
            <div key={i} className="flex justify-between font-body-sm text-body-sm text-on-surface-variant">
              <span>
                {it.name} × {it.qty}
              </span>
              <span>{fmtINR(it.lineTotal)}</span>
            </div>
          ))}
        </div>
        <div className="flex justify-between font-headline-sm text-headline-sm font-bold text-deep-obsidian pt-2 mt-2 border-t border-slate-border">
          <span>Total Paid</span>
          <span>{fmtINR(order.amounts.total)}</span>
        </div>
        <div className="mt-space-sm font-body-sm text-body-sm text-on-surface-variant">
          <p>
            Delivering to: {order.address.fullName}, {order.address.city}
          </p>
          <p>
            Payment: <span className="capitalize">{order.paymentMethod}</span>
          </p>
          <p>Expected delivery: {order.estimatedDelivery}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 mt-space-md justify-center">
        <Link to={`/account/orders/${order.id}`} className="px-6 py-3 bg-deep-obsidian text-on-primary font-label-md text-label-md rounded hover:bg-charcoal-surface transition-colors">
          View Order
        </Link>
        <Link to={`/track-order?id=${order.id}`} className="px-6 py-3 border border-slate-border font-label-md text-label-md rounded hover:bg-surface-container transition-colors">
          Track Order
        </Link>
        <Link to="/shop" className="px-6 py-3 border border-slate-border font-label-md text-label-md rounded hover:bg-surface-container transition-colors">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}