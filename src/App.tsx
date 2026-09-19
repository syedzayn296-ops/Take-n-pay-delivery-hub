import { useState, useEffect, useMemo } from 'react';
import {
  GroceryProduct,
  CartItem,
  GroceryCategory,
  SuburbCoverage,
  OrderRecord,
  OrderStatus,
  HamperDeal,
  DeliveryAddress
} from './types';
import {
  GROCERY_PRODUCTS,
  HAMPER_DEALS,
  SUBURB_COVERAGE_LIST,
  STORE_LOCATIONS
} from './data/groceryData';

import TakeNPayNavbar from './components/TakeNPayNavbar';
import HeroBanner from './components/HeroBanner';
import ProductCard from './components/ProductCard';
import ProductDetailModal from './components/ProductDetailModal';
import HamperDealsSection from './components/HamperDealsSection';
import DeliveryTrackingModal from './components/DeliveryTrackingModal';
import CartDrawer from './components/CartDrawer';
import StoreLocatorSection from './components/StoreLocatorSection';
import AboutTakeNPaySection from './components/AboutTakeNPaySection';

import {
  ShoppingBag,
  Sparkles,
  Percent,
  Layers,
  Bike,
  Store,
  PhoneCall,
  Clock,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  Filter
} from 'lucide-react';

const INITIAL_DEMO_ORDER: OrderRecord = {
  id: 'ord-7842',
  orderNumber: 'TNP-60-9182',
  placedAt: '10:14 AM',
  etaTime: '10:48 AM',
  remainingMinutes: 24,
  status: 'dispatched',
  items: [
    {
      product: GROCERY_PRODUCTS[0], // Stewing Mutton
      quantity: 1,
      substitutionPreference: 'best_match'
    },
    {
      product: GROCERY_PRODUCTS[5], // 10kg Potatoes
      quantity: 1,
      substitutionPreference: 'best_match'
    },
    {
      product: GROCERY_PRODUCTS[10], // Sunfoil 5L
      quantity: 1,
      substitutionPreference: 'best_match'
    }
  ],
  subtotal: 374.97,
  deliveryFee: 35,
  driverTip: 15,
  total: 424.97,
  deliveryAddress: {
    id: 'addr-demo',
    label: 'Home',
    recipientName: 'Zayn S.',
    recipientPhone: '082 555 1290',
    streetAddress: '42 Silverglen Drive',
    suburb: 'Chatsworth',
    city: 'Durban',
    postalCode: '4092',
    gateCode: '#3390',
    deliveryNotes: 'Ring bell at security gate, friendly dog.'
  },
  substitutionRule: 'best_match',
  paymentMethod: 'Credit / Debit Card',
  hubBranch: 'Chatsworth Hyper Hub',
  pickerName: 'Sipho Khumalo',
  driver: {
    name: 'Thabo Mthembu',
    phone: '071 892 4410',
    rating: 4.9,
    deliveriesCompleted: 1420,
    vehicle: 'Honda Ace 125',
    licensePlate: 'ND 884-219',
    currentProgressPercent: 65
  },
  otpCode: '4892'
};

export default function App() {
  // Navigation & View Tabs: 'shop' | 'hampers' | 'specials' | 'tracker' | 'stores' | 'about'
  const [activeTab, setActiveTab] = useState<string>('shop');
  const [activeCategory, setActiveCategory] = useState<GroceryCategory>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Selected delivery suburb
  const [selectedSuburb, setSelectedSuburb] = useState<SuburbCoverage>(() => {
    const saved = localStorage.getItem('tnp60_suburb');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return SUBURB_COVERAGE_LIST[0]; // Chatsworth
  });

  // Cart State (Persisted)
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('tnp60_cart');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return [];
  });

  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [quickViewProduct, setQuickViewProduct] = useState<GroceryProduct | null>(null);

  // Active Live Sixty60 Order (Persisted)
  const [activeOrder, setActiveOrder] = useState<OrderRecord | null>(() => {
    const saved = localStorage.getItem('tnp60_active_order');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return INITIAL_DEMO_ORDER;
  });

  // Save Cart to LocalStorage
  useEffect(() => {
    localStorage.setItem('tnp60_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Save Suburb to LocalStorage
  useEffect(() => {
    localStorage.setItem('tnp60_suburb', JSON.stringify(selectedSuburb));
  }, [selectedSuburb]);

  // Save Order to LocalStorage
  useEffect(() => {
    if (activeOrder) {
      localStorage.setItem('tnp60_active_order', JSON.stringify(activeOrder));
    }
  }, [activeOrder]);

  // Cart operations
  const handleAddToCart = (product: GroceryProduct) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1, substitutionPreference: 'best_match' }];
    });
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    setCartItems((prev) => {
      if (quantity <= 0) {
        return prev.filter((item) => item.product.id !== productId);
      }
      return prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      );
    });
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  // Add Full Hamper to Cart
  const handleAddHamper = (hamper: HamperDeal) => {
    // Create or add a combo item representation
    const comboProduct: GroceryProduct = {
      id: hamper.id,
      name: hamper.title,
      brand: 'Take n Pay Durban Hyper',
      size: `${hamper.itemsList.length} Bulk Items Included`,
      category: 'hampers',
      price: hamper.price,
      originalPrice: hamper.originalPrice,
      isOnSpecial: true,
      badge: hamper.badge,
      inStock: true,
      imageEmoji: hamper.imageEmoji,
      description: `Includes: ${hamper.itemsList.join(', ')}`
    };
    handleAddToCart(comboProduct);
    setIsCartOpen(true);
  };

  // Place Sixty60-style order
  const handlePlaceOrder = (config: {
    address: DeliveryAddress;
    substitutionRule: 'best_match' | 'call_me' | 'refund';
    deliveryType: 'sixty_express' | 'scheduled';
    driverTip: number;
    paymentMethod: 'Credit / Debit Card' | 'Ozow Instant EFT' | 'Cash on Delivery';
  }) => {
    const subtotal = cartItems.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
    const fee = subtotal >= 500 ? 0 : 35;
    const total = subtotal + fee + config.driverTip;

    const newOrder: OrderRecord = {
      id: `ord-${Date.now()}`,
      orderNumber: `TNP-60-${Math.floor(1000 + Math.random() * 9000)}`,
      placedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      etaTime: new Date(Date.now() + selectedSuburb.etaMinutes * 60000).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      }),
      remainingMinutes: selectedSuburb.etaMinutes,
      status: 'placed',
      items: [...cartItems],
      subtotal,
      deliveryFee: fee,
      driverTip: config.driverTip,
      total,
      deliveryAddress: config.address,
      substitutionRule: config.substitutionRule,
      paymentMethod: config.paymentMethod,
      hubBranch: selectedSuburb.hubBranch,
      pickerName: 'Sipho (Chatsworth Hyper)',
      driver: {
        name: 'Thabo Mthembu',
        phone: '071 892 4410',
        rating: 4.9,
        deliveriesCompleted: 1420,
        vehicle: 'Honda Ace 125',
        licensePlate: 'ND 884-219',
        currentProgressPercent: 10
      },
      otpCode: `${Math.floor(1000 + Math.random() * 9000)}`
    };

    setActiveOrder(newOrder);
    setCartItems([]);
    setActiveTab('tracker');
  };

  const handleUpdateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    if (activeOrder && activeOrder.id === orderId) {
      setActiveOrder({
        ...activeOrder,
        status: newStatus,
        remainingMinutes:
          newStatus === 'delivered' ? 0 :
          newStatus === 'arriving' ? 4 :
          newStatus === 'dispatched' ? 18 :
          newStatus === 'picking' ? 28 : activeOrder.remainingMinutes
      });
    }
  };

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return GROCERY_PRODUCTS.filter((product) => {
      // specials tab filter
      if (activeTab === 'specials' && !product.isOnSpecial) {
        return false;
      }
      // category filter (if not on 'specials' tab)
      if (activeCategory !== 'all' && product.category !== activeCategory) {
        return false;
      }
      // search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(query);
        const matchesBrand = product.brand.toLowerCase().includes(query);
        const matchesDesc = product.description.toLowerCase().includes(query);
        return matchesName || matchesBrand || matchesDesc;
      }
      return true;
    });
  }, [activeCategory, activeTab, searchQuery]);

  const cartTotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col text-slate-900 font-sans">
      {/* Top Sixty60-style Navbar */}
      <TakeNPayNavbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedSuburb={selectedSuburb}
        setSelectedSuburb={setSelectedSuburb}
        allSuburbs={SUBURB_COVERAGE_LIST}
        cartCount={cartCount}
        cartTotal={cartTotal}
        onOpenCart={() => setIsCartOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        hasActiveOrder={!!activeOrder}
        onOpenActiveOrder={() => setActiveTab('tracker')}
      />

      {/* Hero Banner (Always visible on Shop & Specials) */}
      {(activeTab === 'shop' || activeTab === 'specials') && (
        <HeroBanner
          selectedSuburb={selectedSuburb}
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
          onExploreHampers={() => setActiveTab('hampers')}
        />
      )}

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex-1 w-full">
        {/* TAB 1: SHOP GROCERIES (Sixty60 Aisle Experience) */}
        {activeTab === 'shop' && (
          <div className="space-y-6">
            {/* Header controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                  <span>{activeCategory === 'all' ? 'All Aisles & Fresh Groceries' : `${activeCategory.toUpperCase()} AISLE`}</span>
                  <span className="text-xs text-slate-400 font-normal">({filteredProducts.length} items)</span>
                </h2>
                <p className="text-xs text-slate-500">
                  Prices match in-store Chatsworth Hyper &bull; Dispatched in insulated thermal bags
                </p>
              </div>

              {/* Quick Filter Pill */}
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                <span className="text-slate-400">Showing:</span>
                <span className="bg-white border border-slate-200 px-2.5 py-1 rounded-lg text-slate-800 font-bold">
                  {selectedSuburb.suburb} (⚡ {selectedSuburb.etaMinutes} mins)
                </span>
              </div>
            </div>

            {/* Product Grid */}
            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
                <div className="text-4xl">🔍</div>
                <h3 className="text-base font-bold text-slate-800">No items match your search</h3>
                <p className="text-xs text-slate-500">
                  Try searching for "mutton", "potatoes", "Sunfoil oil", or "rice".
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setActiveCategory('all');
                  }}
                  className="px-4 py-2 bg-red-600 text-white text-xs font-bold rounded-xl"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
                {filteredProducts.map((product) => {
                  const inCartItem = cartItems.find((i) => i.product.id === product.id);
                  const quantityInCart = inCartItem ? inCartItem.quantity : 0;

                  return (
                    <ProductCard
                      key={product.id}
                      product={product}
                      quantityInCart={quantityInCart}
                      onAddToCart={handleAddToCart}
                      onUpdateQuantity={handleUpdateQuantity}
                      onQuickView={(p) => setQuickViewProduct(p)}
                    />
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: BULK HYPER HAMPERS */}
        {activeTab === 'hampers' && (
          <HamperDealsSection
            hampers={HAMPER_DEALS}
            onAddHamper={handleAddHamper}
          />
        )}

        {/* TAB 3: WEEKLY SPECIALS LEAFLET */}
        {activeTab === 'specials' && (
          <div className="space-y-6">
            <div className="bg-yellow-400 text-red-950 p-6 rounded-3xl border-2 border-yellow-500 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="bg-red-600 text-white text-[10px] font-black px-2.5 py-0.5 rounded uppercase">
                  PRICE CRUSH THIS WEEK
                </span>
                <h2 className="text-2xl sm:text-3xl font-black mt-1">
                  Take n Pay Weekly Specials Leaflet
                </h2>
                <p className="text-xs text-red-900 mt-0.5">
                  Unbeatable price drops on fresh A-grade mutton, 10kg pocket potatoes, cooking oil, and household cleansers!
                </p>
              </div>
              <div className="text-right shrink-0">
                <span className="text-xs font-bold block">Valid Until Sunday</span>
                <span className="text-lg font-black text-red-700">Chatsworth &bull; Westcliff &bull; Online 60</span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredProducts.map((product) => {
                const inCartItem = cartItems.find((i) => i.product.id === product.id);
                const quantityInCart = inCartItem ? inCartItem.quantity : 0;

                return (
                  <ProductCard
                    key={product.id}
                    product={product}
                    quantityInCart={quantityInCart}
                    onAddToCart={handleAddToCart}
                    onUpdateQuantity={handleUpdateQuantity}
                    onQuickView={(p) => setQuickViewProduct(p)}
                  />
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 4: LIVE 60-MIN DRIVER TRACKER (Checkers Sixty60 Style) */}
        {activeTab === 'tracker' && (
          <div className="space-y-6">
            {activeOrder ? (
              <DeliveryTrackingModal
                order={activeOrder}
                onUpdateOrderStatus={handleUpdateOrderStatus}
              />
            ) : (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 max-w-lg mx-auto space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-amber-100 flex items-center justify-center text-3xl mx-auto">
                  🛵
                </div>
                <h3 className="text-lg font-black text-slate-900">No Active 60-Minute Orders</h3>
                <p className="text-xs text-slate-500">
                  Place an order from our fresh aisles to watch your motorbike driver navigate live through Durban!
                </p>
                <button
                  onClick={() => setActiveTab('shop')}
                  className="px-5 py-2.5 rounded-xl bg-red-600 text-white font-bold text-xs hover:bg-red-700 transition"
                >
                  Browse Groceries
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 5: DURBAN STORE LOCATIONS */}
        {activeTab === 'stores' && (
          <StoreLocatorSection
            stores={STORE_LOCATIONS}
            suburbs={SUBURB_COVERAGE_LIST}
            onSelectSuburbForDelivery={(sub) => {
              setSelectedSuburb(sub);
              setActiveTab('shop');
            }}
          />
        )}

        {/* TAB 6: ABOUT TAKE N PAY */}
        {activeTab === 'about' && (
          <AboutTakeNPaySection
            onStartShopping={() => setActiveTab('shop')}
          />
        )}
      </main>

      {/* Slide-Over Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onClearCart={handleClearCart}
        selectedSuburb={selectedSuburb}
        onPlaceOrder={handlePlaceOrder}
      />

      {/* Quick View Product Modal */}
      <ProductDetailModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        quantityInCart={
          quickViewProduct
            ? cartItems.find((i) => i.product.id === quickViewProduct.id)?.quantity || 0
            : 0
        }
        onAddToCart={handleAddToCart}
        onUpdateQuantity={handleUpdateQuantity}
      />

      {/* Footer */}
      <footer className="bg-slate-900 text-white border-t border-slate-800 pt-12 pb-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Brand Column */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-red-600 flex flex-col items-center justify-center text-white font-black text-xs">
                  <span className="text-[9px] text-yellow-300">TNP</span>
                  <span className="text-[8px]">60</span>
                </div>
                <span className="text-xl font-black text-white">Take n Pay Hyper</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Durban’s favorite food town hyper since 1989. On-demand grocery delivery across Chatsworth, Berea, Durban North, Westville, and surrounding KZN communities in 60 minutes.
              </p>
              <div className="text-xs font-bold text-yellow-400 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" />
                <span>100% SANHA Halal Certified Butchery</span>
              </div>
            </div>

            {/* Durban Hubs */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-black uppercase text-slate-200 tracking-wider">
                Durban Branches &amp; 60 Hubs
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-400">
                <li>&bull; Chatsworth Flagship (Woodhurst)</li>
                <li>&bull; Westcliff Express Store</li>
                <li>&bull; Sydney Road Dark Store Fulfilment Hub</li>
                <li>&bull; Click &amp; Collect WhatsApp: +27 31 401 2288</li>
              </ul>
            </div>

            {/* Sixty60 Delivery Guarantee */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-black uppercase text-slate-200 tracking-wider">
                Take n Pay 60 Promise
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-400">
                <li>⚡ 60-Minute FastDrop Guarantee</li>
                <li>🥩 Butchery Cuts Chilled in Thermal Totes</li>
                <li>🔄 Smart Substitutions or Direct WhatsApp Call</li>
                <li>🛡️ Secure 4-Digit Delivery OTP Verification</li>
              </ul>
            </div>

            {/* Payment & Security */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-black uppercase text-slate-200 tracking-wider">
                Payment &amp; Support
              </h4>
              <p className="text-xs text-slate-400">
                Secure South African payment gateway supported:
              </p>
              <div className="flex flex-wrap gap-1.5 text-[11px] font-bold text-slate-300">
                <span className="bg-slate-800 px-2 py-1 rounded">Visa</span>
                <span className="bg-slate-800 px-2 py-1 rounded">Mastercard</span>
                <span className="bg-slate-800 px-2 py-1 rounded">Ozow Instant EFT</span>
                <span className="bg-slate-800 px-2 py-1 rounded">Cash on Delivery</span>
              </div>
              <div className="pt-2">
                <span className="text-[11px] text-slate-400 block">Customer Care Hotline:</span>
                <span className="text-xs font-bold text-red-400">support@takenpay60.co.za</span>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
            <div>
              &copy; {new Date().getFullYear()} Take n Pay Food Town Hyper &bull; Durban, KwaZulu-Natal, South Africa. All rights reserved.
            </div>
            <div className="flex items-center gap-4">
              <span>Privacy Policy</span>
              <span>&bull;</span>
              <span>Terms of 60 Delivery</span>
              <span>&bull;</span>
              <span>SANHA Certificate #7749</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
