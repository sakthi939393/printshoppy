'use client';

import { useQuery } from '@tanstack/react-query';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { formatPrice } from '@/lib/utils';
import api from '@/lib/api';

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'];

export function AdminAnalyticsPanel() {
  const { data: revenueData } = useQuery({
    queryKey: ['revenue-chart'],
    queryFn: () => api.getRevenueChart(30),
  });

  const { data: stats } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: () => api.getDashboardStats(),
  });

  const chartData = (revenueData as any) || [];
  const ordersByStatus = (stats as any)?.ordersByStatus || [];

  return (
    <div className="space-y-6">
      {/* Revenue Chart */}
      <div className="bg-gray-800 rounded-2xl p-5 border border-gray-700">
        <h2 className="text-white font-semibold mb-4">Revenue (Last 30 Days)</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="date" stroke="#6b7280" tick={{ fill: '#9ca3af', fontSize: 12 }} />
              <YAxis stroke="#6b7280" tick={{ fill: '#9ca3af', fontSize: 12 }} tickFormatter={(v) => `₹${v.toLocaleString()}`} />
              <Tooltip
                contentStyle={{ background: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                labelStyle={{ color: '#e5e7eb' }}
                formatter={(value: any) => [formatPrice(value), 'Revenue']}
              />
              <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Orders by Status */}
        <div className="bg-gray-800 rounded-2xl p-5 border border-gray-700">
          <h2 className="text-white font-semibold mb-4">Orders by Status</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ordersByStatus}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="status" stroke="#6b7280" tick={{ fill: '#9ca3af', fontSize: 10 }} />
                <YAxis stroke="#6b7280" tick={{ fill: '#9ca3af', fontSize: 12 }} />
                <Tooltip contentStyle={{ background: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }} />
                <Bar dataKey="_count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-gray-800 rounded-2xl p-5 border border-gray-700">
          <h2 className="text-white font-semibold mb-4">Top Products by Revenue</h2>
          <div className="space-y-3">
            {(stats as any)?.topProducts?.map((item: any, index: number) => (
              <div key={item.productId} className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center text-xs text-gray-300 font-bold">
                  {index + 1}
                </span>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-gray-300 text-sm">{item.productId}</span>
                    <span className="text-white text-sm font-semibold">
                      {formatPrice(item._sum?.totalPrice || 0)}
                    </span>
                  </div>
                  <div className="h-1.5 bg-gray-700 rounded-full">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${Math.min(100, (item._sum?.totalPrice || 0) / 10000 * 100)}%`,
                        backgroundColor: COLORS[index % COLORS.length],
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
            {!(stats as any)?.topProducts?.length && (
              <p className="text-gray-400 text-sm text-center py-8">No data available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
