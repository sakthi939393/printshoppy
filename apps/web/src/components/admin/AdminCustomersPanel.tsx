'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Search, UserX, UserCheck } from 'lucide-react';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export function AdminCustomersPanel() {
  const [search, setSearch] = useState('');
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-customers', search],
    queryFn: () => api.getCustomers({ search, limit: 20 }),
  });

  const customers = (data as any)?.customers || [];

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="search"
          placeholder="Search customers..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-gray-800 text-white border border-gray-700 rounded-xl text-sm focus:outline-none focus:border-primary-500"
        />
      </div>
      <div className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="text-left text-gray-400 text-xs uppercase bg-gray-700/50">
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Orders</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Joined</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer: any) => (
              <tr key={customer.id} className="border-t border-gray-700 hover:bg-gray-700/30">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-primary-600 flex items-center justify-center text-white text-sm font-bold">
                      {customer.name?.[0]?.toUpperCase()}
                    </div>
                    <div>
                      <p className="text-white text-sm font-medium">{customer.name}</p>
                      <p className="text-gray-400 text-xs">{customer.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-300 text-sm">{customer._count?.orders || 0}</td>
                <td className="px-4 py-3">
                  <span className={`badge text-xs ${customer.isActive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                    {customer.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-400 text-sm">
                  {new Date(customer.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-3">
                  <button className={`p-1.5 rounded-lg transition-colors ${customer.isActive ? 'bg-red-500/20 text-red-400 hover:bg-red-500/40' : 'bg-green-500/20 text-green-400 hover:bg-green-500/40'}`}>
                    {customer.isActive ? <UserX className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5" />}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
