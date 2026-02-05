import { useState } from 'react';
import { ArrowLeft, Star, ShoppingCart, Heart, Share2, Truck, Shield, RotateCcw, Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { products } from '@/data/products';
import { useCart } from '@/store/CartContext';
import { toast } from 'sonner';

interface ProductDetailProps {
  productId: string | null;
  onNavigate: (page: 'home' | 'shop' | 'product' | 'cart' | 'checkout' | 'login' | 'register' | 'orders' | 'admin', productId?: string) => void;
}

export default function ProductDetail({ productId, onNavigate }: ProductDetailProps) {
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const { addItem } = useCart();

  const product = products.find(p => p.id === productId);

  if (!product) {
    return (
      <div className="pt-24 pb-16 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="font-display text-2xl font-bold text-charcoal mb-4">
            Product Not Found
          </h2>
          <p className="text-gray mb-6">The product you&apos;re looking for doesn&apos;t exist.</p>
          <Button onClick={() => onNavigate('shop')} className="bg-forest text-white">
            Back to Shop
          </Button>
        </div>
      </div>
    );
  }

  const relatedProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem(product);
    }
    toast.success(`${quantity}x ${product.name} added to cart!`);
  };

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist!');
  };

  return (
    <div className="pt-20 lg:pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <button
          onClick={() => onNavigate('shop')}
          className="flex items-center gap-2 text-gray hover:text-forest transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Shop
        </button>

        {/* Product Info */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 mb-16">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-square bg-white rounded-2xl overflow-hidden shadow-soft">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-contain p-8"
              />
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            {/* Category & Rating */}
            <div className="flex items-center gap-4">
              <span className="px-3 py-1 bg-forest/10 text-forest text-sm font-medium rounded-full">
                {product.category}
              </span>
              <div className="flex items-center gap-1">
                <Star className="w-5 h-5 text-sunny fill-current" />
                <span className="font-medium">{product.rating}</span>
                <span className="text-gray">({product.reviews} reviews)</span>
              </div>
            </div>

            {/* Title */}
            <h1 className="font-display text-3xl lg:text-4xl font-bold text-charcoal">
              {product.name}
            </h1>

            {/* Price */}
            <div className="flex items-center gap-4">
              <span className="font-display text-3xl font-bold text-forest">
                ${product.price.toFixed(2)}
              </span>
              {product.originalPrice && (
                <>
                  <span className="text-xl text-gray line-through">
                    ${product.originalPrice.toFixed(2)}
                  </span>
                  <span className="px-2 py-1 bg-sunny text-charcoal text-sm font-bold rounded-full">
                    {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                  </span>
                </>
              )}
            </div>

            {/* Description */}
            <p className="text-gray leading-relaxed">
              {product.description}
            </p>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 py-4 border-y border-gray-100">
              <div className="text-center">
                <Truck className="w-6 h-6 text-forest mx-auto mb-2" />
                <p className="text-sm text-gray">Free Delivery</p>
              </div>
              <div className="text-center">
                <Shield className="w-6 h-6 text-forest mx-auto mb-2" />
                <p className="text-sm text-gray">Quality Guaranteed</p>
              </div>
              <div className="text-center">
                <RotateCcw className="w-6 h-6 text-forest mx-auto mb-2" />
                <p className="text-sm text-gray">Easy Returns</p>
              </div>
            </div>

            {/* Quantity & Actions */}
            <div className="space-y-4">
              {/* Quantity */}
              <div className="flex items-center gap-4">
                <span className="font-medium">Quantity:</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 flex items-center justify-center border border-gray-200 rounded-full hover:border-forest transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center font-medium text-lg">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 flex items-center justify-center border border-gray-200 rounded-full hover:border-forest transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={handleAddToCart}
                  size="lg"
                  className="flex-1 bg-forest hover:bg-forest/90 text-white h-14"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Add to Cart
                </Button>
                <Button
                  onClick={handleWishlist}
                  size="lg"
                  variant="outline"
                  className={`h-14 px-6 ${isWishlisted ? 'bg-red-50 border-red-300 text-red-500' : ''}`}
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="h-14 px-6"
                  onClick={() => toast.success('Share link copied!')}
                >
                  <Share2 className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Tags */}
            {product.tags && (
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm text-gray">Tags:</span>
                {product.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-gray-100 text-gray text-xs rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-16">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="w-full justify-start bg-gray-light p-1 rounded-xl">
              <TabsTrigger value="description" className="rounded-lg">Description</TabsTrigger>
              <TabsTrigger value="reviews" className="rounded-lg">Reviews</TabsTrigger>
              <TabsTrigger value="shipping" className="rounded-lg">Shipping</TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="mt-6">
              <div className="bg-white rounded-2xl p-6 lg:p-8">
                <h3 className="font-display text-xl font-semibold mb-4">Product Description</h3>
                <p className="text-gray leading-relaxed">
                  {product.description} Our {product.name} is carefully selected from the finest 
                  organic farms to ensure the highest quality. Each piece is hand-picked at peak 
                  ripeness to deliver the best flavor and nutritional value. Perfect for healthy 
                  eating, cooking, or enjoying as a fresh snack.
                </p>
                <ul className="mt-4 space-y-2 text-gray">
                  <li>• 100% organic and pesticide-free</li>
                  <li>• Sourced from local sustainable farms</li>
                  <li>• Packed with essential vitamins and nutrients</li>
                  <li>• Freshly harvested and delivered within 24 hours</li>
                </ul>
              </div>
            </TabsContent>
            <TabsContent value="reviews" className="mt-6">
              <div className="bg-white rounded-2xl p-6 lg:p-8">
                <h3 className="font-display text-xl font-semibold mb-4">Customer Reviews</h3>
                <div className="space-y-6">
                  {[1, 2, 3].map((review) => (
                    <div key={review} className="border-b border-gray-100 pb-6 last:border-0">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-forest rounded-full flex items-center justify-center text-white font-medium">
                          {String.fromCharCode(64 + review)}
                        </div>
                        <div>
                          <p className="font-medium">Customer {review}</p>
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${i < 4 ? 'text-sunny fill-current' : 'text-gray-300'}`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      <p className="text-gray">
                        Great quality and freshness! Will definitely order again. 
                        The delivery was quick and the packaging was eco-friendly.
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
            <TabsContent value="shipping" className="mt-6">
              <div className="bg-white rounded-2xl p-6 lg:p-8">
                <h3 className="font-display text-xl font-semibold mb-4">Shipping Information</h3>
                <div className="space-y-4 text-gray">
                  <p>
                    We offer free delivery on all orders over $35. Orders are typically 
                    delivered within 1-2 business days.
                  </p>
                  <ul className="space-y-2">
                    <li>• Standard Delivery: 1-2 business days</li>
                    <li>• Express Delivery: Same day (order before 10 AM)</li>
                    <li>• Free delivery on orders over $35</li>
                    <li>• Fresh packaging to maintain quality</li>
                  </ul>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="font-display text-2xl font-bold text-charcoal mb-6">
              You May Also <span className="text-forest">Like</span>
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              {relatedProducts.map((relatedProduct) => (
                <button
                  key={relatedProduct.id}
                  onClick={() => onNavigate('product', relatedProduct.id)}
                  className="group bg-white rounded-xl overflow-hidden shadow-soft hover:shadow-hover transition-all hover:-translate-y-1 text-left"
                >
                  <div className="aspect-square bg-gray-light overflow-hidden">
                    <img
                      src={relatedProduct.image}
                      alt={relatedProduct.name}
                      className="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-gray uppercase">{relatedProduct.category}</p>
                    <p className="font-display font-semibold text-charcoal group-hover:text-forest transition-colors line-clamp-1">
                      {relatedProduct.name}
                    </p>
                    <p className="font-display text-lg font-bold text-forest mt-1">
                      ${relatedProduct.price.toFixed(2)}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
