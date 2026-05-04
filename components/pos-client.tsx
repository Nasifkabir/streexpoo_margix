"use client";

import { useState, useEffect } from "react";
import { Loader2, Search, CheckCircle2, ShoppingBag } from "lucide-react";
import { useRouter } from "next/navigation";

type Product = {
  _id: string;
  name: string;
  category: string;
  stockQuantity: number;
  sellingPrice: number;
};

type POSClientProps = {
  products: Product[];
};

export default function POSClient({ products: initialProducts }: POSClientProps) {
  const router = useRouter();
  const [products, setProducts] = useState(initialProducts);
  const [searchTerm, setSearchTerm] = useState("");
  
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [sellingPrice, setSellingPrice] = useState(0);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    setSellingPrice(product.sellingPrice);
    setQuantity(1);
    setError("");
    setSuccess("");
  };

  const handleLogSale = async () => {
    if (!selectedProduct) return;
    if (quantity < 1) {
      setError("Quantity must be at least 1");
      return;
    }
    if (quantity > selectedProduct.stockQuantity) {
      setError(`Only ${selectedProduct.stockQuantity} items left in stock`);
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/sales", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: selectedProduct._id,
          quantitySold: quantity,
          sellingPrice: sellingPrice,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to log sale");
      }

      setSuccess("Sale logged successfully!");
      
      // Update local stock to avoid full refresh, though router.refresh is better
      setProducts(prev => 
        prev.map(p => 
          p._id === selectedProduct._id 
            ? { ...p, stockQuantity: p.stockQuantity - quantity } 
            : p
        ).filter(p => p.stockQuantity > 0)
      );
      
      setSelectedProduct(null);
      setSearchTerm("");
      router.refresh();
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(""), 3000);
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid lg:grid-cols-3 gap-6 h-[calc(100vh-8rem)]">
      {/* Product Selection Column */}
      <div className="lg:col-span-2 flex flex-col bg-white dark:bg-zinc-950 rounded-2xl border border-zinc-200/50 dark:border-zinc-800/50 shadow-sm overflow-hidden backdrop-blur-xl">
        <div className="p-4 border-b border-zinc-100 dark:border-zinc-800/50">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400" />
            <input
              type="text"
              placeholder="Search products by name or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex h-12 w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 pl-10 pr-4 py-2 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:focus:ring-blue-400/50 focus:border-transparent transition-all"
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4">
          {filteredProducts.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-zinc-500 dark:text-zinc-400">
              <ShoppingBag className="h-12 w-12 mb-2 opacity-20" />
              <p>No products found in inventory.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
              {filteredProducts.map((product) => (
                <div
                  key={product._id}
                  onClick={() => handleSelectProduct(product)}
                  className={`relative p-4 rounded-xl border cursor-pointer transition-all hover:shadow-md ${
                    selectedProduct?._id === product._id
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-500/10 dark:border-blue-500"
                      : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 hover:border-blue-300 dark:hover:border-blue-700/50"
                  }`}
                >
                  <div className="mb-2">
                    <span className="text-xs font-semibold px-2 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
                      {product.category}
                    </span>
                  </div>
                  <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 leading-tight">
                    {product.name}
                  </h3>
                  <div className="mt-3 flex items-end justify-between">
                    <div>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">Price</p>
                      <p className="font-bold text-blue-600 dark:text-blue-400">৳{product.sellingPrice}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">Stock</p>
                      <p className="font-medium text-zinc-700 dark:text-zinc-300">{product.stockQuantity}</p>
                    </div>
                  </div>
                  {selectedProduct?._id === product._id && (
                    <div className="absolute -top-2 -right-2 bg-blue-600 rounded-full p-0.5 text-white shadow-sm">
                      <CheckCircle2 className="h-5 w-5" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Checkout/Cart Column */}
      <div className="flex flex-col bg-white dark:bg-zinc-950 rounded-2xl border border-zinc-200/50 dark:border-zinc-800/50 shadow-sm overflow-hidden backdrop-blur-xl">
        <div className="p-6 border-b border-zinc-100 dark:border-zinc-800/50 bg-zinc-50/50 dark:bg-zinc-900/30">
          <h2 className="text-xl font-bold tracking-tight">Current Sale</h2>
        </div>
        
        <div className="flex-1 p-6 overflow-y-auto">
          {error && (
            <div className="mb-4 rounded-lg bg-red-50 dark:bg-red-900/20 p-3 text-sm text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800/30">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 rounded-lg bg-green-50 dark:bg-green-900/20 p-3 text-sm text-green-600 dark:text-green-400 border border-green-200 dark:border-green-800/30 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              {success}
            </div>
          )}

          {!selectedProduct ? (
            <div className="h-full flex flex-col items-center justify-center text-zinc-400 dark:text-zinc-500 text-center">
              <ShoppingBag className="h-16 w-16 mb-4 opacity-20" />
              <p>Select a product from the inventory to start logging a sale.</p>
            </div>
          ) : (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div>
                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">{selectedProduct.name}</h3>
                <p className="text-sm text-zinc-500">{selectedProduct.category}</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Quantity
                  </label>
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 rounded-lg border border-zinc-200 dark:border-zinc-800 flex items-center justify-center bg-zinc-50 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min="1"
                      max={selectedProduct.stockQuantity}
                      value={quantity}
                      onChange={(e) => setQuantity(Number(e.target.value))}
                      className="flex-1 h-10 text-center font-bold text-lg rounded-lg border border-zinc-200 dark:border-zinc-800 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    />
                    <button 
                      onClick={() => setQuantity(Math.min(selectedProduct.stockQuantity, quantity + 1))}
                      className="w-10 h-10 rounded-lg border border-zinc-200 dark:border-zinc-800 flex items-center justify-center bg-zinc-50 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                    >
                      +
                    </button>
                  </div>
                  <p className="text-xs text-right text-zinc-500">Max available: {selectedProduct.stockQuantity}</p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Selling Price (৳)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={sellingPrice}
                    onChange={(e) => setSellingPrice(Number(e.target.value))}
                    className="flex w-full h-11 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 py-2 text-lg font-bold text-blue-600 dark:text-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  />
                  <p className="text-xs text-zinc-500">You can override the default price if giving a discount.</p>
                </div>
              </div>

              <div className="pt-6 border-t border-zinc-100 dark:border-zinc-800/50">
                <div className="flex items-center justify-between mb-6">
                  <span className="text-lg font-medium text-zinc-700 dark:text-zinc-300">Total</span>
                  <span className="text-3xl font-black text-zinc-900 dark:text-white">
                    ৳{(quantity * sellingPrice).toFixed(2)}
                  </span>
                </div>
                
                <button
                  onClick={handleLogSale}
                  disabled={loading}
                  className="w-full relative inline-flex h-14 items-center justify-center overflow-hidden rounded-xl bg-blue-600 px-6 font-bold text-white transition-all hover:scale-[1.02] hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] shadow-lg shadow-blue-500/25"
                >
                  {loading ? (
                    <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                  ) : (
                    "Complete Sale"
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
