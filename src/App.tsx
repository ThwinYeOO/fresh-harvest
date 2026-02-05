import { useState, useEffect } from 'react';
import { CartProvider } from '@/store/CartContext';
import { AuthProvider } from '@/store/AuthContext';
import Navbar from '@/sections/Navbar';
import Footer from '@/sections/Footer';
import CartDrawer from '@/sections/CartDrawer';
import Home from '@/pages/Home';
import Shop from '@/pages/Shop';
import ProductDetail from '@/pages/ProductDetail';
import Cart from '@/pages/Cart';
import Checkout from '@/pages/Checkout';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import OrderHistory from '@/pages/OrderHistory';
import AdminDashboard from '@/pages/AdminDashboard';
import './App.css';

type Page = 'home' | 'shop' | 'product' | 'cart' | 'checkout' | 'login' | 'register' | 'orders' | 'admin';

function AppContent() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path === '/' || path === '') setCurrentPage('home');
      else if (path === '/shop') setCurrentPage('shop');
      else if (path.startsWith('/product/')) {
        const id = path.split('/')[2];
        setSelectedProductId(id);
        setCurrentPage('product');
      }
      else if (path === '/cart') setCurrentPage('cart');
      else if (path === '/checkout') setCurrentPage('checkout');
      else if (path === '/login') setCurrentPage('login');
      else if (path === '/register') setCurrentPage('register');
      else if (path === '/orders') setCurrentPage('orders');
      else if (path === '/admin') setCurrentPage('admin');
    };

    window.addEventListener('popstate', handlePopState);
    handlePopState(); // Check initial URL
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (page: Page, productId?: string) => {
    setCurrentPage(page);
    if (productId) setSelectedProductId(productId);
    
    let url = '/';
    switch (page) {
      case 'home': url = '/'; break;
      case 'shop': url = '/shop'; break;
      case 'product': url = `/product/${productId}`; break;
      case 'cart': url = '/cart'; break;
      case 'checkout': url = '/checkout'; break;
      case 'login': url = '/login'; break;
      case 'register': url = '/register'; break;
      case 'orders': url = '/orders'; break;
      case 'admin': url = '/admin'; break;
    }
    window.history.pushState({}, '', url);
    window.scrollTo(0, 0);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home onNavigate={navigate} />;
      case 'shop':
        return <Shop onNavigate={navigate} />;
      case 'product':
        return <ProductDetail productId={selectedProductId} onNavigate={navigate} />;
      case 'cart':
        return <Cart onNavigate={navigate} />;
      case 'checkout':
        return <Checkout onNavigate={navigate} />;
      case 'login':
        return <Login onNavigate={navigate} />;
      case 'register':
        return <Register onNavigate={navigate} />;
      case 'orders':
        return <OrderHistory onNavigate={navigate} />;
      case 'admin':
        return <AdminDashboard onNavigate={navigate} />;
      default:
        return <Home onNavigate={navigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-light pattern-bg">
      <Navbar onNavigate={navigate} currentPage={currentPage} />
      <main className="min-h-screen">
        {renderPage()}
      </main>
      <Footer onNavigate={navigate} />
      <CartDrawer onNavigate={navigate} />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
