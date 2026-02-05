import { X, Plus, Minus, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { useCart } from '@/store/CartContext';
import { Button } from '@/components/ui/button';

interface CartDrawerProps {
  onNavigate: (page: 'home' | 'shop' | 'product' | 'cart' | 'checkout' | 'login' | 'register' | 'orders' | 'admin') => void;
}

export default function CartDrawer({ onNavigate }: CartDrawerProps) {
  const { items, isOpen, setCartOpen, removeItem, updateQuantity, totalPrice, totalItems } = useCart();

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 animate-fade-in"
        onClick={() => setCartOpen(false)}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl z-50 animate-slide-up">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <ShoppingBag className="w-5 h-5 text-forest" />
              <h2 className="font-display text-lg font-semibold text-charcoal">
                Your Cart ({totalItems})
              </h2>
            </div>
            <button
              onClick={() => setCartOpen(false)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-4">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <ShoppingBag className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="font-display text-lg font-semibold text-charcoal mb-2">
                  Your cart is empty
                </h3>
                <p className="text-gray text-sm mb-6">
                  Looks like you haven&apos;t added anything yet
                </p>
                <Button
                  onClick={() => {
                    setCartOpen(false);
                    onNavigate('shop');
                  }}
                  className="bg-forest hover:bg-forest/90 text-white"
                >
                  Start Shopping
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    {/* Product Image */}
                    <div className="w-20 h-20 bg-white rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-contain p-2"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-charcoal truncate">
                        {item.name}
                      </h4>
                      <p className="text-sm text-gray">{item.weight}</p>
                      <p className="font-semibold text-forest mt-1">
                        ${item.price.toFixed(2)}
                      </p>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-7 h-7 flex items-center justify-center bg-white rounded-full border border-gray-200 hover:border-forest transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center font-medium text-sm">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-7 h-7 flex items-center justify-center bg-white rounded-full border border-gray-200 hover:border-forest transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-2 hover:bg-red-50 rounded-full transition-colors self-start"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="p-4 border-t border-gray-100 bg-gray-50">
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray">Subtotal</span>
                <span className="font-display text-xl font-bold text-charcoal">
                  ${totalPrice.toFixed(2)}
                </span>
              </div>
              <p className="text-xs text-gray mb-4">
                Shipping and taxes calculated at checkout
              </p>
              <Button
                onClick={() => {
                  setCartOpen(false);
                  onNavigate('checkout');
                }}
                className="w-full bg-forest hover:bg-forest/90 text-white h-12"
              >
                Proceed to Checkout
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button
                onClick={() => {
                  setCartOpen(false);
                  onNavigate('cart');
                }}
                variant="outline"
                className="w-full mt-2 border-forest text-forest hover:bg-forest/10"
              >
                View Full Cart
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
