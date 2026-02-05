import { useState } from 'react';
import { ArrowLeft, CreditCard, Truck, Check, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useCart } from '@/store/CartContext';
import { useAuth } from '@/store/AuthContext';
import type { Address } from '@/types';

interface CheckoutProps {
  onNavigate: (page: 'home' | 'shop' | 'product' | 'cart' | 'checkout' | 'login' | 'register' | 'orders' | 'admin', productId?: string) => void;
}

export default function Checkout({ onNavigate }: CheckoutProps) {
  const { items, totalPrice, clearCart } = useCart();
  const { user, addOrder } = useAuth();
  const [step, setStep] = useState<'shipping' | 'payment' | 'confirmation'>('shipping');
  const [isProcessing, setIsProcessing] = useState(false);

  const [shippingAddress, setShippingAddress] = useState<Address>({
    fullName: user?.name || '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'USA',
    phone: '',
  });

  const [paymentMethod, setPaymentMethod] = useState('card');

  const shippingCost = totalPrice > 35 ? 0 : 5.99;
  const tax = totalPrice * 0.08;
  const finalTotal = totalPrice + shippingCost + tax;

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('payment');
    window.scrollTo(0, 0);
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Create order
    const newOrder = {
      id: `ORD-${Date.now()}`,
      userId: user?.id || '',
      items: [...items],
      total: finalTotal,
      status: 'processing' as const,
      createdAt: new Date().toISOString(),
      shippingAddress,
      paymentMethod: paymentMethod === 'card' ? 'Credit Card' : 'PayPal',
    };

    addOrder(newOrder);
    clearCart();
    setIsProcessing(false);
    setStep('confirmation');
    window.scrollTo(0, 0);
  };

  if (items.length === 0 && step !== 'confirmation') {
    onNavigate('cart');
    return null;
  }

  return (
    <div className="pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <button
          onClick={() => step === 'shipping' ? onNavigate('cart') : setStep('shipping')}
          className="flex items-center gap-2 text-gray hover:text-forest transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          {step === 'shipping' ? 'Back to Cart' : 'Back to Shipping'}
        </button>

        {/* Progress */}
        <div className="flex items-center justify-center mb-12">
          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-2 ${step === 'shipping' ? 'text-forest' : 'text-gray'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'shipping' ? 'bg-forest text-white' : 'bg-forest/20 text-forest'}`}>
                <MapPin className="w-4 h-4" />
              </div>
              <span className="font-medium hidden sm:block">Shipping</span>
            </div>
            <div className="w-12 h-0.5 bg-gray-200">
              <div className={`h-full bg-forest transition-all ${step !== 'shipping' ? 'w-full' : 'w-0'}`} />
            </div>
            <div className={`flex items-center gap-2 ${step === 'payment' ? 'text-forest' : 'text-gray'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'payment' ? 'bg-forest text-white' : step === 'confirmation' ? 'bg-forest/20 text-forest' : 'bg-gray-200'}`}>
                <CreditCard className="w-4 h-4" />
              </div>
              <span className="font-medium hidden sm:block">Payment</span>
            </div>
            <div className="w-12 h-0.5 bg-gray-200">
              <div className={`h-full bg-forest transition-all ${step === 'confirmation' ? 'w-full' : 'w-0'}`} />
            </div>
            <div className={`flex items-center gap-2 ${step === 'confirmation' ? 'text-forest' : 'text-gray'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'confirmation' ? 'bg-forest text-white' : 'bg-gray-200'}`}>
                <Check className="w-4 h-4" />
              </div>
              <span className="font-medium hidden sm:block">Confirmation</span>
            </div>
          </div>
        </div>

        {/* Shipping Step */}
        {step === 'shipping' && (
          <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-soft">
            <h2 className="font-display text-2xl font-bold text-charcoal mb-6">
              Shipping Information
            </h2>
            <form onSubmit={handleShippingSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    value={shippingAddress.fullName}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, fullName: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={shippingAddress.phone}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="street">Street Address *</Label>
                <Input
                  id="street"
                  value={shippingAddress.street}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, street: e.target.value })}
                  required
                />
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    value={shippingAddress.city}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State *</Label>
                  <Input
                    id="state"
                    value={shippingAddress.state}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zipCode">ZIP Code *</Label>
                  <Input
                    id="zipCode"
                    value={shippingAddress.zipCode}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, zipCode: e.target.value })}
                    required
                  />
                </div>
              </div>

              {/* Order Summary */}
              <div className="bg-gray-light rounded-xl p-6 mt-8">
                <h3 className="font-display text-lg font-semibold mb-4">Order Summary</h3>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-gray">
                    <span>Subtotal ({items.reduce((sum, i) => sum + i.quantity, 0)} items)</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray">
                    <span>Shipping</span>
                    <span>{shippingCost === 0 ? 'Free' : `$${shippingCost.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between text-gray">
                    <span>Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                </div>
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between font-display text-xl font-bold">
                    <span>Total</span>
                    <span className="text-forest">${finalTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-forest hover:bg-forest/90 text-white h-14"
              >
                Continue to Payment
              </Button>
            </form>
          </div>
        )}

        {/* Payment Step */}
        {step === 'payment' && (
          <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-soft">
            <h2 className="font-display text-2xl font-bold text-charcoal mb-6">
              Payment Method
            </h2>
            <form onSubmit={handlePaymentSubmit} className="space-y-6">
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                <div className="space-y-4">
                  <label className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-colors ${paymentMethod === 'card' ? 'border-forest bg-forest/5' : 'border-gray-200'}`}>
                    <RadioGroupItem value="card" />
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-forest rounded-lg flex items-center justify-center">
                        <CreditCard className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium">Credit/Debit Card</p>
                        <p className="text-sm text-gray">Pay with Visa, Mastercard, etc.</p>
                      </div>
                    </div>
                  </label>

                  <label className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-colors ${paymentMethod === 'paypal' ? 'border-forest bg-forest/5' : 'border-gray-200'}`}>
                    <RadioGroupItem value="paypal" />
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
                        P
                      </div>
                      <div>
                        <p className="font-medium">PayPal</p>
                        <p className="text-sm text-gray">Pay with your PayPal account</p>
                      </div>
                    </div>
                  </label>

                  <label className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-colors ${paymentMethod === 'cod' ? 'border-forest bg-forest/5' : 'border-gray-200'}`}>
                    <RadioGroupItem value="cod" />
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-sunny rounded-lg flex items-center justify-center">
                        <Truck className="w-5 h-5 text-charcoal" />
                      </div>
                      <div>
                        <p className="font-medium">Cash on Delivery</p>
                        <p className="text-sm text-gray">Pay when you receive</p>
                      </div>
                    </div>
                  </label>
                </div>
              </RadioGroup>

              {paymentMethod === 'card' && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Card Number</Label>
                    <Input placeholder="1234 5678 9012 3456" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Expiry Date</Label>
                      <Input placeholder="MM/YY" />
                    </div>
                    <div className="space-y-2">
                      <Label>CVV</Label>
                      <Input placeholder="123" type="password" maxLength={4} />
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-gray-light rounded-xl p-6">
                <div className="flex justify-between font-display text-xl font-bold">
                  <span>Total to Pay</span>
                  <span className="text-forest">${finalTotal.toFixed(2)}</span>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isProcessing}
                className="w-full bg-forest hover:bg-forest/90 text-white h-14"
              >
                {isProcessing ? (
                  <span className="flex items-center gap-2">
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Processing...
                  </span>
                ) : (
                  `Pay $${finalTotal.toFixed(2)}`
                )}
              </Button>
            </form>
          </div>
        )}

        {/* Confirmation Step */}
        {step === 'confirmation' && (
          <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-soft text-center">
            <div className="w-20 h-20 bg-forest rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-white" />
            </div>
            <h2 className="font-display text-3xl font-bold text-charcoal mb-4">
              Order Confirmed!
            </h2>
            <p className="text-gray mb-8 max-w-md mx-auto">
              Thank you for your order! We&apos;ve sent a confirmation email to {user?.email}. 
              Your order will be delivered within 1-2 business days.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => onNavigate('orders')}
                className="bg-forest hover:bg-forest/90 text-white"
              >
                View Order History
              </Button>
              <Button
                onClick={() => onNavigate('shop')}
                variant="outline"
                className="border-forest text-forest hover:bg-forest/10"
              >
                Continue Shopping
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
