import { useState } from 'react';
import { X, Check, CreditCard, ShieldCheck, Truck, ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';
import {
  CartItem,
  calculateSubtotal,
  calculateShipping,
  calculateDiscount,
} from '../utils/ecommerce';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  promoCode: string;
  onClearCart: () => void;
}

type Step = 'shipping' | 'payment' | 'review' | 'confirmed';
type PaymentMethod = 'credit-card' | 'paypal' | 'cod';

interface ShippingData {
  fullName: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface PaymentData {
  cardNumber: string;
  cardName: string;
  expiry: string;
  cvc: string;
}

export function CheckoutModal({
  isOpen,
  onClose,
  items,
  promoCode,
  onClearCart,
}: CheckoutModalProps) {
  const [step, setStep] = useState<Step>('shipping');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('credit-card');
  const [confirmedOrderId, setConfirmedOrderId] = useState<string>('');

  // Shipping form state
  const [shipping, setShipping] = useState<ShippingData>({
    fullName: 'Julian Vance',
    email: 'julian.vance@example.com',
    address: '742 Evergreen Terrace',
    city: 'San Francisco',
    state: 'CA',
    zipCode: '94107',
    country: 'United States',
  });
  const [shippingErrors, setShippingErrors] = useState<Partial<Record<keyof ShippingData, string>>>({});

  // Payment form state
  const [payment, setPayment] = useState<PaymentData>({
    cardNumber: '•••• •••• •••• 4242',
    cardName: 'Julian Vance',
    expiry: '12/28',
    cvc: '888',
  });
  const [paymentErrors, setPaymentErrors] = useState<Partial<Record<keyof PaymentData, string>>>({});

  if (!isOpen) return null;

  const subtotal = calculateSubtotal(items);
  const shippingFee = calculateShipping(subtotal);
  const discountResult = calculateDiscount(subtotal, promoCode);
  const finalTotal = Math.max(0, subtotal - discountResult.discountAmount + shippingFee);

  const validateShipping = () => {
    const errors: Partial<Record<keyof ShippingData, string>> = {};
    if (!shipping.fullName.trim()) errors.fullName = 'Full name is required';
    if (!shipping.email.trim() || !shipping.email.includes('@')) errors.email = 'Valid email is required';
    if (!shipping.address.trim()) errors.address = 'Street address is required';
    if (!shipping.city.trim()) errors.city = 'City is required';
    if (!shipping.zipCode.trim()) errors.zipCode = 'Postal code is required';
    setShippingErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validatePayment = () => {
    if (paymentMethod !== 'credit-card') return true;
    const errors: Partial<Record<keyof PaymentData, string>> = {};
    if (!payment.cardNumber.trim()) errors.cardNumber = 'Card number is required';
    if (!payment.cardName.trim()) errors.cardName = 'Name on card is required';
    if (!payment.expiry.trim()) errors.expiry = 'MM/YY required';
    if (!payment.cvc.trim()) errors.cvc = 'CVC required';
    setPaymentErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNextFromShipping = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateShipping()) {
      setStep('payment');
    }
  };

  const handleNextFromPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (validatePayment()) {
      setStep('review');
    }
  };

  const handlePlaceOrder = () => {
    const generatedId = `AURA-${Math.floor(100000 + Math.random() * 900000)}`;
    setConfirmedOrderId(generatedId);
    setStep('confirmed');
    onClearCart();
  };

  const stepIndex = step === 'shipping' ? 0 : step === 'payment' ? 1 : step === 'review' ? 2 : 3;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={() => {
          if (step !== 'confirmed') onClose();
        }}
      />

      <div className="flex min-h-full items-center justify-center p-3 sm:p-6">
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="checkout-heading"
          className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200 my-8"
        >
          {/* Header */}
          <div className="p-6 border-b border-slate-200 flex items-center justify-between">
            <h2 id="checkout-heading" className="text-lg font-bold text-slate-900 tracking-tight">
              {step === 'confirmed' ? 'Order Confirmed' : 'Secure Checkout'}
            </h2>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg transition-colors"
              aria-label="Close checkout"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Progress Bar (visible for non-confirmed steps) */}
          {step !== 'confirmed' && (
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
              <div className="flex items-center justify-between max-w-md mx-auto relative">
                {/* Connecting bar */}
                <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-0.5 bg-slate-200 z-0" />
                <div
                  className="absolute top-1/2 left-0 -translate-y-1/2 h-0.5 bg-indigo-600 transition-all duration-300 z-0"
                  style={{ width: `${(stepIndex / 2) * 100}%` }}
                />

                {[
                  { label: 'Shipping', key: 'shipping', idx: 0 },
                  { label: 'Payment', key: 'payment', idx: 1 },
                  { label: 'Review', key: 'review', idx: 2 },
                ].map((s) => {
                  const isDone = stepIndex > s.idx;
                  const isCurrent = stepIndex === s.idx;
                  return (
                    <div key={s.key} className="relative z-10 flex flex-col items-center">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                          isDone
                            ? 'bg-indigo-600 text-white'
                            : isCurrent
                            ? 'bg-indigo-600 text-white ring-4 ring-indigo-100'
                            : 'bg-white border-2 border-slate-300 text-slate-500'
                        }`}
                      >
                        {isDone ? <Check className="w-3.5 h-3.5" /> : s.idx + 1}
                      </div>
                      <span
                        className={`text-[11px] font-semibold mt-1 ${
                          isCurrent ? 'text-indigo-600' : 'text-slate-500'
                        }`}
                      >
                        {s.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Body Content according to Step */}
          <div className="p-6 sm:p-8">
            {/* STEP 1: Shipping Address */}
            {step === 'shipping' && (
              <form onSubmit={handleNextFromShipping} className="space-y-4">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">
                  1. Shipping Information
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="shipping-full-name" className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                    <input
                      id="shipping-full-name"
                      type="text"
                      value={shipping.fullName}
                      onChange={(e) => setShipping({ ...shipping, fullName: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 outline-none"
                    />
                    {shippingErrors.fullName && (
                      <p className="text-[11px] text-rose-500 mt-1">{shippingErrors.fullName}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="shipping-email" className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                    <input
                      id="shipping-email"
                      type="email"
                      value={shipping.email}
                      onChange={(e) => setShipping({ ...shipping, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 outline-none"
                    />
                    {shippingErrors.email && (
                      <p className="text-[11px] text-rose-500 mt-1">{shippingErrors.email}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="shipping-address" className="block text-xs font-semibold text-slate-700 mb-1">Street Address</label>
                  <input
                    id="shipping-address"
                    type="text"
                    value={shipping.address}
                    onChange={(e) => setShipping({ ...shipping, address: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 outline-none"
                  />
                  {shippingErrors.address && (
                    <p className="text-[11px] text-rose-500 mt-1">{shippingErrors.address}</p>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label htmlFor="shipping-city" className="block text-xs font-semibold text-slate-700 mb-1">City</label>
                    <input
                      id="shipping-city"
                      type="text"
                      value={shipping.city}
                      onChange={(e) => setShipping({ ...shipping, city: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 outline-none"
                    />
                  </div>
                  <div>
                    <label htmlFor="shipping-state" className="block text-xs font-semibold text-slate-700 mb-1">State / Prov</label>
                    <input
                      id="shipping-state"
                      type="text"
                      value={shipping.state}
                      onChange={(e) => setShipping({ ...shipping, state: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 outline-none"
                    />
                  </div>
                  <div>
                    <label htmlFor="shipping-zip" className="block text-xs font-semibold text-slate-700 mb-1">Postal Code</label>
                    <input
                      id="shipping-zip"
                      type="text"
                      value={shipping.zipCode}
                      onChange={(e) => setShipping({ ...shipping, zipCode: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 outline-none"
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl shadow-md flex items-center gap-2 transition-all"
                  >
                    <span>Continue to Payment</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}

            {/* STEP 2: Payment Details */}
            {step === 'payment' && (
              <form onSubmit={handleNextFromPayment} className="space-y-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                    2. Payment Method
                  </h3>
                  <button
                    type="button"
                    onClick={() => setStep('shipping')}
                    className="text-xs text-indigo-600 hover:underline flex items-center gap-1"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" /> Back to Shipping
                  </button>
                </div>

                {/* Method selector pills */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'credit-card', label: 'Credit Card', icon: CreditCard },
                    { id: 'paypal', label: 'PayPal', icon: ShieldCheck },
                    { id: 'cod', label: 'Cash on Delivery', icon: Truck },
                  ].map((m) => {
                    const isSelected = paymentMethod === m.id;
                    const Icon = m.icon;
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setPaymentMethod(m.id as PaymentMethod)}
                        className={`p-3.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                          isSelected
                            ? 'border-indigo-600 bg-indigo-50/50 text-indigo-700 font-semibold ring-2 ring-indigo-600/20'
                            : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <Icon className="w-5 h-5 text-indigo-600" />
                        <span className="text-xs">{m.label}</span>
                      </button>
                    );
                  })}
                </div>

                {paymentMethod === 'credit-card' ? (
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                    <div>
                      <label htmlFor="card-number" className="block text-xs font-semibold text-slate-700 mb-1">Card Number</label>
                      <input
                        id="card-number"
                        type="text"
                        value={payment.cardNumber}
                        onChange={(e) => setPayment({ ...payment, cardNumber: e.target.value })}
                        placeholder="4242 •••• •••• 4242"
                        className="w-full px-3.5 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:border-indigo-500 outline-none tabular-nums"
                      />
                    </div>
                    <div>
                      <label htmlFor="card-name" className="block text-xs font-semibold text-slate-700 mb-1">Cardholder Name</label>
                      <input
                        id="card-name"
                        type="text"
                        value={payment.cardName}
                        onChange={(e) => setPayment({ ...payment, cardName: e.target.value })}
                        className="w-full px-3.5 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:border-indigo-500 outline-none"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label htmlFor="card-expiry" className="block text-xs font-semibold text-slate-700 mb-1">Expiry (MM/YY)</label>
                        <input
                          id="card-expiry"
                          type="text"
                          value={payment.expiry}
                          onChange={(e) => setPayment({ ...payment, expiry: e.target.value })}
                          placeholder="MM/YY"
                          className="w-full px-3.5 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:border-indigo-500 outline-none tabular-nums"
                        />
                      </div>
                      <div>
                        <label htmlFor="card-cvc" className="block text-xs font-semibold text-slate-700 mb-1">CVC</label>
                        <input
                          id="card-cvc"
                          type="password"
                          maxLength={4}
                          value={payment.cvc}
                          onChange={(e) => setPayment({ ...payment, cvc: e.target.value })}
                          placeholder="•••"
                          className="w-full px-3.5 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:border-indigo-500 outline-none tabular-nums"
                        />
                      </div>
                    </div>
                  </div>
                ) : paymentMethod === 'paypal' ? (
                  <div className="p-5 bg-slate-50 rounded-xl border border-slate-200 text-center text-xs text-slate-600">
                    <p>You will be redirected to PayPal to complete your purchase securely.</p>
                  </div>
                ) : (
                  <div className="p-5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1">
                    <p className="font-semibold text-slate-900">Cash on Delivery verified</p>
                    <p>Pay in cash upon physical receipt at {shipping.address}. Please prepare exact change.</p>
                  </div>
                )}

                <div className="pt-4 flex justify-between items-center">
                  <button
                    type="button"
                    onClick={() => setStep('shipping')}
                    className="text-xs font-semibold text-slate-600 hover:text-slate-900"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl shadow-md flex items-center gap-2 transition-all"
                  >
                    <span>Review Order</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}

            {/* STEP 3: Order Review */}
            {step === 'review' && (
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                    3. Final Order Review
                  </h3>
                  <button
                    type="button"
                    onClick={() => setStep('payment')}
                    className="text-xs text-indigo-600 hover:underline flex items-center gap-1"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" /> Back to Payment
                  </button>
                </div>

                {/* Items summary */}
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 max-h-48 overflow-y-auto divide-y divide-slate-200/60">
                  {items.map((item) => (
                    <div key={item.id} className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="w-10 h-10 rounded-lg object-cover bg-white border border-slate-200"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <p className="font-semibold text-slate-900 truncate max-w-[200px]">{item.product.name}</p>
                          <p className="text-[11px] text-slate-500">Qty: {item.quantity} · {item.color}</p>
                        </div>
                      </div>
                      <span className="font-semibold text-slate-900 tabular-nums">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Shipping & Payment summaries */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <p className="font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1">Delivering To:</p>
                    <p className="text-slate-900 font-medium">{shipping.fullName}</p>
                    <p className="text-slate-500 truncate">{shipping.address}, {shipping.city}</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <p className="font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1">Payment Method:</p>
                    <p className="text-slate-900 font-medium capitalize">{paymentMethod.replace('-', ' ')}</p>
                    <p className="text-slate-500">Encrypted via 256-bit SSL</p>
                  </div>
                </div>

                {/* Totals */}
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal</span>
                    <span className="tabular-nums font-medium">${subtotal.toFixed(2)}</span>
                  </div>
                  {discountResult.isValid && (
                    <div className="flex justify-between text-emerald-600 font-medium">
                      <span>Promo code ({discountResult.label})</span>
                      <span className="tabular-nums">-${discountResult.discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-slate-600">
                    <span>Shipping</span>
                    <span className="tabular-nums font-medium">
                      {shippingFee === 0 ? <span className="text-emerald-600 font-bold">FREE</span> : `$${shippingFee.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-slate-900 pt-2 border-t border-slate-200">
                    <span>Total Amount</span>
                    <span className="text-base text-indigo-600 tabular-nums">${finalTotal.toFixed(2)}</span>
                  </div>
                </div>

                {/* Place Order CTA */}
                <button
                  type="button"
                  onClick={handlePlaceOrder}
                  className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-indigo-600/30 transition-all duration-150 active:scale-95"
                >
                  Place Order · ${finalTotal.toFixed(2)}
                </button>
              </div>
            )}

            {/* STEP 4: Confirmed Order Screen */}
            {step === 'confirmed' && (
              <div className="py-6 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900">Thank you for your order!</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  We’ve sent a confirmation receipt to <strong className="text-slate-800">{shipping.email}</strong>. Your order is being hand-inspected and prepared for dispatch.
                </p>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 max-w-md mx-auto text-left text-xs space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Order Number:</span>
                    <span className="font-bold text-slate-900">{confirmedOrderId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Estimated Delivery:</span>
                    <span className="font-medium text-slate-900">Nov 12 - Nov 15, 2026</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Courier:</span>
                    <span className="font-medium text-slate-900">DHL Express Priority</span>
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-8 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl shadow-md transition-all active:scale-95"
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
