import { useState } from 'react';
import { ArrowLeft, Package, Users, DollarSign, TrendingUp, ShoppingBag, Plus, Edit, Trash2, Search, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/store/AuthContext';
import { products } from '@/data/products';
import { toast } from 'sonner';

interface AdminDashboardProps {
  onNavigate: (page: 'home' | 'shop' | 'product' | 'cart' | 'checkout' | 'login' | 'register' | 'orders' | 'admin', productId?: string) => void;
}

export default function AdminDashboard({ onNavigate }: AdminDashboardProps) {
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders'>('overview');
  const [searchQuery, setSearchQuery] = useState('');

  if (!isAuthenticated || user?.role !== 'admin') {
    return (
      <div className="pt-24 pb-16 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="font-display text-2xl font-bold text-charcoal mb-4">
            Access Denied
          </h2>
          <p className="text-gray mb-6">You don&apos;t have permission to access this page</p>
          <Button onClick={() => onNavigate('home')} className="bg-forest text-white">
            Go Home
          </Button>
        </div>
      </div>
    );
  }

  // Mock stats
  const stats = {
    totalOrders: 156,
    totalRevenue: 12450.50,
    totalCustomers: 89,
    totalProducts: products.length,
  };

  // Mock recent orders
  const recentOrders = [
    { id: 'ORD-156', customer: 'John Doe', total: 45.99, status: 'delivered', date: '2024-01-25' },
    { id: 'ORD-155', customer: 'Jane Smith', total: 78.50, status: 'shipped', date: '2024-01-24' },
    { id: 'ORD-154', customer: 'Mike Johnson', total: 23.99, status: 'processing', date: '2024-01-24' },
    { id: 'ORD-153', customer: 'Sarah Williams', total: 156.00, status: 'pending', date: '2024-01-23' },
  ];

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDeleteProduct = (_productId: string) => {
    toast.success('Product deleted successfully');
  };

  const handleEditProduct = (_productId: string) => {
    toast.info('Edit feature coming soon!');
  };

  const handleAddProduct = () => {
    toast.info('Add product feature coming soon!');
  };

  return (
    <div className="pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <button
              onClick={() => onNavigate('home')}
              className="flex items-center gap-2 text-gray hover:text-forest transition-colors mb-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </button>
            <h1 className="font-display text-3xl font-bold text-charcoal">
              Admin Dashboard
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-forest rounded-full flex items-center justify-center">
              <span className="text-white font-medium">{user?.name?.charAt(0)}</span>
            </div>
            <div>
              <p className="font-medium text-charcoal">{user?.name}</p>
              <p className="text-sm text-gray">Administrator</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'products', label: 'Products', icon: Package },
            { id: 'orders', label: 'Orders', icon: ShoppingBag },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-forest text-white'
                  : 'bg-white text-gray hover:bg-gray-100'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Total Orders', value: stats.totalOrders, icon: ShoppingBag, color: 'bg-blue-500' },
                { label: 'Revenue', value: `$${stats.totalRevenue.toFixed(2)}`, icon: DollarSign, color: 'bg-green-500' },
                { label: 'Customers', value: stats.totalCustomers, icon: Users, color: 'bg-purple-500' },
                { label: 'Products', value: stats.totalProducts, icon: Package, color: 'bg-orange-500' },
              ].map((stat) => (
                <div key={stat.label} className="bg-white rounded-xl p-6 shadow-soft">
                  <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center mb-4`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-gray text-sm">{stat.label}</p>
                  <p className="font-display text-2xl font-bold text-charcoal">{stat.value}</p>
                </div>
              ))}
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-xl shadow-soft p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-xl font-semibold">Recent Orders</h2>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="text-forest hover:underline text-sm"
                >
                  View All
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray">Order ID</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray">Customer</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray">Total</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray">Status</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order) => (
                      <tr key={order.id} className="border-b border-gray-50 last:border-0">
                        <td className="py-3 px-4 font-medium">{order.id}</td>
                        <td className="py-3 px-4">{order.customer}</td>
                        <td className="py-3 px-4 font-medium text-forest">${order.total.toFixed(2)}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            order.status === 'delivered' ? 'bg-green-100 text-green-600' :
                            order.status === 'shipped' ? 'bg-purple-100 text-purple-600' :
                            order.status === 'processing' ? 'bg-blue-100 text-blue-600' :
                            'bg-yellow-100 text-yellow-600'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray">{order.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-forest to-green-600 rounded-xl p-6 text-white">
                <TrendingUp className="w-8 h-8 mb-4" />
                <h3 className="font-display text-xl font-semibold mb-2">Sales Overview</h3>
                <p className="opacity-90 mb-4">Your store is performing well this month!</p>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold">+24%</span>
                  <span className="text-sm opacity-75">vs last month</span>
                </div>
              </div>
              <div className="bg-gradient-to-br from-sunny to-orange-400 rounded-xl p-6 text-charcoal">
                <Package className="w-8 h-8 mb-4" />
                <h3 className="font-display text-xl font-semibold mb-2">Inventory Status</h3>
                <p className="mb-4">All products are well stocked</p>
                <Button
                  onClick={() => setActiveTab('products')}
                  variant="secondary"
                  className="bg-white/80 hover:bg-white"
                >
                  Manage Products
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div className="bg-white rounded-xl shadow-soft p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <h2 className="font-display text-xl font-semibold">Products</h2>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="relative flex-1 sm:flex-none">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-full sm:w-64"
                  />
                </div>
                <Button
                  onClick={handleAddProduct}
                  className="bg-forest hover:bg-forest/90 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Product
                </Button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray">Product</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray">Category</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray">Price</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray">Stock</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="border-b border-gray-50 last:border-0">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gray-light rounded-lg overflow-hidden">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-full object-contain p-1"
                            />
                          </div>
                          <span className="font-medium">{product.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">{product.category}</td>
                      <td className="py-3 px-4 font-medium text-forest">${product.price.toFixed(2)}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          product.inStock ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                        }`}>
                          {product.inStock ? 'In Stock' : 'Out of Stock'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEditProduct(product.id)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            <Edit className="w-4 h-4 text-gray" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product.id)}
                            className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-xl shadow-soft p-6">
            <h2 className="font-display text-xl font-semibold mb-6">All Orders</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray">Order ID</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray">Customer</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray">Total</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray">Date</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="border-b border-gray-50 last:border-0">
                      <td className="py-3 px-4 font-medium">{order.id}</td>
                      <td className="py-3 px-4">{order.customer}</td>
                      <td className="py-3 px-4 font-medium text-forest">${order.total.toFixed(2)}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          order.status === 'delivered' ? 'bg-green-100 text-green-600' :
                          order.status === 'shipped' ? 'bg-purple-100 text-purple-600' :
                          order.status === 'processing' ? 'bg-blue-100 text-blue-600' :
                          'bg-yellow-100 text-yellow-600'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray">{order.date}</td>
                      <td className="py-3 px-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toast.info('Order details coming soon!')}
                        >
                          View Details
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
