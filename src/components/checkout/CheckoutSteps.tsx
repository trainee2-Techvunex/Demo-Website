import type { LucideIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Wallet, CreditCard, Landmark, WalletCards, Banknote } from 'lucide-react';
import { useCartStore, useCartTotals } from '../../store/cartStore';
import { useAddressStore } from '../../store/addressStore';
import type { DeliveryMethod, PaymentMethod } from '../../types';

export function DeliveryStep({ onBack, onContinue }: { onBack: () => void; onContinue: () => void }) {
  const deliveryMethod = useCartStore((s) => s.deliveryMethod);
  const setDeliveryMethod = useCartStore((s) => s.setDeliveryMethod);

  return (
    <div className="flex flex-col gap-space-md">
      <label className={`flex items-center justify-between p-space-md border rounded-lg cursor-pointer ${deliveryMethod !== 'express' ? 'border-deep-obsidian' : 'border-slate-border'}`}>
        <div className="flex items-center gap-3">
          <input type="radio" name="delivery-method" checked={deliveryMethod !== 'express'} onChange={() => setDeliveryMethod('standard' as DeliveryMethod)} />
          <div>
            <p className="font-label-md text-label-md font-semibold text-on-surface">Standard Delivery</p>
            <p className="font-body-sm text-body-sm text-on-surface-variant">3–5 business days</p>
          </div>
        </div>
        <span className="font-label-md text-label-md text-secondary font-semibold">FREE</span>
      </label>
      <label className={`flex items-center justify-between p-space-md border rounded-lg cursor-pointer ${deliveryMethod === 'express' ? 'border-deep-obsidian' : 'border-slate-border'}`}>
        <div className="flex items-center gap-3">
          <input type="radio" name="delivery-method" checked={deliveryMethod === 'express'} onChange={() => setDeliveryMethod('express' as DeliveryMethod)} />
          <div>
            <p className="font-label-md text-label-md font-semibold text-on-surface">Express Delivery</p>
            <p className="font-body-sm text-body-sm text-on-surface-variant">1–2 business days</p>
          </div>
        </div>
        <span className="font-label-md text-label-md text-on-surface font-semibold">₹149</span>
      </label>
      <div className="flex justify-between mt-2">
        <button onClick={onBack} className="px-6 py-3 border border-slate-border rounded font-label-md text-label-md">
          Back
        </button>
        <button onClick={onContinue} className="px-8 py-3 bg-deep-obsidian text-on-primary font-label-md text-label-md rounded hover:bg-charcoal-surface transition-colors">
          Continue to Payment
        </button>
      </div>
    </div>
  );
}

const METHODS: { value: PaymentMethod; icon: LucideIcon; label: string }[] = [
  { value: 'upi', icon: Wallet, label: 'UPI' },
  { value: 'card', icon: CreditCard, label: 'Credit / Debit Card' },
  { value: 'netbanking', icon: Landmark, label: 'Net Banking' },
  { value: 'wallet', icon: WalletCards, label: 'Wallet' },
  { value: 'cod', icon: Banknote, label: 'Cash on Delivery' },
];

const cardSchema = z.object({
  cardNumber: z.string().regex(/^\d{16}$/, 'Enter a valid 16-digit card number'),
  cardName: z.string().min(2, 'Enter the name on card'),
  cardExpiry: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, 'Use MM/YY format'),
  cardCvv: z.string().regex(/^\d{3,4}$/, 'Enter a valid CVV'),
});
type CardFormValues = z.infer<typeof cardSchema>;

export function PaymentStep({
  paymentMethod,
  onChangeMethod,
  onBack,
  onContinue,
}: {
  paymentMethod: PaymentMethod;
  onChangeMethod: (m: PaymentMethod) => void;
  onBack: () => void;
  onContinue: () => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CardFormValues>({ resolver: zodResolver(cardSchema) });

  function handleContinueClick() {
    if (paymentMethod === 'card') {
      handleSubmit(() => onContinue())();
    } else {
      onContinue();
    }
  }

  return (
    <div className="flex flex-col gap-space-md">
      <div className="flex flex-col gap-2">
        {METHODS.map(({ value, icon: Icon, label }) => (
          <label key={value} className={`flex items-center gap-3 p-space-md border rounded-lg cursor-pointer ${paymentMethod === value ? 'border-deep-obsidian' : 'border-slate-border'}`}>
            <input type="radio" name="payment-method" checked={paymentMethod === value} onChange={() => onChangeMethod(value)} />
            <Icon size={20} className="text-on-surface-variant" />
            <span className="font-label-md text-label-md text-on-surface font-medium">{label}</span>
          </label>
        ))}
      </div>

      {paymentMethod === 'card' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm p-space-md border border-slate-border rounded-lg">
          <CardField label="Card Number" error={errors.cardNumber?.message} className="sm:col-span-2">
            <input {...register('cardNumber')} maxLength={16} placeholder="1234 5678 9012 3456" className={inputClass(!!errors.cardNumber)} />
          </CardField>
          <CardField label="Name on Card" error={errors.cardName?.message} className="sm:col-span-2">
            <input {...register('cardName')} className={inputClass(!!errors.cardName)} />
          </CardField>
          <CardField label="Expiry (MM/YY)" error={errors.cardExpiry?.message}>
            <input {...register('cardExpiry')} placeholder="MM/YY" maxLength={5} className={inputClass(!!errors.cardExpiry)} />
          </CardField>
          <CardField label="CVV" error={errors.cardCvv?.message}>
            <input type="password" {...register('cardCvv')} maxLength={4} className={inputClass(!!errors.cardCvv)} />
          </CardField>
        </div>
      )}
      <p className="font-body-sm text-body-sm text-outline">Payment details are never stored — this is a frontend demo only.</p>

      <div className="flex justify-between mt-2">
        <button onClick={onBack} className="px-6 py-3 border border-slate-border rounded font-label-md text-label-md">
          Back
        </button>
        <button onClick={handleContinueClick} className="px-8 py-3 bg-deep-obsidian text-on-primary font-label-md text-label-md rounded hover:bg-charcoal-surface transition-colors">
          Review Order
        </button>
      </div>
    </div>
  );
}

function CardField({ label, error, className = '', children }: { label: string; error?: string; className?: string; children: React.ReactNode }) {
  return (
    <label className={`flex flex-col gap-1 ${className}`}>
      <span className="font-body-sm text-body-sm text-on-surface-variant">{label}</span>
      {children}
      {error && <span className="font-body-sm text-body-sm text-error">{error}</span>}
    </label>
  );
}

function inputClass(hasError: boolean) {
  return `px-3 py-2 border rounded font-body-md text-body-md focus:outline-none focus:border-secondary ${hasError ? 'border-error' : 'border-slate-border'}`;
}

export function ReviewStep({
  paymentMethod,
  placing,
  onBack,
  onPlaceOrder,
}: {
  paymentMethod: PaymentMethod;
  placing: boolean;
  onBack: () => void;
  onPlaceOrder: () => void;
}) {
  const cart = useCartTotals();
  const address = useCartStoreSelectedAddress();

  return (
    <div className="flex flex-col gap-space-md">
      <div className="p-space-md border border-slate-border rounded-lg">
        <p className="font-label-caps text-label-caps text-secondary uppercase tracking-wider mb-1">Delivering To</p>
        {address ? (
          <>
            <p className="font-label-md text-label-md text-on-surface font-semibold">{address.fullName}</p>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              {address.house}, {address.street}, {address.city}, {address.state} - {address.pincode}
            </p>
          </>
        ) : (
          <p className="text-error font-body-sm text-body-sm">No address selected.</p>
        )}
      </div>
      <div className="p-space-md border border-slate-border rounded-lg">
        <p className="font-label-caps text-label-caps text-secondary uppercase tracking-wider mb-1">Delivery Method</p>
        <p className="font-body-sm text-body-sm text-on-surface">{cart.deliveryMethod === 'express' ? 'Express Delivery (1–2 business days)' : 'Standard Delivery (3–5 business days)'}</p>
      </div>
      <div className="p-space-md border border-slate-border rounded-lg">
        <p className="font-label-caps text-label-caps text-secondary uppercase tracking-wider mb-1">Payment Method</p>
        <p className="font-body-sm text-body-sm text-on-surface capitalize">{paymentMethod === 'cod' ? 'Cash on Delivery' : paymentMethod.toUpperCase()}</p>
      </div>
      <div className="flex justify-between mt-2">
        <button onClick={onBack} className="px-6 py-3 border border-slate-border rounded font-label-md text-label-md">
          Back
        </button>
        <button
          onClick={onPlaceOrder}
          disabled={placing}
          className="px-8 py-3.5 bg-deep-obsidian text-on-primary font-label-md text-label-md rounded hover:bg-charcoal-surface transition-colors flex items-center gap-2 disabled:opacity-60"
        >
          {placing ? 'Processing...' : 'Place Order'}
        </button>
      </div>
    </div>
  );
}

// Small helper kept local to avoid re-selecting inside JSX.
function useCartStoreSelectedAddress() {
  const addresses = useAddressStore((s) => s.addresses);
  const selectedId = useAddressStore((s) => s.selectedId);
  return addresses.find((a) => a.id === selectedId) ?? null;
}