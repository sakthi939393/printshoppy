'use client';

import { useState } from 'react';
import { Mail, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

export function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    toast.success('🎉 Subscribed! Get ready for exclusive offers!');
    setEmail('');
    setIsLoading(false);
  };

  return (
    <section className="py-20 gradient-primary">
      <div className="container-custom text-center">
        <div className="max-w-2xl mx-auto">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Mail className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Get Exclusive Deals & Design Tips
          </h2>
          <p className="text-blue-200 mb-8 text-lg">
            Join 50,000+ subscribers. Get 15% off your first order when you subscribe!
          </p>
          <form onSubmit={handleSubmit} className="flex gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 px-4 py-3 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-white/50"
              required
            />
            <button
              type="submit"
              disabled={isLoading}
              className="bg-white text-primary-700 font-bold px-6 py-3 rounded-xl hover:bg-blue-50 transition-colors disabled:opacity-70 flex items-center gap-2 whitespace-nowrap"
            >
              {isLoading ? 'Subscribing...' : (
                <>Subscribe <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>
          <p className="text-blue-300 text-sm mt-4">
            🔒 No spam, unsubscribe anytime. Your privacy is protected.
          </p>
        </div>
      </div>
    </section>
  );
}
