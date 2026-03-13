'use client';

import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Priya Sharma',
    role: 'Business Owner',
    avatar: '👩‍💼',
    rating: 5,
    text: 'PrintShoppy transformed my brand! Got 500 business cards and they look absolutely stunning. The quality exceeded my expectations and delivery was super fast!',
    product: 'Business Cards',
  },
  {
    name: 'Rohit Verma',
    role: 'Event Manager',
    avatar: '👨‍💻',
    rating: 5,
    text: 'Ordered 200 custom t-shirts for our company event. The online designer was so easy to use, and the prints came out perfectly. Will definitely reorder!',
    product: 'Custom T-Shirts',
  },
  {
    name: 'Anita Patel',
    role: 'Home Baker',
    avatar: '👩‍🍳',
    rating: 5,
    text: 'The personalized mugs I ordered for gifting were a massive hit! My clients loved them. PrintShoppy has the best quality I have seen at this price point.',
    product: 'Custom Mugs',
  },
  {
    name: 'Karan Singh',
    role: 'Startup Founder',
    avatar: '👨‍🚀',
    rating: 5,
    text: 'From branding stickers to office banners, PrintShoppy handles everything. The customer support is excellent and delivery is always on time. Highly recommend!',
    product: 'Stickers & Banners',
  },
  {
    name: 'Meera Nair',
    role: 'Teacher',
    avatar: '👩‍🏫',
    rating: 5,
    text: 'Created custom notebooks for my students as year-end gifts. The design tool was intuitive and the result was beautiful. Parents were so impressed!',
    product: 'Custom Notebooks',
  },
  {
    name: 'Arjun Mehta',
    role: 'Photographer',
    avatar: '📸',
    rating: 5,
    text: 'Printed my portfolio photos on canvas. The colors are vibrant and accurate. PrintShoppy is my go-to for all photo printing needs now.',
    product: 'Canvas Prints',
  },
];

export function Testimonials() {
  return (
    <section className="py-20 bg-gradient-to-br from-primary-50 to-blue-50">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="section-title">What Our Customers Say</h2>
          <p className="section-subtitle">Trusted by 10,000+ happy customers across India</p>
          <div className="flex items-center justify-center gap-2 mt-4">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
              ))}
            </div>
            <span className="font-bold text-gray-900">4.9/5</span>
            <span className="text-gray-500">from 5,000+ reviews</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                ))}
              </div>

              <div className="relative mb-4">
                <Quote className="w-8 h-8 text-primary-200 absolute -top-2 -left-1" />
                <p className="text-gray-600 leading-relaxed pl-6 italic">
                  "{testimonial.text}"
                </p>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-xl">
                  {testimonial.avatar}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
                <div className="ml-auto">
                  <span className="text-xs bg-primary-100 text-primary-700 font-medium px-2 py-1 rounded-full">
                    {testimonial.product}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
