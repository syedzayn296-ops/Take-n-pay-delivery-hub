import { useState } from 'react';
import {
  ShoppingBag,
  Search,
  MapPin,
  Clock,
  Sparkles,
  Layers,
  Store,
  ChevronDown,
  Percent,
  CheckCircle,
  PhoneCall,
  Menu,
  X
} from 'lucide-react';
import { SuburbCoverage } from '../types';

interface Props {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedSuburb: SuburbCoverage;
  setSelectedSuburb: (suburb: SuburbCoverage) => void;
  allSuburbs: SuburbCoverage[];
  cartCount: number;
  cartTotal: number;
  onOpenCart: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  hasActiveOrder: boolean;
  onOpenActiveOrder: () => void;
}

export default function TakeNPayNavbar({
  activeTab,
  setActiveTab,
  selectedSuburb,
  setSelectedSuburb,
  allSuburbs,
  cartCount,
  cartTotal,
  onOpenCart,
  searchQuery,
  setSearchQuery,
  hasActiveOrder,
  onOpenActiveOrder
}: Props) {
  const [isSuburbDropdownOpen, setIsSuburbDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
      {/* Top Banner Ribbon */}
      <div className="bg-red-700 text-white text-xs font-semibold px-4 py-1.5 flex items-center justify-between">
        <div className="flex items-center gap-2 max-w-7xl mx-auto w-full justify-between">
          <div className="flex items-center gap-2">
            <span className="bg-yellow-400 text-red-950 font-black px-1.5 py-0.5 rounded text-[10px] tracking-wider uppercase">
              TAKE N PAY 60
            </span>
            <span className="hidden sm:inline">
              Durban’s Famous Food Town Hyper &bull; Groceries at Hyper Low Prices in 60 Minutes
            </span>
            <span className="sm:hidden text-[11px]">
              Durban Hyper Groceries in 60 Mins
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <div className="flex items-center gap-1 text-yellow-300 font-bold">
              <Clock className="w-3.5 h-3.5" />
              <span>Avg. Delivery: {selectedSuburb.etaMinutes} mins</span>
            </div>
            <span className="hidden md:inline text-red-200">|</span>
            <span className="hidden md:inline text-white font-medium">
              Halal Master Butchery &bull; 100% Guaranteed Fresh
            </span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between gap-3 sm:gap-6">
          {/* Brand Logo */}
          <div
            onClick={() => setActiveTab('shop')}
            className="flex items-center gap-2.5 cursor-pointer shrink-0"
          >
            <div className="w-10 h-10 rounded-xl bg-red-600 flex flex-col items-center justify-center text-white shadow-md shadow-red-600/30 border border-red-500">
              <span className="text-[10px] font-black leading-none tracking-tight text-yellow-300">TAKE</span>
              <span className="text-[9px] font-extrabold leading-none tracking-tight text-white">&amp;</span>
              <span className="text-[10px] font-black leading-none tracking-tight text-yellow-300">PAY</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  Take<span className="text-red-600">n</span>Pay
                </span>
                <span className="bg-yellow-400 text-red-950 text-[10px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-tighter">
                  60 MINS
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium tracking-wide hidden sm:block">
                FOOD TOWN HYPER &bull; DURBAN
              </p>
            </div>
          </div>

          {/* Suburb Selector Dropdown (Sixty60 style) */}
          <div className="relative">
            <button
              onClick={() => setIsSuburbDropdownOpen(!isSuburbDropdownOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-800 transition text-left"
            >
              <MapPin className="w-4 h-4 text-red-600 shrink-0" />
              <div className="hidden sm:block">
                <span className="text-[10px] text-slate-500 block uppercase font-bold leading-none">Deliver to:</span>
                <span className="font-bold text-slate-900 leading-tight truncate max-w-[120px] block">
                  {selectedSuburb.suburb}
                </span>
              </div>
              <span className="sm:hidden font-bold">{selectedSuburb.suburb.split(' ')[0]}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500 ml-0.5" />
            </button>

            {isSuburbDropdownOpen && (
              <div className="absolute left-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50">
                <div className="px-3 py-2 border-b border-slate-100">
                  <span className="text-xs font-bold text-slate-800 block">Select Delivery Suburb (Durban)</span>
                  <span className="text-[11px] text-slate-500">60-minute dispatch from nearest Hyper Hub</span>
                </div>
                <div className="max-h-64 overflow-y-auto divide-y divide-slate-100">
                  {allSuburbs.map((sub) => (
                    <button
                      key={sub.suburb}
                      onClick={() => {
                        setSelectedSuburb(sub);
                        setIsSuburbDropdownOpen(false);
                      }}
                      className={`w-full px-3 py-2.5 text-left text-xs flex items-center justify-between hover:bg-slate-50 transition ${
                        selectedSuburb.suburb === sub.suburb ? 'bg-red-50 text-red-700 font-bold' : 'text-slate-700'
                      }`}
                    >
                      <div>
                        <div className="font-bold text-slate-900">{sub.suburb}</div>
                        <div className="text-[10px] text-slate-400">{sub.hubBranch} &bull; {sub.zone}</div>
                      </div>
                      <div className="text-right">
                        <span className="text-[11px] font-bold text-emerald-600 block">{sub.etaMinutes} mins</span>
                        <span className="text-[10px] text-slate-400">R{sub.deliveryFee} fee</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Search bar */}
          <div className="flex-1 max-w-md hidden md:block">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search mutton, 10kg potatoes, Sunfoil oil, bread, boerewors..."
                className="w-full pl-9 pr-4 py-2 bg-slate-100 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-xs text-slate-400 hover:text-slate-600 absolute right-3 top-1/2 -translate-y-1/2"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Live Order Indicator (if active) */}
            {hasActiveOrder && (
              <button
                onClick={onOpenActiveOrder}
                className="relative px-3 py-1.5 bg-yellow-400 hover:bg-yellow-300 text-red-950 rounded-xl text-xs font-black flex items-center gap-1.5 shadow-sm border border-yellow-500 transition animate-pulse"
              >
                <span>Track 60-Min Driver</span>
              </button>
            )}

            {/* Cart Button */}
            <button
              onClick={onOpenCart}
              className="px-3.5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-black flex items-center gap-2 shadow-md shadow-red-600/20 transition cursor-pointer"
            >
              <div className="relative">
                <ShoppingBag className="w-4 h-4" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-yellow-400 text-red-950 rounded-full w-4 h-4 text-[10px] font-black flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline">R{cartTotal.toFixed(2)}</span>
            </button>

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-slate-100 text-slate-700 lg:hidden"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Search input */}
        <div className="mt-2.5 md:hidden">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search mutton, potatoes, Sunfoil oil..."
              className="w-full pl-9 pr-4 py-2 bg-slate-100 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
        </div>
      </div>

      {/* Navigation Sub-Ribbon / Category Tabs */}
      <nav className="border-t border-slate-100 bg-slate-50/70 overflow-x-auto scrollbar-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-1 sm:gap-2 py-1.5 text-xs font-semibold text-slate-600 whitespace-nowrap">
          <button
            onClick={() => setActiveTab('shop')}
            className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
              activeTab === 'shop'
                ? 'bg-red-600 text-white font-bold shadow-sm'
                : 'hover:bg-slate-200/70 text-slate-700'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Shop All Groceries</span>
          </button>

          <button
            onClick={() => setActiveTab('hampers')}
            className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
              activeTab === 'hampers'
                ? 'bg-red-600 text-white font-bold shadow-sm'
                : 'hover:bg-slate-200/70 text-slate-700'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-amber-500" />
            <span>Hyper Hampers &amp; Combos</span>
            <span className="bg-yellow-400 text-red-950 font-black text-[9px] px-1 rounded">SAVE 25%</span>
          </button>

          <button
            onClick={() => setActiveTab('specials')}
            className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
              activeTab === 'specials'
                ? 'bg-red-600 text-white font-bold shadow-sm'
                : 'hover:bg-slate-200/70 text-slate-700'
            }`}
          >
            <Percent className="w-3.5 h-3.5 text-red-500" />
            <span>Weekly Specials Leaflet</span>
          </button>

          <button
            onClick={() => setActiveTab('tracker')}
            className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
              activeTab === 'tracker'
                ? 'bg-red-600 text-white font-bold shadow-sm'
                : 'hover:bg-slate-200/70 text-slate-700'
            }`}
          >
            <span>Live 60-Min Driver Tracker</span>
            {hasActiveOrder && (
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('stores')}
            className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
              activeTab === 'stores'
                ? 'bg-red-600 text-white font-bold shadow-sm'
                : 'hover:bg-slate-200/70 text-slate-700'
            }`}
          >
            <Store className="w-3.5 h-3.5" />
            <span>Durban Hyper Branches</span>
          </button>

          <button
            onClick={() => setActiveTab('about')}
            className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
              activeTab === 'about'
                ? 'bg-red-600 text-white font-bold shadow-sm'
                : 'hover:bg-slate-200/70 text-slate-700'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-yellow-500" />
            <span>About Take n Pay</span>
          </button>
        </div>
      </nav>
    </header>
  );
}
