import Link from 'next/link';
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react';

const footerLinks = {
  products: [
    { name: 'T-Shirts', href: '/products?category=tshirts' },
    { name: 'Mugs', href: '/products?category=mugs' },
    { name: 'Business Cards', href: '/products?category=business-cards' },
    { name: 'Banners', href: '/products?category=banners' },
    { name: 'Stickers', href: '/products?category=stickers' },
    { name: 'All Products', href: '/products' },
  ],
  company: [
    { name: 'About Us', href: '/about' },
    { name: 'Blog', href: '/blog' },
    { name: 'Careers', href: '/careers' },
    { name: 'Press Kit', href: '/press' },
    { name: 'Partner Program', href: '/partners' },
  ],
  support: [
    { name: 'Help Center', href: '/help' },
    { name: 'Design Guidelines', href: '/design-help' },
    { name: 'Shipping Info', href: '/shipping' },
    { name: 'Returns & Refunds', href: '/returns' },
    { name: 'Contact Us', href: '/contact' },
    { name: 'Bulk Orders', href: '/bulk-orders' },
  ],
  legal: [
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Cookie Policy', href: '/cookies' },
    { name: 'Copyright Policy', href: '/copyright' },
  ],
};

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-blue-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">P</span>
              </div>
              <span className="text-xl font-bold text-white">PrintShoppy</span>
            </Link>
            <p className="text-gray-400 mb-6 leading-relaxed">
              India's premier print-on-demand platform. Design, customize, and order premium quality printed products delivered to your doorstep.
            </p>
            <div className="space-y-3">
              <a href="tel:+918800000000" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                <Phone className="w-4 h-4" />
                <span>+91 88000 00000</span>
              </a>
              <a href="mailto:hello@printshoppy.com" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                <Mail className="w-4 h-4" />
                <span>hello@printshoppy.com</span>
              </a>
              <div className="flex items-start gap-2 text-gray-400">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>123 Print Street, Koramangala, Bengaluru - 560034</span>
              </div>
            </div>
            <div className="flex gap-4 mt-8">
              {[
                { icon: Facebook, href: '#', label: 'Facebook' },
                { icon: Twitter, href: '#', label: 'Twitter' },
                { icon: Instagram, href: '#', label: 'Instagram' },
                { icon: Youtube, href: '#', label: 'YouTube' },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 bg-gray-800 hover:bg-primary-600 rounded-lg flex items-center justify-center transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-bold text-white mb-4">Products</h3>
            <ul className="space-y-3">
              {footerLinks.products.map(link => (
                <li key={link.name}>
                  <Link href={link.href} className="text-gray-400 hover:text-white transition-colors text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-white mb-4">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map(link => (
                <li key={link.name}>
                  <Link href={link.href} className="text-gray-400 hover:text-white transition-colors text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-white mb-4">Support</h3>
            <ul className="space-y-3">
              {footerLinks.support.map(link => (
                <li key={link.name}>
                  <Link href={link.href} className="text-gray-400 hover:text-white transition-colors text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="border-t border-gray-800 pt-8 mt-12">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div>
              <p className="text-sm text-gray-400 mb-3">Secure Payment Methods</p>
              <div className="flex flex-wrap gap-3">
                {['💳 Visa', '💳 Mastercard', '📱 UPI', '🏦 Net Banking', '💰 Razorpay', '🏷️ Stripe'].map(method => (
                  <span key={method} className="bg-gray-800 text-gray-300 text-xs px-3 py-1.5 rounded-lg font-medium">
                    {method}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-3">Shipping Partners</p>
              <div className="flex flex-wrap gap-3">
                {['🚚 Shiprocket', '📦 Delhivery', '⚡ BlueDart'].map(partner => (
                  <span key={partner} className="bg-gray-800 text-gray-300 text-xs px-3 py-1.5 rounded-lg font-medium">
                    {partner}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-wrap items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} PrintShoppy. All rights reserved.
          </p>
          <div className="flex flex-wrap gap-6">
            {footerLinks.legal.map(link => (
              <Link key={link.name} href={link.href} className="text-sm text-gray-500 hover:text-gray-300 transition-colors">
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
