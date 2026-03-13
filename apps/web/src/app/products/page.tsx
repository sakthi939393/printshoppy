import { Metadata } from 'next';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ProductsGrid } from '@/components/product/ProductsGrid';
import { ProductFilters } from '@/components/product/ProductFilters';

export const metadata: Metadata = {
  title: 'All Products - Custom Printing',
  description: 'Browse 500+ customizable products. T-shirts, mugs, business cards, and more.',
};

export default function ProductsPage({
  searchParams,
}: {
  searchParams: { category?: string; search?: string; sort?: string; page?: string };
}) {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-20 bg-gray-50">
        <div className="container-custom py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <aside className="lg:w-64 flex-shrink-0">
              <ProductFilters />
            </aside>

            {/* Products */}
            <div className="flex-1">
              <ProductsGrid searchParams={searchParams} />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
