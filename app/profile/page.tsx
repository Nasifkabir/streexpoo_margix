"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  User, ShoppingBag, LogOut, KeyRound, Package,
  Loader2, CheckCircle2, ChevronRight, Eye, EyeOff, ArrowLeft
} from "lucide-react";

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  size?: string;
}

interface Order {
  _id: string;
  orderId: string;
  items: OrderItem[];
  totalAmount: number;
  status: string;
  createdAt: string;
}

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  PROCESSING: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  SHIPPED: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  DELIVERED: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  CANCELLED: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswords, setShowPasswords] = useState(false);
  const [pwLoading, setPwLoading] = useState(false);
  const [pwSuccess, setPwSuccess] = useState(false);
  const [pwError, setPwError] = useState("");

  const [activeTab, setActiveTab] = useState<"orders" | "settings">("orders");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user?.email) {
      fetch(`/api/orders/my-orders?email=${encodeURIComponent(session.user.email)}`)
        .then((r) => r.json())
        .then((data) => {
          setOrders(Array.isArray(data) ? data : []);
          setOrdersLoading(false);
        })
        .catch(() => setOrdersLoading(false));
    }
  }, [session]);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwError("");
    if (newPassword !== confirmPassword) {
      setPwError("New passwords do not match.");
      return;
    }
    setPwLoading(true);
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setPwSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setPwSuccess(false), 4000);
    } catch (err: unknown) {
      setPwError(err instanceof Error ? err.message : "Failed to change password.");
    } finally {
      setPwLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 font-outfit">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white dark:bg-zinc-950 border-b border-zinc-100 dark:border-zinc-900 py-4 px-4 md:px-8 flex items-center justify-between shadow-sm">
        <Link href="/" className="flex items-center gap-2 text-zinc-500 hover:text-blue-600 transition-colors">
          <ArrowLeft className="h-4 w-4" />
          <span className="text-xs font-bold uppercase tracking-widest">Back to Store</span>
        </Link>
        <span className="font-bebas text-2xl tracking-wide text-zinc-900 dark:text-white uppercase">Streexpo</span>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex items-center gap-2 text-xs font-bold text-zinc-500 hover:text-red-500 uppercase tracking-widest transition-colors"
        >
          <LogOut className="h-4 w-4" /> Sign Out
        </button>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
        {/* Profile Hero */}
        <div className="bg-gradient-to-br from-[#0a192f] to-blue-700 rounded-2xl p-6 md:p-10 mb-8 flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="h-16 w-16 md:h-20 md:w-20 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
            <User className="h-8 w-8 md:h-10 md:w-10 text-white" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-black text-white font-bebas tracking-wide uppercase leading-none">
              {session?.user?.name}
            </h1>
            <p className="text-blue-200 text-sm font-medium mt-1">{session?.user?.email}</p>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-3 py-1">
                <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-bold text-white uppercase tracking-widest">
                  {session?.user?.role === "ADMIN" ? "Admin" : "Member"}
                </span>
              </div>
              {session?.user?.role === "ADMIN" && (
                <Link
                  href="/admin"
                  className="inline-flex items-center gap-1.5 bg-yellow-500 text-[#0a192f] text-xs font-black uppercase tracking-widest px-4 py-1.5 rounded-full hover:bg-yellow-400 transition-colors shadow-lg"
                >
                  Admin Panel <ChevronRight className="h-3 w-3" />
                </Link>
              )}
            </div>
          </div>
          <div className="text-right hidden sm:block">
            <p className="text-blue-200 text-xs font-bold uppercase tracking-widest">Total Orders</p>
            <p className="text-white text-4xl font-black font-bebas">{orders.length}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white dark:bg-zinc-900 rounded-xl p-1 border border-zinc-100 dark:border-zinc-800 mb-6 shadow-sm">
          <button
            onClick={() => setActiveTab("orders")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-black uppercase tracking-widest transition-all ${
              activeTab === "orders"
                ? "bg-[#0a192f] text-white shadow"
                : "text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
            }`}
          >
            <ShoppingBag className="h-4 w-4" /> Order History
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-black uppercase tracking-widest transition-all ${
              activeTab === "settings"
                ? "bg-[#0a192f] text-white shadow"
                : "text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
            }`}
          >
            <KeyRound className="h-4 w-4" /> Account Settings
          </button>
        </div>

        {/* Orders Tab */}
        {activeTab === "orders" && (
          <div className="space-y-4">
            {ordersLoading ? (
              <div className="flex justify-center py-16">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              </div>
            ) : orders.length === 0 ? (
              <div className="bg-white dark:bg-zinc-900 rounded-2xl p-12 text-center border border-zinc-100 dark:border-zinc-800">
                <Package className="h-12 w-12 text-zinc-300 dark:text-zinc-700 mx-auto mb-4" />
                <h3 className="font-black font-bebas text-xl text-zinc-900 dark:text-white tracking-wide">NO ORDERS YET</h3>
                <p className="text-zinc-500 text-sm mt-1 mb-6">Your purchases will appear here once you place an order.</p>
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 bg-[#0a192f] text-white text-xs font-black uppercase tracking-widest px-6 py-3 rounded-xl hover:bg-blue-600 transition-all"
                >
                  Start Shopping <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            ) : (
              orders.map((order) => (
                <div key={order._id} className="bg-white dark:bg-zinc-900 rounded-2xl p-5 md:p-6 border border-zinc-100 dark:border-zinc-800 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="font-bebas text-lg tracking-wide text-zinc-900 dark:text-white">#{order.orderId}</p>
                      <p className="text-xs text-zinc-400 font-bold">
                        {new Date(order.createdAt).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${STATUS_COLORS[order.status] || STATUS_COLORS.PENDING}`}>
                        {order.status}
                      </span>
                      <p className="font-black text-lg text-blue-600">৳{order.totalAmount}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {order.items.map((item, i) => (
                      <div key={i} className="flex items-center justify-between text-sm py-2 border-t border-zinc-50 dark:border-zinc-800">
                        <div>
                          <span className="font-bold text-zinc-800 dark:text-zinc-200">{item.name}</span>
                          {item.size && (
                            <span className="ml-2 text-[10px] font-black bg-blue-100 dark:bg-blue-900/40 text-blue-600 px-2 py-0.5 rounded-full uppercase">{item.size}</span>
                          )}
                        </div>
                        <span className="text-zinc-500 font-bold">x{item.quantity} · ৳{item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === "settings" && (
          <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 md:p-8 border border-zinc-100 dark:border-zinc-800 shadow-sm">
            <h2 className="font-bebas text-2xl tracking-wide text-zinc-900 dark:text-white mb-6">CHANGE PASSWORD</h2>

            {pwSuccess && (
              <div className="flex items-center gap-3 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 rounded-xl p-4 mb-6">
                <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
                <span className="text-sm font-bold">Password updated successfully!</span>
              </div>
            )}

            {pwError && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 text-red-600 dark:text-red-400 rounded-xl p-4 mb-6 text-sm font-bold">
                {pwError}
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Current Password</label>
                <div className="relative">
                  <input
                    type={showPasswords ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                    placeholder="Your current password"
                    className="flex h-12 w-full rounded-xl border-2 border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 px-4 pr-12 text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:border-blue-600 transition-colors"
                  />
                  <button type="button" onClick={() => setShowPasswords(!showPasswords)} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200">
                    {showPasswords ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">New Password</label>
                <input
                  type={showPasswords ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={6}
                  placeholder="Min. 6 characters"
                  className="flex h-12 w-full rounded-xl border-2 border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 px-4 text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:border-blue-600 transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Confirm New Password</label>
                <input
                  type={showPasswords ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  placeholder="Repeat new password"
                  className="flex h-12 w-full rounded-xl border-2 border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 px-4 text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:border-blue-600 transition-colors"
                />
              </div>
              <button
                type="submit"
                disabled={pwLoading}
                className="flex h-12 w-full items-center justify-center rounded-xl bg-[#0a192f] text-sm font-black text-white hover:bg-blue-600 transition-all disabled:opacity-50 uppercase tracking-widest gap-2 mt-2"
              >
                {pwLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "UPDATE PASSWORD"}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
