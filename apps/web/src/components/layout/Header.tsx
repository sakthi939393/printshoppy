'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingCart, Search, User, Menu, X, ChevronDown,
  Heart, Bell, Package, LogOut, Settings,
} from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';
import { useCartStore } from '@/store/cart.store';
import { cn } from '@/lib/utils';

const categories = [
  { name: 'T-Shirts', slug: 'tshirts', icon: '👕' },
  { name: 'Mugs', slug: 'mugs', icon: '☕' },
  { name: 'Business Cards', slug: 'business-cards', icon: '💼' },
  { name: 'Banners', slug: 'banners', icon: '🎌' },
  { name: 'Stickers', slug: 'stickers', icon: '✨' },
  { name: 'Notebooks', slug: 'notebooks', icon: '📓' },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);

  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { getItemCount, isOpen, toggleCart } = useCartStore();
  const itemCount = getItemCount();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled ? 'bg-white shadow-md' : 'bg-white/90 backdrop-blur-sm'
      )}
    >
      {/* Top Bar */}
      <div className="bg-primary-600 text-white text-xs py-1.5 text-center font-medium tracking-wide">
        🎁 Free shipping on orders above ₹999 &nbsp;|&nbsp; Use code <span className="font-bold">FIRST10</span> for 10% off your first order!
      </div>

      <div className="container-custom">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">P</span>
              </div>
              <span className="text-xl font-bold text-primary-700 hidden sm:block">PrintShoppy</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-6">
            <div className="relative group">
              <button className="flex items-center gap-1 text-gray-700 hover:text-primary-600 font-medium transition-colors">
                Products <ChevronDown className="w-4 h-4" />
              </button>
              <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="p-4 grid grid-cols-2 gap-2">
                  {categories.map(cat => (
                    <Link
                      key={cat.slug}
                      href={`/products?category=${cat.slug}`}
                      className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 text-gray-700 hover:text-primary-600 transition-colors"
                    >
                      <span>{cat.icon}</span>
                      <span className="text-sm font-medium">{cat.name}</span>
                    </Link>
                  ))}
                </div>
                <div className="border-t border-gray-100 p-3">
                  <Link href="/products" className="block text-center text-sm text-primary-600 font-medium hover:underline">
                    View all products →
                  </Link>
                </div>
              </div>
            </div>
            <Link href="/designer" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
              Design Tool
            </Link>
            <Link href="/products?category=business-cards" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
              Business Cards
            </Link>
            <Link href="/products?sale=true" className="text-orange-600 font-medium">
              Sale 🔥
            </Link>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 text-gray-600 hover:text-primary-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Wishlist */}
            {isAuthenticated && (
              <Link href="/dashboard/wishlist" className="p-2 text-gray-600 hover:text-red-500 hover:bg-gray-100 rounded-lg transition-colors">
                <Heart className="w-5 h-5" />
              </Link>
            )}

            {/* Cart */}
            <button
              onClick={toggleCart}
              className="relative p-2 text-gray-600 hover:text-primary-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ShoppingCart className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {itemCount > 9 ? '9+' : itemCount}
                </span>
              )}
            </button>

            {/* User */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 p-2 text-gray-600 hover:text-primary-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  {user?.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-7 h-7 rounded-full object-cover" />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-primary-600 text-white flex items-center justify-center text-sm font-bold">
                      {user?.name?.[0]?.toUpperCase()}
                    </div>
                  )}
                  <ChevronDown className="w-4 h-4 hidden sm:block" />
                </button>
                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 z-50"
                    >
                      <div className="p-4 border-b border-gray-100">
                        <p className="font-semibold text-gray-900">{user?.name}</p>
                        <p className="text-sm text-gray-500">{user?.email}</p>
                      </div>
                      <div className="p-2">
                        <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-700">
                          <Package className="w-4 h-4" /> My Orders
                        </Link>
                        <Link href="/dashboard/designs" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-700">
                          <Settings className="w-4 h-4" /> My Designs
                        </Link>
                        {(user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN') && (
                          <Link href="/admin" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-blue-50 text-blue-600">
                            <Settings className="w-4 h-4" /> Admin Panel
                          </Link>
                        )}
                        <button
                          onClick={() => { logout(); setShowUserMenu(false); }}
                          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-red-50 text-red-600"
                        >
                          <LogOut className="w-4 h-4" /> Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                href="/auth/login"
                className="hidden sm:flex items-center gap-2 btn-primary text-sm py-2 px-4"
              >
                <User className="w-4 h-4" /> Sign In
              </Link>
            )}

            {/* Mobile Menu */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-gray-600 hover:text-primary-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="pb-4">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="search"
                    placeholder="Search products, designs, templates..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                    autoFocus
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-gray-100 bg-white overflow-hidden"
          >
            <div className="container-custom py-4 space-y-2">
              <Link href="/products" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg font-medium">
                All Products
              </Link>
              {categories.map(cat => (
                <Link
                  key={cat.slug}
                  href={`/products?category=${cat.slug}`}
                  className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg"
                >
                  <span>{cat.icon}</span> {cat.name}
                </Link>
              ))}
              <Link href="/designer" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg font-medium">
                🎨 Design Tool
              </Link>
              {!isAuthenticated && (
                <div className="pt-2 border-t border-gray-100">
                  <Link href="/auth/login" className="block btn-primary text-center">Sign In</Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
