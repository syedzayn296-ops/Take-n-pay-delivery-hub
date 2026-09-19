import { useState } from 'react';
import {
  X,
  Plus,
  Minus,
  Trash2,
  Clock,
  ShieldCheck,
  CreditCard,
  Banknote,
  ArrowRight,
  PhoneCall,
  RotateCcw,
  Sparkles,
  MapPin,
  Check
} from 'lucide-react';
import { CartItem, DeliveryAddress, SuburbCoverage } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onClearCart: () => void;
  selectedSuburb: SuburbCoverage;
  onPlaceOrder: (orderConfig: {
    address: DeliveryAddress;
    substitutionRule: 'best_match' | 'call_me' | 'refund';
    deliveryType: 'sixty_express' | 'scheduled';
    driverTip: number;
    paymentMethod: 'Credit / Debit Card' | 'Ozow Instant EFT' | 'Cash on Delivery';
  }) => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onClearCart,
  selectedSuburb,
  onPlaceOrder
}: Props) {
  const [substitutionRule, setSubstitutionRule] = useState<'best_match' | 'call_me' | 'refund'>('best_match');
  const [deliveryType, setDeliveryType] = useState<'sixty_express' | 'scheduled'>('sixty_express');
  const [driverTip, setDriverTip] = useState<number>(15);
  const [paymentMethod, setPaymentMethod] = useState<'Credit / Debit Card' | 'Ozow Instant EFT' | 'Cash on Delivery'>('Credit / Debit Card');

  // Address fields
  const [streetAddress, setStreetAddress] = useState('42 Silverglen Drive');
  const [recipientName, setRecipientName] = useState('Zayn S.');
  const [recipientPhone, setRecipientPhone] = useState('082 555 1290');
  const [gateCode, setGateCode] = useState('#3390');
  const [deliveryNotes, setDeliveryNotes] = useState('Please ring intercom, watch out for friendly dog.');

  const itemsSubtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const deliveryFee = itemsSubtotal >= 500 ? 0 : 35;
  const grandTotal = itemsSubtotal + deliveryFee + driverTip;
  const freeDeliveryShortfall = 500 - itemsSubtotal;

  if (!isOpen) return null;

  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    onPlaceOrder({
      address: {
        id: 'addr-active',
        label: 'Current Address',
        recipientName,
        recipientPhone,
        streetAddress,
        suburb: selectedSuburb.suburb,
        city: 'Durban',
        postalCode: '4092',
        gateCode,
        deliveryNotes
      },
      substitutionRule,
      deliveryType,
      driverTip,
      paymentMethod
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
      />

      {/* Slide-over Drawer Panel */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col z-10">
        {/* Top Header */}
        <div className="p-4 bg-red-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🛵</span>
            <div>
              <h2 className="text-base font-black tracking-tight leading-none">Your Take n Pay 60 Cart</h2>
              <span className="text-[10px] text-red-100 font-semibold">
                Delivering to {selectedSuburb.suburb} in {selectedSuburb.etaMinutes} mins
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {cartItems.length > 0 && (
              <button
                onClick={onClearCart}
                className="text-[11px] text-red-200 hover:text-white underline font-semibold"
              >
                Clear
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-white hover:bg-red-700 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Free Delivery Meter */}
        <div className="bg-amber-50 p-3 border-b border-amber-200 text-xs text-amber-900">
          {itemsSubtotal >= 500 ? (
            <div className="flex items-center gap-1.5 font-bold text-emerald-700">
              <span>🎉 Congratulations! You have unlocked FREE 60-Minute Delivery.</span>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between text-[11px] font-semibold mb-1">
                <span>Add R{freeDeliveryShortfall.toFixed(2)} for FREE 60-Min Delivery</span>
                <span>R{itemsSubtotal.toFixed(0)} / R500</span>
              </div>
              <div className="w-full bg-amber-200 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-amber-600 h-full rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, (itemsSubtotal / 500) * 100)}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5">
          {cartItems.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-3xl">
                🛒
              </div>
              <h3 className="text-base font-bold text-slate-800">Your basket is empty</h3>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Explore our famous Durban butchery cuts, 10kg pocket potatoes, and hyper hampers to start your 60-minute order!
              </p>
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-red-600 text-white font-bold text-xs hover:bg-red-700 transition cursor-pointer"
              >
                Start Shopping Now
              </button>
            </div>
          ) : (
            <>
              {/* Item List */}
              <div className="space-y-3">
                <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 block">
                  Items in Basket ({cartItems.length})
                </span>
                {cartItems.map(({ product, quantity }) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200"
                  >
                    <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-xl shrink-0">
                      {product.imageEmoji}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-slate-900 truncate">{product.name}</h4>
                      <div className="text-[10px] text-slate-500">{product.size}</div>
                      <div className="text-xs font-black text-red-600">
                        R{(product.price * quantity).toFixed(2)}
                      </div>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center bg-white border border-slate-300 rounded-lg overflow-hidden shadow-2xs">
                      <button
                        onClick={() => onUpdateQuantity(product.id, quantity - 1)}
                        className="w-6 h-6 flex items-center justify-center text-slate-700 hover:bg-slate-100"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-6 text-center text-xs font-bold text-slate-900">
                        {quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(product.id, quantity + 1)}
                        className="w-6 h-6 flex items-center justify-center text-slate-700 hover:bg-slate-100"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Sixty60 Signature Feature: Substitution Rule */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <RotateCcw className="w-3.5 h-3.5 text-red-600" />
                    <span>Out of Stock Substitution Rule</span>
                  </span>
                  <span className="text-[10px] bg-red-100 text-red-700 font-bold px-1.5 py-0.5 rounded">
                    Sixty60 Style
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-1.5 text-[10px] font-bold">
                  <button
                    type="button"
                    onClick={() => setSubstitutionRule('best_match')}
                    className={`p-2 rounded-xl border text-center transition ${
                      substitutionRule === 'best_match'
                        ? 'bg-red-600 text-white border-red-600 font-black shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    Best Similar
                  </button>

                  <button
                    type="button"
                    onClick={() => setSubstitutionRule('call_me')}
                    className={`p-2 rounded-xl border text-center transition ${
                      substitutionRule === 'call_me'
                        ? 'bg-red-600 text-white border-red-600 font-black shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    Call Me First
                  </button>

                  <button
                    type="button"
                    onClick={() => setSubstitutionRule('refund')}
                    className={`p-2 rounded-xl border text-center transition ${
                      substitutionRule === 'refund'
                        ? 'bg-red-600 text-white border-red-600 font-black shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    Do Not Replace
                  </button>
                </div>
              </div>

              {/* Delivery Address & Contact */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-2.5">
                <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-slate-700">
                  <MapPin className="w-3.5 h-3.5 text-red-600" />
                  <span>Delivery Address ({selectedSuburb.suburb})</span>
                </div>

                <div className="space-y-1.5 text-xs">
                  <div>
                    <label className="text-[10px] text-slate-500 font-bold block">Street Address</label>
                    <input
                      type="text"
                      value={streetAddress}
                      onChange={(e) => setStreetAddress(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] text-slate-500 font-bold block">Recipient Name</label>
                      <input
                        type="text"
                        value={recipientName}
                        onChange={(e) => setRecipientName(e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-500 font-bold block">Phone (WhatsApp)</label>
                      <input
                        type="text"
                        value={recipientPhone}
                        onChange={(e) => setRecipientPhone(e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] text-slate-500 font-bold block">Gate Code</label>
                      <input
                        type="text"
                        value={gateCode}
                        onChange={(e) => setGateCode(e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-500 font-bold block">Driver Note</label>
                      <input
                        type="text"
                        value={deliveryNotes}
                        onChange={(e) => setDeliveryNotes(e.target.value)}
                        placeholder="Leave at reception etc."
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Driver Tip */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                  <span>Tip Your Motorbike Driver</span>
                  <span className="text-red-600 font-black">+R{driverTip}.00</span>
                </div>
                <div className="grid grid-cols-4 gap-1.5">
                  {[0, 15, 25, 50].map((tip) => (
                    <button
                      key={tip}
                      type="button"
                      onClick={() => setDriverTip(tip)}
                      className={`py-1.5 rounded-xl border text-xs font-bold transition ${
                        driverTip === tip
                          ? 'bg-slate-900 text-white border-slate-900'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {tip === 0 ? 'No tip' : `R${tip}`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Payment Method */}
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-slate-700 block">Payment Method</span>
                <div className="grid grid-cols-3 gap-1.5 text-[10px] font-bold">
                  {(['Credit / Debit Card', 'Ozow Instant EFT', 'Cash on Delivery'] as const).map((method) => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setPaymentMethod(method)}
                      className={`p-2 rounded-xl border text-center transition ${
                        paymentMethod === method
                          ? 'bg-slate-900 text-white border-slate-900'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {method === 'Credit / Debit Card' ? '💳 Card' : method === 'Ozow Instant EFT' ? '⚡ Ozow EFT' : '💵 Cash'}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Bottom Checkout Action */}
        {cartItems.length > 0 && (
          <div className="p-4 bg-slate-50 border-t border-slate-200 space-y-3">
            <div className="space-y-1 text-xs">
              <div className="flex justify-between text-slate-500">
                <span>Items Subtotal:</span>
                <span>R{itemsSubtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>60-Minute Delivery Fee:</span>
                <span>{deliveryFee === 0 ? <strong className="text-emerald-600">FREE</strong> : `R${deliveryFee}.00`}</span>
              </div>
              {driverTip > 0 && (
                <div className="flex justify-between text-slate-500">
                  <span>Driver Tip:</span>
                  <span>R{driverTip.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-black text-slate-900 pt-1 border-t border-slate-200">
                <span>Grand Total:</span>
                <span className="text-red-600 text-base">R{grandTotal.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full py-3.5 bg-red-600 hover:bg-red-700 active:scale-95 text-white font-black text-sm rounded-2xl shadow-lg shadow-red-600/30 flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <span>Dispatch 60-Minute Order (R{grandTotal.toFixed(2)})</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
