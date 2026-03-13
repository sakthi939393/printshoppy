import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import { Providers } from '@/components/providers';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: {
    default: 'PrintShoppy - Custom Print On Demand Platform',
    template: '%s | PrintShoppy',
  },
  description: 'Design and order custom printed products. T-shirts, mugs, business cards, and more. Professional quality printing with fast delivery.',
  keywords: ['print on demand', 'custom printing', 'personalized gifts', 't-shirt printing', 'mug printing'],
  authors: [{ name: 'PrintShoppy' }],
  creator: 'PrintShoppy',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: 'PrintShoppy',
    title: 'PrintShoppy - Custom Print On Demand',
    description: 'Design and order custom printed products with fast delivery.',
    images: [{ url: '/images/og-image.jpg', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PrintShoppy - Custom Print On Demand',
    description: 'Design and order custom printed products.',
  },
  manifest: '/manifest.json',
  icons: {
    icon: '/icons/favicon.ico',
    apple: '/icons/apple-icon.png',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#2563eb',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-gray-50 font-sans antialiased">
        <Providers>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: { background: '#1f2937', color: '#f9fafb' },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
