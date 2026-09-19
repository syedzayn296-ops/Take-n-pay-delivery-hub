import { StoreLocation, SuburbCoverage } from '../types';
import { MapPin, Clock, Phone, Check, Bike, ShieldCheck, ShoppingBag } from 'lucide-react';

interface Props {
  stores: StoreLocation[];
  suburbs: SuburbCoverage[];
  onSelectSuburbForDelivery: (suburb: SuburbCoverage) => void;
}

export default function StoreLocatorSection({
  stores,
  suburbs,
  onSelectSuburbForDelivery
}: Props) {
  return (
    <div className="space-y-8">
      {/* Intro Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-lg relative overflow-hidden">
        <div className="max-w-2xl space-y-2 relative z-10">
          <span className="bg-red-600 text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-full">
            DURBAN HYPER HUBS &bull; CLICK &amp; COLLECT
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Take n Pay Durban Stores &amp; 60-Minute Fulfilment Hubs
          </h2>
          <p className="text-xs sm:text-sm text-slate-300">
            Proudly serving Durban communities for over 35 years. Walk into our bustling Food Town Hyper branches or let our 60-minute motorbike fleet bring the aisles to your kitchen!
          </p>
        </div>
      </div>

      {/* Stores Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stores.map((store) => (
          <div
            key={store.id}
            className="bg-white rounded-3xl border border-slate-200 p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center text-xl font-bold">
                  🏪
                </span>
                {store.hasSixtyHub && (
                  <span className="bg-yellow-400 text-red-950 font-black text-[9px] px-2 py-0.5 rounded-full uppercase">
                    60-MIN HUB
                  </span>
                )}
              </div>

              <div>
                <h3 className="text-base font-black text-slate-900 leading-snug">
                  {store.name}
                </h3>
                <p className="text-xs text-slate-500 mt-1 flex items-start gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-red-600 mt-0.5 shrink-0" />
                  <span>{store.address}</span>
                </p>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{store.tradingHours}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <a href={`tel:${store.contactNumber}`} className="hover:text-red-600 font-semibold">
                    {store.contactNumber}
                  </a>
                </div>
              </div>

              {/* Department Badges */}
              <div className="flex flex-wrap gap-1.5 pt-2">
                {store.hasButchery && (
                  <span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded">
                    🥩 Halal Butchery
                  </span>
                )}
                {store.hasBakery && (
                  <span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded">
                    🥖 In-Store Bakery
                  </span>
                )}
                {store.hasClickAndCollect && (
                  <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded">
                    ✓ Click &amp; Collect
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Delivery Coverage Suburbs Section */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl">🛵</span>
              <h3 className="text-lg font-black text-slate-900">
                Take n Pay 60 Durban Delivery Coverage
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Live estimated arrival times from nearest fulfillment hub
            </p>
          </div>
          <span className="text-xs font-bold text-red-600 bg-red-50 border border-red-200 px-3 py-1.5 rounded-xl self-start sm:self-auto">
            ⚡ R35 Flat Delivery or FREE on R500+
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {suburbs.map((sub) => (
            <div
              key={sub.suburb}
              onClick={() => onSelectSuburbForDelivery(sub)}
              className="p-3.5 rounded-2xl border border-slate-200 hover:border-red-400 hover:bg-red-50/40 transition cursor-pointer flex items-center justify-between"
            >
              <div>
                <h4 className="text-xs font-bold text-slate-900">{sub.suburb}</h4>
                <span className="text-[10px] text-slate-400">{sub.hubBranch}</span>
              </div>
              <div className="text-right">
                <span className="text-xs font-black text-emerald-600 block">{sub.etaMinutes} mins</span>
                <span className="text-[9px] text-slate-400">{sub.activeDrivers} motorbikes</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
