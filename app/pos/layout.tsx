import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Store, ChevronLeft } from "lucide-react";
import SignOutButton from "../admin/SignOutButton";
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

  // Only ADMIN can access POS now
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-zinc-50 dark:bg-[#121212]">
      {/* Top Navigation for POS */}
      <header className="flex-none bg-white dark:bg-[#18181b] border-b border-zinc-200 dark:border-zinc-800/50 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500 text-white shadow-lg shadow-emerald-500/20">
              <Store className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 leading-none">Point of Sale (POS) Terminal</h1>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">Process customer transactions</p>
            </div>
          </div>
          
          {session.user.role === "ADMIN" && (
            <>
              <div className="h-8 w-px bg-zinc-200 dark:bg-zinc-800/80"></div>
              <Link 
                href="/admin" 
                className="flex items-center gap-2 text-sm font-medium text-zinc-500 dark:text-zinc-400 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
                Back to Admin
              </Link>
            </>
          )}
        </div>
        
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <div className="flex items-center gap-3 bg-zinc-100 dark:bg-zinc-800/50 rounded-full pl-2 pr-4 py-1.5 border border-zinc-200 dark:border-zinc-700/50">
            <div className="h-8 w-8 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold text-sm">
              {session.user.name?.charAt(0) || "U"}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 leading-none">{session.user.name || "User"}</span>
              <span className="text-[10px] text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">{session.user.role}</span>
            </div>
          </div>
          <div className="w-28">
            <SignOutButton />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden p-6 bg-zinc-100 dark:bg-[#0a0a0a]">
        <div className="h-full max-w-[1600px] mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
