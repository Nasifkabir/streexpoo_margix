"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  LayoutDashboard,
  PackageSearch,
  Users,
  Settings,
  Store,
  Tag,
  ShoppingBag,
  CreditCard,
} from "lucide-react";
import SignOutButton from "@/app/admin/SignOutButton";

export default function MobileSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="md:hidden p-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
      >
        <Menu className="h-6 w-6" />
      </button>

      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sliding Drawer */}
      <div 
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-[#121212] border-r border-zinc-200 dark:border-zinc-800/50 transform transition-transform duration-300 ease-in-out flex flex-col md:hidden ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex items-center justify-between p-6 border-b border-zinc-200 dark:border-zinc-800/50">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg shadow-emerald-500/20">
              <Store className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-bold text-zinc-900 dark:text-zinc-100 text-lg leading-none">Margix</h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-500 mt-1">Mobile Admin</p>
            </div>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="p-1 rounded-md text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-6 scrollbar-thin scrollbar-thumb-zinc-200 dark:scrollbar-thumb-zinc-800">
          {/* Sales & Insights */}
          <div className="space-y-1">
            <p className="px-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">
              Sales & Insights
            </p>
            <Link
              href="/admin"
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${pathname === '/admin' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800/50'}`}
            >
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Link>
            <Link
              href="/pos"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-colors"
            >
              <ShoppingBag className="h-4 w-4" />
              POS Terminal
            </Link>
          </div>

          {/* Catalog */}
          <div className="space-y-1">
            <p className="px-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">
              Catalog
            </p>
            <Link
              href="/admin/products"
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${pathname === '/admin/products' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800/50'}`}
            >
              <PackageSearch className="h-4 w-4" />
              Products
            </Link>
            <div className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-400 dark:text-zinc-500 cursor-not-allowed">
              <Tag className="h-4 w-4" />
              Categories
            </div>
          </div>

          {/* Users & Staff */}
          <div className="space-y-1">
            <p className="px-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">
              Staff & Users
            </p>
            <Link
              href="/admin/staff"
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${pathname === '/admin/staff' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800/50'}`}
            >
              <Users className="h-4 w-4" />
              Staff
            </Link>
            <div className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-400 dark:text-zinc-500 cursor-not-allowed">
              <CreditCard className="h-4 w-4" />
              Payments
            </div>
          </div>

          {/* Preferences */}
          <div className="space-y-1">
            <p className="px-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">
              Preferences
            </p>
            <Link
              href="/admin/settings"
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${pathname === '/admin/settings' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800/50'}`}
            >
              <Settings className="h-4 w-4" />
              Store Settings
            </Link>
          </div>
        </div>

        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800/50 bg-zinc-50 dark:bg-[#0a0a0a]">
          <SignOutButton />
        </div>
      </div>
    </>
  );
}
