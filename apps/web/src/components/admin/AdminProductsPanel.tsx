'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Edit, Trash2, Search, Package } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export function AdminProductsPanel() {
  const [search, setSearch] = useState('');
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-products', search],
    queryFn: () => api.getProducts({ search, limit: 50 }),
  });

  const products = (data as any)?.products || [];

  return (
    <div className="space-y-4">
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="search"
            placeholder="Search products..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-800 text-white border border-gray-700 rounded-xl text-sm focus:outline-none focus:border-primary-500"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-medium transition-colors">
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>

      <div className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="text-left text-gray-400 text-xs uppercase bg-gray-700/50">
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i} className="border-t border-gray-700">
                  {[...Array(5)].map((_, j) => (
                    <td key={j} className="px-4 py-3">
                      <div className="h-4 bg-gray-700 rounded animate-pulse" />
                    </td>
                  ))}
                </tr>
              ))
            ) : products.map((product: any) => (
              <tr key={product.id} className="border-t border-gray-700 hover:bg-gray-700/30">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-700 rounded-lg overflow-hidden flex-shrink-0">
                      {product.images?.[0]?.url ? (
                        <img src={product.images[0].url} alt={product.name} className="w-full h-full object-cover" />
                      ) : (
                        <Package className="w-5 h-5 m-2.5 text-gray-500" />
                      )}
                    </div>
                    <div>
                      <p className="text-white text-sm font-medium">{product.name}</p>
                      <p className="text-gray-400 text-xs">{product.slug}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-300 text-sm">{product.category?.name}</td>
                <td className="px-4 py-3 text-white text-sm font-semibold">{formatPrice(product.basePrice)}</td>
                <td className="px-4 py-3">
                  <span className={`badge text-xs ${product.status === 'ACTIVE' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                    {product.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button className="p-1.5 bg-gray-700 hover:bg-blue-600 text-gray-300 hover:text-white rounded-lg transition-colors">
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button className="p-1.5 bg-gray-700 hover:bg-red-600 text-gray-300 hover:text-white rounded-lg transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
