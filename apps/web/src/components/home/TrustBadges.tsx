import { Shield, Truck, RotateCcw, Headphones, Award, Zap } from 'lucide-react';

const badges = [
  { icon: Shield, title: 'Secure Payment', desc: '100% safe checkout', color: 'text-green-600' },
  { icon: Truck, title: 'Free Shipping', desc: 'Orders above ₹999', color: 'text-blue-600' },
  { icon: RotateCcw, title: 'Easy Returns', desc: '7-day return policy', color: 'text-orange-600' },
  { icon: Headphones, title: '24/7 Support', desc: 'Always here to help', color: 'text-purple-600' },
  { icon: Award, title: 'Quality Assured', desc: 'ISO certified printing', color: 'text-red-600' },
  { icon: Zap, title: 'Fast Delivery', desc: 'Pan India in 3-5 days', color: 'text-yellow-600' },
];

export function TrustBadges() {
  return (
    <section className="py-8 bg-white border-y border-gray-100">
      <div className="container-custom">
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
          {badges.map((badge, index) => (
            <div key={index} className="flex flex-col items-center text-center p-3 group">
              <badge.icon className={`w-7 h-7 ${badge.color} mb-2 group-hover:scale-110 transition-transform`} />
              <p className="font-semibold text-gray-900 text-sm">{badge.title}</p>
              <p className="text-xs text-gray-500 hidden sm:block">{badge.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
