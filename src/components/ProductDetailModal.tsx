import { X, Plus, Minus, Check, ShieldCheck, Heart, Sparkles } from 'lucide-react';
import { GroceryProduct } from '../types';

interface Props {
  product: GroceryProduct | null;
  onClose: () => void;
  quantityInCart: number;
  onAddToCart: (p: GroceryProduct) => void;
  onUpdateQuantity: (id: string, q: number) => void;
}

export default function ProductDetailModal({
  product,
  onClose,
  quantityInCart,
  onAddToCart,
  onUpdateQuantity
}: Props) {
  if (!product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200">
        {/* Modal Header */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[10px] bg-red-600 text-white font-black px-2 py-0.5 rounded-full uppercase">
              TAKE N PAY 60
            </span>
            <span className="text-xs text-slate-500 font-bold">{product.category.toUpperCase()}</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-xl text-slate-400 hover:text-slate-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4">
          <div className="w-full h-44 bg-slate-50 rounded-2xl flex items-center justify-center text-7xl border border-slate-100">
            {product.imageEmoji}
          </div>

          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              {product.brand}
            </span>
            <h3 className="text-lg font-black text-slate-900 leading-snug">
              {product.name}
            </h3>
            <span className="text-xs font-semibold text-slate-500 block mt-0.5">
              Pack Size: {product.size}
            </span>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
            {product.description}
          </p>

          <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold text-slate-600">
            {product.isHalal && (
              <span className="bg-emerald-50 text-emerald-700 border border-emerald-300 px-2 py-1 rounded-lg">
                ✓ SANHA Halal Certified
              </span>
            )}
            {product.origin && (
              <span className="bg-slate-100 text-slate-700 px-2 py-1 rounded-lg">
                📍 {product.origin}
              </span>
            )}
            <span className="bg-amber-50 text-amber-800 border border-amber-200 px-2 py-1 rounded-lg">
              ⚡ 60-Minute Delivery Eligible
            </span>
          </div>

          {/* Pricing & CTA */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <div>
              {product.originalPrice && (
                <span className="text-xs text-slate-400 line-through block">
                  R{product.originalPrice.toFixed(2)}
                </span>
              )}
              <span className="text-2xl font-black text-red-600">
                R{product.price.toFixed(2)}
              </span>
            </div>

            <div>
              {quantityInCart === 0 ? (
                <button
                  onClick={() => onAddToCart(product)}
                  className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-xs shadow-md transition active:scale-95"
                >
                  Add to 60-Min Cart
                </button>
              ) : (
                <div className="flex items-center bg-red-50 border border-red-200 rounded-xl overflow-hidden shadow-xs">
                  <button
                    onClick={() => onUpdateQuantity(product.id, quantityInCart - 1)}
                    className="w-9 h-9 flex items-center justify-center text-red-700 hover:bg-red-100 transition font-black"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-8 text-center font-black text-sm text-red-950">
                    {quantityInCart}
                  </span>
                  <button
                    onClick={() => onUpdateQuantity(product.id, quantityInCart + 1)}
                    className="w-9 h-9 flex items-center justify-center text-red-700 hover:bg-red-100 transition font-black"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
