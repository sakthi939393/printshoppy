'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const categories = [
  {
    name: 'T-Shirts & Apparel',
    slug: 'apparel',
    emoji: '👕',
    count: '150+ designs',
    gradient: 'from-blue-500 to-indigo-600',
    bg: 'bg-blue-50',
  },
  {
    name: 'Mugs & Drinkware',
    slug: 'mugs',
    emoji: '☕',
    count: '80+ styles',
    gradient: 'from-orange-500 to-red-500',
    bg: 'bg-orange-50',
  },
  {
    name: 'Business Cards',
    slug: 'business-cards',
    emoji: '💼',
    count: '200+ templates',
    gradient: 'from-gray-700 to-gray-900',
    bg: 'bg-gray-50',
  },
  {
    name: 'Banners & Signage',
    slug: 'banners',
    emoji: '🎌',
    count: '50+ sizes',
    gradient: 'from-green-500 to-teal-600',
    bg: 'bg-green-50',
  },
  {
    name: 'Stickers & Labels',
    slug: 'stickers',
    emoji: '✨',
    count: '100+ options',
    gradient: 'from-pink-500 to-rose-600',
    bg: 'bg-pink-50',
  },
  {
    name: 'Notebooks & Diaries',
    slug: 'notebooks',
    emoji: '📓',
    count: '40+ styles',
    gradient: 'from-purple-500 to-violet-600',
    bg: 'bg-purple-50',
  },
  {
    name: 'Photo Products',
    slug: 'photo',
    emoji: '🖼️',
    count: '60+ options',
    gradient: 'from-cyan-500 to-blue-600',
    bg: 'bg-cyan-50',
  },
  {
    name: 'Packaging',
    slug: 'packaging',
    emoji: '📦',
    count: '30+ types',
    gradient: 'from-amber-500 to-yellow-600',
    bg: 'bg-amber-50',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export function CategoriesSection() {
  return (
    <section className="py-20 bg-white">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="section-title">What Would You Like to Print?</h2>
          <p className="section-subtitle max-w-2xl mx-auto">
            From business essentials to personal gifts, we print it all with premium quality.
          </p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
        >
          {categories.map((category) => (
            <motion.div key={category.slug} variants={itemVariants}>
              <Link
                href={`/products?category=${category.slug}`}
                className={`block p-6 rounded-2xl ${category.bg} hover:shadow-lg transition-all duration-300 group border border-transparent hover:border-gray-200`}
              >
                <div className={`w-14 h-14 bg-gradient-to-br ${category.gradient} rounded-2xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  {category.emoji}
                </div>
                <h3 className="font-bold text-gray-900 mb-1 group-hover:text-primary-600 transition-colors">
                  {category.name}
                </h3>
                <p className="text-sm text-gray-500">{category.count}</p>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        <div className="text-center mt-10">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 btn-outline"
          >
            View All Categories
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
