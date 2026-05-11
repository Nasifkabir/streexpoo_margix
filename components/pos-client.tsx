"use client";

import { useState } from "react";
import { Loader2, Search, Trash2, Plus, ScanLine, Package, CheckCircle2, ShoppingCart, X, Check } from "lucide-react";
import { useRouter } from "next/navigation";

type Variant = {
  size: string;
  stockQuantity: number;
};

type Product = {
  _id: string;
  name: string;
  category: string;
  stockQuantity: number;
  sellingPrice: number;
  imageUrl?: string;
  variants?: Variant[];
};

type CartItem = Product & {
  cartQuantity: number;
  selectedSize?: string;
};

type POSClientProps = {
  products: Product[];
};

export default function POSClient({ products: initialProducts }: POSClientProps) {
  const router = useRouter();
  const [products, setProducts] = useState(initialProducts);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const [selectionProduct, setSelectionProduct] = useState<Product | null>(null);

  const categories = ["All", ...Array.from(new Set(products.map(p => p.category)))];

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === "All" || p.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const addToCart = (product: Product, variant?: Variant) => {
    setCart(prev => {
      const existing = prev.find(item => 
        item._id === product._id && 
        item.selectedSize === variant?.size
      );

      const maxStock = variant ? variant.stockQuantity : product.stockQuantity;

      if (existing) {
        if (existing.cartQuantity >= maxStock) return prev;
        return prev.map(item => 
          (item._id === product._id && item.selectedSize === variant?.size)
            ? { ...item, cartQuantity: item.cartQuantity + 1 }
            : item
        );
      }
      return [...prev, { 
        ...product, 
        cartQuantity: 1, 
        selectedSize: variant?.size, 
        stockQuantity: maxStock // Track the specific variant stock in cart
      }];
    });
    setSelectionProduct(null);
  };

  const removeFromCart = (productId: string, size?: string) => {
    setCart(prev => prev.filter(item => 
      !(item._id === productId && item.selectedSize === size)
    ));
  };

  const updateCartItemPrice = (productId: string, newPrice: number, size?: string) => {
    setCart(prev => prev.map(item => 
      (item._id === productId && item.selectedSize === size)
        ? { ...item, sellingPrice: newPrice }
        : item
    ));
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.sellingPrice * item.cartQuantity), 0);
  const tax = 0;
  const discount = 0;
  const finalTotal = subtotal + tax - discount;

  const handleCompleteOrder = async () => {
    if (cart.length === 0) return;

    setLoading(true);
    setSuccessMessage("");

    try {
      for (const item of cart) {
        const res = await fetch("/api/sales", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            productId: item._id,
            quantitySold: item.cartQuantity,
            sellingPrice: item.sellingPrice,
            variant: item.selectedSize ? {
              size: item.selectedSize,
            } : undefined
          }),
        });

        if (!res.ok) {
          throw new Error(`Failed to log sale for ${item.name}`);
        }
      }

      setSuccessMessage("Order completed successfully!");
      
      // Local stock update is complex with variants, so we refresh from server
      setCart([]);
      router.refresh();
      
      setTimeout(() => setSuccessMessage(""), 3000);
      
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An unknown error occurred";
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <div className="flex h-full gap-6 relative font-outfit">
      
      {/* Variant Selection Modal */}
      {selectionProduct && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-zinc-950 w-full max-w-lg rounded-[2rem] p-8 shadow-2xl relative">
            <button 
              onClick={() => setSelectionProduct(null)}
              className="absolute top-6 right-6 h-10 w-10 flex items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-900 text-zinc-500 hover:text-zinc-900 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            <h2 className="text-2xl font-black font-bebas tracking-wide uppercase mb-2">{selectionProduct.name}</h2>
            <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-8">Select size for POS</p>

            <div className="grid grid-cols-2 gap-4 max-h-[50vh] overflow-y-auto pr-2 scrollbar-hide">
              {selectionProduct.variants?.map((v, i) => (
                <button
                  key={i}
                  disabled={v.stockQuantity === 0}
                  onClick={() => addToCart(selectionProduct, v)}
                  className="flex flex-col items-center justify-center p-6 rounded-[2rem] border-2 border-zinc-100 dark:border-zinc-800 hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all disabled:opacity-50 disabled:grayscale"
                >
                  <span className="text-2xl font-black uppercase tracking-widest text-zinc-900 dark:text-zinc-100">{v.size}</span>
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-tighter mt-1">{v.stockQuantity} Left</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* LEFT PANEL: Product Selection */}
      <div className={`flex-1 flex flex-col bg-white dark:bg-[#18181b] rounded-2xl border border-zinc-200 dark:border-zinc-800/50 shadow-sm overflow-hidden ${isCartOpen ? "hidden md:flex" : "flex"}`}>
        
        <div className="p-4 border-b border-zinc-200 dark:border-zinc-800/50">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-black text-zinc-900 dark:text-zinc-100 font-bebas tracking-wide uppercase">Inventory Search</h2>
          </div>
          
          <div className="flex gap-3 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex h-10 w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900/50 pl-10 pr-4 text-xs text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-blue-600/50 transition-all"
              />
            </div>
            <button className="h-10 w-10 flex items-center justify-center rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900/50 text-zinc-500 hover:text-blue-600 transition-colors">
              <ScanLine className="h-5 w-5" />
            </button>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`whitespace-nowrap px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border ${
                  activeCategory === cat 
                    ? "bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-600/20" 
                    : "bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:border-zinc-300"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-5 pb-24 md:pb-5">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredProducts.map(product => (
              <div 
                key={product._id}
                onClick={() => product.variants && product.variants.length > 0 ? setSelectionProduct(product) : addToCart(product)}
                className="bg-zinc-50 dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800/50 overflow-hidden flex flex-col hover:border-blue-600 cursor-pointer transition-all active:scale-95 group shadow-sm"
              >
                <div className="h-28 md:h-36 bg-zinc-100 dark:bg-zinc-800/50 flex flex-col items-center justify-center relative overflow-hidden">
                  {product.imageUrl ? (
                    <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  ) : (
                    <Package className="h-8 w-8 text-zinc-300 dark:text-zinc-700" />
                  )}
                  {product.variants && product.variants.length > 0 && (
                    <div className="absolute top-2 right-2 bg-blue-600 text-white text-[8px] font-black px-2 py-1 rounded-md uppercase tracking-tighter shadow-lg">Variants</div>
                  )}
                </div>
                
                <div className="p-3 flex-1 flex flex-col">
                  <h3 className="text-[10px] font-black text-zinc-900 dark:text-zinc-200 line-clamp-2 leading-tight mb-2 uppercase tracking-tight">
                    {product.name}
                  </h3>
                  
                  <div className="mt-auto flex items-end justify-between">
                    <span className="font-black text-sm text-zinc-900 dark:text-zinc-100">
                      ৳{product.sellingPrice}
                    </span>
                    <div className="h-6 w-6 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500 group-hover:bg-blue-600 group-hover:text-white transition-all">
                      <Plus className="h-3 w-3" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT PANEL: Cart & Checkout */}
      <div className={`md:w-[450px] md:flex-none flex flex-col gap-4 ${isCartOpen ? "absolute inset-0 z-40 bg-zinc-100 dark:bg-[#0a0a0a] flex" : "hidden md:flex"}`}>
        
        {isCartOpen && (
          <div className="flex items-center justify-between p-4 bg-white dark:bg-[#18181b] border-b border-zinc-200 dark:border-zinc-800/50 md:hidden">
            <h2 className="text-base font-black text-zinc-900 dark:text-zinc-100 font-bebas tracking-wide uppercase">Checkout</h2>
            <button 
              onClick={() => setIsCartOpen(false)}
              className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-zinc-600 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 rounded-lg"
            >
              Back
            </button>
          </div>
        )}

        {successMessage && (
          <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 p-4 rounded-2xl flex items-center gap-3 mx-4 md:mx-0 shadow-sm animate-in slide-in-from-top duration-300">
            <CheckCircle2 className="h-5 w-5" />
            <span className="text-sm font-black uppercase tracking-tight">{successMessage}</span>
          </div>
        )}

        <div className="bg-white dark:bg-[#18181b] md:rounded-[2rem] border-y md:border border-zinc-200 dark:border-zinc-800/50 flex flex-col flex-1 overflow-hidden shadow-2xl">
          <div className="p-6 border-b border-zinc-200 dark:border-zinc-800/50 hidden md:block">
            <h2 className="text-xl font-black text-zinc-900 dark:text-zinc-100 font-bebas tracking-wide uppercase">Current Order</h2>
          </div>

          <div className="grid grid-cols-12 gap-2 px-6 py-3 border-b border-zinc-200 dark:border-zinc-800/50 text-[10px] font-black uppercase tracking-widest text-zinc-400 bg-zinc-50/30">
            <div className="col-span-5">Item Details</div>
            <div className="col-span-2 text-center">Qty</div>
            <div className="col-span-2 text-right">Price</div>
            <div className="col-span-2 text-right">Total</div>
            <div className="col-span-1"></div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-zinc-400 dark:text-zinc-600 opacity-30 p-10 text-center">
                <ShoppingCart className="h-16 w-16 mb-4" />
                <p className="text-sm font-black uppercase tracking-widest font-bebas">No items in cart</p>
              </div>
            ) : (
              <div className="p-3">
                {cart.map((item, idx) => (
                  <div key={`${item._id}-${idx}`} className="grid grid-cols-12 gap-2 px-3 py-4 items-center hover:bg-zinc-50 dark:hover:bg-zinc-900/50 rounded-2xl group transition-all">
                    <div className="col-span-5">
                      <p className="text-xs font-black text-zinc-900 dark:text-zinc-200 leading-tight uppercase">{item.name}</p>
                      {item.selectedSize && (
                        <p className="text-[9px] font-bold text-blue-600 uppercase mt-1">
                          Size: {item.selectedSize}
                        </p>
                      )}
                    </div>
                    <div className="col-span-2 text-center">
                      <span className="text-xs font-black text-zinc-500">x{item.cartQuantity}</span>
                    </div>
                    <div className="col-span-2 text-right">
                      <input
                        type="number"
                        value={item.sellingPrice}
                        onChange={(e) => updateCartItemPrice(item._id, Number(e.target.value), item.selectedSize)}
                        className="w-full text-right bg-transparent border-none p-0 text-xs font-black text-zinc-900 dark:text-zinc-100 focus:ring-0"
                      />
                    </div>
                    <div className="col-span-2 text-right text-xs font-black text-zinc-900 dark:text-zinc-100">
                      ৳{item.sellingPrice * item.cartQuantity}
                    </div>
                    <div className="col-span-1 flex justify-end">
                      <button 
                        onClick={() => removeFromCart(item._id, item.selectedSize)}
                        className="text-zinc-300 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="p-6 border-t border-zinc-200 dark:border-zinc-800/50 bg-zinc-50/50 dark:bg-transparent space-y-3">
            <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
              <span className="text-zinc-500">Subtotal</span>
              <span className="text-zinc-900 dark:text-zinc-100">৳{subtotal.toFixed(2)}</span>
            </div>
            
            <button className="w-full mt-2 py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-lg shadow-xl shadow-blue-600/20 transition-all uppercase tracking-widest font-bebas">
              Final Total: ৳{finalTotal.toFixed(2)}
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-[#18181b] md:rounded-[2rem] border-y md:border border-zinc-200 dark:border-zinc-800/50 p-6 pb-10 md:pb-6 shadow-xl">
          <div className="space-y-4">
            <button 
              onClick={handleCompleteOrder}
              disabled={loading || cart.length === 0}
              className="w-full py-4 rounded-2xl bg-[#0a192f] hover:bg-emerald-600 text-white font-black text-lg shadow-xl active:scale-[0.98] transition-all disabled:opacity-50 disabled:grayscale uppercase tracking-widest font-bebas"
            >
              {loading ? <Loader2 className="h-6 w-6 animate-spin mx-auto" /> : "COMPLETE TRANSACTION"}
            </button>
            
            <button 
              onClick={() => setCart([])}
              className="w-full py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-all"
            >
              Cancel Order
            </button>
          </div>
        </div>
      </div>

      {/* Floating Mobile Cart Button */}
      {!isCartOpen && cart.length > 0 && (
        <div className="md:hidden fixed bottom-6 left-6 right-6 z-30">
          <button 
            onClick={() => setIsCartOpen(true)}
            className="w-full py-4 rounded-2xl bg-blue-600 text-white font-black shadow-2xl flex items-center justify-between px-8 font-bebas tracking-widest uppercase"
          >
            <div className="flex items-center gap-3">
              <ShoppingCart className="h-5 w-5" />
              <span>Checkout ({cart.reduce((sum, item) => sum + item.cartQuantity, 0)})</span>
            </div>
            <span>৳{finalTotal.toFixed(2)}</span>
          </button>
        </div>
      )}
    </div>
  );
}

