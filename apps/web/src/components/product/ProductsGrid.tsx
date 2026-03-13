'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ShoppingCart, Heart, Star, Zap, SlidersHorizontal } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import api from '@/lib/api';
import { useCartStore } from '@/store/cart.store';

const SORT_OPTIONS = [
  { value: 'createdAt:desc', label: 'Newest First' },
  { value: 'basePrice:asc', label: 'Price: Low to High' },
  { value: 'basePrice:desc', label: 'Price: High to Low' },
  { value: 'name:asc', label: 'Name A-Z' },
];

interface SearchParams {
  category?: string;
  search?: string;
  sort?: string;
  page?: string;
}

export function ProductsGrid({ searchParams }: { searchParams: SearchParams }) {
  const [sortBy, setSortBy] = useState('createdAt:desc');
  const [page, setPage] = useState(1);
  const { addItem } = useCartStore();

  const { data, isLoading } = useQuery({
    queryKey: ['products', searchParams, sortBy, page],
    queryFn: () => {
      const [sort, order] = sortBy.split(':');
      return api.getProducts({
        ...searchParams,
        sort,
        order,
        page,
        limit: 24,
      });
    },
  });

  const products = (data as any)?.products || [];
  const pagination = (data as any)?.pagination;

  return (
    <div>
      {/* Sort & Count */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-gray-500 text-sm">
          {isLoading ? 'Loading...' : `${pagination?.total ?? 0} products found`}
        </p>
        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
        >
          {SORT_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      {/* Products Grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="card overflow-hidden">
              <div className="skeleton aspect-square" />
              <div className="p-4 space-y-2">
                <div className="skeleton h-4 rounded w-3/4" />
                <div className="skeleton h-4 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-4xl mb-4">😔</p>
          <p className="text-gray-500 text-lg">No products found</p>
          <p className="text-gray-400 text-sm mt-2">Try different filters or search terms</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((product: any, index: number) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="product-card"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={product.images?.[0]?.url || '/images/placeholder.jpg'}
                    alt={product.name}
                    className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  {product.isCustomizable && (
                    <span className="absolute top-2 left-2 bg-white/90 text-primary-600 text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Zap className="w-3 h-3" /> Custom
                    </span>
                  )}
                  <button className="absolute top-2 right-2 p-2 bg-white/90 rounded-full text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
                    <Heart className="w-4 h-4" />
                  </button>

                  {/* Hover overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <Link
                      href={`/designer?product=${product.id}`}
                      className="block w-full bg-white text-gray-900 text-xs font-bold py-2 rounded-lg text-center hover:bg-primary-600 hover:text-white transition-colors"
                    >
                      🎨 Customize Now
                    </Link>
                  </div>
                </div>

                <div className="p-3">
                  <Link href={`/products/${product.slug}`}>
                    <h3 className="font-medium text-gray-900 text-sm hover:text-primary-600 transition-colors line-clamp-2 mb-1">
                      {product.name}
                    </h3>
                  </Link>
                  {product._count?.reviews > 0 && (
                    <div className="flex items-center gap-1 mb-2">
                      <Star className="w-3 h-3 text-yellow-400 fill-current" />
                      <span className="text-xs text-gray-500">({product._count.reviews})</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-gray-900 text-sm">
                        {formatPrice(product.basePrice)}
                      </span>
                      {product.minQuantity > 1 && (
                        <span className="text-xs text-gray-400 ml-1">/ {product.minQuantity} pcs</span>
                      )}
                    </div>
                    <button
                      onClick={() => addItem({ productId: product.id, quantity: 1 })}
                      className="p-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Pagination */}
          {pagination && pagination.pages > 1 && (
            <div className="flex justify-center gap-2 mt-10">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              {[...Array(Math.min(pagination.pages, 7))].map((_, i) => {
                const pageNum = i + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                      page === pageNum
                        ? 'bg-primary-600 text-white'
                        : 'border border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              <button
                onClick={() => setPage(p => Math.min(pagination.pages, p + 1))}
                disabled={page === pagination.pages}
                className="px-4 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
