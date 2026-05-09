import { Shield, Truck, RotateCcw, Headphones, Award, Camera } from 'lucide-react';

const badges = [
  { icon: Camera, title: '1 Crore+ Photos', desc: 'Printed & Delivered', color: 'text-primary-600' },
  { icon: Award, title: '57,000+ Reviews', desc: '4.8★ on Google', color: 'text-yellow-500' },
  { icon: Truck, title: 'Pan India Delivery', desc: 'Fast & Reliable', color: 'text-primary-600' },
  { icon: Shield, title: 'Secure Payment', desc: '100% safe checkout', color: 'text-green-600' },
  { icon: RotateCcw, title: 'Easy Returns', desc: '7-day return policy', color: 'text-orange-500' },
  { icon: Headphones, title: '24/7 Support', desc: 'Always here to help', color: 'text-primary-600' },
];

export function TrustBadges() {
  return (
    <section className="py-8 bg-primary-50 border-y border-primary-100">
      <div className="container-custom">
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
          {badges.map((badge, index) => (
            <div key={index} className="flex flex-col items-center text-center p-3 group">
              <badge.icon className={`w-7 h-7 ${badge.color} mb-2 group-hover:scale-110 transition-transform`} />
              <p className="font-bold text-gray-900 text-sm">{badge.title}</p>
              <p className="text-xs text-gray-500 hidden sm:block">{badge.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
