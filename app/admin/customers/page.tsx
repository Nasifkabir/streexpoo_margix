"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Users,
  Search,
  Eye,
  Trash2,
  ShieldAlert,
  ShieldCheck,
  Loader2,
  AlertTriangle,
  X,
} from "lucide-react";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
  totalOrders: number;
  totalSpent: number;
}

interface ConfirmModal {
  open: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  confirmClass: string;
  onConfirm: () => void;
}

export default function CustomersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [banningId, setBanningId] = useState<string | null>(null);
  const [modal, setModal] = useState<ConfirmModal>({
    open: false,
    title: "",
    message: "",
    confirmLabel: "",
    confirmClass: "",
    onConfirm: () => {},
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/users");
      const data = await res.json();
      if (Array.isArray(data)) {
        setUsers(data);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () =>
    setModal((prev) => ({ ...prev, open: false }));

  const openBanModal = (user: User) => {
    if (user.role === "ADMIN" && user.status !== "BANNED") {
      return;
    }

    const isBanned = user.status === "BANNED";
    setModal({
      open: true,
      title: isBanned ? "Unban User" : "Ban User",
      message: isBanned
        ? `Are you sure you want to unban "${user.name}"? They will regain full access to the store.`
        : `Are you sure you want to ban "${user.name}"? They will be immediately blocked from logging in.`,
      confirmLabel: isBanned ? "Yes, Unban" : "Yes, Ban",
      confirmClass: isBanned
        ? "bg-emerald-600 hover:bg-emerald-700 text-white"
        : "bg-red-600 hover:bg-red-700 text-white",
      onConfirm: () => executeBanToggle(user._id, user.status),
    });
  };

  const openDeleteModal = (user: User) => {
    setModal({
      open: true,
      title: "Delete User",
      message: `Are you sure you want to permanently delete "${user.name}"? This action cannot be undone.`,
      confirmLabel: "Yes, Delete Permanently",
      confirmClass: "bg-red-600 hover:bg-red-700 text-white",
      onConfirm: () => executeDelete(user._id),
    });
  };

  const executeBanToggle = async (id: string, currentStatus: string) => {
    closeModal();
    setBanningId(id);
    const newStatus = currentStatus === "BANNED" ? "ACTIVE" : "BANNED";
    try {
      const res = await fetch(`/api/users/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setUsers((prev) =>
          prev.map((u) => (u._id === id ? { ...u, status: newStatus } : u))
        );
      } else {
        const data = await res.json();
        alert(data.error || "Failed to update status.");
      }
    } catch (error) {
      console.error("Status update error:", error);
      alert("Failed to update status.");
    } finally {
      setBanningId(null);
    }
  };

  const executeDelete = async (id: string) => {
    closeModal();
    setDeletingId(id);
    try {
      const res = await fetch(`/api/users/${id}`, { method: "DELETE" });
      if (res.ok) {
        setUsers((prev) => prev.filter((u) => u._id !== id));
      } else {
        const data = await res.json();
        alert(data.error || "Failed to delete user.");
      }
    } catch (error) {
      console.error("Delete error:", error);
    } finally {
      setDeletingId(null);
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalBanned = users.filter((u) => u.status === "BANNED").length;

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Confirmation Modal */}
      {modal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 w-full max-w-md p-6 animate-in fade-in zoom-in-95">
            <div className="flex items-start justify-between mb-4">
              <h3 className="font-bebas text-xl tracking-wide text-zinc-900 dark:text-white">
                {modal.title}
              </h3>
              <button
                onClick={closeModal}
                className="p-1 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-6 leading-relaxed">
              {modal.message}
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={closeModal}
                className="px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 text-sm font-bold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={modal.onConfirm}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors ${modal.confirmClass}`}
              >
                {modal.confirmLabel}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header and Stats */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="font-bebas text-3xl tracking-wide text-zinc-900 dark:text-white">
            CUSTOMERS
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Manage your store users, permissions, and orders.
          </p>
        </div>

        <div className="flex gap-4">
          <div className="bg-white dark:bg-zinc-900 rounded-xl p-4 border border-zinc-200 dark:border-zinc-800 flex items-center gap-4 min-w-[150px]">
            <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">
                Total
              </p>
              <p className="font-bebas text-2xl leading-none">{users.length}</p>
            </div>
          </div>
          <div className="bg-white dark:bg-zinc-900 rounded-xl p-4 border border-zinc-200 dark:border-zinc-800 flex items-center gap-4 min-w-[150px]">
            <div className="h-10 w-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <ShieldAlert className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">
                Banned
              </p>
              <p className="font-bebas text-2xl leading-none">{totalBanned}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-zinc-50 dark:bg-zinc-950/50 border-b border-zinc-200 dark:border-zinc-800 text-xs uppercase tracking-widest text-zinc-500 font-bold">
              <tr>
                <th className="px-6 py-4">Customer Info</th>
                <th className="px-6 py-4">Role & Status</th>
                <th className="px-6 py-4">Joined Date</th>
                <th className="px-6 py-4 text-right">Orders / Spent</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-zinc-500">
                    <AlertTriangle className="h-8 w-8 mx-auto mb-3 text-zinc-400" />
                    <p className="font-bold">No customers found.</p>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr
                    key={user._id}
                    className="hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 font-black flex-shrink-0">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-zinc-900 dark:text-zinc-100">
                            {user.name}
                          </p>
                          <p className="text-xs text-zinc-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-2 items-start">
                        <span
                          className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${
                            user.role === "ADMIN"
                              ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
                              : "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400"
                          }`}
                        >
                          {user.role}
                        </span>
                        <span
                          className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${
                            user.status === "BANNED"
                              ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                              : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                          }`}
                        >
                          {user.status || "ACTIVE"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-zinc-500 font-medium">
                      {new Date(user.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <p className="font-bold text-zinc-900 dark:text-zinc-100">
                        {user.totalOrders} Orders
                      </p>
                      <p className="text-xs text-blue-600 dark:text-blue-400 font-black">
                        ৳{user.totalSpent}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {(user.role !== "ADMIN" || user.status === "BANNED") && (
                          <button
                            onClick={() => openBanModal(user)}
                            disabled={banningId === user._id}
                            className={`p-2 rounded-lg transition-colors disabled:opacity-50 ${
                              user.status === "BANNED"
                                ? "text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                                : "text-zinc-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20"
                            }`}
                            title={
                              user.status === "BANNED" ? "Unban User" : "Ban User"
                            }
                          >
                            {banningId === user._id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : user.status === "BANNED" ? (
                              <ShieldCheck className="h-4 w-4" />
                            ) : (
                              <ShieldAlert className="h-4 w-4" />
                            )}
                          </button>
                        )}
                        <Link
                          href={`/admin/customers/${user._id}`}
                          className="p-2 rounded-lg text-zinc-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                          title="View & Edit"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                        {user.role !== "ADMIN" && <button
                          onClick={() => openDeleteModal(user)}
                          disabled={deletingId === user._id}
                          className="p-2 rounded-lg text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50"
                          title="Delete User"
                        >
                          {deletingId === user._id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </button>}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
