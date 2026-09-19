import { Sparkles, Clock, ShieldCheck, Zap, ArrowRight, Layers, Award } from 'lucide-react';
import { SuburbCoverage, GroceryCategory } from '../types';

interface Props {
  selectedSuburb: SuburbCoverage;
  activeCategory: GroceryCategory;
  setActiveCategory: (cat: GroceryCategory) => void;
  onExploreHampers: () => void;
}

export default function HeroBanner({
  selectedSuburb,
  activeCategory,
  setActiveCategory,
  onExploreHampers
}: Props) {
  const categoryShortcuts = [
    { id: 'all' as GroceryCategory, label: 'All Aisles', emoji: '🛒' },
    { id: 'hampers' as GroceryCategory, label: 'Hyper Hampers', emoji: '📦', isSpecial: true },
    { id: 'butchery' as GroceryCategory, label: 'Master Butchery', emoji: '🥩' },
    { id: 'produce' as GroceryCategory, label: 'Fresh Farm Produce', emoji: '🥔' },
    { id: 'pantry' as GroceryCategory, label: 'Bulk Oil & Staples', emoji: '🌻' },
    { id: 'bakery' as GroceryCategory, label: 'In-Store Bakery', emoji: '🥖' },
    { id: 'dairy' as GroceryCategory, label: 'Dairy & Eggs 30s', emoji: '🥚' },
    { id: 'beverages' as GroceryCategory, label: 'Cold Drinks & Tea', emoji: '🥤' },
    { id: 'household' as GroceryCategory, label: 'Cleaning & Wash', emoji: '🧺' },
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-red-700 via-red-600 to-rose-700 text-white shadow-inner">
      {/* Background patterns */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
      <div className="absolute -bottom-10 -right-10 w-80 h-80 bg-yellow-400/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Main Hero Messaging */}
          <div className="lg:col-span-8 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-400 text-red-950 font-black text-xs uppercase tracking-wider shadow-sm">
              <Zap className="w-3.5 h-3.5 fill-red-950" />
              <span>Take n Pay 60 On-Demand &bull; Delivered To {selectedSuburb.suburb} In {selectedSuburb.etaMinutes} Mins</span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white leading-tight tracking-tight">
              Durban’s Famous Hyper Prices. <br className="hidden sm:block" />
              <span className="text-yellow-300 underline decoration-yellow-400/60 decoration-wavy">
                Delivered in 60 Minutes.
              </span>
            </h1>

            <p className="text-xs sm:text-sm text-red-100 max-w-2xl leading-relaxed">
              Why queue at the tills? Order our legendary fresh Halal butchery cuts, 10kg pocket potatoes, bulk 5L cooking oils, and weekly supermarket specials straight to your door with motorbike speed.
            </p>

            {/* Quick Guarantees */}
            <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-white/90 pt-1">
              <div className="flex items-center gap-1.5 bg-red-800/60 px-3 py-1.5 rounded-lg border border-red-500/40">
                <Clock className="w-4 h-4 text-yellow-300" />
                <span>60-Minute Target ETA</span>
              </div>
              <div className="flex items-center gap-1.5 bg-red-800/60 px-3 py-1.5 rounded-lg border border-red-500/40">
                <ShieldCheck className="w-4 h-4 text-emerald-300" />
                <span>Cold-Chain Thermal Bags</span>
              </div>
              <div className="flex items-center gap-1.5 bg-red-800/60 px-3 py-1.5 rounded-lg border border-red-500/40">
                <Award className="w-4 h-4 text-yellow-300" />
                <span>Store Prices Match Online</span>
              </div>
            </div>
          </div>

          {/* Quick Hamper Spotlight Card Right */}
          <div className="lg:col-span-4">
            <div className="bg-white text-slate-900 rounded-2xl p-5 shadow-xl border-2 border-yellow-400 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-red-600 text-white font-black text-[10px] px-3 py-1 rounded-bl-xl uppercase tracking-wider">
                MEGA SAVER
              </div>

              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">📦</span>
                <div>
                  <span className="text-[10px] text-red-600 font-bold uppercase tracking-wider block">Durban Family Favourite</span>
                  <h4 className="text-sm font-black text-slate-900 leading-tight">Mega Month-End Pantry Hamper</h4>
                </div>
              </div>

              <p className="text-[11px] text-slate-600 mb-3 line-clamp-2">
                Includes 10kg Maize Meal, 10kg Rice, 5L Sunfoil Oil, 10kg Flour, 10kg Sugar, Koo Beans &amp; Rooibos!
              </p>

              <div className="flex items-baseline justify-between pt-2 border-t border-slate-100">
                <div>
                  <span className="text-xs text-slate-400 line-through mr-1.5">R839.00</span>
                  <span className="text-xl font-black text-red-600">R649.00</span>
                  <span className="text-[10px] text-emerald-600 font-bold block">Save R190.00</span>
                </div>

                <button
                  onClick={onExploreHampers}
                  className="px-3.5 py-2 bg-yellow-400 hover:bg-yellow-300 text-red-950 font-black text-xs rounded-xl shadow transition flex items-center gap-1"
                >
                  <span>View Hampers</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Category Aisles Pills */}
        <div className="mt-6 pt-5 border-t border-red-500/40">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categoryShortcuts.map((cat) => {
              const isSelected = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-2 shadow-sm ${
                    isSelected
                      ? 'bg-yellow-400 text-red-950 font-black shadow-md scale-105'
                      : cat.isSpecial
                      ? 'bg-red-800 text-yellow-300 border border-yellow-400/50 hover:bg-red-900'
                      : 'bg-red-800/70 text-white hover:bg-red-800 border border-red-500/30'
                  }`}
                >
                  <span className="text-sm">{cat.emoji}</span>
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
