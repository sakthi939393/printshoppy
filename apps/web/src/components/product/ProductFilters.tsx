'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronDown, ChevronUp, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const categories = [
  { value: 'tshirts', label: 'T-Shirts & Apparel' },
  { value: 'mugs', label: 'Mugs & Drinkware' },
  { value: 'business-cards', label: 'Business Cards' },
  { value: 'banners', label: 'Banners & Signage' },
  { value: 'stickers', label: 'Stickers & Labels' },
  { value: 'notebooks', label: 'Notebooks' },
  { value: 'photo', label: 'Photo Products' },
  { value: 'packaging', label: 'Packaging' },
];

const priceRanges = [
  { label: 'Under ₹200', min: 0, max: 200 },
  { label: '₹200 - ₹500', min: 200, max: 500 },
  { label: '₹500 - ₹1000', min: 500, max: 1000 },
  { label: 'Above ₹1000', min: 1000, max: undefined },
];

export function ProductFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [openSections, setOpenSections] = useState(['categories', 'price']);

  const toggleSection = (section: string) => {
    setOpenSections(prev =>
      prev.includes(section) ? prev.filter(s => s !== section) : [...prev, section]
    );
  };

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete('page');
    router.push(`/products?${params.toString()}`);
  };

  const clearFilters = () => {
    router.push('/products');
  };

  const activeFilters = Array.from(searchParams.entries()).filter(([key]) =>
    ['category', 'minPrice', 'maxPrice'].includes(key)
  );

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden sticky top-24">
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <h3 className="font-semibold text-gray-900">Filters</h3>
        {activeFilters.length > 0 && (
          <button
            onClick={clearFilters}
            className="text-sm text-red-500 hover:text-red-700 flex items-center gap-1"
          >
            <X className="w-3.5 h-3.5" /> Clear all
          </button>
        )}
      </div>

      {/* Active Filters */}
      {activeFilters.length > 0 && (
        <div className="p-4 border-b border-gray-100">
          <div className="flex flex-wrap gap-2">
            {activeFilters.map(([key, value]) => (
              <span
                key={key}
                className="inline-flex items-center gap-1 bg-primary-100 text-primary-700 text-xs font-medium px-2 py-1 rounded-full"
              >
                {value}
                <button onClick={() => updateFilter(key, '')}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Categories */}
      <div className="border-b border-gray-100">
        <button
          onClick={() => toggleSection('categories')}
          className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
        >
          <span className="font-medium text-gray-900 text-sm">Categories</span>
          {openSections.includes('categories') ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
        </button>
        {openSections.includes('categories') && (
          <div className="px-4 pb-4 space-y-2">
            {categories.map(cat => (
              <label key={cat.value} className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="radio"
                  name="category"
                  value={cat.value}
                  checked={searchParams.get('category') === cat.value}
                  onChange={() => updateFilter('category', cat.value)}
                  className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700 group-hover:text-primary-600 transition-colors">
                  {cat.label}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Price Range */}
      <div className="border-b border-gray-100">
        <button
          onClick={() => toggleSection('price')}
          className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
        >
          <span className="font-medium text-gray-900 text-sm">Price Range</span>
          {openSections.includes('price') ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
        </button>
        {openSections.includes('price') && (
          <div className="px-4 pb-4 space-y-2">
            {priceRanges.map(range => (
              <label key={range.label} className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="radio"
                  name="price"
                  onChange={() => {
                    updateFilter('minPrice', range.min.toString());
                    if (range.max) updateFilter('maxPrice', range.max.toString());
                  }}
                  className="w-4 h-4 text-primary-600 border-gray-300"
                />
                <span className="text-sm text-gray-700 group-hover:text-primary-600">{range.label}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Customizable */}
      <div className="p-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" className="w-4 h-4 rounded text-primary-600 border-gray-300 focus:ring-primary-500" />
          <span className="text-sm text-gray-700">Customizable Only</span>
        </label>
      </div>
    </div>
  );
}
