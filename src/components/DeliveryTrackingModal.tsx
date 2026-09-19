import { useState, useEffect } from 'react';
import {
  Clock,
  MapPin,
  Phone,
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
  Package,
  Bike,
  Store,
  Sparkles,
  RefreshCw,
  AlertCircle,
  HelpCircle,
  X
} from 'lucide-react';
import { OrderRecord, OrderStatus } from '../types';

interface Props {
  order: OrderRecord;
  onClose?: () => void;
  onUpdateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;
}

export default function DeliveryTrackingModal({
  order,
  onClose,
  onUpdateOrderStatus
}: Props) {
  const [activeTab, setActiveTab] = useState<'map' | 'items'>('map');
  const [simulatedEta, setSimulatedEta] = useState(order.remainingMinutes);

  // Countdown timer simulation
  useEffect(() => {
    const timer = setInterval(() => {
      setSimulatedEta((prev) => (prev > 1 ? prev - 1 : 1));
    }, 15000);
    return () => clearInterval(timer);
  }, []);

  const advanceStage = () => {
    const stages: OrderStatus[] = ['placed', 'picking', 'dispatched', 'arriving', 'delivered'];
    const currentIndex = stages.indexOf(order.status);
    if (currentIndex < stages.length - 1) {
      onUpdateOrderStatus(order.id, stages[currentIndex + 1]);
    }
  };

  const getStatusIndex = (status: OrderStatus) => {
    switch (status) {
      case 'placed': return 0;
      case 'picking': return 1;
      case 'dispatched': return 2;
      case 'arriving': return 3;
      case 'delivered': return 4;
      default: return 0;
    }
  };

  const currentStep = getStatusIndex(order.status);

  // Calculate simulated motorcycle progress percentage
  const progressPercent =
    order.status === 'placed' ? 5 :
    order.status === 'picking' ? 25 :
    order.status === 'dispatched' ? 60 :
    order.status === 'arriving' ? 90 : 100;

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden max-w-4xl mx-auto my-4">
      {/* Sixty60 Style Top Header */}
      <div className="bg-slate-900 text-white p-5 sm:p-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-red-600 flex items-center justify-center text-white font-black text-xl shadow-md border border-red-500">
            🛵
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-yellow-400 text-red-950 font-black text-[10px] px-2 py-0.5 rounded-full uppercase">
                TAKE N PAY 60 LIVE
              </span>
              <span className="text-xs text-slate-400 font-mono">#{order.orderNumber}</span>
            </div>
            <h2 className="text-lg sm:text-2xl font-black text-white tracking-tight mt-0.5">
              {order.status === 'delivered'
                ? 'Order Delivered!'
                : `Delivering to ${order.deliveryAddress.suburb}`}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Estimated Arrival</span>
            <span className="text-xl font-black text-yellow-400">
              {order.status === 'delivered' ? 'Completed' : `${simulatedEta} mins`}
            </span>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Interactive Map Visualizer (Simulated Sixty60 GPS Track) */}
      <div className="relative h-64 sm:h-80 bg-slate-950 overflow-hidden border-b border-slate-800">
        {/* Map Grid and Roads */}
        <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,#38bdf8_1px,transparent_1px),linear-gradient(to_bottom,#38bdf8_1px,transparent_1px)] bg-[size:40px_40px]" />

        {/* Durban Coastal / Highway Representation */}
        <svg className="w-full h-full absolute inset-0" viewBox="0 0 800 300">
          {/* Main Higginson Hwy / N2 route curve */}
          <path
            d="M 80,240 Q 250,180 400,160 T 720,70"
            fill="none"
            stroke="#334155"
            strokeWidth="16"
            strokeLinecap="round"
          />
          <path
            d="M 80,240 Q 250,180 400,160 T 720,70"
            fill="none"
            stroke="#ef4444"
            strokeWidth="6"
            strokeDasharray="8 8"
            strokeLinecap="round"
          />

          {/* Hub Point (Take n Pay Chatsworth Hyper) */}
          <g transform="translate(80, 240)">
            <circle r="18" fill="#dc2626" opacity="0.3" className="animate-ping" />
            <circle r="12" fill="#dc2626" />
            <text x="0" y="4" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">🏪</text>
            <text x="0" y="-18" fill="#f87171" fontSize="11" fontWeight="bold" textAnchor="middle">
              {order.hubBranch}
            </text>
          </g>

          {/* Delivery Destination Pin (Customer Suburb) */}
          <g transform="translate(720, 70)">
            <circle r="18" fill="#10b981" opacity="0.3" className="animate-ping" />
            <circle r="12" fill="#10b981" />
            <text x="0" y="4" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">📍</text>
            <text x="0" y="-18" fill="#34d399" fontSize="11" fontWeight="bold" textAnchor="middle">
              {order.deliveryAddress.suburb}
            </text>
          </g>

          {/* Live Motorbike Position Marker */}
          {(() => {
            // Position calculation along curve roughly based on progress percent
            const t = progressPercent / 100;
            const x = 80 + t * (720 - 80);
            const y = 240 - Math.sin(t * Math.PI) * 90 - t * 80;

            return (
              <g transform={`translate(${x}, ${y})`}>
                <circle r="22" fill="#eab308" opacity="0.25" className="animate-pulse" />
                <circle r="14" fill="#eab308" stroke="#713f12" strokeWidth="2" />
                <text x="0" y="4" fill="#000" fontSize="11" textAnchor="middle">🛵</text>
                <text x="0" y="-18" fill="#fef08a" fontSize="10" fontWeight="black" textAnchor="middle">
                  {order.driver.name} ({order.driver.vehicle.split(' ')[0]})
                </text>
              </g>
            );
          })()}
        </svg>

        {/* Floating Live Telemetry Badge Top-Left */}
        <div className="absolute top-4 left-4 bg-slate-900/90 backdrop-blur border border-slate-700 text-white rounded-2xl p-3 shadow-xl max-w-xs space-y-1 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span className="font-bold text-slate-200">GPS Live Delivery Stream</span>
          </div>
          <div className="text-[11px] text-slate-400">
            En route via <strong className="text-white">M4 / Higginson Corridor</strong>
          </div>
          <div className="text-[10px] text-yellow-400 font-bold">
            Cold-Chain Sealed Bags &bull; Temp: 4.2°C
          </div>
        </div>

        {/* OTP Drop-Off Verification Box Bottom-Right */}
        <div className="absolute bottom-4 right-4 bg-yellow-400 text-red-950 font-black px-4 py-2.5 rounded-2xl shadow-xl border-2 border-yellow-300 flex items-center gap-3">
          <div>
            <span className="text-[9px] uppercase font-black tracking-wider block leading-none">
              Your Secure Delivery OTP
            </span>
            <span className="text-xl tracking-widest leading-none font-mono">
              {order.otpCode}
            </span>
          </div>
          <ShieldCheck className="w-6 h-6 text-red-900" />
        </div>
      </div>

      {/* Multi-Stage Sixty60 Timeline */}
      <div className="p-6 bg-slate-50 border-b border-slate-200">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* Step 1 */}
          <div className={`p-3 rounded-2xl border transition ${
            currentStep >= 0 ? 'bg-white border-red-500 shadow-sm' : 'bg-slate-100 border-slate-200 opacity-60'
          }`}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-base">💳</span>
              {currentStep > 0 && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Step 1</span>
            <h4 className="text-xs font-black text-slate-900">Order Confirmed</h4>
            <span className="text-[10px] text-slate-500">{order.placedAt}</span>
          </div>

          {/* Step 2 */}
          <div className={`p-3 rounded-2xl border transition ${
            currentStep >= 1 ? 'bg-white border-red-500 shadow-sm' : 'bg-slate-100 border-slate-200 opacity-60'
          }`}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-base">🛒</span>
              {currentStep > 1 && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Step 2</span>
            <h4 className="text-xs font-black text-slate-900">In-Store Picker</h4>
            <span className="text-[10px] text-slate-500">{order.pickerName} picking</span>
          </div>

          {/* Step 3 */}
          <div className={`p-3 rounded-2xl border transition ${
            currentStep >= 2 ? 'bg-white border-red-500 shadow-sm' : 'bg-slate-100 border-slate-200 opacity-60'
          }`}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-base">🛵</span>
              {currentStep > 2 && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Step 3</span>
            <h4 className="text-xs font-black text-slate-900">On The Road</h4>
            <span className="text-[10px] text-slate-500">{order.driver.name} riding</span>
          </div>

          {/* Step 4 */}
          <div className={`p-3 rounded-2xl border transition ${
            currentStep >= 3 ? 'bg-white border-red-500 shadow-sm' : 'bg-slate-100 border-slate-200 opacity-60'
          }`}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-base">📦</span>
              {currentStep >= 4 && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Step 4</span>
            <h4 className="text-xs font-black text-slate-900">
              {order.status === 'delivered' ? 'Delivered' : 'Arriving at Gate'}
            </h4>
            <span className="text-[10px] text-slate-500">OTP code required</span>
          </div>
        </div>

        {/* Demo Stage Advance Tool for Testing */}
        <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-xs">
          <span className="text-slate-500 text-[11px]">
            Demonstration mode: Advance through Sixty60 order fulfillment stages in real time.
          </span>
          <button
            onClick={advanceStage}
            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1 transition cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Simulate Next Stage ({order.status})</span>
          </button>
        </div>
      </div>

      {/* Driver Card & Order Breakdown */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Driver Profile */}
        <div className="md:col-span-6 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase text-slate-400 tracking-wider">Your Delivery Driver</span>
            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">
              Verified 60 Driver
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-yellow-400 text-red-950 flex items-center justify-center text-xl font-bold">
              🛵
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900">{order.driver.name}</h3>
              <p className="text-xs text-slate-500">{order.driver.vehicle}</p>
              <div className="flex items-center gap-2 text-[11px] text-slate-600 mt-0.5">
                <span className="text-amber-500 font-bold">★ {order.driver.rating}</span>
                <span>&bull;</span>
                <span>{order.driver.deliveriesCompleted} Durban Deliveries</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
            <a
              href={`tel:${order.driver.phone}`}
              className="flex-1 py-2.5 px-3 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition text-center"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Call Driver ({order.driver.phone})</span>
            </a>
          </div>
        </div>

        {/* Address & Delivery Notes */}
        <div className="md:col-span-6 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <span className="text-xs font-black uppercase text-slate-400 tracking-wider block">
            Delivery Location &amp; Instructions
          </span>

          <div className="text-xs space-y-1">
            <div className="font-bold text-slate-900">{order.deliveryAddress.recipientName} ({order.deliveryAddress.recipientPhone})</div>
            <div className="text-slate-600">{order.deliveryAddress.streetAddress}, {order.deliveryAddress.suburb}</div>
            {order.deliveryAddress.gateCode && (
              <div className="text-slate-700 font-mono bg-slate-100 p-1.5 rounded inline-block text-[11px]">
                Gate Access Code: <strong>{order.deliveryAddress.gateCode}</strong>
              </div>
            )}
            {order.deliveryAddress.deliveryNotes && (
              <p className="text-[11px] text-slate-500 italic mt-1">
                "{order.deliveryAddress.deliveryNotes}"
              </p>
            )}
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">Order Subtotal ({order.items.length} items):</span>
            <strong className="text-slate-900">R{order.total.toFixed(2)}</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
