import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  PackageSearch,
  Settings,
  Store,
  Tag,
  ShoppingBag,
  CreditCard,
  Puzzle,
  ClipboardList,
} from "lucide-react";
import SignOutButton from "../admin/SignOutButton";
import MobileSidebar from "@/components/mobile-sidebar";
import { ThemeToggle } from "@/components/theme-toggle";

import { AdminLoginForm } from "@/components/admin-login-form";

export default async function POSLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return <AdminLoginForm />;
  }

  if (session.user.role !== "ADMIN") {
    redirect("/");
  }

  return (
    <div className="flex h-screen overflow-hidden bg-zinc-50 dark:bg-zinc-950 font-outfit">
      {/* Sidebar - Dark theme */}
      <aside className="w-64 border-r border-zinc-200 dark:border-zinc-800/50 bg-white dark:bg-[#121212] hidden md:flex flex-col">
        {/* Logo Area */}
        <div className="p-6 border-b border-zinc-200 dark:border-zinc-800/50">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg shadow-blue-600/20">
              <Store className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-black text-zinc-900 dark:text-zinc-100 text-2xl leading-none font-bebas tracking-wide">STREEXPO</h2>
              <p className="text-[10px] text-zinc-500 dark:text-zinc-500 mt-1 uppercase font-bold tracking-widest">Premium Admin</p>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-6 scrollbar-thin scrollbar-thumb-zinc-200 dark:scrollbar-thumb-zinc-800">
          
          {/* Sales & Insights */}
          <div className="space-y-1">
            <p className="px-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">
              Sales & Insights
            </p>
            <Link
              href="/admin"
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-colors"
            >
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Link>
            <Link
              href="/admin/orders"
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-colors"
            >
              <ClipboardList className="h-4 w-4" />
              Storefront Orders
            </Link>
            <Link
              href="/pos"
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-bold bg-blue-600/10 text-blue-600 dark:text-blue-400"
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
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-colors"
            >
              <PackageSearch className="h-4 w-4" />
              Products
            </Link>
            <Link
              href="/admin/banners"
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-colors"
            >
              <Puzzle className="h-4 w-4" />
              Storefront Banners
            </Link>
            <div className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-400 dark:text-zinc-500 cursor-not-allowed">
              <Tag className="h-4 w-4" />
              Categories
            </div>
          </div>

          {/* Users */}
          <div className="space-y-1">
            <p className="px-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">
              Users & Payments
            </p>
            <div className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-400 dark:text-zinc-500 cursor-not-allowed">
              <CreditCard className="h-4 w-4" />
              Payments
            </div>
          </div>

          {/* Preferences */}
          <div className="space-y-1">
            <p className="px-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">
              Preferences
            </p>
            <Link
              href="/admin/settings"
              className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-colors"
            >
              <Settings className="h-5 w-5" />
              Store Settings
            </Link>
          </div>
        </div>

        {/* Bottom Profile Area */}
        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800/50 bg-zinc-50 dark:bg-[#0a0a0a]">
          <SignOutButton />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-zinc-50/50 dark:bg-zinc-900/50">
        {/* Top bar */}
        <header className="sticky top-0 z-40 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800/50 px-4 md:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <MobileSidebar />
            <div>
              <h1 className="text-xl font-black text-zinc-900 dark:text-zinc-100 font-bebas tracking-wide">POS TERMINAL</h1>
              <p className="text-[10px] text-zinc-500 dark:text-zinc-400 hidden sm:block uppercase font-bold tracking-widest opacity-60">Process customer transactions</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <div className="flex items-center gap-3 bg-zinc-100 dark:bg-zinc-800/50 rounded-full pl-2 pr-4 py-1.5 border border-zinc-200 dark:border-zinc-700/50 cursor-pointer hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors">
              <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-black text-sm">
                {session.user.name?.charAt(0) || "A"}
              </div>
              <div className="flex flex-col hidden sm:flex">
                <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 leading-none">{session.user.name || "Admin"}</span>
                <span className="text-xs text-zinc-500 dark:text-zinc-400">{session.user.email}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
