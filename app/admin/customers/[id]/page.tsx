"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  User,
  ShoppingBag,
  Mail,
  Loader2,
  CheckCircle2,
  Package,
  Calendar,
  Settings,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";

interface UserDetails {
  _id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
}

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  size?: string;
}

interface Order {
  _id: string;
  orderId: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  items: OrderItem[];
}

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  CONFIRMED: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  PROCESSING: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  SHIPPED: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  DELIVERED: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  CANCELLED: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

export default function CustomerDetailsPage() {
  const { id } = useParams<{ id: string }>();

  const [user, setUser] = useState<UserDetails | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [ordersError, setOrdersError] = useState("");

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("ACTIVE");
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Load user info
  useEffect(() => {
    if (!id) return;
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/users");
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to load users");
        const found = Array.isArray(data) ? data.find((u: UserDetails) => u._id === id) : null;
        if (found) {
          setUser(found);
          setName(found.name);
          setEmail(found.email);
          setStatus(found.status ?? "ACTIVE");
        }
      } catch (err) {
        console.error("Failed to fetch user:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  // Load orders separately
  useEffect(() => {
    if (!id) return;
    const fetchOrders = async () => {
      setOrdersLoading(true);
      setOrdersError("");
      try {
        const res = await fetch(`/api/users/${id}/orders`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to load orders");
        setOrders(Array.isArray(data) ? data : []);
      } catch (err: unknown) {
        setOrdersError(err instanceof Error ? err.message : "Failed to load orders");
      } finally {
        setOrdersLoading(false);
      }
    };
    fetchOrders();
  }, [id]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setErrorMsg("");
    setSaveSuccess(false);

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const body: any = { name, email, status };
      if (password) body.password = password;

      const res = await fetch(`/api/users/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (res.ok) {
        setSaveSuccess(true);
        setPassword("");
        // Update local user state so badge reflects new status
        setUser((prev) => prev ? { ...prev, name, email, status } : prev);
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        setErrorMsg(data.error || "Failed to update user");
      }
    } catch {
      setErrorMsg("Failed to update user");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-bold text-zinc-700 dark:text-zinc-300">Customer not found</h2>
        <Link href="/admin/customers" className="text-blue-600 hover:underline mt-4 inline-block">
          ← Back to Customers
        </Link>
      </div>
    );
  }

  const totalSpent = orders.reduce((sum, order) => sum + order.totalAmount, 0);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/customers"
          className="p-2 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="font-bebas text-3xl tracking-wide text-zinc-900 dark:text-white uppercase">
            Customer Profile
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Manage {user.name}&apos;s account and view history
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left Col: Profile Edit */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-zinc-200 dark:border-zinc-800 shadow-sm">
            <div className="flex flex-col items-center mb-6">
              <div className="h-20 w-20 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4 text-blue-600 text-3xl font-black">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <h2 className="font-bold text-lg text-zinc-900 dark:text-white">{user.name}</h2>
              <p className="text-sm text-zinc-500">{user.email}</p>
              <div className="flex gap-2 mt-3">
                <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400">
                  {user.role}
                </span>
                <span
                  className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full flex items-center gap-1 ${
                    status === "BANNED"
                      ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                      : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                  }`}
                >
                  {status === "BANNED"
                    ? <ShieldAlert className="h-3 w-3" />
                    : <ShieldCheck className="h-3 w-3" />
                  }
                  {status}
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-2 flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                Joined {new Date(user.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
              </p>
            </div>

            <hr className="border-zinc-100 dark:border-zinc-800 my-4" />

            <form onSubmit={handleUpdate} className="space-y-4">
              <div className="flex items-center gap-2 mb-4 text-zinc-900 dark:text-white font-bebas text-xl">
                <Settings className="h-5 w-5" /> Account Settings
              </div>

              {saveSuccess && (
                <div className="flex items-center gap-2 p-3 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 text-sm font-bold rounded-lg border border-emerald-100 dark:border-emerald-800/30">
                  <CheckCircle2 className="h-4 w-4" /> Profile Updated
                </div>
              )}

              {errorMsg && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 text-sm font-bold rounded-lg border border-red-100 dark:border-red-800/30">
                  {errorMsg}
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full pl-9 pr-4 py-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm focus:outline-none focus:border-blue-500 text-zinc-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-9 pr-4 py-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm focus:outline-none focus:border-blue-500 text-zinc-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
                  New Password{" "}
                  <span className="text-zinc-400 normal-case font-medium">(optional)</span>
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Leave blank to keep current"
                  className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm focus:outline-none focus:border-blue-500 text-zinc-900 dark:text-white placeholder:text-zinc-400"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
                  Account Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm focus:outline-none focus:border-blue-500 text-zinc-900 dark:text-white"
                >
                  <option value="ACTIVE">✅ ACTIVE — Normal Access</option>
                  <option value="BANNED">🚫 BANNED — Prevent Login</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={isSaving}
                className="w-full py-3 mt-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Changes"}
              </button>
            </form>
          </div>
        </div>

        {/* Right Col: Stats + Full Order History */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white dark:bg-zinc-900 rounded-2xl p-5 border border-zinc-200 dark:border-zinc-800">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600">
                  <ShoppingBag className="h-5 w-5" />
                </div>
                <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">
                  Total Orders
                </p>
              </div>
              <p className="font-bebas text-3xl text-zinc-900 dark:text-white">{ordersLoading ? "—" : orders.length}</p>
            </div>
            <div className="bg-white dark:bg-zinc-900 rounded-2xl p-5 border border-zinc-200 dark:border-zinc-800">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 font-bold text-sm">
                  ৳
                </div>
                <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">
                  Total Spent
                </p>
              </div>
              <p className="font-bebas text-3xl text-zinc-900 dark:text-white">৳{ordersLoading ? "—" : totalSpent}</p>
            </div>
          </div>

          {/* Order History — No scroll cap, shows all */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
            <div className="p-5 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Package className="h-5 w-5 text-zinc-400" />
                <h2 className="font-bebas text-xl text-zinc-900 dark:text-white">
                  Full Order History
                </h2>
              </div>
              {!ordersLoading && (
                <span className="text-xs font-bold text-zinc-500 bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded-full">
                  {orders.length} order{orders.length !== 1 ? "s" : ""}
                </span>
              )}
            </div>

            {ordersLoading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
              </div>
            ) : ordersError ? (
              <div className="p-8 text-center text-red-500 text-sm font-bold">
                {ordersError}
              </div>
            ) : orders.length === 0 ? (
              <div className="p-12 text-center text-zinc-500">
                <ShoppingBag className="h-10 w-10 mx-auto mb-3 text-zinc-300 dark:text-zinc-700" />
                <p className="font-bold">No orders placed yet.</p>
                <p className="text-xs mt-1 text-zinc-400">
                  Orders will appear here once the customer makes a purchase.
                </p>
              </div>
            ) : (
              // Full list - no height cap, shows everything
              <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
                {orders.map((order, idx) => (
                  <div
                    key={order._id}
                    className="p-5 hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-zinc-400">#{idx + 1}</span>
                          <span className="font-bold text-blue-600 text-sm">
                            #{order.orderId}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 mt-1 text-xs text-zinc-500 font-medium">
                          <Calendar className="h-3.5 w-3.5" />
                          {new Date(order.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-black text-lg text-zinc-900 dark:text-white">
                          ৳{order.totalAmount}
                        </p>
                        <span
                          className={`inline-block mt-1 text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full ${
                            STATUS_COLORS[order.status] ?? STATUS_COLORS.PENDING
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>
                    </div>

                    {/* Items breakdown */}
                    <div className="bg-zinc-50 dark:bg-zinc-950 rounded-xl p-3 space-y-2 border border-zinc-100 dark:border-zinc-800/50">
                      {order.items.map((item, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between text-sm py-1"
                        >
                          <div className="flex items-center gap-2">
                            <div className="h-1.5 w-1.5 rounded-full bg-blue-400 flex-shrink-0" />
                            <span className="font-medium text-zinc-700 dark:text-zinc-300">
                              {item.name}
                            </span>
                            {item.size && (
                              <span className="text-[10px] font-bold bg-zinc-200 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-600 dark:text-zinc-400">
                                {item.size}
                              </span>
                            )}
                          </div>
                          <span className="text-zinc-500 font-bold text-xs">
                            x{item.quantity} · ৳{item.price * item.quantity}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
