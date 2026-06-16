/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import { useRouter } from "next/navigation";
import { ShoppingBag, CreditCard, ChevronRight, Shield, Truck, RefreshCw, Sparkles, Check } from "lucide-react";

interface Variant {
  size: string;
  stockQuantity: number;
}

interface Product {
  _id: string;
  name: string;
  category: string;
  description?: string;
  stockQuantity: number;
  sellingPrice: number;
  imageUrl?: string;
  variants?: Variant[];
}

interface Settings {
  currencySymbol: string;
}

export function ProductDetailInteractive({ product, settings }: { product: Product; settings: Settings }) {
  const { addToCart, cart } = useCart();
  const { showToast } = useToast();
  const router = useRouter();

  const hasVariants = product.variants && product.variants.length > 0;
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(
    hasVariants && product.variants ? product.variants[0] : null
  );
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"details" | "sizing" | "shipping">("details");

  const cartItem = cart.find(
    (item) =>
      item._id === product._id &&
      (!hasVariants || item.size === selectedVariant?.size)
  );

  const quantityInCart = cartItem?.quantity || 0;
  const totalStockForSelected = hasVariants
    ? (selectedVariant?.stockQuantity || 0)
    : product.stockQuantity;

  const remainingStock = totalStockForSelected - quantityInCart;

  const handleAddToBag = () => {
    if (hasVariants && !selectedVariant) {
      showToast("Please select a size first");
      return;
    }

    if (quantity > remainingStock) {
      showToast(`Cannot add ${quantity} items. Only ${remainingStock} left in stock.`);
      return;
    }

    addToCart({
      _id: product._id,
      name: product.name,
      sellingPrice: product.sellingPrice,
      imageUrl: product.imageUrl,
      stockQuantity: totalStockForSelected,
      size: selectedVariant?.size,
    }, quantity);

    showToast(`${product.name}${selectedVariant ? ` (${selectedVariant.size})` : ""} added to bag`);
  };

  const handleBuyNow = () => {
    if (hasVariants && !selectedVariant) {
      showToast("Please select a size first");
      return;
    }

    if (remainingStock <= 0) {
      showToast("Product is out of stock");
      return;
    }

    // Add to cart (default 1 or selected quantity)
    addToCart({
      _id: product._id,
      name: product.name,
      sellingPrice: product.sellingPrice,
      imageUrl: product.imageUrl,
      stockQuantity: totalStockForSelected,
      size: selectedVariant?.size,
    }, quantity);

    // Redirect to checkout
    router.push("/checkout");
  };

  // Dynamic specifications based on product category for premium presentation
  const getDynamicSpecs = (category: string) => {
    const cat = category.toUpperCase();
    if (cat.includes("T-SHIRT") || cat.includes("TEE")) {
      return {
        material: "100% Heavyweight Premium Cotton (240 GSM)",
        fit: "Relaxed boxy silhouette, dropped shoulders",
        features: ["Premium high-density puff print", "Pre-shrunk fabric to prevent shrinkage", "Double-needle stitched neckband and hems"],
        care: "Machine wash cold with like colors. Line dry inside out."
      };
    } else if (cat.includes("SHIRT")) {
      return {
        material: "Premium Linen-Cotton Blend",
        fit: "Modern relaxed fit, casual camp collar",
        features: ["Ultra-breathable lightweight weave", "Genuine coconut shell buttons", "Curved hemline, ideal for untucked styling"],
        care: "Dry clean recommended or gentle hand wash cold."
      };
    } else if (cat.includes("PANT") || cat.includes("JEANS") || cat.includes("DENIM")) {
      return {
        material: "13.5oz Rigid Selvedge Denim",
        fit: "Straight leg, classic mid-rise styling",
        features: ["Custom engraved metal hardware", "Reinforced stress points with rivets", "Signature leather patch on waistband"],
        care: "Wash minimally. Cold wash inside out, air dry."
      };
    } else {
      return {
        material: "Ethically Sourced Premium Fabric Blend",
        fit: "Tailored contemporary fit",
        features: ["Crafted with high-durability stitching", "Breathable weave for year-round comfort", "Refined minimalist branding details"],
        care: "Follow wash-label instructions. Gentle cold cycle."
      };
    }
  };

  const specs = getDynamicSpecs(product.category);

  return (
    <div className="grid lg:grid-cols-12 gap-8 lg:gap-16 items-start">
      {/* Left: Product Images */}
      <div className="lg:col-span-7 space-y-6">
        <div className="aspect-[3/4] w-full rounded-[2.5rem] overflow-hidden bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 shadow-md relative group">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-1000"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-zinc-300 dark:text-zinc-700 font-black text-6xl uppercase font-bebas">
              {product.category}
            </div>
          )}
          
          <div className="absolute top-6 left-6 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md px-5 py-2.5 rounded-full border border-white/20 shadow-lg flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-yellow-500 animate-pulse" />
            <span className="text-[10px] md:text-xs font-black tracking-widest uppercase text-zinc-800 dark:text-white font-bebas">PREMIUM EDITION</span>
          </div>
        </div>
      </div>

      {/* Right: Product Info & Actions */}
      <div className="lg:col-span-5 space-y-8">
        <div>
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-[10px] md:text-xs font-bold text-zinc-400 uppercase tracking-widest mb-4">
            <span>Home</span>
            <ChevronRight className="h-3 w-3" />
            <span>{product.category}</span>
            <ChevronRight className="h-3 w-3" />
            <span className="text-zinc-800 dark:text-zinc-200 truncate max-w-[120px]">{product.name}</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-black font-bebas tracking-wide uppercase text-zinc-900 dark:text-white leading-none mb-3">
            {product.name}
          </h1>

          <div className="flex items-baseline gap-4 mt-2">
            <span className="text-3xl font-black text-blue-600 font-outfit">
              {settings.currencySymbol}{product.sellingPrice}
            </span>
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
              Delivery Charge Free
            </span>
          </div>
        </div>

        {/* Size Selection */}
        {hasVariants && product.variants && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-xs font-black text-zinc-400 uppercase tracking-widest">Select Size</span>
              {selectedVariant && (
                <span className={`text-xs font-bold uppercase tracking-wider ${
                  selectedVariant.stockQuantity > 0 ? "text-emerald-600" : "text-red-500"
                }`}>
                  {selectedVariant.stockQuantity > 0 
                    ? `In Stock: ${selectedVariant.stockQuantity} Left` 
                    : "Out of Stock"
                  }
                </span>
              )}
            </div>

            <div className="grid grid-cols-5 gap-3">
              {product.variants.map((v, i) => {
                const isSelected = selectedVariant?.size === v.size;
                const isOutOfStock = v.stockQuantity === 0;

                return (
                  <button
                    key={i}
                    disabled={isOutOfStock}
                    onClick={() => {
                      setSelectedVariant(v);
                      setQuantity(1); // Reset quantity selector
                    }}
                    className={`flex flex-col items-center justify-center h-14 rounded-2xl border-2 transition-all duration-300 relative ${
                      isSelected
                        ? "border-blue-600 bg-blue-600/5 dark:bg-blue-600/10 text-blue-600 font-black shadow-md"
                        : "border-zinc-200 dark:border-zinc-800 bg-transparent text-zinc-700 dark:text-zinc-300 hover:border-zinc-400"
                    } ${isOutOfStock ? "opacity-30 cursor-not-allowed border-dashed" : "cursor-pointer"}`}
                  >
                    <span className="text-sm font-black font-bebas tracking-widest">{v.size}</span>
                    {isSelected && (
                      <span className="absolute bottom-1 right-1 h-3 w-3 rounded-full bg-blue-600 flex items-center justify-center text-white">
                        <Check className="h-2 w-2" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Quantity Selector */}
        {remainingStock > 0 && (
          <div className="space-y-3">
            <span className="text-xs font-black text-zinc-400 uppercase tracking-widest block">Quantity</span>
            <div className="flex items-center w-36 bg-zinc-50 dark:bg-zinc-900 border-2 border-zinc-100 dark:border-zinc-800 rounded-2xl p-1">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 flex items-center justify-center font-bold text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
              >
                -
              </button>
              <span className="flex-1 text-center font-bold font-outfit text-zinc-800 dark:text-zinc-200">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(Math.min(remainingStock, quantity + 1))}
                className="w-10 h-10 flex items-center justify-center font-bold text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
              >
                +
              </button>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-4 pt-4">
          {remainingStock <= 0 ? (
            <button
              disabled
              className="w-full h-16 bg-zinc-200 dark:bg-zinc-800 text-zinc-400 font-black rounded-2xl text-sm tracking-[0.2em] font-bebas uppercase flex items-center justify-center cursor-not-allowed"
            >
              Sold Out
            </button>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={handleAddToBag}
                className="h-16 border-2 border-zinc-900 dark:border-white text-zinc-900 dark:text-white font-black rounded-2xl text-xs tracking-[0.2em] hover:bg-zinc-900 hover:text-white dark:hover:bg-white dark:hover:text-zinc-900 transition-all active:scale-[0.98] font-bebas uppercase flex items-center justify-center gap-2.5 shadow-sm"
              >
                <ShoppingBag className="h-4 w-4" /> Add to Bag
              </button>
              <button
                onClick={handleBuyNow}
                className="h-16 bg-[#0a192f] text-white hover:bg-blue-600 font-black rounded-2xl text-xs tracking-[0.2em] transition-all active:scale-[0.98] font-bebas uppercase flex items-center justify-center gap-2.5 shadow-lg shadow-blue-900/10"
              >
                <CreditCard className="h-4 w-4" /> Buy It Now
              </button>
            </div>
          )}
        </div>

        {/* Features / Info Badges */}
        <div className="grid grid-cols-3 gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-800">
          <div className="flex flex-col items-center text-center p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-900">
            <Truck className="h-5 w-5 text-blue-600 mb-1" />
            <span className="text-[9px] font-black text-zinc-800 dark:text-zinc-300 uppercase tracking-wider">Free Delivery</span>
          </div>
          <div className="flex flex-col items-center text-center p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-900">
            <RefreshCw className="h-5 w-5 text-emerald-600 mb-1" />
            <span className="text-[9px] font-black text-zinc-800 dark:text-zinc-300 uppercase tracking-wider">Easy Return</span>
          </div>
          <div className="flex flex-col items-center text-center p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-900">
            <Shield className="h-5 w-5 text-purple-600 mb-1" />
            <span className="text-[9px] font-black text-zinc-800 dark:text-zinc-300 uppercase tracking-wider">Secure Pay</span>
          </div>
        </div>

        {/* Tabs for specs, sizing, shipping */}
        <div className="border border-zinc-100 dark:border-zinc-800 rounded-3xl overflow-hidden bg-white dark:bg-zinc-900/50">
          <div className="flex border-b border-zinc-100 dark:border-zinc-800 text-[10px] font-black uppercase tracking-widest font-bebas">
            <button
              onClick={() => setActiveTab("details")}
              className={`flex-1 py-4 text-center border-b-2 transition-all ${
                activeTab === "details"
                  ? "border-blue-600 text-blue-600 bg-zinc-50/50 dark:bg-zinc-900/50"
                  : "border-transparent text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
              }`}
            >
              Specifications
            </button>
            <button
              onClick={() => setActiveTab("sizing")}
              className={`flex-1 py-4 text-center border-b-2 transition-all ${
                activeTab === "sizing"
                  ? "border-blue-600 text-blue-600 bg-zinc-50/50 dark:bg-zinc-900/50"
                  : "border-transparent text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
              }`}
            >
              Sizing Guide
            </button>
            <button
              onClick={() => setActiveTab("shipping")}
              className={`flex-1 py-4 text-center border-b-2 transition-all ${
                activeTab === "shipping"
                  ? "border-blue-600 text-blue-600 bg-zinc-50/50 dark:bg-zinc-900/50"
                  : "border-transparent text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
              }`}
            >
              Shipping & COD
            </button>
          </div>

          <div className="p-6 text-sm font-medium leading-relaxed text-zinc-600 dark:text-zinc-400 font-outfit">
            {activeTab === "details" && (
              <div className="space-y-6">
                {product.description && (
                  <div className="text-zinc-800 dark:text-zinc-200 font-medium whitespace-pre-wrap leading-relaxed">
                    {product.description}
                  </div>
                )}
                <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 space-y-4">
                  <div>
                    <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest block mb-1">Material & Care</span>
                    <p className="text-zinc-800 dark:text-zinc-200 font-bold">{specs.material} — {specs.care}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest block mb-1">Fitting</span>
                    <p className="text-zinc-800 dark:text-zinc-200 font-bold">{specs.fit}</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "sizing" && (
              <div className="space-y-3">
                <p className="text-zinc-500 dark:text-zinc-400 font-bold text-xs uppercase mb-2">Standard Aesthetic Fit Chart (Inches):</p>
                <div className="grid grid-cols-4 gap-2 text-center text-xs font-bold border-b border-zinc-100 dark:border-zinc-800 pb-2">
                  <span className="text-left text-zinc-400 uppercase">Size</span>
                  <span className="text-zinc-800 dark:text-zinc-200">Chest</span>
                  <span className="text-zinc-800 dark:text-zinc-200">Length</span>
                  <span className="text-zinc-800 dark:text-zinc-200">Sleeve</span>
                </div>
                {[
                  { size: "S", chest: "38-40", length: "27", sleeve: "8" },
                  { size: "M", chest: "40-42", length: "28", sleeve: "8.5" },
                  { size: "L", chest: "42-44", length: "29", sleeve: "9" },
                  { size: "XL", chest: "44-46", length: "30", sleeve: "9.5" },
                  { size: "XXL", chest: "46-48", length: "31", sleeve: "10" }
                ].map((row, i) => (
                  <div key={i} className="grid grid-cols-4 gap-2 text-center text-xs font-semibold py-1">
                    <span className="text-left font-black text-zinc-800 dark:text-white">{row.size}</span>
                    <span>{row.chest}</span>
                    <span>{row.length}</span>
                    <span>{row.sleeve}</span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "shipping" && (
              <div className="space-y-4">
                <div>
                  <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest block mb-1">Buy Now Pay Later (COD)</span>
                  <p className="text-zinc-800 dark:text-zinc-200 font-bold">
                    We offer Cash on Delivery all over Bangladesh. Confirm your order now without upfront payments; our agent will call you shortly to confirm.
                  </p>
                </div>
                <div>
                  <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest block mb-1">Delivery Time</span>
                  <p className="text-zinc-800 dark:text-zinc-200 font-bold">
                    Inside Dhaka: 24-48 Hours. Outside Dhaka: 3-5 Working Days.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
