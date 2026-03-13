'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  Package, Eye, RotateCcw, Truck, CheckCircle, Clock,
  XCircle, AlertCircle, ChevronRight, ExternalLink,
} from 'lucide-react';
import { formatPrice, formatDate, getOrderStatusColor } from '@/lib/utils';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export function OrdersList() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('all');

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['orders', page],
    queryFn: () => api.getOrders(page, 10),
  });

  const orders = (data as any)?.orders || [];
  const pagination = (data as any)?.pagination;

  const handleReorder = async (orderId: string) => {
    try {
      await api.reorder(orderId);
      toast.success('Items added to cart!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to reorder');
    }
  };

  const handleCancel = async (orderId: string) => {
    if (!confirm('Are you sure you want to cancel this order?')) return;
    try {
      await api.cancelOrder(orderId);
      toast.success('Order cancelled');
      refetch();
    } catch (error: any) {
      toast.error(error.message || 'Cannot cancel this order');
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="card p-6">
            <div className="animate-pulse space-y-3">
              <div className="flex justify-between">
                <div className="skeleton h-5 w-32 rounded" />
                <div className="skeleton h-5 w-20 rounded-full" />
              </div>
              <div className="skeleton h-4 w-48 rounded" />
              <div className="flex gap-4">
                <div className="skeleton w-12 h-12 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <div className="skeleton h-4 w-3/4 rounded" />
                  <div className="skeleton h-4 w-1/2 rounded" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="card p-16 text-center">
        <Package className="w-16 h-16 text-gray-200 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-gray-900 mb-2">No orders yet</h3>
        <p className="text-gray-500 mb-6">Start creating custom products and place your first order!</p>
        <Link href="/products" className="btn-primary">
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
        <div className="flex gap-2 flex-wrap">
          {['all', 'PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                statusFilter === status
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {status === 'all' ? 'All' : status}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {orders.map((order: any) => (
          <motion.div
            key={order.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="card p-6 hover:shadow-md transition-shadow"
          >
            {/* Order Header */}
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <div className="flex items-center gap-3 flex-wrap">
                  <h3 className="font-bold text-gray-900">#{order.orderNumber}</h3>
                  <span className={`badge ${getOrderStatusColor(order.status)}`}>
                    {order.status.replace(/_/g, ' ')}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  {formatDate(order.createdAt)} · {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                </p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="font-bold text-gray-900 text-lg">{formatPrice(order.totalAmount)}</p>
                {order.payment && (
                  <p className="text-xs text-gray-500 capitalize">{order.payment.gateway.toLowerCase()}</p>
                )}
              </div>
            </div>

            {/* Order Items */}
            <div className="flex gap-3 mb-4 overflow-x-auto hide-scrollbar">
              {order.items.slice(0, 4).map((item: any) => (
                <div key={item.id} className="flex-shrink-0">
                  <img
                    src={item.product?.images?.[0]?.url || '/images/placeholder.jpg'}
                    alt={item.product?.name}
                    className="w-14 h-14 object-cover rounded-xl border border-gray-100"
                  />
                </div>
              ))}
              {order.items.length > 4 && (
                <div className="flex-shrink-0 w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center text-sm font-bold text-gray-500">
                  +{order.items.length - 4}
                </div>
              )}
            </div>

            {/* Tracking */}
            {order.shipping?.awbCode && (
              <div className="flex items-center gap-2 bg-blue-50 rounded-xl p-3 mb-4">
                <Truck className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-blue-700">
                  Tracking: <strong>{order.shipping.awbCode}</strong> via {order.shipping.courier}
                </span>
                {order.shipping.trackingUrl && (
                  <a
                    href={order.shipping.trackingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-auto text-blue-600 hover:text-blue-700"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2 flex-wrap">
              <Link
                href={`/dashboard/orders/${order.id}`}
                className="flex items-center gap-1.5 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Eye className="w-4 h-4" /> View Details
              </Link>
              {['DELIVERED', 'CANCELLED'].includes(order.status) && (
                <button
                  onClick={() => handleReorder(order.id)}
                  className="flex items-center gap-1.5 px-4 py-2 border border-primary-200 rounded-lg text-sm font-medium text-primary-600 hover:bg-primary-50 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" /> Reorder
                </button>
              )}
              {['PENDING', 'CONFIRMED', 'PAYMENT_PENDING'].includes(order.status) && (
                <button
                  onClick={() => handleCancel(order.id)}
                  className="flex items-center gap-1.5 px-4 py-2 border border-red-200 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                >
                  <XCircle className="w-4 h-4" /> Cancel
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Pagination */}
      {pagination && pagination.pages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-4 py-2 text-sm text-gray-600">
            Page {page} of {pagination.pages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(pagination.pages, p + 1))}
            disabled={page === pagination.pages}
            className="px-4 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
