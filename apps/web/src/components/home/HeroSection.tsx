'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Play, Star, Sparkles } from 'lucide-react';

const stats = [
  { value: '10K+', label: 'Happy Customers' },
  { value: '500+', label: 'Products' },
  { value: '4.9★', label: 'Rating' },
  { value: '2-Day', label: 'Delivery' },
];

const floatingProducts = [
  { name: 'Custom T-Shirt', color: 'from-blue-400 to-purple-500', emoji: '👕', x: -20, y: 20 },
  { name: 'Printed Mug', color: 'from-orange-400 to-red-500', emoji: '☕', x: 40, y: -30 },
  { name: 'Business Card', color: 'from-green-400 to-teal-500', emoji: '💼', x: -40, y: -20 },
];

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">
      {/* Background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/5 rounded-full" />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="container-custom relative z-10 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="text-white"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 text-sm font-medium mb-6"
            >
              <Sparkles className="w-4 h-4 text-yellow-400" />
              <span>India's #1 Print-on-Demand Platform</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-5xl lg:text-6xl font-bold leading-tight mb-6"
            >
              Design &{' '}
              <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                Print
              </span>{' '}
              Anything You{' '}
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Imagine
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl text-blue-200 mb-8 max-w-xl"
            >
              Create custom t-shirts, mugs, business cards, and 500+ more products with our powerful online designer. Premium quality, delivered fast.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap gap-4 mb-12"
            >
              <Link
                href="/designer"
                className="flex items-center gap-2 bg-white text-primary-700 font-bold px-8 py-4 rounded-xl hover:bg-blue-50 transition-all duration-200 shadow-lg hover:shadow-xl active:scale-95"
              >
                Start Designing Free
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/products"
                className="flex items-center gap-2 border-2 border-white/30 text-white font-semibold px-8 py-4 rounded-xl hover:bg-white/10 transition-all duration-200"
              >
                <Play className="w-5 h-5" />
                Browse Products
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="grid grid-cols-4 gap-4"
            >
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-xs text-blue-300">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Content - Visual */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="relative hidden lg:block"
          >
            {/* Main card */}
            <div className="relative w-full aspect-square max-w-lg mx-auto">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-3xl border border-white/20 shadow-2xl">
                <div className="p-8 h-full flex flex-col">
                  <div className="flex items-center gap-2 mb-6">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                    <span className="text-white/60 text-sm ml-2">Design Studio</span>
                  </div>

                  {/* Mock canvas */}
                  <div className="flex-1 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-4 bg-white/10 rounded-xl" />
                    <div className="relative z-10 text-center text-white">
                      <div className="text-6xl mb-4">🎨</div>
                      <p className="font-semibold text-lg">Your Design Here</p>
                      <p className="text-sm text-white/60">Drag, drop, and customize</p>
                    </div>
                    {/* Floating tool indicators */}
                    <motion.div
                      animate={{ y: [0, -10, 0] }}
                      transition={{ repeat: Infinity, duration: 3 }}
                      className="absolute top-4 right-4 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-lg"
                    >
                      Text Tool
                    </motion.div>
                    <motion.div
                      animate={{ y: [0, 10, 0] }}
                      transition={{ repeat: Infinity, duration: 2.5 }}
                      className="absolute bottom-4 left-4 bg-green-400 text-green-900 text-xs font-bold px-2 py-1 rounded-lg"
                    >
                      Layer Added
                    </motion.div>
                  </div>

                  {/* Mock toolbar */}
                  <div className="flex gap-2 mt-4">
                    {['📝', '🖼️', '✏️', '🎨', '⟲', '⟳'].map((icon, i) => (
                      <motion.button
                        key={i}
                        whileHover={{ scale: 1.1 }}
                        className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center text-lg transition-colors"
                      >
                        {icon}
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Floating product cards */}
              {floatingProducts.map((product, index) => (
                <motion.div
                  key={index}
                  animate={{
                    y: [product.y, product.y - 15, product.y],
                    rotate: [-2, 2, -2],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 3 + index,
                    delay: index * 0.5,
                  }}
                  style={{ right: `${-product.x}%`, top: `${20 + index * 25}%` }}
                  className="absolute"
                >
                  <div className={`bg-gradient-to-br ${product.color} p-3 rounded-xl shadow-lg`}>
                    <span className="text-2xl">{product.emoji}</span>
                    <p className="text-white text-xs font-bold mt-1">{product.name}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Trust indicator */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="absolute -bottom-4 left-8 right-8 bg-white rounded-2xl p-4 shadow-xl border border-gray-100"
            >
              <div className="flex items-center gap-4">
                <div className="flex -space-x-2">
                  {['🙋', '👨', '👩', '🧑'].map((emoji, i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-sm">
                      {emoji}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 fill-current" />)}
                  </div>
                  <p className="text-xs text-gray-600 font-medium">10,000+ satisfied customers</p>
                </div>
                <div className="ml-auto">
                  <div className="text-xs text-green-600 font-bold">✓ Verified</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
