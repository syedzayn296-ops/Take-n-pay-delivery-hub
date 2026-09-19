import { Plus, Minus, Check, Sparkles } from 'lucide-react';
import { GroceryProduct } from '../types';

interface Props {
  key?: string;
  product: GroceryProduct;
  quantityInCart: number;
  onAddToCart: (product: GroceryProduct) => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onQuickView?: (product: GroceryProduct) => void;
}

export default function ProductCard({
  product,
  quantityInCart,
  onAddToCart,
  onUpdateQuantity,
  onQuickView
}: Props) {
  const savings = product.originalPrice ? (product.originalPrice - product.price).toFixed(2) : null;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 hover:border-red-300 hover:shadow-lg transition-all flex flex-col justify-between p-4 relative group">
      {/* Badges Top Bar */}
      <div className="flex items-center justify-between gap-1 mb-2">
        <div className="flex items-center gap-1">
          {product.badge && (
            <span className="bg-red-600 text-white font-black text-[9px] px-2 py-0.5 rounded-full uppercase tracking-tighter">
              {product.badge}
            </span>
          )}
          {product.isHalal && (
            <span className="bg-emerald-50 text-emerald-700 border border-emerald-300 font-bold text-[9px] px-1.5 py-0.5 rounded uppercase">
              SANHA HALAL
            </span>
          )}
        </div>

        {savings && Number(savings) > 0 && (
          <span className="bg-yellow-100 text-amber-900 border border-yellow-300 font-black text-[10px] px-1.5 py-0.5 rounded">
            SAVE R{savings}
          </span>
        )}
      </div>

      {/* Product Image Emoji / Visual */}
      <div
        onClick={() => onQuickView && onQuickView(product)}
        className="w-full h-28 bg-slate-50 rounded-xl flex items-center justify-center text-5xl my-2 cursor-pointer group-hover:scale-105 transition-transform"
      >
        <span>{product.imageEmoji}</span>
      </div>

      {/* Product Info */}
      <div className="flex-1 space-y-1 mb-3">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
          {product.brand}
        </span>
        <h3
          onClick={() => onQuickView && onQuickView(product)}
          className="text-xs sm:text-sm font-bold text-slate-900 leading-snug line-clamp-2 cursor-pointer hover:text-red-600 transition"
        >
          {product.name}
        </h3>
        <span className="text-[11px] font-semibold text-slate-500 block">
          {product.size}
        </span>
      </div>

      {/* Price & Cart Control */}
      <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
        <div>
          {product.originalPrice && (
            <span className="text-[11px] text-slate-400 line-through block">
              R{product.originalPrice.toFixed(2)}
            </span>
          )}
          <span className="text-base sm:text-lg font-black text-red-600 leading-none">
            R{product.price.toFixed(2)}
          </span>
        </div>

        {/* Quantity Controls (Sixty60 style) */}
        <div>
          {quantityInCart === 0 ? (
            <button
              onClick={() => onAddToCart(product)}
              className="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-xs flex items-center gap-1 shadow-sm transition active:scale-95 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          ) : (
            <div className="flex items-center bg-red-50 border border-red-200 rounded-xl overflow-hidden shadow-sm">
              <button
                onClick={() => onUpdateQuantity(product.id, quantityInCart - 1)}
                className="w-7 h-7 flex items-center justify-center text-red-700 hover:bg-red-100 transition font-black"
                title="Decrease"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="w-7 text-center font-black text-xs text-red-950">
                {quantityInCart}
              </span>
              <button
                onClick={() => onUpdateQuantity(product.id, quantityInCart + 1)}
                className="w-7 h-7 flex items-center justify-center text-red-700 hover:bg-red-100 transition font-black"
                title="Increase"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
