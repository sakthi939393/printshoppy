'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Eye, Printer, ChevronDown, Search, Filter } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import api from '@/lib/api';
import toast from 'react-hot-toast';

const ORDER_STATUSES = [
  'PENDING', 'CONFIRMED', 'PAYMENT_PENDING', 'PROCESSING',
  'PRINT_QUEUE', 'PRINTING', 'DISPATCHED', 'SHIPPED', 'DELIVERED', 'CANCELLED',
];

export function AdminOrdersPanel() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-orders', page, statusFilter],
    queryFn: () => api.getAdminOrders({ page, limit: 20, status: statusFilter || undefined }),
  });

  const updateStatus = useMutation({
    mutationFn: ({ orderId, status, note }: any) =>
      api.updateAdminOrderStatus(orderId, status, note),
    onSuccess: () => {
      toast.success('Order status updated');
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
    },
    onError: () => toast.error('Failed to update status'),
  });

  const generatePrintFile = useMutation({
    mutationFn: (orderId: string) => api.generatePrintFile(orderId),
    onSuccess: (data: any) => {
      toast.success('Print file generated!');
      if (data?.printFileUrl) window.open(data.printFileUrl, '_blank');
    },
    onError: () => toast.error('Failed to generate print file'),
  });

  const orders = (data as any)?.orders || [];
  const pagination = (data as any)?.pagination;

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="search"
            placeholder="Search orders..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-800 text-white border border-gray-700 rounded-xl text-sm focus:outline-none focus:border-primary-500"
          />
        </div>
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="px-4 py-2 bg-gray-800 text-white border border-gray-700 rounded-xl text-sm focus:outline-none focus:border-primary-500"
        >
          <option value="">All Statuses</option>
          {ORDER_STATUSES.map(s => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
        </select>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-medium transition-colors">
          <Filter className="w-4 h-4" /> Export CSV
        </button>
      </div>

      {/* Table */}
      <div className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-gray-400 text-xs uppercase tracking-wider bg-gray-700/50">
                <th className="px-4 py-3 font-medium">Order</th>
                <th className="px-4 py-3 font-medium">Customer</th>
                <th className="px-4 py-3 font-medium">Items</th>
                <th className="px-4 py-3 font-medium">Amount</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="border-t border-gray-700">
                    {[...Array(7)].map((_, j) => (
                      <td key={j} className="px-4 py-3">
                        <div className="h-4 bg-gray-700 rounded animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : orders.map((order: any) => (
                <tr key={order.id} className="border-t border-gray-700 hover:bg-gray-700/30 transition-colors">
                  <td className="px-4 py-3">
                    <span className="text-primary-400 font-mono text-sm">#{order.orderNumber}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <p className="text-white text-sm font-medium">{order.user?.name}</p>
                      <p className="text-gray-400 text-xs">{order.user?.email}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-gray-300 text-sm">{order.items?.length || 0} items</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-white font-semibold text-sm">{formatPrice(order.totalAmount)}</span>
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={order.status}
                      onChange={e => updateStatus.mutate({
                        orderId: order.id,
                        status: e.target.value,
                        note: `Status updated to ${e.target.value} by admin`,
                      })}
                      className="text-xs px-2 py-1 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-primary-500"
                    >
                      {ORDER_STATUSES.map(s => (
                        <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-gray-400 text-sm">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="p-1.5 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg transition-colors"
                        title="View order"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => generatePrintFile.mutate(order.id)}
                        className="p-1.5 bg-gray-700 hover:bg-blue-600 text-gray-300 hover:text-white rounded-lg transition-colors"
                        title="Generate print file"
                      >
                        <Printer className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination && pagination.pages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-700">
            <p className="text-gray-400 text-sm">
              {pagination.total} total orders
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1 bg-gray-700 text-gray-300 rounded-lg text-sm disabled:opacity-50 hover:bg-gray-600 transition-colors"
              >
                Prev
              </button>
              <span className="px-3 py-1 bg-gray-700 text-white rounded-lg text-sm">
                {page} / {pagination.pages}
              </span>
              <button
                onClick={() => setPage(p => Math.min(pagination.pages, p + 1))}
                disabled={page === pagination.pages}
                className="px-3 py-1 bg-gray-700 text-gray-300 rounded-lg text-sm disabled:opacity-50 hover:bg-gray-600 transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
