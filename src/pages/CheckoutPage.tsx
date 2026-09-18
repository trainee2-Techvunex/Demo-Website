import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ShoppingBag, ChevronRight } from 'lucide-react';
import { useCartStore, useCartTotals } from '../store/cartStore';
import { useAddressStore } from '../store/addressStore';
import { useToast } from '../hooks/useToast';
import { checkoutService } from '../services/orderCheckoutAuthService';
import { fmtINR } from '../utils/format';
import { EmptyState } from '../components/common/EmptyState';
import { AddressStep } from '../components/checkout/AddressStep';
import { DeliveryStep, PaymentStep, ReviewStep } from '../components/checkout/CheckoutSteps';
import type { PaymentMethod, OrderDraft } from '../types';

const STEPS = ['address', 'delivery', 'payment', 'review'] as const;
type Step = (typeof STEPS)[number];

export function CheckoutPage() {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const step: Step = (params.get('step') as Step) || 'address';
  const toast = useToast();
  const cart = useCartTotals();
  const clearCart = useCartStore((s) => s.clear);
  const getSelectedAddress = useAddressStore((s) => s.getSelected);

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('upi');
  const [placing, setPlacing] = useState(false);

  function goTo(next: Step) {
    setParams({ step: next });
  }

  if (cart.lines.length === 0) {
    return (
      <div className="max-w-[1200px] mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin py-space-lg">
        <EmptyState icon={ShoppingBag} title="Your bag is empty" message="Add items to your bag before checking out." ctaLabel="Continue Shopping" ctaPath="/shop" />
      </div>
    );
  }

  function handlePlaceOrder() {
    const address = getSelectedAddress();
    if (!address) {
      toast.show('Please add a delivery address', 'error');
      goTo('address');
      return;
    }
    setPlacing(true);
    const draft: OrderDraft = {
      items: cart.lines.map((l) => ({ productId: l.product.id, name: l.product.name, qty: l.qty, size: l.size, color: l.color, lineTotal: l.lineTotal })),
      amounts: { subtotal: cart.subtotal, discount: cart.productDiscount + cart.couponDiscount, delivery: cart.deliveryCharge, total: cart.total, deliveryMethod: cart.deliveryMethod },
      paymentMethod,
      address,
    };
    checkoutService.placeOrder(draft).then((order) => {
      clearCart();
      toast.show('Order placed successfully!');
      navigate(`/order-success?id=${order.id}`);
    });
  }

  const stepIndex = STEPS.indexOf(step);

  return (
    <div className="max-w-[1200px] mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin py-space-lg">
      <h1 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-deep-obsidian font-light mb-space-md">Checkout</h1>

      <div className="flex items-center gap-2 mb-space-lg overflow-x-auto">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center gap-2 shrink-0">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center font-label-md text-label-md ${i <= stepIndex ? 'bg-deep-obsidian text-white' : 'bg-surface-container text-outline'}`}>
              {i + 1}
            </div>
            <span className={`font-label-md text-label-md capitalize ${i === stepIndex ? 'text-deep-obsidian font-semibold' : 'text-outline'}`}>{s}</span>
            {i < STEPS.length - 1 && <ChevronRight size={16} className="text-outline mx-1" />}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg">
        <div className="lg:col-span-8">
          {step === 'address' && <AddressStep onContinue={() => goTo('delivery')} />}
          {step === 'delivery' && <DeliveryStep onBack={() => goTo('address')} onContinue={() => goTo('payment')} />}
          {step === 'payment' && <PaymentStep paymentMethod={paymentMethod} onChangeMethod={setPaymentMethod} onBack={() => goTo('delivery')} onContinue={() => goTo('review')} />}
          {step === 'review' && <ReviewStep paymentMethod={paymentMethod} placing={placing} onBack={() => goTo('payment')} onPlaceOrder={handlePlaceOrder} />}
        </div>

        <div className="lg:col-span-4">
          <div className="p-space-lg border border-slate-border rounded-lg bg-surface-container-lowest flex flex-col gap-2 sticky top-28">
            <h3 className="font-headline-sm text-headline-sm font-semibold text-deep-obsidian mb-1">Order Summary</h3>
            {cart.lines.map((l) => (
              <div key={l.id} className="flex justify-between font-body-sm text-body-sm text-on-surface-variant">
                <span className="line-clamp-1 pr-2">
                  {l.product.name} × {l.qty}
                </span>
                <span className="shrink-0">{fmtINR(l.lineTotal)}</span>
              </div>
            ))}
            <div className="border-t border-slate-border pt-2 mt-1 flex flex-col gap-1">
              <div className="flex justify-between font-body-sm text-body-sm text-outline">
                <span>Subtotal</span>
                <span>{fmtINR(cart.subtotal)}</span>
              </div>
              {cart.couponDiscount > 0 && (
                <div className="flex justify-between font-body-sm text-body-sm text-secondary">
                  <span>Coupon</span>
                  <span>-{fmtINR(cart.couponDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between font-body-sm text-body-sm text-outline">
                <span>Delivery</span>
                <span>{cart.deliveryCharge === 0 ? 'Free' : fmtINR(cart.deliveryCharge)}</span>
              </div>
              <div className="flex justify-between font-headline-sm text-headline-sm font-bold text-deep-obsidian pt-2 border-t border-slate-border">
                <span>Total</span>
                <span>{fmtINR(cart.total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
