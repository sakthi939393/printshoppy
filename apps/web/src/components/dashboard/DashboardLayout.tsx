'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Package, Palette, MapPin, CreditCard, User,
  Heart, Bell, Settings, ChevronRight,
} from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/dashboard', icon: Package, label: 'My Orders', badge: null },
  { href: '/dashboard/designs', icon: Palette, label: 'My Designs', badge: null },
  { href: '/dashboard/wishlist', icon: Heart, label: 'Wishlist', badge: null },
  { href: '/dashboard/addresses', icon: MapPin, label: 'Addresses', badge: null },
  { href: '/dashboard/payments', icon: CreditCard, label: 'Payment History', badge: null },
  { href: '/dashboard/notifications', icon: Bell, label: 'Notifications', badge: '3' },
  { href: '/dashboard/profile', icon: User, label: 'Profile Settings', badge: null },
];

export function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { user } = useAuthStore();

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Sidebar */}
      <aside className="lg:w-72 flex-shrink-0">
        {/* Profile Card */}
        <div className="card p-6 mb-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-500 to-blue-600 flex items-center justify-center text-white text-2xl font-bold">
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
              ) : (
                user?.name?.[0]?.toUpperCase()
              )}
            </div>
            <div>
              <h2 className="font-bold text-gray-900">{user?.name}</h2>
              <p className="text-sm text-gray-500">{user?.email}</p>
              <span className="inline-block mt-1 bg-green-100 text-green-700 text-xs font-medium px-2 py-0.5 rounded-full">
                ✓ Verified
              </span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="card overflow-hidden">
          {navItems.map((item, index) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center justify-between px-4 py-3.5 transition-colors border-b border-gray-50 last:border-0',
                  isActive
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-700 hover:bg-gray-50'
                )}
              >
                <div className="flex items-center gap-3">
                  <item.icon className={cn('w-5 h-5', isActive ? 'text-primary-600' : 'text-gray-400')} />
                  <span className="font-medium text-sm">{item.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  {item.badge && (
                    <span className="bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                      {item.badge}
                    </span>
                  )}
                  <ChevronRight className={cn('w-4 h-4', isActive ? 'text-primary-400' : 'text-gray-300')} />
                </div>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}
