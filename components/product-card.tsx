"use client";

import { ShoppingBag, X, Check } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import { useRouter } from "next/navigation";

interface Variant {
  size: string;
  stockQuantity: number;
}

interface Product {
  _id: string;
  name: string;
  category: string;
  stockQuantity: number;
  sellingPrice: number;
  imageUrl?: string;
  variants?: Variant[];
}

interface Settings {
  currencySymbol: string;
}

export function ProductCard({ product, settings }: { product: Product; settings: Settings }) {
  const { addToCart, cart, updateQuantity, removeFromCart } = useCart();
  const { showToast } = useToast();
  const router = useRouter();
  const [showVariants, setShowVariants] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);

  // If no variants in product, treat it as a single default variant
  const hasVariants = product.variants && product.variants.length > 0;

  const cartItem = cart.find(item =>
    item._id === product._id &&
    (!hasVariants || item.size === selectedVariant?.size)
  );

  const quantityInCart = cartItem?.quantity || 0;
  const totalStockForSelected = hasVariants
    ? (selectedVariant?.stockQuantity || 0)
    : product.stockQuantity;

  const remainingStock = totalStockForSelected - quantityInCart;

  const handleAddToCart = (e?: React.MouseEvent) => {
    e?.stopPropagation();

    if (hasVariants && !selectedVariant && !showVariants) {
      setShowVariants(true);
      return;
    }

    const variantToAdd = hasVariants ? selectedVariant : null;

    if (remainingStock > 0) {
      addToCart({
        _id: product._id,
        name: product.name,
        sellingPrice: product.sellingPrice,
        imageUrl: product.imageUrl,
        stockQuantity: totalStockForSelected,
        size: variantToAdd?.size,
      });
      showToast(`${product.name}${variantToAdd ? ` (${variantToAdd.size})` : ""} added to cart`);
      if (hasVariants) setShowVariants(false);
    }
  };



  const totalQuantityInCart = cart.reduce((sum, item) => 
    item._id === product._id ? sum + item.quantity : sum, 0
  );
  const displayStock = Math.max(0, product.stockQuantity - totalQuantityInCart);

  return (
    <div className="group cursor-pointer font-outfit relative" onClick={() => router.push(`/product/${product._id}`)}>
      <div className="aspect-[3/4] bg-zinc-100 dark:bg-zinc-900 rounded-[2rem] md:rounded-[2.5rem] mb-4 overflow-hidden relative shadow-sm transition-all duration-500 group-hover:shadow-xl group-hover:-translate-y-2">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-zinc-300 dark:text-zinc-700 font-black text-3xl uppercase tracking-tighter font-bebas">
            {product.category}
          </div>
        )}

        {displayStock === 0 ? (
          <div className="absolute top-6 right-6 bg-black text-white text-[10px] font-black px-4 py-2 rounded-full tracking-widest font-bebas">SOLD OUT</div>
        ) : (
          <div className="absolute top-6 right-6 bg-blue-600 text-white text-[10px] font-black px-4 py-2 rounded-full tracking-widest font-bebas">
            {displayStock} TOTAL
          </div>
        )}

        <div className="absolute inset-0 bg-black/20 opacity-100 md:opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-end justify-center pb-6 md:pb-8 px-4 md:px-8">
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (hasVariants) {
                setShowVariants(true);
              } else {
                handleAddToCart(e);
              }
            }}
            className="w-full bg-white/90 backdrop-blur-md md:bg-white text-zinc-900 font-black text-sm md:text-xl tracking-[0.3em] py-5 md:py-6 rounded-2xl hover:bg-[#0a192f] hover:text-white transition-all translate-y-0 md:translate-y-4 group-hover:translate-y-0 duration-300 shadow-xl font-bebas disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center border border-white/20 uppercase"
          >
            {hasVariants ? "SELECT SIZE" : "QUICK ADD"}
          </button>
        </div>
        {/* Compact Variant Selection Overlay inside the card */}
        {showVariants && (
          <div
            className="absolute inset-0 z-50 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300 flex flex-col justify-end p-3 pb-4"
            onClick={(e) => { e.stopPropagation(); setShowVariants(false); }}
          >
            <div
              className="bg-white dark:bg-zinc-900 w-full rounded-[1.5rem] p-4 shadow-2xl relative animate-in slide-in-from-bottom-4 duration-300 border border-white/10"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="font-bebas text-lg tracking-wider text-zinc-900 dark:text-white uppercase">Select Size</span>
                <button
                  onClick={(e) => { e.stopPropagation(); setShowVariants(false); }}
                  className="h-7 w-7 flex items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="grid grid-cols-5 gap-2 mb-4">
                {product.variants?.map((v, i) => {
                  const isSelected = selectedVariant?.size === v.size;
                  const isOutOfStock = v.stockQuantity === 0;

                  return (
                    <button
                      key={i}
                      disabled={isOutOfStock}
                      onClick={(e) => { e.stopPropagation(); setSelectedVariant(v); }}
                      className={`flex items-center justify-center h-10 rounded-xl border-2 transition-all duration-200 ${isSelected
                          ? "border-blue-600 bg-blue-600 text-white shadow-md scale-105"
                          : "border-zinc-200 dark:border-zinc-800 bg-transparent text-zinc-900 dark:text-zinc-100 hover:border-zinc-400"
                        } ${isOutOfStock ? "opacity-30 cursor-not-allowed" : "cursor-pointer"}`}
                    >
                      <span className="text-sm font-black font-bebas tracking-widest">{v.size}</span>
                    </button>
                  );
                })}
              </div>

              <button
                onClick={(e) => { e.stopPropagation(); handleAddToCart(e); }}
                disabled={!selectedVariant}
                className="w-full bg-[#0a192f] dark:bg-white dark:text-zinc-900 text-white font-black text-sm py-3.5 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-lg active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed font-bebas tracking-[0.1em] uppercase flex items-center justify-center gap-2"
              >
                <ShoppingBag className="h-4 w-4" /> Add to Bag
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="px-2 py-2">
        <h3 className="font-black text-sm md:text-lg mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors uppercase tracking-wider font-bebas leading-tight">
          {product.name}
        </h3>
        <div className="flex items-center justify-between pt-1">
          <p className="text-zinc-500 dark:text-zinc-400 text-[9px] md:text-xs font-bold uppercase tracking-[0.2em]">{product.category}</p>
          <p className="font-black text-base md:text-xl text-blue-600 font-outfit">
            {settings.currencySymbol}{product.sellingPrice}
          </p>
        </div>
      </div>
    </div>
  );
}

