import { useEffect, useRef } from 'react';
import { ArrowRight, Star, Quote } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { products, categories, testimonials, blogPosts, instagramImages } from '@/data/products';

interface HomeProps {
  onNavigate: (page: 'home' | 'shop' | 'product' | 'cart' | 'checkout' | 'login' | 'register' | 'orders' | 'admin', productId?: string) => void;
}

export default function Home({ onNavigate }: HomeProps) {
  return (
    <div className="pt-16 lg:pt-20">
      {/* Hero Section */}
      <HeroSection onNavigate={onNavigate} />

      {/* Categories Section */}
      <CategoriesSection onNavigate={onNavigate} />

      {/* Featured Products Section */}
      <FeaturedProductsSection onNavigate={onNavigate} />

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* Blog Section */}
      <BlogSection onNavigate={onNavigate} />

      {/* Instagram Section */}
      <InstagramSection />
    </div>
  );
}

// Hero Section
function HeroSection({ onNavigate }: { onNavigate: HomeProps['onNavigate'] }) {
  const heroRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!imageRef.current) return;
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      const x = (clientX / innerWidth - 0.5) * 20;
      const y = (clientY / innerHeight - 0.5) * 20;
      imageRef.current.style.transform = `perspective(1000px) rotateY(${x}deg) rotateX(${-y}deg)`;
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section ref={heroRef} className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 pattern-bg opacity-50" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Text Content */}
          <div className="space-y-6 lg:space-y-8 animate-slide-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-forest/10 rounded-full">
              <span className="w-2 h-2 bg-forest rounded-full animate-pulse" />
              <span className="text-sm font-medium text-forest">100% Organic & Fresh</span>
            </div>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-charcoal leading-tight">
              Fresh From
              <br />
              <span className="text-forest">The Farm</span>
            </h1>

            <p className="text-lg lg:text-xl text-gray max-w-lg">
              Organic ingredients delivered to your doorstep. Experience the taste of 
              nature with our farm-fresh produce, sourced directly from local farmers.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={() => onNavigate('shop')}
                size="lg"
                className="bg-forest hover:bg-forest/90 text-white h-14 px-8 text-lg"
              >
                Shop Now
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                onClick={() => onNavigate('shop')}
                size="lg"
                variant="outline"
                className="border-forest text-forest hover:bg-forest/10 h-14 px-8 text-lg"
              >
                Explore Products
              </Button>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-8 pt-4">
              <div>
                <p className="font-display text-3xl font-bold text-forest">50K+</p>
                <p className="text-sm text-gray">Happy Customers</p>
              </div>
              <div className="w-px h-12 bg-gray-200" />
              <div>
                <p className="font-display text-3xl font-bold text-forest">200+</p>
                <p className="text-sm text-gray">Local Farms</p>
              </div>
              <div className="w-px h-12 bg-gray-200" />
              <div>
                <p className="font-display text-3xl font-bold text-forest">100%</p>
                <p className="text-sm text-gray">Organic</p>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div 
            ref={imageRef}
            className="relative transition-transform duration-200 ease-out"
            style={{ transformStyle: 'preserve-3d' }}
          >
            <div className="relative">
              {/* Main Image */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl float-animation">
                <img
                  src="/hero-main.jpg"
                  alt="Fresh organic food"
                  className="w-full h-auto object-cover"
                />
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>

              {/* Floating Badge */}
              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-lg p-4 animate-bounce-soft">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-sunny rounded-full flex items-center justify-center">
                    <Star className="w-6 h-6 text-charcoal fill-current" />
                  </div>
                  <div>
                    <p className="font-semibold text-charcoal">4.9 Rating</p>
                    <p className="text-sm text-gray">Based on 10k+ reviews</p>
                  </div>
                </div>
              </div>

              {/* Price Tag */}
              <div className="absolute -top-4 -right-4 bg-forest text-white rounded-2xl shadow-lg p-4 animate-float">
                <p className="text-sm opacity-90">Starting from</p>
                <p className="font-display text-2xl font-bold">$1.99</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Categories Section
function CategoriesSection({ onNavigate }: { onNavigate: HomeProps['onNavigate'] }) {
  return (
    <section className="py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl lg:text-4xl font-bold text-charcoal mb-4">
            Explore by <span className="text-forest">Taste</span>
          </h2>
          <p className="text-gray max-w-2xl mx-auto">
            Browse our wide selection of fresh, organic categories
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {categories.map((category, index) => (
            <button
              key={category.id}
              onClick={() => onNavigate('shop')}
              className="group relative overflow-hidden rounded-2xl aspect-square hover-lift"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4 lg:p-6">
                <h3 className="font-display text-xl lg:text-2xl font-bold text-white mb-1">
                  {category.name}
                </h3>
                <p className="text-white/80 text-sm">
                  {category.productCount} products
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

// Featured Products Section
function FeaturedProductsSection({ onNavigate }: { onNavigate: HomeProps['onNavigate'] }) {
  const featuredProducts = products.slice(0, 4);

  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-12">
          <div>
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-charcoal mb-2">
              Fresh <span className="text-forest">Picks</span>
            </h2>
            <p className="text-gray">
              Handpicked favorites from our farm to your table
            </p>
          </div>
          <Button
            onClick={() => onNavigate('shop')}
            variant="outline"
            className="border-forest text-forest hover:bg-forest/10"
          >
            View All Products
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {featuredProducts.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              onNavigate={onNavigate}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

// Product Card Component
function ProductCard({ 
  product, 
  onNavigate, 
  index 
}: { 
  product: typeof products[0]; 
  onNavigate: HomeProps['onNavigate'];
  index: number;
}) {
  return (
    <div
      className="group bg-gray-light rounded-2xl overflow-hidden hover-lift"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      {/* Image */}
      <button
        onClick={() => onNavigate('product', product.id)}
        className="relative aspect-square bg-white overflow-hidden"
      >
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-110"
        />
        {product.originalPrice && (
          <span className="absolute top-3 left-3 bg-sunny text-charcoal text-xs font-bold px-2 py-1 rounded-full">
            SALE
          </span>
        )}
      </button>

      {/* Content */}
      <div className="p-4">
        <p className="text-xs text-gray uppercase tracking-wide mb-1">
          {product.category}
        </p>
        <button
          onClick={() => onNavigate('product', product.id)}
          className="font-display font-semibold text-charcoal hover:text-forest transition-colors line-clamp-1"
        >
          {product.name}
        </button>

        {/* Rating */}
        <div className="flex items-center gap-1 mt-2">
          <Star className="w-4 h-4 text-sunny fill-current" />
          <span className="text-sm font-medium">{product.rating}</span>
          <span className="text-sm text-gray">({product.reviews})</span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2 mt-2">
          <span className="font-display text-lg font-bold text-forest">
            ${product.price.toFixed(2)}
          </span>
          {product.originalPrice && (
            <span className="text-sm text-gray line-through">
              ${product.originalPrice.toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// Testimonials Section
function TestimonialsSection() {
  return (
    <section className="py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl lg:text-4xl font-bold text-charcoal mb-4">
            What People <span className="text-forest">Say</span>
          </h2>
          <p className="text-gray max-w-2xl mx-auto">
            Hear from our satisfied customers about their FreshHarvest experience
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className="bg-white rounded-2xl p-6 lg:p-8 shadow-soft hover:shadow-hover transition-shadow"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <Quote className="w-10 h-10 text-forest/20 mb-4" />
              <p className="text-charcoal mb-6 leading-relaxed">
                &ldquo;{testimonial.text}&rdquo;
              </p>
              <div className="flex items-center gap-4">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold text-charcoal">{testimonial.name}</p>
                  <div className="flex items-center gap-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-sunny fill-current" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Blog Section
function BlogSection({ onNavigate }: { onNavigate: HomeProps['onNavigate'] }) {
  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-12">
          <div>
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-charcoal mb-2">
              Fresh From The <span className="text-forest">Blog</span>
            </h2>
            <p className="text-gray">
              Tips, recipes, and stories from our farm
            </p>
          </div>
          <Button
            onClick={() => onNavigate('home')}
            variant="outline"
            className="border-forest text-forest hover:bg-forest/10"
          >
            View All Posts
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {blogPosts.map((post, index) => (
            <button
              key={post.id}
              onClick={() => onNavigate('home')}
              className="group text-left bg-gray-light rounded-2xl overflow-hidden hover-lift"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="aspect-video overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-xs font-medium text-forest bg-forest/10 px-2 py-1 rounded-full">
                    {post.category}
                  </span>
                  <span className="text-xs text-gray">{post.readTime}</span>
                </div>
                <h3 className="font-display text-lg font-semibold text-charcoal group-hover:text-forest transition-colors line-clamp-2 mb-2">
                  {post.title}
                </h3>
                <p className="text-gray text-sm line-clamp-2 mb-4">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray">{post.author}</span>
                  <span className="text-sm text-gray">{post.date}</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

// Instagram Section
function InstagramSection() {
  return (
    <section className="py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl lg:text-4xl font-bold text-charcoal mb-4">
            Follow Us on <span className="text-forest">Instagram</span>
          </h2>
          <p className="font-accent text-2xl text-sunny">@freshharvest</p>
        </div>

        <div className="grid grid-cols-3 lg:grid-cols-6 gap-2 lg:gap-4">
          {instagramImages.map((image, index) => (
            <a
              key={index}
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-square overflow-hidden rounded-lg lg:rounded-xl"
            >
              <img
                src={image}
                alt={`Instagram post ${index + 1}`}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-forest/0 group-hover:bg-forest/40 transition-colors flex items-center justify-center">
                <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity font-medium">
                  View
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
