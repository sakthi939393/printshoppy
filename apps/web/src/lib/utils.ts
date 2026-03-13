import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(amount: number, currency = 'INR') {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(date: string | Date, options?: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options,
  }).format(new Date(date));
}

export function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function truncate(text: string, length: number) {
  if (text.length <= length) return text;
  return `${text.slice(0, length)}...`;
}

export function getInitials(name: string) {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function debounce<T extends (...args: any[]) => any>(func: T, wait: number) {
  let timeout: NodeJS.Timeout;
  return function(this: unknown, ...args: Parameters<T>) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

export const ORDER_STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  CONFIRMED: 'bg-blue-100 text-blue-800',
  PAYMENT_PENDING: 'bg-orange-100 text-orange-800',
  PAYMENT_FAILED: 'bg-red-100 text-red-800',
  PROCESSING: 'bg-blue-100 text-blue-800',
  DESIGN_REVIEW: 'bg-purple-100 text-purple-800',
  PRINT_QUEUE: 'bg-indigo-100 text-indigo-800',
  PRINTING: 'bg-cyan-100 text-cyan-800',
  QUALITY_CHECK: 'bg-teal-100 text-teal-800',
  DISPATCHED: 'bg-green-100 text-green-800',
  SHIPPED: 'bg-green-100 text-green-800',
  DELIVERED: 'bg-green-200 text-green-900',
  CANCELLED: 'bg-red-100 text-red-800',
  REFUNDED: 'bg-gray-100 text-gray-800',
};

export function getOrderStatusColor(status: string) {
  return ORDER_STATUS_COLORS[status] || 'bg-gray-100 text-gray-800';
}
