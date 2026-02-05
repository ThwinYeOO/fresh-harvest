import { useState } from 'react';
import { ArrowLeft, Package, Truck, CheckCircle, Clock, XCircle, ChevronDown, ChevronUp, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/store/AuthContext';

interface OrderHistoryProps {
  onNavigate: (page: 'home' | 'shop' | 'product' | 'cart' | 'checkout' | 'login' | 'register' | 'orders' | 'admin', productId?: string) => void;
}

const statusConfig = {
  pending: { icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-100', label: 'Pending' },
  processing: { icon: Package, color: 'text-blue-600', bg: 'bg-blue-100', label: 'Processing' },
  shipped: { icon: Truck, color: 'text-purple-600', bg: 'bg-purple-100', label: 'Shipped' },
  delivered: { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100', label: 'Delivered' },
  cancelled: { icon: XCircle, color: 'text-red-600', bg: 'bg-red-100', label: 'Cancelled' },
};

export default function OrderHistory({ onNavigate }: OrderHistoryProps) {
  const { orders, isAuthenticated } = useAuth();
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  if (!isAuthenticated) {
    return (
      <div className="pt-24 pb-16 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="font-display text-2xl font-bold text-charcoal mb-4">
            Please Sign In
          </h2>
          <p className="text-gray mb-6">You need to be signed in to view your orders</p>
          <Button onClick={() => onNavigate('login')} className="bg-forest text-white">
            Sign In
          </Button>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="pt-24 pb-16 min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2 text-gray hover:text-forest transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </button>

          <h1 className="font-display text-3xl font-bold text-charcoal mb-8">
            My Orders
          </h1>

          <div className="bg-white rounded-2xl p-12 shadow-soft text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Package className="w-10 h-10 text-gray-400" />
            </div>
            <h2 className="font-display text-2xl font-semibold text-charcoal mb-2">
              No orders yet
            </h2>
            <p className="text-gray mb-8">
              You haven&apos;t placed any orders yet. Start shopping to see your orders here!
            </p>
            <Button
              onClick={() => onNavigate('shop')}
              className="bg-forest hover:bg-forest/90 text-white"
            >
              Start Shopping
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2 text-gray hover:text-forest transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </button>

        <h1 className="font-display text-3xl font-bold text-charcoal mb-8">
          My Orders
        </h1>

        {/* Orders List */}
        <div className="space-y-4">
          {orders.map((order) => {
            const status = statusConfig[order.status];
            const StatusIcon = status.icon;
            const isExpanded = expandedOrder === order.id;

            return (
              <div
                key={order.id}
                className="bg-white rounded-xl shadow-soft overflow-hidden"
              >
                {/* Order Header */}
                <button
                  onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                  className="w-full p-4 lg:p-6 flex items-center justify-between"
                >
                  <div className="flex items-center gap-4 lg:gap-6">
                    <div className={`w-12 h-12 ${status.bg} rounded-xl flex items-center justify-center`}>
                      <StatusIcon className={`w-6 h-6 ${status.color}`} />
                    </div>
                    <div className="text-left">
                      <p className="font-display font-semibold text-charcoal">
                        {order.id}
                      </p>
                      <p className="text-sm text-gray">
                        {new Date(order.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 lg:gap-8">
                    <div className="hidden sm:block text-right">
                      <p className="font-display font-semibold text-forest">
                        ${order.total.toFixed(2)}
                      </p>
                      <p className="text-sm text-gray">
                        {order.items.reduce((sum, i) => sum + i.quantity, 0)} items
                      </p>
                    </div>
                    <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${status.bg}`}>
                      <span className={`text-sm font-medium ${status.color}`}>
                        {status.label}
                      </span>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-gray" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray" />
                    )}
                  </div>
                </button>

                {/* Order Details */}
                {isExpanded && (
                  <div className="border-t border-gray-100 p-4 lg:p-6 animate-slide-up">
                    {/* Items */}
                    <div className="space-y-4 mb-6">
                      <h4 className="font-medium text-charcoal">Order Items</h4>
                      {order.items.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center gap-4 p-3 bg-gray-light rounded-lg"
                        >
                          <div className="w-16 h-16 bg-white rounded-lg overflow-hidden flex-shrink-0">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-contain p-2"
                            />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-charcoal">{item.name}</p>
                            <p className="text-sm text-gray">{item.weight}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-charcoal">
                              ${(item.price * item.quantity).toFixed(2)}
                            </p>
                            <p className="text-sm text-gray">
                              {item.quantity} x ${item.price.toFixed(2)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Shipping Address */}
                    <div className="mb-6">
                      <h4 className="font-medium text-charcoal mb-2 flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        Shipping Address
                      </h4>
                      <div className="p-4 bg-gray-light rounded-lg text-sm">
                        <p className="font-medium">{order.shippingAddress.fullName}</p>
                        <p className="text-gray">{order.shippingAddress.street}</p>
                        <p className="text-gray">
                          {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                        </p>
                        <p className="text-gray">{order.shippingAddress.country}</p>
                        <p className="text-gray mt-2">{order.shippingAddress.phone}</p>
                      </div>
                    </div>

                    {/* Order Summary */}
                    <div className="border-t border-gray-100 pt-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray">Subtotal</span>
                          <span>${(order.total * 0.92).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray">Tax</span>
                          <span>${(order.total * 0.08).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray">Shipping</span>
                          <span>Free</span>
                        </div>
                        <div className="flex justify-between font-display text-lg font-bold pt-2 border-t border-gray-100">
                          <span>Total</span>
                          <span className="text-forest">${order.total.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
