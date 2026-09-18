import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Check, Circle } from 'lucide-react';
import { useOrderStore } from '../store/orderStore';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { EmptyState } from '../components/common/EmptyState';
import { AlertCircle } from 'lucide-react';

const STAGES = ['confirmed', 'packed', 'shipped', 'out_for_delivery', 'delivered'] as const;
const STAGE_LABELS: Record<(typeof STAGES)[number], string> = {
  confirmed: 'Order Confirmed',
  packed: 'Packed',
  shipped: 'Shipped',
  out_for_delivery: 'Out for Delivery',
  delivered: 'Delivered',
};

export function TrackOrderPage() {
  const [params, setParams] = useSearchParams();
  const orderId = params.get('id') ?? '';
  const order = useOrderStore((s) => (orderId ? s.getById(orderId) : null));
  const [inputValue, setInputValue] = useState(orderId);

  let currentIndex = -1;
  if (order) {
    const daysSince = Math.floor((Date.now() - new Date(order.date).getTime()) / 86400000);
    currentIndex = Math.min(STAGES.length - 1, daysSince);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setParams({ id: inputValue.trim() });
  }

  return (
    <div className="max-w-[760px] mx-auto px-margin-mobile py-space-lg">
      <Breadcrumb items={[{ label: 'Home', path: '/' }, { label: 'Track Order' }]} />
      <h1 className="font-headline-lg text-headline-lg-mobile text-deep-obsidian font-light mt-3 mb-space-md">Track Your Order</h1>

      <form onSubmit={handleSubmit} className="flex gap-2 mb-space-lg">
        <input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Enter Order ID (e.g. TVX2026...)"
          className="flex-1 px-3 py-2 border border-slate-border rounded font-body-md text-body-md focus:outline-none focus:border-secondary"
        />
        <button type="submit" className="px-6 py-2 bg-deep-obsidian text-on-primary rounded font-label-md text-label-md">
          Track
        </button>
      </form>

      {order && (
        <div className="p-space-lg border border-slate-border rounded-lg">
          <p className="font-label-md text-label-md font-semibold text-on-surface mb-1">Order {order.id}</p>
          <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md">Estimated delivery: {order.estimatedDelivery}</p>
          <div className="flex flex-col gap-0">
            {STAGES.map((s, i) => (
              <div key={s} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${i <= currentIndex ? 'bg-deep-obsidian text-white' : 'bg-surface-container text-outline'}`}>
                    {i <= currentIndex ? <Check size={14} /> : <Circle size={10} fill="currentColor" />}
                  </div>
                  {i < STAGES.length - 1 && <div className={`w-0.5 flex-1 min-h-[28px] ${i < currentIndex ? 'bg-deep-obsidian' : 'bg-surface-container'}`} />}
                </div>
                <div className="pb-space-md">
                  <p className={`font-label-md text-label-md ${i <= currentIndex ? 'text-on-surface font-semibold' : 'text-outline'}`}>{STAGE_LABELS[s]}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {!order && orderId && <EmptyState icon={AlertCircle} title="Order not found" message="Please check the order ID and try again." />}
    </div>
  );
}
