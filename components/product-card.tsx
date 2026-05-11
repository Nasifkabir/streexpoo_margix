"use client";

import { ShoppingBag, X, Check } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";

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

  const handleIncrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (remainingStock > 0) {
      updateQuantity(product._id, quantityInCart + 1, cartItem?.size);
    }
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (quantityInCart > 1) {
      updateQuantity(product._id, quantityInCart - 1, cartItem?.size);
    } else {
      removeFromCart(product._id, cartItem?.size);
    }
  };

  return (
    <div className="group cursor-pointer font-outfit relative" onClick={() => hasVariants ? setShowVariants(true) : handleAddToCart()}>
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
        
        {product.stockQuantity === 0 ? (
          <div className="absolute top-6 right-6 bg-black text-white text-[10px] font-black px-4 py-2 rounded-full tracking-widest font-bebas">SOLD OUT</div>
        ) : (
          <div className="absolute top-6 right-6 bg-blue-600 text-white text-[10px] font-black px-4 py-2 rounded-full tracking-widest font-bebas">
            {product.stockQuantity} TOTAL
          </div>
        )}

        <div className="absolute inset-0 bg-black/20 opacity-100 md:opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-end justify-center pb-6 md:pb-8 px-4 md:px-8">
          <button 
            className="w-full bg-white/90 backdrop-blur-md md:bg-white text-zinc-900 font-black text-sm md:text-xl tracking-[0.3em] py-5 md:py-6 rounded-2xl hover:bg-[#0a192f] hover:text-white transition-all translate-y-0 md:translate-y-4 group-hover:translate-y-0 duration-300 shadow-xl font-bebas disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center border border-white/20 uppercase"
          >
            {hasVariants ? "SELECT SIZE" : "QUICK ADD"}
          </button>
        </div>
      </div>

      {/* Variant Selection Modal/Overlay */}
      {showVariants && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-md animate-in fade-in duration-500"
          onClick={(e) => { e.stopPropagation(); setShowVariants(false); }}
        >
          <div 
            className="bg-white/80 dark:bg-zinc-950/80 backdrop-blur-2xl w-full max-w-md rounded-[3.5rem] p-10 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.3)] relative animate-in zoom-in-95 slide-in-from-bottom-10 duration-500 border border-white/20"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setShowVariants(false)}
              className="absolute top-8 right-8 h-12 w-12 flex items-center justify-center rounded-full bg-white dark:bg-zinc-900 text-zinc-500 hover:text-zinc-900 shadow-xl transition-all hover:scale-110 active:scale-95"
            >
              <X className="h-6 w-6" />
            </button>

            <div className="mb-10">
              <span className="text-blue-600 font-black tracking-[0.3em] text-[10px] mb-2 block uppercase">Select Size</span>
              <h2 className="text-3xl font-black font-bebas tracking-wide uppercase leading-none">{product.name}</h2>
            </div>

            <div className="grid grid-cols-2 gap-4 max-h-[50vh] overflow-y-auto pr-2 scrollbar-hide pb-4">
              {product.variants?.map((v, i) => {
                const isSelected = selectedVariant?.size === v.size;
                const isOutOfStock = v.stockQuantity === 0;
                
                return (
                  <button
                    key={i}
                    disabled={isOutOfStock}
                    onClick={() => setSelectedVariant(v)}
                    className={`flex flex-col items-center justify-center p-8 rounded-[2.5rem] border-2 transition-all duration-300 relative overflow-hidden group/size ${
                      isSelected 
                        ? "border-blue-600 bg-white dark:bg-zinc-900 shadow-2xl shadow-blue-500/10 scale-[1.02]" 
                        : "border-zinc-100 dark:border-zinc-800 hover:border-zinc-200 dark:hover:border-zinc-700 bg-white/50 dark:bg-zinc-900/50"
                    } ${isOutOfStock ? "opacity-30 grayscale cursor-not-allowed" : "cursor-pointer"}`}
                  >
                    <span className={`text-3xl font-black font-bebas tracking-widest transition-colors ${isSelected ? "text-blue-600" : "text-zinc-900 dark:text-zinc-100"}`}>
                      {v.size}
                    </span>
                    <span className="text-[10px] font-black text-zinc-400 uppercase tracking-tighter mt-2">
                      {isOutOfStock ? "Sold Out" : `${v.stockQuantity} Left`}
                    </span>
                    
                    {isSelected && (
                      <div className="absolute top-0 right-0 p-3">
                        <div className="h-6 w-6 rounded-full bg-blue-600 flex items-center justify-center text-white scale-110 shadow-lg">
                          <Check className="h-3 w-3" strokeWidth={4} />
                        </div>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => handleAddToCart()}
              disabled={!selectedVariant}
              className="w-full mt-6 bg-[#0a192f] dark:bg-white dark:text-zinc-900 text-white font-black text-xl py-6 rounded-[2rem] hover:bg-blue-600 hover:text-white transition-all shadow-2xl hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed font-bebas tracking-[0.2em] uppercase"
            >
              Confirm & Add to Bag
            </button>
          </div>
        </div>
      )}

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

