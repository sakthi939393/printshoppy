import { Metadata } from 'next';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { OrdersList } from '@/components/dashboard/OrdersList';

export const metadata: Metadata = {
  title: 'My Dashboard - Orders & Designs',
  description: 'Manage your orders, designs, and account settings.',
};

export default function DashboardPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-20 bg-gray-50">
        <div className="container-custom py-8">
          <DashboardLayout>
            <OrdersList />
          </DashboardLayout>
        </div>
      </main>
      <Footer />
    </>
  );
}
