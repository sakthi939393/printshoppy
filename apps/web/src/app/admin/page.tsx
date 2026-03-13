import { Metadata } from 'next';
import { AdminDashboard } from '@/components/admin/AdminDashboard';

export const metadata: Metadata = {
  title: 'Admin Dashboard - PrintShoppy',
  description: 'Manage orders, products, customers and production.',
};

export default function AdminPage() {
  return <AdminDashboard />;
}
