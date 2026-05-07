"use client";

import { useState } from "react";
import { Loader2, Search, Trash2, Plus, ScanLine, Filter, Package, User, CheckCircle2, ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";

type Product = {
  _id: string;
  name: string;
  category: string;
  stockQuantity: number;
  sellingPrice: number;
  imageUrl?: string;
};

type CartItem = Product & {
  cartQuantity: number;
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

  const categories = ["All", ...Array.from(new Set(products.map(p => p.category)))];

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === "All" || p.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item._id === product._id);
      if (existing) {
        if (existing.cartQuantity >= product.stockQuantity) return prev;
        return prev.map(item => 
          item._id === product._id 
            ? { ...item, cartQuantity: item.cartQuantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, cartQuantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item._id !== productId));
  };

  const updateCartItemPrice = (productId: string, newPrice: number) => {
    setCart(prev => prev.map(item => 
      item._id === productId 
        ? { ...item, sellingPrice: newPrice }
        : item
    ));
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.sellingPrice * item.cartQuantity), 0);
  const tax = 0; // Keeping simple for now
  const discount = 0;
  const finalTotal = subtotal + tax - discount;

  const handleCompleteOrder = async () => {
    if (cart.length === 0) return;

    setLoading(true);
    setSuccessMessage("");

    try {
      // Process each item in the cart sequentially (in a real app, use a bulk API endpoint)
      for (const item of cart) {
        const res = await fetch("/api/sales", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            productId: item._id,
            quantitySold: item.cartQuantity,
            sellingPrice: item.sellingPrice, // Default price
          }),
        });

        if (!res.ok) {
          throw new Error(`Failed to log sale for ${item.name}`);
        }
      }

      setSuccessMessage("Order completed successfully!");
      
      // Update local stock
      setProducts(prev => 
        prev.map(p => {
          const cartItem = cart.find(item => item._id === p._id);
          if (cartItem) {
            return { ...p, stockQuantity: p.stockQuantity - cartItem.cartQuantity };
          }
          return p;
        }).filter(p => p.stockQuantity > 0)
      );
      
      setCart([]);
      router.refresh();
      
      setTimeout(() => setSuccessMessage(""), 3000);
      
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <div className="flex h-full gap-6 relative">
      
      {/* LEFT PANEL: Product Selection */}
      <div className={`flex-1 flex flex-col bg-white dark:bg-[#18181b] rounded-2xl border border-zinc-200 dark:border-zinc-800/50 shadow-sm overflow-hidden ${isCartOpen ? "hidden md:flex" : "flex"}`}>
        
        <div className="p-4 border-b border-zinc-200 dark:border-zinc-800/50">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-black text-zinc-900 dark:text-zinc-100 font-bebas tracking-wide">PRODUCT QUICK SEARCH</h2>
          </div>
          
          <div className="flex gap-3 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex h-9 w-full rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900/50 pl-10 pr-4 text-xs text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-blue-600/50 focus:ring-1 focus:ring-blue-600/50 transition-all"
              />
            </div>
            <button className="h-10 w-10 flex items-center justify-center rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900/50 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
              <ScanLine className="h-5 w-5" />
            </button>
            <button className="h-10 w-10 flex items-center justify-center rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900/50 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
              <Filter className="h-5 w-5" />
            </button>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`whitespace-nowrap px-3 py-1 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-wider transition-colors border ${
                  activeCategory === cat 
                    ? "bg-blue-600 text-white border-blue-600" 
                    : "bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
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
                className="bg-zinc-50 dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800/50 overflow-hidden flex flex-col hover:border-blue-600 transition-colors group"
              >
                {/* Product Image */}
                <div className="h-24 md:h-32 bg-zinc-100 dark:bg-zinc-800/50 flex flex-col items-center justify-center text-zinc-400 dark:text-zinc-600 group-hover:bg-zinc-200 dark:group-hover:bg-zinc-800 transition-colors relative overflow-hidden">
                  {product.imageUrl ? (
                    <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  ) : (
                    <>
                      <Package className="h-6 w-6 md:h-8 md:w-8 mb-2 opacity-50" />
                      <span className="text-[10px] uppercase font-bold tracking-wider">{product.category}</span>
                    </>
                  )}
                </div>
                
                <div className="p-3 flex-1 flex flex-col">
                  <h3 className="text-xs font-bold text-zinc-900 dark:text-zinc-200 line-clamp-2 leading-tight mb-2 uppercase tracking-tight">
                    {product.name}
                  </h3>
                  
                  <div className="mt-auto flex items-end justify-between">
                    <span className="font-bold text-zinc-900 dark:text-zinc-100">
                      ৳{product.sellingPrice}
                    </span>
                    <button 
                      onClick={() => addToCart(product)}
                      disabled={(cart.find(c => c._id === product._id)?.cartQuantity || 0) >= product.stockQuantity}
                      className="h-7 w-7 rounded-lg bg-blue-600 flex items-center justify-center text-white hover:bg-blue-700 active:scale-95 transition-all disabled:opacity-50 disabled:bg-zinc-300 dark:disabled:bg-zinc-700 disabled:cursor-not-allowed"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT PANEL: Cart & Checkout */}
      <div className={`md:w-[400px] md:flex-none flex flex-col gap-4 ${isCartOpen ? "absolute inset-0 z-40 bg-zinc-100 dark:bg-[#0a0a0a] flex" : "hidden md:flex"}`}>
        
        {isCartOpen && (
          <div className="flex items-center justify-between p-4 bg-white dark:bg-[#18181b] border-b border-zinc-200 dark:border-zinc-800/50 md:hidden">
            <h2 className="text-base font-black text-zinc-900 dark:text-zinc-100 font-bebas tracking-wide">CURRENT ORDER</h2>
            <button 
              onClick={() => setIsCartOpen(false)}
              className="px-4 py-2 text-sm font-medium text-zinc-600 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
            >
              Back to Products
            </button>
          </div>
        )}

        {successMessage && (
          <div className="bg-blue-600/10 border border-blue-600/20 text-blue-600 dark:text-blue-400 p-3 rounded-2xl flex items-center gap-3 mx-4 md:mx-0">
            <CheckCircle2 className="h-4 w-4" />
            <span className="text-sm font-bold uppercase tracking-tight">{successMessage}</span>
          </div>
        )}

        <div className="bg-white dark:bg-[#18181b] md:rounded-2xl border-y md:border border-zinc-200 dark:border-zinc-800/50 flex flex-col flex-1 overflow-hidden">
          <div className="p-4 border-b border-zinc-200 dark:border-zinc-800/50 hidden md:block">
            <h2 className="text-base font-black text-zinc-900 dark:text-zinc-100 font-bebas tracking-wide">CURRENT ORDER (CART)</h2>
            <p className="text-[10px] text-zinc-500 mt-1 uppercase font-bold tracking-widest opacity-60">Process transactions</p>
          </div>

          {/* Cart Table Header */}
          <div className="grid grid-cols-12 gap-2 px-5 py-3 border-b border-zinc-200 dark:border-zinc-800/50 text-xs font-semibold text-zinc-500 uppercase bg-zinc-50/50 dark:bg-transparent">
            <div className="col-span-5">Item</div>
            <div className="col-span-2 text-center">Qty</div>
            <div className="col-span-2 text-right">Unit</div>
            <div className="col-span-2 text-right">Total</div>
            <div className="col-span-1"></div>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-zinc-400 dark:text-zinc-600">
                <ShoppingCart className="h-12 w-12 mb-3 opacity-20" />
                <p className="text-sm">Cart is empty</p>
              </div>
            ) : (
              <div className="p-2">
                {cart.map(item => (
                  <div key={item._id} className="grid grid-cols-12 gap-2 px-3 py-3 items-center hover:bg-zinc-50 dark:hover:bg-zinc-900/50 rounded-lg group transition-colors">
                    <div className="col-span-5">
                      <p className="text-sm font-medium text-zinc-900 dark:text-zinc-200 line-clamp-2 leading-tight">{item.name}</p>
                    </div>
                    <div className="col-span-2 text-center text-sm font-medium text-zinc-600 dark:text-zinc-400">
                      x {item.cartQuantity}
                    </div>
                    <div className="col-span-2 text-right">
                      <div className="flex items-center justify-end">
                        <span className="text-zinc-500 mr-1 hidden sm:inline">৳</span>
                        <input
                          type="number"
                          min="0"
                          value={item.sellingPrice === 0 ? "" : item.sellingPrice}
                          onChange={(e) => updateCartItemPrice(item._id, Number(e.target.value) || 0)}
                          className="w-12 sm:w-16 text-right bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded text-sm text-zinc-900 dark:text-zinc-200 focus:outline-none focus:border-emerald-500/50 py-0.5 px-1 hide-arrows"
                        />
                      </div>
                    </div>
                    <div className="col-span-2 text-right text-sm font-bold text-zinc-900 dark:text-zinc-200">
                      ৳{item.sellingPrice * item.cartQuantity}
                    </div>
                    <div className="col-span-1 flex justify-end">
                      <button 
                        onClick={() => removeFromCart(item._id)}
                        className="text-zinc-400 hover:text-red-500 dark:text-zinc-600 dark:hover:text-red-400 md:opacity-0 md:group-hover:opacity-100 transition-all"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Cart Summary */}
          <div className="p-5 border-t border-zinc-200 dark:border-zinc-800/50 bg-zinc-50 dark:bg-[#1e1e22]/30 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-zinc-500 dark:text-zinc-400">Subtotal</span>
              <span className="font-semibold text-zinc-900 dark:text-zinc-200">৳{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-zinc-500 dark:text-zinc-400">Tax</span>
              <span className="font-semibold text-zinc-900 dark:text-zinc-200">৳{tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-zinc-500 dark:text-zinc-400">Discount</span>
              <span className="font-semibold text-zinc-900 dark:text-zinc-200">৳{discount.toFixed(2)}</span>
            </div>
            
            <button className="w-full mt-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-base shadow-lg shadow-blue-600/20 active:scale-[0.98] transition-all uppercase tracking-widest font-bebas">
              FINAL TOTAL (৳{finalTotal.toFixed(2)})
            </button>
          </div>
        </div>

        {/* Order Controls */}
        <div className="bg-white dark:bg-[#18181b] md:rounded-2xl border-y md:border border-zinc-200 dark:border-zinc-800/50 p-5 pb-8 md:pb-5">
          <h3 className="font-bold text-zinc-900 dark:text-zinc-100 mb-4">Order Controls & Payment</h3>
          
          <div className="space-y-4">
            <div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-2">Find or create customer</p>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 dark:text-zinc-500" />
                <input
                  type="text"
                  placeholder="Lookup by ID or Name"
                  className="flex h-10 w-full rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900/50 pl-10 pr-4 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-emerald-500/50 transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button className="py-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-sm font-medium">Cash</button>
              <button className="py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 text-sm font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800">Card</button>
              <button className="py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 text-sm font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800">QR Pay</button>
            </div>

            <button 
              onClick={handleCompleteOrder}
              disabled={loading || cart.length === 0}
              className="w-full py-3 rounded-xl bg-[#0a192f] hover:bg-blue-600 text-white font-black shadow-lg shadow-blue-600/20 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest font-bebas"
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin mx-auto" /> : "COMPLETE ORDER"}
            </button>
            
            <div className="grid grid-cols-2 gap-2">
              <button 
                onClick={() => setCart([])}
                className="py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-transparent text-zinc-600 dark:text-zinc-300 font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
              >
                Cancel Order
              </button>
              <button className="py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-300 font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
                Hold Order
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Mobile Cart Button */}
      {!isCartOpen && (
        <div className="md:hidden fixed bottom-6 left-6 right-6 z-30">
          <button 
            onClick={() => setIsCartOpen(true)}
            className="w-full py-3.5 rounded-xl bg-blue-600 text-white font-black text-base shadow-xl shadow-blue-600/30 active:scale-[0.98] transition-all flex items-center justify-between px-6 font-bebas tracking-widest"
          >
            <div className="flex items-center gap-2">
              <ShoppingCart className="h-4 w-4" />
              <span>VIEW CART ({cart.reduce((sum, item) => sum + item.cartQuantity, 0)})</span>
            </div>
            <span>৳{finalTotal.toFixed(2)}</span>
          </button>
        </div>
      )}
    </div>
  );
}
