'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Star, CheckCircle } from 'lucide-react';

const stats = [
  { value: '1 Crore+', label: 'Photos Printed' },
  { value: '57,000+', label: 'Google Reviews' },
  { value: '4.8★', label: 'Avg. Rating' },
  { value: 'Est. 2015', label: 'Trusted Since' },
];

const highlights = [
  'Premium quality guaranteed',
  'Delivered across India',
  'Design online in minutes',
];

const productImages = [
  { label: 'Photo Frames', bg: 'bg-amber-50', emoji: '🖼️' },
  { label: 'Custom Mugs', bg: 'bg-teal-50', emoji: '☕' },
  { label: 'T-Shirts', bg: 'bg-rose-50', emoji: '👕' },
  { label: 'Calendars', bg: 'bg-violet-50', emoji: '📅' },
];

export function HeroSection() {
  return (
    <section className="bg-white pt-20">
      {/* Hero content */}
      <div className="container-custom py-16 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-primary-600 font-semibold text-sm uppercase tracking-widest mb-4"
            >
              India&apos;s Most Trusted Print Platform
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 leading-tight mb-6"
            >
              Turn Your{' '}
              <span className="text-primary-600">Memories</span>
              <br />
              Into Products
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-lg text-gray-500 mb-6 max-w-lg"
            >
              Perfect gifts, personalized. Design custom photo products, t-shirts, mugs, frames and 500+ more — delivered to your door.
            </motion.p>

            <motion.ul
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35 }}
              className="flex flex-col gap-2 mb-8"
            >
              {highlights.map((h) => (
                <li key={h} className="flex items-center gap-2 text-gray-600 text-sm">
                  <CheckCircle className="w-4 h-4 text-primary-500 flex-shrink-0" />
                  {h}
                </li>
              ))}
            </motion.ul>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap gap-3 mb-12"
            >
              <Link
                href="/products"
                className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-bold px-8 py-4 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg active:scale-95"
              >
                Shop Now
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/designer"
                className="flex items-center gap-2 border-2 border-primary-600 text-primary-600 hover:bg-primary-50 font-semibold px-8 py-4 rounded-xl transition-all duration-200 active:scale-95"
              >
                Start Designing Free
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="grid grid-cols-4 gap-4 border-t border-gray-100 pt-8"
            >
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right — product grid showcase */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="hidden lg:grid grid-cols-2 gap-4"
          >
            {productImages.map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className={`${item.bg} rounded-3xl p-8 flex flex-col items-center justify-center aspect-square shadow-sm hover:shadow-md transition-shadow`}
              >
                <span className="text-6xl mb-3">{item.emoji}</span>
                <p className="font-semibold text-gray-700 text-sm">{item.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Google reviews bar */}
      <div className="border-t border-gray-100 py-4 bg-gray-50">
        <div className="container-custom flex flex-wrap items-center justify-center gap-6 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
            </div>
            <span className="font-semibold">4.8 / 5</span>
            <span>based on 57,000+ Google Reviews</span>
          </div>
          <span className="text-gray-300 hidden sm:block">|</span>
          <span>🏆 Trusted By Millions of Happy Customers</span>
        </div>
      </div>
    </section>
  );
}
