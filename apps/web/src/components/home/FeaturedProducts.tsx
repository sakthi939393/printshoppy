'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShoppingCart, Heart, Star, Zap } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

// Mock data - in production would be fetched from API
const featuredProducts = [
  {
    id: '1',
    name: 'Classic Custom T-Shirt',
    slug: 'classic-custom-tshirt',
    basePrice: 399,
    rating: 4.8,
    reviews: 1245,
    image: 'https://via.placeholder.com/400x400?text=T-Shirt',
    badge: 'Best Seller',
    badgeColor: 'bg-orange-500',
    isCustomizable: true,
  },
  {
    id: '2',
    name: 'Premium Photo Mug',
    slug: 'premium-photo-mug',
    basePrice: 299,
    rating: 4.9,
    reviews: 876,
    image: 'https://via.placeholder.com/400x400?text=Mug',
    badge: 'Trending',
    badgeColor: 'bg-blue-500',
    isCustomizable: true,
  },
  {
    id: '3',
    name: 'Business Card (500 pcs)',
    slug: 'business-card-500',
    basePrice: 599,
    rating: 4.7,
    reviews: 2341,
    image: 'https://via.placeholder.com/400x400?text=Business+Card',
    badge: 'Popular',
    badgeColor: 'bg-green-500',
    isCustomizable: true,
  },
  {
    id: '4',
    name: 'Custom Canvas Print',
    slug: 'custom-canvas-print',
    basePrice: 799,
    rating: 4.9,
    reviews: 432,
    image: 'https://via.placeholder.com/400x400?text=Canvas',
    badge: 'New',
    badgeColor: 'bg-purple-500',
    isCustomizable: true,
  },
  {
    id: '5',
    name: 'Customized Notebook',
    slug: 'customized-notebook',
    basePrice: 249,
    rating: 4.6,
    reviews: 654,
    image: 'https://via.placeholder.com/400x400?text=Notebook',
    badge: null,
    badgeColor: null,
    isCustomizable: true,
  },
  {
    id: '6',
    name: 'Vinyl Sticker Pack',
    slug: 'vinyl-sticker-pack',
    basePrice: 149,
    rating: 4.8,
    reviews: 987,
    image: 'https://via.placeholder.com/400x400?text=Stickers',
    badge: 'Sale',
    badgeColor: 'bg-red-500',
    isCustomizable: true,
  },
  {
    id: '7',
    name: 'Custom Tote Bag',
    slug: 'custom-tote-bag',
    basePrice: 449,
    rating: 4.7,
    reviews: 321,
    image: 'https://via.placeholder.com/400x400?text=Tote+Bag',
    badge: null,
    badgeColor: null,
    isCustomizable: true,
  },
  {
    id: '8',
    name: 'Personalized Pillow',
    slug: 'personalized-pillow',
    basePrice: 549,
    rating: 4.8,
    reviews: 213,
    image: 'https://via.placeholder.com/400x400?text=Pillow',
    badge: 'Gift Idea',
    badgeColor: 'bg-pink-500',
    isCustomizable: true,
  },
];

export function FeaturedProducts() {
  return (
    <section className="py-20 bg-white">
      <div className="container-custom">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="section-title">Featured Products</h2>
            <p className="section-subtitle">Most popular picks from our catalog</p>
          </div>
          <Link href="/products" className="text-primary-600 font-semibold hover:underline hidden sm:block">
            View All →
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {featuredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="product-card group"
            >
              <div className="relative overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                {product.badge && (
                  <span className={`absolute top-3 left-3 ${product.badgeColor} text-white text-xs font-bold px-2 py-1 rounded-full`}>
                    {product.badge}
                  </span>
                )}
                {product.isCustomizable && (
                  <span className="absolute top-3 right-3 bg-white/90 text-primary-600 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                    <Zap className="w-3 h-3" /> Custom
                  </span>
                )}

                {/* Quick actions */}
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <div className="flex gap-2">
                    <Link
                      href={`/designer?product=${product.id}`}
                      className="flex-1 bg-white text-gray-900 text-xs font-bold py-2 rounded-lg text-center hover:bg-primary-600 hover:text-white transition-colors"
                    >
                      🎨 Customize
                    </Link>
                    <button className="p-2 bg-white rounded-lg text-gray-600 hover:text-red-500 transition-colors">
                      <Heart className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-4">
                <Link href={`/products/${product.slug}`}>
                  <h3 className="font-semibold text-gray-900 mb-1 hover:text-primary-600 transition-colors line-clamp-2 text-sm">
                    {product.name}
                  </h3>
                </Link>
                <div className="flex items-center gap-1 mb-2">
                  <Star className="w-3.5 h-3.5 text-yellow-400 fill-current" />
                  <span className="text-xs font-medium text-gray-700">{product.rating}</span>
                  <span className="text-xs text-gray-400">({product.reviews})</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-gray-900">
                    {formatPrice(product.basePrice)}
                  </span>
                  <button className="p-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                    <ShoppingCart className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Link href="/products" className="btn-outline">View All Products</Link>
        </div>
      </div>
    </section>
  );
}
