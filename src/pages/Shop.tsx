import { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, Grid3X3, LayoutList, Star, ShoppingCart, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { products, categories } from '@/data/products';
import { useCart } from '@/store/CartContext';
import { toast } from 'sonner';

interface ShopProps {
  onNavigate: (page: 'home' | 'shop' | 'product' | 'cart' | 'checkout' | 'login' | 'register' | 'orders' | 'admin', productId?: string) => void;
}

export default function Shop({ onNavigate }: ShopProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10]);
  const [sortBy, setSortBy] = useState<'price-low' | 'price-high' | 'rating' | 'name'>('name');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const { addItem } = useCart();

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        p =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      result = result.filter(p => p.category.toLowerCase() === selectedCategory.toLowerCase());
    }

    // Price filter
    result = result.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

    // Sort
    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    return result;
  }, [searchQuery, selectedCategory, priceRange, sortBy]);

  const handleAddToCart = (product: typeof products[0]) => {
    addItem(product);
    toast.success(`${product.name} added to cart!`);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setPriceRange([0, 10]);
    setSortBy('name');
  };

  return (
    <div className="pt-20 lg:pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-3xl lg:text-4xl font-bold text-charcoal mb-4">
            Our <span className="text-emerald">Products</span>
          </h1>
          <p className="text-gray max-w-2xl">
            Browse our selection of fresh, organic produce sourced directly from local farms
          </p>
        </div>

        {/* Search and Controls */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12"
            />
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden"
            >
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              Filters
            </Button>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="h-12 px-4 rounded-md border border-input bg-background text-sm"
            >
              <option value="name">Sort by Name</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>

            <div className="hidden sm:flex items-center border rounded-md">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-3 ${viewMode === 'grid' ? 'bg-emerald text-white' : 'hover:bg-gray-100'}`}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-3 ${viewMode === 'list' ? 'bg-emerald text-white' : 'hover:bg-gray-100'}`}
              >
                <LayoutList className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Sidebar Filters */}
          <aside className={`${showFilters ? 'fixed inset-0 z-50 bg-white p-4' : 'hidden'} lg:block lg:static lg:w-64 lg:flex-shrink-0`}>
            <div className="lg:sticky lg:top-24">
              <div className="flex items-center justify-between mb-6 lg:mb-4">
                <h3 className="font-display text-lg font-semibold">Filters</h3>
                <button
                  onClick={() => setShowFilters(false)}
                  className="lg:hidden p-2"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Categories */}
              <div className="mb-6">
                <h4 className="font-medium mb-3">Categories</h4>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <Checkbox
                      checked={selectedCategory === 'all'}
                      onCheckedChange={() => setSelectedCategory('all')}
                    />
                    <span className="text-sm">All Categories</span>
                  </label>
                  {categories.map((cat) => (
                    <label key={cat.id} className="flex items-center gap-2 cursor-pointer">
                      <Checkbox
                        checked={selectedCategory === cat.name.toLowerCase()}
                        onCheckedChange={() => setSelectedCategory(cat.name.toLowerCase())}
                      />
                      <span className="text-sm">{cat.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h4 className="font-medium mb-3">Price Range</h4>
                <Slider
                  value={priceRange}
                  onValueChange={(value) => setPriceRange(value as [number, number])}
                  max={10}
                  step={0.5}
                  className="mb-4"
                />
                <div className="flex items-center justify-between text-sm">
                  <span>${priceRange[0].toFixed(2)}</span>
                  <span>${priceRange[1].toFixed(2)}</span>
                </div>
              </div>

              {/* Clear Filters */}
              <Button
                onClick={clearFilters}
                variant="outline"
                className="w-full border-emerald text-emerald hover:bg-emerald/10"
              >
                Clear Filters
              </Button>

              <Button
                onClick={() => setShowFilters(false)}
                className="w-full mt-3 lg:hidden bg-emerald text-white"
              >
                Apply Filters
              </Button>
            </div>
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Results Count */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-gray text-sm">
                Showing {filteredProducts.length} products
              </p>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="font-display text-xl font-semibold text-charcoal mb-2">
                  No products found
                </h3>
                <p className="text-gray mb-4">
                  Try adjusting your search or filters
                </p>
                <Button onClick={clearFilters} variant="outline">
                  Clear Filters
                </Button>
              </div>
            ) : (
              <div className={`grid ${viewMode === 'grid' ? 'grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'} gap-4 lg:gap-6`}>
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    viewMode={viewMode}
                    onNavigate={onNavigate}
                    onAddToCart={handleAddToCart}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Product Card Component
interface ProductCardProps {
  product: typeof products[0];
  viewMode: 'grid' | 'list';
  onNavigate: ShopProps['onNavigate'];
  onAddToCart: (product: typeof products[0]) => void;
}

function ProductCard({ product, viewMode, onNavigate, onAddToCart }: ProductCardProps) {
  if (viewMode === 'list') {
    return (
      <div className="flex gap-4 bg-white rounded-xl p-4 shadow-soft hover:shadow-hover transition-shadow">
        <button
          onClick={() => onNavigate('product', product.id)}
          className="w-32 h-32 flex-shrink-0 bg-gray-light rounded-lg overflow-hidden"
        >
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-contain p-2"
          />
        </button>
        <div className="flex-1 flex flex-col">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-gray uppercase">{product.category}</p>
              <button
                onClick={() => onNavigate('product', product.id)}
                className="font-display text-lg font-semibold text-charcoal hover:text-emerald transition-colors"
              >
                {product.name}
              </button>
              <div className="flex items-center gap-1 mt-1">
                <Star className="w-4 h-4 text-golden fill-current" />
                <span className="text-sm">{product.rating}</span>
                <span className="text-sm text-gray">({product.reviews})</span>
              </div>
            </div>
            <div className="text-right">
              <p className="font-display text-xl font-bold text-emerald">
                ${product.price.toFixed(2)}
              </p>
              {product.originalPrice && (
                <p className="text-sm text-gray line-through">
                  ${product.originalPrice.toFixed(2)}
                </p>
              )}
            </div>
          </div>
          <p className="text-gray text-sm mt-2 line-clamp-2">{product.description}</p>
          <div className="mt-auto pt-3">
            <Button
              onClick={() => onAddToCart(product)}
              className="bg-emerald hover:bg-emerald/90 text-white"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Add to Cart
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group bg-white rounded-xl overflow-hidden shadow-soft hover:shadow-hover transition-all hover:-translate-y-1">
      <button
        onClick={() => onNavigate('product', product.id)}
        className="relative aspect-square bg-gray-light overflow-hidden"
      >
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-110"
        />
        {product.originalPrice && (
          <span className="absolute top-3 left-3 bg-golden text-charcoal text-xs font-bold px-2 py-1 rounded-full">
            SALE
          </span>
        )}
      </button>
      <div className="p-4">
        <p className="text-xs text-gray uppercase">{product.category}</p>
        <button
          onClick={() => onNavigate('product', product.id)}
          className="font-display font-semibold text-charcoal hover:text-emerald transition-colors line-clamp-1"
        >
          {product.name}
        </button>
        <div className="flex items-center gap-1 mt-1">
          <Star className="w-4 h-4 text-golden fill-current" />
          <span className="text-sm">{product.rating}</span>
        </div>
        <div className="flex items-center justify-between mt-3">
          <div>
            <span className="font-display text-lg font-bold text-emerald">
              ${product.price.toFixed(2)}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-gray line-through ml-2">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>
          <button
            onClick={() => onAddToCart(product)}
            className="w-10 h-10 bg-emerald text-white rounded-full flex items-center justify-center hover:bg-emerald/90 transition-colors"
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
