'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ShoppingBag, MapPin, CreditCard, CheckCircle, Loader2, ChevronRight } from 'lucide-react';
import { useCartStore } from '@/store/cart.store';
import { formatPrice } from '@/lib/utils';
import api from '@/lib/api';
import toast from 'react-hot-toast';

const STEPS = [
  { id: 1, label: 'Cart Review', icon: ShoppingBag },
  { id: 2, label: 'Address', icon: MapPin },
  { id: 3, label: 'Payment', icon: CreditCard },
  { id: 4, label: 'Confirmed', icon: CheckCircle },
];

export default function CheckoutPage() {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [couponCode, setCouponCode] = useState('');
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
  const { items, getTotal, clearCart } = useCartStore();
  const router = useRouter();

  const subtotal = getTotal();
  const shipping = subtotal >= 999 ? 0 : 99;
  const tax = Math.round((subtotal) * 0.18 * 100) / 100;
  const total = subtotal + shipping + tax;

  const handlePlaceOrder = async () => {
    setIsLoading(true);
    try {
      const order = await api.createOrder({
        addressId: selectedAddress || undefined,
        couponCode: couponCode || undefined,
      }) as any;
      setOrderId(order.id);

      // Create Razorpay payment
      const paymentData = await api.createRazorpayOrder(order.id) as any;

      // Load Razorpay
      const Razorpay = (window as any).Razorpay;
      const rzp = new Razorpay({
        key: paymentData.keyId,
        amount: paymentData.amount,
        currency: paymentData.currency,
        name: 'PrintShoppy',
        description: `Order #${paymentData.orderNumber}`,
        order_id: paymentData.razorpayOrderId,
        handler: async (response: any) => {
          try {
            await api.verifyRazorpayPayment({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              orderId: order.id,
            });
            clearCart();
            setStep(4);
            toast.success('Payment successful! Order confirmed! 🎉');
          } catch {
            toast.error('Payment verification failed');
          }
        },
        prefill: {
          name: 'Customer',
          email: 'customer@email.com',
        },
        theme: { color: '#2563EB' },
        modal: {
          ondismiss: () => toast.error('Payment cancelled'),
        },
      });
      rzp.open();
    } catch (error: any) {
      toast.error(error.message || 'Failed to place order');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Razorpay Script */}
      <script src="https://checkout.razorpay.com/v1/checkout.js" async />

      <div className="container-custom py-8">
        {/* Steps */}
        <div className="flex items-center justify-center mb-10">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex items-center">
              <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                step >= s.id ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                <s.icon className="w-4 h-4" />
                <span className="hidden sm:block">{s.label}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`w-8 h-0.5 mx-1 ${step > s.id ? 'bg-primary-600' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {step === 1 && (
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="card p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Review Your Cart</h2>
                <div className="space-y-4">
                  {items.map(item => (
                    <div key={item.id} className="flex gap-4 p-4 bg-gray-50 rounded-xl">
                      <img
                        src={item.product?.images?.[0]?.url || '/images/placeholder.jpg'}
                        alt={item.product?.name}
                        className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 truncate">{item.product?.name}</h4>
                        {item.variant && <p className="text-sm text-gray-500">{item.variant.name}</p>}
                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="font-bold text-gray-900">
                          {formatPrice((item.variant?.price ?? item.product?.basePrice ?? 0) * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 pt-4 border-t border-gray-100">
                  <div className="flex gap-3">
                    <input
                      type="text"
                      placeholder="Coupon code"
                      value={couponCode}
                      onChange={e => setCouponCode(e.target.value.toUpperCase())}
                      className="input-field flex-1"
                    />
                    <button className="btn-secondary px-4 py-2">Apply</button>
                  </div>
                </div>
                <button
                  onClick={() => setStep(2)}
                  className="w-full btn-primary mt-6 flex items-center justify-center gap-2"
                >
                  Continue to Address <ChevronRight className="w-4 h-4" />
                </button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="card p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Delivery Address</h2>
                <div className="space-y-4">
                  {/* Address Form */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <label className="label">Full Name</label>
                      <input type="text" placeholder="John Doe" className="input-field" />
                    </div>
                    <div>
                      <label className="label">Phone</label>
                      <input type="tel" placeholder="+91 9876543210" className="input-field" />
                    </div>
                    <div>
                      <label className="label">Pincode</label>
                      <input type="text" placeholder="560034" className="input-field" maxLength={6} />
                    </div>
                    <div className="col-span-2">
                      <label className="label">Address Line 1</label>
                      <input type="text" placeholder="Street, Area, Locality" className="input-field" />
                    </div>
                    <div>
                      <label className="label">City</label>
                      <input type="text" placeholder="Bengaluru" className="input-field" />
                    </div>
                    <div>
                      <label className="label">State</label>
                      <input type="text" placeholder="Karnataka" className="input-field" />
                    </div>
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <button onClick={() => setStep(1)} className="btn-secondary">Back</button>
                  <button
                    onClick={() => setStep(3)}
                    className="flex-1 btn-primary flex items-center justify-center gap-2"
                  >
                    Continue to Payment <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="card p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Payment</h2>
                <div className="space-y-3">
                  {[
                    { id: 'razorpay', label: 'Pay with Razorpay', desc: 'UPI, Cards, Net Banking', icon: '💳' },
                    { id: 'cod', label: 'Cash on Delivery', desc: '+₹50 COD charge', icon: '💰' },
                  ].map(method => (
                    <label key={method.id} className="flex items-center gap-4 p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-primary-400 transition-colors">
                      <input type="radio" name="payment" value={method.id} className="w-4 h-4 text-primary-600" defaultChecked={method.id === 'razorpay'} />
                      <span className="text-2xl">{method.icon}</span>
                      <div>
                        <p className="font-medium text-gray-900">{method.label}</p>
                        <p className="text-sm text-gray-500">{method.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
                <div className="flex gap-3 mt-6">
                  <button onClick={() => setStep(2)} className="btn-secondary">Back</button>
                  <button
                    onClick={handlePlaceOrder}
                    disabled={isLoading}
                    className="flex-1 btn-primary flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</>
                    ) : (
                      <><CreditCard className="w-5 h-5" /> Pay {formatPrice(total)}</>
                    )}
                  </button>
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="card p-12 text-center"
              >
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Confirmed! 🎉</h2>
                <p className="text-gray-500 mb-2">Thank you for your order!</p>
                {orderId && <p className="text-sm text-gray-400 mb-6">Order ID: #{orderId.slice(-8).toUpperCase()}</p>}
                <p className="text-gray-500 mb-8">You will receive an email confirmation shortly. Your order will be delivered in 3-5 business days.</p>
                <div className="flex gap-4 justify-center">
                  <button
                    onClick={() => router.push('/dashboard')}
                    className="btn-primary"
                  >
                    Track Your Order
                  </button>
                  <button
                    onClick={() => router.push('/products')}
                    className="btn-secondary"
                  >
                    Continue Shopping
                  </button>
                </div>
              </motion.div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-24">
              <h3 className="font-bold text-gray-900 mb-4">Order Summary</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({items.reduce((sum, i) => sum + i.quantity, 0)} items)</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? <span className="text-green-600">Free</span> : formatPrice(shipping)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>GST (18%)</span>
                  <span>{formatPrice(tax)}</span>
                </div>
                {shipping === 0 && (
                  <div className="bg-green-50 text-green-700 text-xs p-2 rounded-lg">
                    🎉 You saved ₹99 on shipping!
                  </div>
                )}
                <div className="border-t border-gray-100 pt-3 flex justify-between font-bold text-gray-900 text-base">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>

              <div className="mt-4 p-3 bg-blue-50 rounded-xl">
                <p className="text-xs text-blue-700">
                  🔒 Secured by Razorpay & Stripe. 100% safe & encrypted checkout.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
