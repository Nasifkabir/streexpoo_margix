"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useRouter as useNextRouter } from "next/navigation";
import { Loader2, ArrowRight, MapPin, Phone, User, ShoppingBag, Trash2 } from "lucide-react";
import Link from "next/link";
import { StorefrontHeader } from "@/components/storefront-header";

export default function CheckoutPage() {
  const { cart, cartTotal, removeFromCart, clearCart, cartCount } = useCart();
  const router = useNextRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: formData.name,
          customerPhone: formData.phone,
          customerEmail: formData.email,
          customerAddress: formData.address,
          items: cart.map(item => ({
            productId: item._id,
            name: item.name,
            quantity: item.quantity,
            price: item.sellingPrice,
            size: item.size,
          })),
          totalAmount: cartTotal,
        }),
      });

      if (!res.ok) throw new Error("Failed to place order");

      const order = await res.json();
      clearCart();
      router.push(`/order-success/${order.orderId}`);
    } catch (err) {
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 font-outfit">
      <div className="bg-white dark:bg-zinc-950 border-b border-zinc-100 dark:border-zinc-900 py-6 px-4 md:px-10 flex items-center justify-between">
        <Link href="/" className="font-bebas text-3xl tracking-wide text-zinc-900 dark:text-white uppercase">STREEXPO</Link>
        <Link href="/" className="text-xs font-black text-zinc-500 hover:text-blue-600 uppercase tracking-widest">Back to Store</Link>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 py-8 md:py-20 flex flex-col-reverse lg:grid lg:grid-cols-2 gap-12 md:gap-16">
        
        {/* Left: Checkout Form */}
        <div className="space-y-8 md:space-y-10">
          <div>
            <h1 className="text-3xl md:text-5xl font-black text-zinc-900 dark:text-white font-bebas tracking-wide mb-3 md:mb-4">CHECKOUT</h1>
            <p className="text-[10px] md:text-xs text-zinc-500 dark:text-zinc-400 font-bold uppercase tracking-[0.2em]">Enter your shipping details below</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                <User className="h-3 w-3" /> Full Name
              </label>
              <input
                required
                type="text"
                placeholder="Ex. John Doe"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full h-14 bg-white dark:bg-zinc-900 border-2 border-zinc-100 dark:border-zinc-800 rounded-2xl px-6 text-sm font-bold focus:outline-none focus:border-blue-600 transition-all placeholder:text-zinc-300 dark:placeholder:text-zinc-700"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                <Phone className="h-3 w-3" /> Phone Number
              </label>
              <input
                required
                type="tel"
                placeholder="Ex. 017XXXXXXXX"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full h-14 bg-white dark:bg-zinc-900 border-2 border-zinc-100 dark:border-zinc-800 rounded-2xl px-6 text-sm font-bold focus:outline-none focus:border-blue-600 transition-all placeholder:text-zinc-300 dark:placeholder:text-zinc-700"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                <ShoppingBag className="h-3 w-3" /> Email Address
              </label>
              <input
                required
                type="email"
                placeholder="Ex. john@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full h-14 bg-white dark:bg-zinc-900 border-2 border-zinc-100 dark:border-zinc-800 rounded-2xl px-6 text-sm font-bold focus:outline-none focus:border-blue-600 transition-all placeholder:text-zinc-300 dark:placeholder:text-zinc-700"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                <MapPin className="h-3 w-3" /> Delivery Address
              </label>
              <textarea
                required
                placeholder="Your full delivery address..."
                rows={4}
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full bg-white dark:bg-zinc-900 border-2 border-zinc-100 dark:border-zinc-800 rounded-2xl p-6 text-sm font-bold focus:outline-none focus:border-blue-600 transition-all placeholder:text-zinc-300 dark:placeholder:text-zinc-700 resize-none"
              />
            </div>

            <button
              disabled={loading || cart.length === 0}
              className="w-full h-16 bg-[#0a192f] text-white font-black rounded-2xl text-base tracking-[0.2em] shadow-2xl shadow-blue-900/20 hover:bg-blue-600 transition-all active:scale-[0.98] disabled:opacity-50 font-bebas flex items-center justify-center gap-3"
            >
              {loading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                <>PLACE ORDER <ArrowRight className="h-5 w-5" /></>
              )}
            </button>
          </form>
        </div>

        {/* Right: Order Summary (Voucher Style) */}
        <div className="relative">
          <div className="lg:sticky lg:top-32 bg-white dark:bg-zinc-900 rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-12 shadow-2xl border border-zinc-100 dark:border-zinc-800">
            <div className="flex items-center justify-between mb-6 pb-6 md:mb-8 md:pb-8 border-b-2 border-dashed border-zinc-100 dark:border-zinc-800">
              <h2 className="text-xl md:text-2xl font-black font-bebas tracking-wide">ORDER VOUCHER</h2>
              <div className="h-8 w-8 md:h-10 md:w-10 bg-blue-600 rounded-full flex items-center justify-center text-white">
                <ShoppingBag className="h-4 w-4 md:h-5 md:w-5" />
              </div>
            </div>

            <div className="space-y-4 md:space-y-6 mb-8 md:mb-10 max-h-[250px] md:max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
              {cart.map((item) => (
                <div key={item._id} className="flex items-center justify-between group">
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-xl bg-zinc-50 dark:bg-zinc-800 overflow-hidden border border-zinc-100 dark:border-zinc-700">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover" />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-xs font-black text-zinc-300 uppercase">{item.name.charAt(0)}</div>
                      )}
                    </div>
                    <div>
                      <h4 className="font-black text-sm uppercase tracking-tight leading-none mb-1 font-bebas">{item.name}</h4>
                      {item.size && (
                        <p className="text-[9px] font-bold text-blue-600 uppercase tracking-widest mb-1">
                          Size: {item.size}
                        </p>
                      )}
                      <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="font-black text-sm font-outfit">৳{item.sellingPrice * item.quantity}</p>
                    <button onClick={() => removeFromCart(item._id)} className="text-zinc-300 hover:text-red-500 transition-colors">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
              {cart.length === 0 && (
                <p className="text-center py-10 text-zinc-400 font-bold uppercase text-xs tracking-widest">Your cart is empty</p>
              )}
            </div>

            <div className="space-y-4 pt-8 border-t-2 border-dashed border-zinc-100 dark:border-zinc-800">
              <div className="flex justify-between text-xs font-bold text-zinc-500 uppercase tracking-widest">
                <span>Subtotal</span>
                <span>৳{cartTotal}</span>
              </div>
              <div className="flex justify-between text-xs font-bold text-zinc-500 uppercase tracking-widest">
                <span>Shipping</span>
                <span className="text-blue-600">FREE</span>
              </div>
              <div className="flex justify-between items-end pt-4">
                <span className="text-base md:text-lg font-black font-bebas tracking-widest uppercase">TOTAL AMOUNT</span>
                <span className="text-2xl md:text-3xl font-black text-blue-600 font-outfit leading-none">৳{cartTotal}</span>
              </div>
            </div>

            {/* Decorative notches for voucher feel */}
            <div className="absolute top-1/2 -left-3 h-6 w-6 md:h-8 md:w-8 bg-zinc-50 dark:bg-zinc-950 rounded-full -translate-y-1/2 border border-zinc-100 dark:border-zinc-800" />
            <div className="absolute top-1/2 -right-3 h-6 w-6 md:h-8 md:w-8 bg-zinc-50 dark:bg-zinc-950 rounded-full -translate-y-1/2 border border-zinc-100 dark:border-zinc-800" />
          </div>
        </div>
      </div>
    </div>
  );
}
