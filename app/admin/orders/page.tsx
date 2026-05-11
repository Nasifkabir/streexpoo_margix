"use client";

import { useState, useEffect } from "react";
import { ShoppingBag, Clock, CheckCircle2, Phone, MapPin, Calendar, User, Truck, PackageCheck, XCircle, Loader2, Mail } from "lucide-react";
import { useToast } from "@/context/ToastContext";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [confirmModal, setConfirmModal] = useState<{ id: string; status: string; message: string } | null>(null);
  const { showToast } = useToast();

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/orders");
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      showToast("Failed to fetch orders", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (id: string, newStatus: string) => {
    setProcessingId(id);
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to update status");
      }

      showToast(`Order status updated to ${newStatus}`);
      fetchOrders(); // Refresh list
    } catch (err: any) {
      showToast(err.message, "error");
    } finally {
      setProcessingId(null);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PENDING": return <Clock className="h-4 w-4" />;
      case "CONFIRMED": return <PackageCheck className="h-4 w-4" />;
      case "SHIPPED": return <Truck className="h-4 w-4" />;
      case "DELIVERED": return <CheckCircle2 className="h-4 w-4" />;
      case "CANCELLED": return <XCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING": return "text-amber-500 bg-amber-500/10 border-amber-500/20";
      case "CONFIRMED": return "text-blue-500 bg-blue-500/10 border-blue-500/20";
      case "SHIPPED": return "text-indigo-500 bg-indigo-500/10 border-indigo-500/20";
      case "DELIVERED": return "text-emerald-500 bg-emerald-500/10 border-emerald-500/20";
      case "CANCELLED": return "text-red-500 bg-red-500/10 border-red-500/20";
      default: return "text-zinc-500 bg-zinc-500/10 border-zinc-500/20";
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-10 font-outfit px-4 md:px-0 relative">
      
      {/* Premium Confirmation Modal */}
      {confirmModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white dark:bg-zinc-900 w-full max-w-md rounded-[2.5rem] p-8 md:p-12 shadow-2xl border border-zinc-100 dark:border-zinc-800 transform animate-in slide-in-from-bottom-4">
            <div className={`h-16 w-16 rounded-3xl flex items-center justify-center mb-6 ${confirmModal.status === "CANCELLED" ? "bg-red-500/10 text-red-500" : "bg-blue-600/10 text-blue-600"}`}>
              {confirmModal.status === "CANCELLED" ? <XCircle className="h-8 w-8" /> : <PackageCheck className="h-8 w-8" />}
            </div>
            <h2 className="text-2xl font-black font-bebas tracking-wide mb-3 text-zinc-900 dark:text-white uppercase">
              {confirmModal.status === "CANCELLED" ? "Cancel Order?" : "Confirm Order?"}
            </h2>
            <p className="text-sm font-bold text-zinc-500 dark:text-zinc-400 mb-8 leading-relaxed uppercase tracking-tight">
              {confirmModal.message}
            </p>
            <div className="flex gap-4">
              <button 
                onClick={() => {
                  updateStatus(confirmModal.id, confirmModal.status);
                  setConfirmModal(null);
                }}
                className={`flex-1 py-4 rounded-2xl font-black text-xs tracking-widest uppercase font-bebas transition-all shadow-lg cursor-pointer ${confirmModal.status === "CANCELLED" ? "bg-red-500 text-white hover:bg-red-600 shadow-red-500/20" : "bg-blue-600 text-white hover:bg-blue-700 shadow-blue-600/20"}`}
              >
                Yes, Proceed
              </button>
              <button 
                onClick={() => setConfirmModal(null)}
                className="flex-1 py-4 rounded-2xl border-2 border-zinc-100 dark:border-zinc-800 text-zinc-400 font-black text-xs tracking-widest uppercase font-bebas hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all cursor-pointer"
              >
                No, Keep Back
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-zinc-900 dark:text-zinc-100 font-bebas tracking-wide uppercase">Storefront Orders</h1>
          <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-1 uppercase font-bold tracking-widest opacity-60">
            Manage pending orders from your website customers
          </p>
        </div>
        <div className="bg-[#0a192f] text-white px-6 py-2 rounded-full font-bebas text-base md:text-lg tracking-widest flex items-center justify-center gap-3 shadow-lg shadow-blue-600/20 self-start sm:self-center">
          <ShoppingBag className="h-4 w-4 md:h-5 md:w-5" /> {orders.length} TOTAL
        </div>
      </div>

      <div className="grid gap-6">
        {orders.length === 0 ? (
          <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] p-20 text-center border-2 border-dashed border-zinc-100 dark:border-zinc-800">
            <ShoppingBag className="h-16 w-16 text-zinc-200 mx-auto mb-6" />
            <p className="text-zinc-400 font-bold uppercase text-sm tracking-[0.2em]">No orders received yet</p>
          </div>
        ) : (
          orders.map((order) => (
            <div 
              key={order._id.toString()} 
              className="bg-white dark:bg-zinc-900 rounded-[1.5rem] md:rounded-[2rem] border border-zinc-100 dark:border-zinc-800 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
            >
              <div className="p-5 md:p-8 flex flex-col lg:flex-row gap-6 md:gap-8">
                
                {/* Order Meta */}
                <div className="lg:w-1/4 space-y-3 md:space-y-4">
                  <div className={`flex items-center gap-3 px-3 py-1.5 rounded-xl border w-fit ${getStatusColor(order.status)}`}>
                    {getStatusIcon(order.status)}
                    <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em]">{order.status}</span>
                  </div>
                  <h3 className="text-xl md:text-2xl font-black font-bebas tracking-wide text-zinc-900 dark:text-white leading-none">
                    {order.orderId}
                  </h3>
                  <div className="flex items-center gap-2 text-zinc-400">
                    <Calendar className="h-3 w-3" />
                    <span className="text-[10px] font-bold uppercase">{new Date(order.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="pt-3 md:pt-4 border-t border-zinc-50 dark:border-zinc-800">
                    <p className="text-[9px] md:text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">Total Amount</p>
                    <p className="text-2xl md:text-3xl font-black text-blue-600 font-outfit leading-none">৳{order.totalAmount}</p>
                  </div>
                </div>

                {/* Customer Info */}
                <div className="lg:w-1/3 bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl md:rounded-3xl p-5 md:p-6 space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="h-8 w-8 md:h-10 md:w-10 rounded-xl bg-white dark:bg-zinc-800 flex items-center justify-center text-zinc-400 shadow-sm">
                      <User className="h-4 w-4 md:h-5 md:w-5" />
                    </div>
                    <div>
                      <p className="text-[9px] md:text-[10px] font-black text-zinc-400 uppercase tracking-widest leading-none mb-1">Customer</p>
                      <p className="text-sm md:text-base font-bold text-zinc-900 dark:text-white uppercase tracking-tight">{order.customerName}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="h-8 w-8 md:h-10 md:w-10 rounded-xl bg-white dark:bg-zinc-800 flex items-center justify-center text-zinc-400 shadow-sm">
                      <Phone className="h-4 w-4 md:h-5 md:w-5" />
                    </div>
                    <div>
                      <p className="text-[9px] md:text-[10px] font-black text-zinc-400 uppercase tracking-widest leading-none mb-1">Phone</p>
                      <p className="text-sm md:text-base font-bold text-blue-600 tracking-wider">{order.customerPhone}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="h-8 w-8 md:h-10 md:w-10 rounded-xl bg-white dark:bg-zinc-800 flex items-center justify-center text-zinc-400 shadow-sm">
                      <Mail className="h-4 w-4 md:h-5 md:w-5" />
                    </div>
                    <div>
                      <p className="text-[9px] md:text-[10px] font-black text-zinc-400 uppercase tracking-widest leading-none mb-1">Email</p>
                      <p className="font-bold text-zinc-700 dark:text-zinc-300 text-[11px] md:text-xs truncate max-w-[180px] md:max-w-none">{order.customerEmail}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="h-8 w-8 md:h-10 md:w-10 rounded-xl bg-white dark:bg-zinc-800 flex items-center justify-center text-zinc-400 shadow-sm">
                      <MapPin className="h-4 w-4 md:h-5 md:w-5" />
                    </div>
                    <div>
                      <p className="text-[9px] md:text-[10px] font-black text-zinc-400 uppercase tracking-widest leading-none mb-1">Delivery Address</p>
                      <p className="text-[11px] md:text-xs font-bold text-zinc-600 dark:text-zinc-400 leading-relaxed">{order.customerAddress}</p>
                    </div>
                  </div>
                </div>

                {/* Items Info */}
                <div className="flex-1 space-y-4">
                   <p className="text-[9px] md:text-[10px] font-black text-zinc-400 uppercase tracking-widest leading-none mb-4">Ordered Items</p>
                   <div className="grid gap-3 max-h-[150px] overflow-y-auto pr-2 custom-scrollbar">
                     {order.items.map((item: any, idx: number) => (
                       <div key={idx} className="flex items-center justify-between p-3 rounded-2xl bg-white dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700">
                         <div className="flex items-center gap-3">
                           <div className="h-8 w-8 rounded-lg bg-zinc-100 dark:bg-zinc-700 flex items-center justify-center text-[10px] font-black text-zinc-400">
                             {idx + 1}
                           </div>
                           <span className="text-xs font-bold uppercase tracking-tight text-zinc-800 dark:text-zinc-200">
                             {item.name}
                             {item.size && <span className="text-[10px] text-blue-600 ml-2">(Size: {item.size})</span>}
                           </span>
                         </div>
                         <div className="flex items-center gap-6">
                           <span className="text-[10px] font-black text-zinc-400 uppercase">Qty: {item.quantity}</span>
                           <span className="text-xs font-black text-blue-600 font-outfit">৳{item.price * item.quantity}</span>
                         </div>
                       </div>
                     ))}
                   </div>

                   {/* Actions */}
                   <div className="pt-4 flex flex-wrap gap-3">
                      {order.status === "PENDING" && (
                        <>
                          <button 
                            onClick={() => setConfirmModal({ 
                              id: order._id, 
                              status: "CONFIRMED", 
                              message: `Are you sure you want to confirm order ${order.orderId}? This will reduce stock and log the sale.` 
                            })}
                            disabled={processingId === order._id}
                            className="flex-1 min-w-[120px] px-6 py-2.5 rounded-xl bg-blue-600 text-white font-black text-xs tracking-widest uppercase font-bebas hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                          >
                            {processingId === order._id ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Confirm Order</>}
                          </button>
                          <button 
                            onClick={() => setConfirmModal({ 
                              id: order._id, 
                              status: "CANCELLED", 
                              message: `Are you sure you want to cancel order ${order.orderId}? This action cannot be undone.` 
                            })}
                            disabled={processingId === order._id}
                            className="flex-1 min-w-[120px] px-6 py-2.5 rounded-xl border border-zinc-100 dark:border-zinc-800 text-zinc-400 font-black text-xs tracking-widest uppercase font-bebas hover:text-red-500 transition-all disabled:opacity-50 cursor-pointer"
                          >
                            Cancel
                          </button>
                        </>
                      )}

                      {order.status === "CONFIRMED" && (
                        <button 
                          onClick={() => updateStatus(order._id, "SHIPPED")}
                          disabled={processingId === order._id}
                          className="flex-1 px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-black text-xs tracking-widest uppercase font-bebas hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <Truck className="h-4 w-4" /> Ship Order
                        </button>
                      )}

                      {order.status === "SHIPPED" && (
                        <button 
                          onClick={() => updateStatus(order._id, "DELIVERED")}
                          disabled={processingId === order._id}
                          className="flex-1 px-6 py-2.5 rounded-xl bg-emerald-600 text-white font-black text-xs tracking-widest uppercase font-bebas hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <CheckCircle2 className="h-4 w-4" /> Mark Delivered
                        </button>
                      )}

                      {(order.status === "DELIVERED" || order.status === "CANCELLED") && (
                        <div className="w-full text-center py-2 px-4 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-400 text-[10px] font-black uppercase tracking-widest">
                          Transaction Finalized
                        </div>
                      )}
                   </div>
                </div>

              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
}
