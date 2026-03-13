import { Suspense } from 'react';
import { Metadata } from 'next';
import { HeroSection } from '@/components/home/HeroSection';
import { CategoriesSection } from '@/components/home/CategoriesSection';
import { FeaturedProducts } from '@/components/home/FeaturedProducts';
import { HowItWorks } from '@/components/home/HowItWorks';
import { Testimonials } from '@/components/home/Testimonials';
import { NewsletterSection } from '@/components/home/NewsletterSection';
import { TrustBadges } from '@/components/home/TrustBadges';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'PrintShoppy - Custom Print On Demand Platform',
  description: 'Design and order custom printed products. High quality t-shirts, mugs, business cards, and more. Fast delivery across India.',
};

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <TrustBadges />
        <Suspense fallback={<div className="h-64 animate-pulse bg-gray-100" />}>
          <CategoriesSection />
        </Suspense>
        <Suspense fallback={<div className="h-96 animate-pulse bg-gray-50" />}>
          <FeaturedProducts />
        </Suspense>
        <HowItWorks />
        <Testimonials />
        <NewsletterSection />
      </main>
      <Footer />
    </>
  );
}
