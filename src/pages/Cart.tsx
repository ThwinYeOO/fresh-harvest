import { ArrowLeft, ShoppingBag, Trash2, Plus, Minus, ArrowRight, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/store/CartContext';
import { useAuth } from '@/store/AuthContext';
import { toast } from 'sonner';

interface CartProps {
  onNavigate: (page: 'home' | 'shop' | 'product' | 'cart' | 'checkout' | 'login' | 'register' | 'orders' | 'admin', productId?: string) => void;
}

export default function Cart({ onNavigate }: CartProps) {
  const { items, removeItem, updateQuantity, totalPrice, clearCart, totalItems } = useCart();
  const { isAuthenticated } = useAuth();

  const shippingCost = totalPrice > 35 ? 0 : 5.99;
  const tax = totalPrice * 0.08;
  const finalTotal = totalPrice + shippingCost + tax;

  const handleCheckout = () => {
    if (!isAuthenticated) {
      toast.info('Please sign in to proceed with checkout');
      onNavigate('login');
      return;
    }
    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }
    onNavigate('checkout');
  };

  if (items.length === 0) {
    return (
      <div className="pt-24 pb-16 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-display text-3xl font-bold text-charcoal mb-8">Shopping Cart</h1>
          <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl shadow-soft">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <ShoppingBag className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="font-display text-2xl font-semibold text-charcoal mb-2">
              Your cart is empty
            </h2>
            <p className="text-gray mb-8 text-center max-w-md">
              Looks like you haven&apos;t added anything to your cart yet. 
              Explore our fresh products and start shopping!
            </p>
            <Button
              onClick={() => onNavigate('shop')}
              className="bg-emerald hover:bg-emerald/90 text-white"
            >
              Start Shopping
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-display text-3xl font-bold text-charcoal">
            Shopping Cart ({totalItems})
          </h1>
          <button
            onClick={() => onNavigate('shop')}
            className="flex items-center gap-2 text-gray hover:text-emerald transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Continue Shopping
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl p-4 lg:p-6 shadow-soft flex gap-4 lg:gap-6"
              >
                {/* Product Image */}
                <button
                  onClick={() => onNavigate('product', item.id)}
                  className="w-24 h-24 lg:w-32 lg:h-32 bg-gray-light rounded-lg flex-shrink-0 overflow-hidden"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-contain p-2"
                  />
                </button>

                {/* Product Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <button
                        onClick={() => onNavigate('product', item.id)}
                        className="font-display text-lg font-semibold text-charcoal hover:text-emerald transition-colors line-clamp-1"
                      >
                        {item.name}
                      </button>
                      <p className="text-sm text-gray">{item.category}</p>
                      <p className="text-sm text-gray">{item.weight}</p>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-2 hover:bg-red-50 rounded-full transition-colors flex-shrink-0"
                    >
                      <Trash2 className="w-5 h-5 text-red-500" />
                    </button>
                  </div>

                  <div className="flex items-end justify-between mt-4">
                    {/* Quantity Controls */}
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded-full hover:border-emerald transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded-full hover:border-emerald transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Price */}
                    <div className="text-right">
                      <p className="font-display text-xl font-bold text-emerald">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                      <p className="text-sm text-gray">
                        ${item.price.toFixed(2)} each
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Clear Cart */}
            <button
              onClick={clearCart}
              className="text-red-500 hover:text-red-600 text-sm font-medium flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Clear Cart
            </button>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 shadow-soft sticky top-24">
              <h2 className="font-display text-xl font-semibold text-charcoal mb-6">
                Order Summary
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between text-gray">
                  <span>Subtotal</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between text-gray">
                  <span>Shipping</span>
                  <span>{shippingCost === 0 ? 'Free' : `$${shippingCost.toFixed(2)}`}</span>
                </div>
                <div className="flex items-center justify-between text-gray">
                  <span>Tax (8%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                {shippingCost > 0 && (
                  <p className="text-sm text-emerald">
                    Add ${(35 - totalPrice).toFixed(2)} more for free shipping!
                  </p>
                )}
              </div>

              <div className="border-t border-gray-100 pt-4 mb-6">
                <div className="flex items-center justify-between">
                  <span className="font-display text-lg font-semibold">Total</span>
                  <span className="font-display text-2xl font-bold text-emerald">
                    ${finalTotal.toFixed(2)}
                  </span>
                </div>
              </div>

              <Button
                onClick={handleCheckout}
                className="w-full bg-emerald hover:bg-emerald/90 text-white h-14"
              >
                Proceed to Checkout
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>

              {!isAuthenticated && (
                <p className="text-sm text-gray text-center mt-4">
                  You&apos;ll need to sign in to complete your order
                </p>
              )}

              {/* Trust Badges */}
              <div className="mt-6 pt-6 border-t border-gray-100">
                <div className="flex items-center justify-center gap-4 text-gray">
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4" />
                    <span className="text-xs">Secure Packaging</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
