import { Award, ShieldCheck, Heart, Clock, Truck, Store, HelpCircle } from 'lucide-react';

export default function AboutTakeNPaySection({ onStartShopping }: { onStartShopping: () => void }) {
  const faqs = [
    {
      q: 'What is Take n Pay 60?',
      a: 'Take n Pay 60 is our lightning-fast, on-demand grocery delivery service across Durban. Just like Checkers Sixty60, we bring the freshest butcher cuts, vegetables, and pantry staples directly to your doorstep in 60 minutes flat.'
    },
    {
      q: 'How much is the delivery fee?',
      a: 'We charge a flat R35 delivery fee per order anywhere in our Durban delivery zones. If your basket totals R500 or more, delivery is 100% FREE.'
    },
    {
      q: 'Are your meats Halal certified?',
      a: 'Yes, absolutely! Take n Pay’s Master Butchery operates under strict SANHA (South African National Halaal Authority) standards. All beef, mutton, lamb, and chicken are certified 100% Halaal.'
    },
    {
      q: 'How does the Sixty60 substitution system work?',
      a: 'If any item runs out of stock in the hyper, our professional in-store picker follows your preference: either selecting the closest premium replacement, phoning you on WhatsApp to ask, or refunding the item instantly.'
    },
    {
      q: 'What is the OTP Code on delivery?',
      a: 'For your security, a unique 4-digit OTP is generated on your live tracking screen when you order. Simply read this code to your motorbike driver when they arrive at your gate to verify handover.'
    }
  ];

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Brand Hero */}
      <div className="bg-gradient-to-r from-red-700 to-amber-700 text-white rounded-3xl p-8 sm:p-12 shadow-xl relative overflow-hidden">
        <div className="max-w-3xl space-y-4">
          <span className="bg-yellow-400 text-red-950 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
            THE DURBAN ICON &bull; EST. 1989
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Famous for Quality, Low Prices &amp; Freshness.
          </h2>
          <p className="text-sm sm:text-base text-red-100 leading-relaxed">
            Take n Pay Food Town Hyper was born in Chatsworth, Durban with a single promise: providing working families with the lowest possible food prices without ever cutting corners on freshness or Halal standards.
          </p>

          <button
            onClick={onStartShopping}
            className="px-6 py-3 bg-white text-red-700 hover:bg-yellow-300 hover:text-red-950 font-black text-sm rounded-2xl shadow-lg transition cursor-pointer"
          >
            Start 60-Minute Grocery Order
          </button>
        </div>
      </div>

      {/* Values Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl p-6 border border-slate-200 space-y-3 shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center text-2xl font-bold">
            🥩
          </div>
          <h3 className="text-base font-black text-slate-900">SANHA Certified Butchery</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Our master butchers cut Karoo lamb, prime mutton, and freshly seasoned boerewors daily in pristine cold rooms with 100% Halal integrity.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 space-y-3 shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center text-2xl font-bold">
            🥔
          </div>
          <h3 className="text-base font-black text-slate-900">KZN Farm Fresh Produce</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            From 10kg pocket potatoes to sweet Durban tomatoes and fresh chillies, we buy directly from Tala Valley and Midlands growers every dawn.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 space-y-3 shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-2xl font-bold">
            🛵
          </div>
          <h3 className="text-base font-black text-slate-900">60-Minute On-Demand Fleet</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Our agile motorbike delivery network delivers directly to your door in Chatsworth, Berea, Durban North, Westville, and beyond in insulated thermal bags.
          </p>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-red-600" />
          <h3 className="text-lg sm:text-xl font-black text-slate-900">
            Frequently Asked Questions about Take n Pay 60
          </h3>
        </div>

        <div className="divide-y divide-slate-100">
          {faqs.map((faq, idx) => (
            <div key={idx} className="py-4 space-y-1.5">
              <h4 className="text-sm font-bold text-slate-900">{faq.q}</h4>
              <p className="text-xs text-slate-600 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
