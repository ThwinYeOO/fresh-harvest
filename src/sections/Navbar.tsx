import { useState, useEffect } from 'react';
import { ShoppingCart, User, Menu, X, Search, Leaf, ChevronDown } from 'lucide-react';
import { useCart } from '@/store/CartContext';
import { useAuth } from '@/store/AuthContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface NavbarProps {
  onNavigate: (page: 'home' | 'shop' | 'product' | 'cart' | 'checkout' | 'login' | 'register' | 'orders' | 'admin') => void;
  currentPage: string;
}

export default function Navbar({ onNavigate, currentPage }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { totalItems, setCartOpen } = useCart();
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onNavigate('shop');
      setSearchQuery('');
    }
  };

  const navLinks = [
    { label: 'Home', page: 'home' as const },
    { label: 'Shop', page: 'shop' as const },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-soft'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2 group"
          >
            <div className="w-10 h-10 bg-forest rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <span className="font-display text-xl lg:text-2xl font-bold text-charcoal">
              Fresh<span className="text-forest">Harvest</span>
            </span>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.page}
                onClick={() => onNavigate(link.page)}
                className={`font-medium transition-colors relative ${
                  currentPage === link.page
                    ? 'text-forest'
                    : 'text-gray hover:text-forest'
                }`}
              >
                {link.label}
                {currentPage === link.page && (
                  <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-forest rounded-full" />
                )}
              </button>
            ))}
          </nav>

          {/* Search Bar - Desktop */}
          <form onSubmit={handleSearch} className="hidden lg:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search fresh produce..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-200 bg-white/80 focus:bg-white focus:border-forest focus:outline-none focus:ring-2 focus:ring-forest/20 transition-all"
              />
            </div>
          </form>

          {/* Right Actions */}
          <div className="flex items-center gap-2 lg:gap-4">
            {/* Cart Button */}
            <button
              onClick={() => setCartOpen(true)}
              className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ShoppingCart className="w-5 h-5 text-charcoal" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-sunny text-charcoal text-xs font-bold rounded-full flex items-center justify-center animate-bounce-soft">
                  {totalItems}
                </span>
              )}
            </button>

            {/* User Menu */}
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <div className="w-8 h-8 bg-forest rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <span className="hidden lg:block font-medium text-sm text-charcoal">
                      {user?.name}
                    </span>
                    <ChevronDown className="hidden lg:block w-4 h-4 text-gray" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <div className="px-3 py-2">
                    <p className="font-medium text-sm">{user?.name}</p>
                    <p className="text-xs text-gray">{user?.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  {user?.role === 'admin' ? (
                    <DropdownMenuItem onClick={() => onNavigate('admin')}>
                      Admin Dashboard
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem onClick={() => onNavigate('orders')}>
                      My Orders
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="text-red-600">
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                onClick={() => onNavigate('login')}
                className="hidden lg:flex bg-forest hover:bg-forest/90 text-white"
              >
                Sign In
              </Button>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5 text-charcoal" />
              ) : (
                <Menu className="w-5 h-5 text-charcoal" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 animate-slide-up">
          <div className="px-4 py-4 space-y-4">
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search fresh produce..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-200 focus:border-forest focus:outline-none focus:ring-2 focus:ring-forest/20"
              />
            </form>

            {/* Mobile Nav Links */}
            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <button
                  key={link.page}
                  onClick={() => {
                    onNavigate(link.page);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`px-4 py-3 rounded-lg text-left font-medium transition-colors ${
                    currentPage === link.page
                      ? 'bg-forest/10 text-forest'
                      : 'hover:bg-gray-100 text-charcoal'
                  }`}
                >
                  {link.label}
                </button>
              ))}
            </nav>

            {/* Mobile Auth */}
            {!isAuthenticated && (
              <div className="pt-4 border-t border-gray-100 space-y-2">
                <Button
                  onClick={() => {
                    onNavigate('login');
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full bg-forest hover:bg-forest/90 text-white"
                >
                  Sign In
                </Button>
                <Button
                  onClick={() => {
                    onNavigate('register');
                    setIsMobileMenuOpen(false);
                  }}
                  variant="outline"
                  className="w-full border-forest text-forest hover:bg-forest/10"
                >
                  Create Account
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
