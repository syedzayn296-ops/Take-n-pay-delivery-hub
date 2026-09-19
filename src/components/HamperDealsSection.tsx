import { useState } from 'react';
import { HamperDeal } from '../types';
import { CheckCircle2, Sparkles, Layers, ArrowRight, ShieldCheck } from 'lucide-react';

interface Props {
  hampers: HamperDeal[];
  onAddHamper: (hamper: HamperDeal) => void;
}

export default function HamperDealsSection({ hampers, onAddHamper }: Props) {
  const [addedHamperId, setAddedHamperId] = useState<string | null>(null);

  const handleAdd = (hamper: HamperDeal) => {
    onAddHamper(hamper);
    setAddedHamperId(hamper.id);
    setTimeout(() => {
      setAddedHamperId(null);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-red-800 via-red-700 to-amber-800 text-white rounded-3xl p-6 sm:p-8 shadow-lg relative overflow-hidden">
        <div className="max-w-3xl space-y-2 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-400 text-red-950 font-black text-xs uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 fill-red-950" />
            <span>Famous Durban Take n Pay Combo Deals</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Bulk Hyper Hampers &amp; Month-End Combos
          </h2>
          <p className="text-xs sm:text-sm text-red-100 leading-relaxed">
            Curated by our Chatsworth Hyper team to stretch your family budget. Packed in reinforced bulk boxes and delivered directly to your doorstep in 60 minutes!
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {hampers.map((hamper) => {
          const isAdded = addedHamperId === hamper.id;

          return (
            <div
              key={hamper.id}
              className="bg-white rounded-3xl border-2 border-slate-200 hover:border-red-500 hover:shadow-xl transition-all p-6 flex flex-col justify-between relative group"
            >
              <div>
                {/* Header Tag */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="bg-red-600 text-white font-black text-[10px] px-3 py-1 rounded-full uppercase tracking-wider">
                    {hamper.badge}
                  </span>
                  <span className="bg-emerald-100 text-emerald-800 font-bold text-xs px-2.5 py-0.5 rounded-full">
                    SAVE R{hamper.savings}.00
                  </span>
                </div>

                <div className="flex items-start gap-4 mb-4">
                  <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-4xl shrink-0 group-hover:scale-105 transition-transform">
                    {hamper.imageEmoji}
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-slate-900 leading-snug">
                      {hamper.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {hamper.subtitle}
                    </p>
                  </div>
                </div>

                {/* Items Checklist */}
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-2 mb-6">
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">
                    What’s Included in This Hamper ({hamper.itemsList.length} Items):
                  </span>
                  <ul className="space-y-1.5 text-xs text-slate-700">
                    {hamper.itemsList.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                        <span className="font-medium">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Price & CTA */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400 line-through block">
                    R{hamper.originalPrice.toFixed(2)}
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-red-600">
                      R{hamper.price.toFixed(2)}
                    </span>
                    <span className="text-xs text-emerald-700 font-bold">
                      (R{hamper.savings} off)
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleAdd(hamper)}
                  className={`px-5 py-3 rounded-2xl font-black text-xs flex items-center gap-2 shadow-md transition active:scale-95 ${
                    isAdded
                      ? 'bg-emerald-600 text-white'
                      : 'bg-red-600 hover:bg-red-700 text-white shadow-red-600/25'
                  }`}
                >
                  {isAdded ? (
                    <>
                      <span>✓ Added to Cart!</span>
                    </>
                  ) : (
                    <>
                      <span>Add Hamper to Cart</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
