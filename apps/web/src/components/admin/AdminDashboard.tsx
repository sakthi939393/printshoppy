'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, Package, ShoppingBag, Users, Tag,
  Printer, BarChart3, Settings, Menu, X, Bell,
  TrendingUp, TrendingDown, DollarSign, ShoppingCart,
  Star, Zap, CheckCircle, Clock, AlertTriangle, LogOut,
} from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import api from '@/lib/api';
import { AdminOrdersPanel } from './AdminOrdersPanel';
import { AdminProductsPanel } from './AdminProductsPanel';
import { AdminCustomersPanel } from './AdminCustomersPanel';
import { AdminAnalyticsPanel } from './AdminAnalyticsPanel';
import { AdminProductionPanel } from './AdminProductionPanel';

const navItems = [
  { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { id: 'orders', icon: ShoppingBag, label: 'Orders', badge: null },
  { id: 'products', icon: Package, label: 'Products' },
  { id: 'customers', icon: Users, label: 'Customers' },
  { id: 'production', icon: Printer, label: 'Print Queue' },
  { id: 'coupons', icon: Tag, label: 'Coupons' },
  { id: 'analytics', icon: BarChart3, label: 'Analytics' },
  { id: 'settings', icon: Settings, label: 'Settings' },
];

export function AdminDashboard() {
  const [activePanel, setActivePanel] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const { data: stats } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: () => api.getDashboardStats(),
    refetchInterval: 30000,
  });

  const summary = (stats as any)?.summary;

  const statCards = [
    {
      title: 'Total Revenue',
      value: formatPrice(summary?.totalRevenue || 0),
      change: '+18.2%',
      trend: 'up',
      icon: DollarSign,
      color: 'from-green-500 to-teal-600',
    },
    {
      title: 'Total Orders',
      value: (summary?.totalOrders || 0).toLocaleString(),
      change: '+12.5%',
      trend: 'up',
      icon: ShoppingCart,
      color: 'from-blue-500 to-indigo-600',
    },
    {
      title: 'Customers',
      value: (summary?.totalCustomers || 0).toLocaleString(),
      change: '+8.1%',
      trend: 'up',
      icon: Users,
      color: 'from-purple-500 to-pink-600',
    },
    {
      title: 'Products',
      value: (summary?.totalProducts || 0).toLocaleString(),
      change: '+3.7%',
      trend: 'up',
      icon: Package,
      color: 'from-orange-500 to-red-500',
    },
  ];

  return (
    <div className="flex h-screen bg-gray-950 overflow-hidden">
      {/* Sidebar */}
      <motion.aside
        animate={{ width: isSidebarOpen ? 256 : 72 }}
        className="bg-gray-900 border-r border-gray-800 flex flex-col z-20 overflow-hidden"
      >
        {/* Logo */}
        <div className="flex items-center gap-3 p-4 border-b border-gray-800">
          <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-sm">P</span>
          </div>
          {isSidebarOpen && (
            <span className="text-white font-bold text-lg">PrintShoppy</span>
          )}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="ml-auto text-gray-400 hover:text-white transition-colors flex-shrink-0"
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-2 overflow-y-auto">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActivePanel(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all mb-1 ${
                activePanel === item.id
                  ? 'bg-primary-600 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {isSidebarOpen && (
                <span className="text-sm font-medium">{item.label}</span>
              )}
            </button>
          ))}
        </nav>

        {/* User */}
        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
              A
            </div>
            {isSidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium truncate">Admin</p>
                <p className="text-gray-500 text-xs truncate">admin@printshoppy.com</p>
              </div>
            )}
          </div>
        </div>
      </motion.aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-gray-900 border-b border-gray-800 px-6 py-3 flex items-center justify-between z-10">
          <h1 className="text-white font-semibold capitalize">{activePanel}</h1>
          <div className="flex items-center gap-3">
            <button className="relative p-2 text-gray-400 hover:text-white transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <button className="flex items-center gap-2 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg text-sm transition-colors">
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {activePanel === 'dashboard' && (
            <DashboardOverview statCards={statCards} stats={stats} />
          )}
          {activePanel === 'orders' && <AdminOrdersPanel />}
          {activePanel === 'products' && <AdminProductsPanel />}
          {activePanel === 'customers' && <AdminCustomersPanel />}
          {activePanel === 'analytics' && <AdminAnalyticsPanel />}
          {activePanel === 'production' && <AdminProductionPanel />}
          {activePanel === 'coupons' && <CouponsPanel />}
          {activePanel === 'settings' && <SettingsPanel />}
        </main>
      </div>
    </div>
  );
}

function DashboardOverview({ statCards, stats }: any) {
  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card: any, index: number) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gray-800 rounded-2xl p-5 border border-gray-700"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-10 h-10 bg-gradient-to-br ${card.color} rounded-xl flex items-center justify-center shadow-lg`}>
                <card.icon className="w-5 h-5 text-white" />
              </div>
              <div className={`flex items-center gap-1 text-sm font-medium ${card.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                {card.trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                {card.change}
              </div>
            </div>
            <p className="text-2xl font-bold text-white mb-1">{card.value}</p>
            <p className="text-gray-400 text-sm">{card.title}</p>
          </motion.div>
        ))}
      </div>

      {/* Quick Status */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Pending Orders', value: '12', icon: Clock, color: 'text-yellow-400 bg-yellow-400/10' },
          { label: 'In Production', value: '8', icon: Printer, color: 'text-blue-400 bg-blue-400/10' },
          { label: 'Ready to Ship', value: '5', icon: CheckCircle, color: 'text-green-400 bg-green-400/10' },
          { label: 'Issues', value: '2', icon: AlertTriangle, color: 'text-red-400 bg-red-400/10' },
        ].map((item, i) => (
          <div key={i} className="bg-gray-800 rounded-xl p-4 border border-gray-700">
            <div className={`w-10 h-10 rounded-xl ${item.color} flex items-center justify-center mb-3`}>
              <item.icon className={`w-5 h-5 ${item.color.split(' ')[0]}`} />
            </div>
            <p className="text-2xl font-bold text-white">{item.value}</p>
            <p className="text-gray-400 text-sm">{item.label}</p>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-gray-800 rounded-2xl border border-gray-700">
        <div className="flex items-center justify-between p-5 border-b border-gray-700">
          <h2 className="text-white font-semibold">Recent Orders</h2>
          <button className="text-primary-400 hover:text-primary-300 text-sm font-medium">View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-gray-400 text-sm border-b border-gray-700">
                <th className="px-5 py-3 font-medium">Order ID</th>
                <th className="px-5 py-3 font-medium">Customer</th>
                <th className="px-5 py-3 font-medium">Amount</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Date</th>
                <th className="px-5 py-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {(stats?.recentOrders || []).map((order: any) => (
                <tr key={order.id} className="border-b border-gray-700/50 hover:bg-gray-700/30 transition-colors">
                  <td className="px-5 py-3 text-sm text-primary-400 font-mono">#{order.orderNumber}</td>
                  <td className="px-5 py-3 text-sm text-gray-300">{order.user?.name}</td>
                  <td className="px-5 py-3 text-sm text-white font-semibold">{formatPrice(order.totalAmount)}</td>
                  <td className="px-5 py-3">
                    <span className={`badge ${getStatusStyle(order.status)}`}>
                      {order.status.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-sm text-gray-400">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-3">
                    <button className="text-primary-400 hover:text-primary-300 text-sm">View</button>
                  </td>
                </tr>
              ))}
              {(stats?.recentOrders || []).length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-gray-500">
                    No recent orders
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function getStatusStyle(status: string) {
  const styles: Record<string, string> = {
    PENDING: 'bg-yellow-500/20 text-yellow-400',
    CONFIRMED: 'bg-blue-500/20 text-blue-400',
    PROCESSING: 'bg-indigo-500/20 text-indigo-400',
    SHIPPED: 'bg-green-500/20 text-green-400',
    DELIVERED: 'bg-green-600/20 text-green-500',
    CANCELLED: 'bg-red-500/20 text-red-400',
  };
  return styles[status] || 'bg-gray-500/20 text-gray-400';
}

function CouponsPanel() {
  return (
    <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-white font-semibold text-lg">Coupons & Discounts</h2>
        <button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          + Create Coupon
        </button>
      </div>
      <div className="text-gray-400 text-center py-12">
        <Tag className="w-12 h-12 mx-auto mb-3 opacity-30" />
        <p>No coupons created yet</p>
      </div>
    </div>
  );
}

function SettingsPanel() {
  return (
    <div className="space-y-6">
      <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
        <h2 className="text-white font-semibold text-lg mb-4">Store Settings</h2>
        <div className="grid gap-4">
          {[
            { label: 'Store Name', value: 'PrintShoppy' },
            { label: 'Support Email', value: 'support@printshoppy.com' },
            { label: 'Phone Number', value: '+91 88000 00000' },
            { label: 'GST Number', value: '29ABCDE1234F1Z5' },
          ].map(setting => (
            <div key={setting.label}>
              <label className="text-gray-400 text-sm block mb-1">{setting.label}</label>
              <input
                type="text"
                defaultValue={setting.value}
                className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:border-primary-500 text-sm"
              />
            </div>
          ))}
          <button className="mt-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors">
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}
