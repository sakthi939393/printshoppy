'use client';

import { motion } from 'framer-motion';
import { Palette, ShoppingBag, Truck, Star } from 'lucide-react';

const steps = [
  {
    icon: Palette,
    step: '01',
    title: 'Choose & Design',
    description: 'Select from 500+ products, then use our powerful online designer to create your perfect custom print.',
    color: 'text-blue-600',
    bg: 'bg-blue-100',
  },
  {
    icon: ShoppingBag,
    step: '02',
    title: 'Review & Order',
    description: 'Preview your design on a 3D product mockup, set quantities, and place your order securely.',
    color: 'text-orange-600',
    bg: 'bg-orange-100',
  },
  {
    icon: Truck,
    step: '03',
    title: 'We Print & Ship',
    description: 'Our experts print your design with professional-grade equipment and ship it directly to you.',
    color: 'text-green-600',
    bg: 'bg-green-100',
  },
  {
    icon: Star,
    step: '04',
    title: 'Love It!',
    description: 'Receive your custom printed products and share the joy. Not happy? We guarantee 100% satisfaction.',
    color: 'text-purple-600',
    bg: 'bg-purple-100',
  },
];

export function HowItWorks() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="section-title">How It Works</h2>
          <p className="section-subtitle">From design to doorstep in 4 simple steps</p>
        </div>

        <div className="relative">
          {/* Connection line */}
          <div className="hidden lg:block absolute top-16 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-blue-200 via-orange-200 to-green-200 z-0" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="relative z-10 text-center"
              >
                <div className={`w-16 h-16 ${step.bg} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg relative`}>
                  <step.icon className={`w-8 h-8 ${step.color}`} />
                  <div className="absolute -top-2 -right-2 w-7 h-7 bg-white rounded-full border-2 border-gray-200 flex items-center justify-center text-xs font-bold text-gray-700 shadow-sm">
                    {step.step}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-500 leading-relaxed">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="mt-16 text-center">
          <a href="/designer" className="btn-primary text-lg">
            Start Creating Now — It's Free!
          </a>
        </div>
      </div>
    </section>
  );
}
