import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Store, ShoppingCart } from "lucide-react";
import SignOutButton from "../admin/SignOutButton";

export default async function POSLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  // Both STAFF and ADMIN can access POS
  return (
    <div className="flex flex-col min-h-screen">
      {/* Top Navigation for POS */}
      <header className="sticky top-0 z-50 w-full border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2 font-bold text-xl text-blue-600 dark:text-blue-500">
            <Store className="h-6 w-6" />
            Margix POS
          </div>
          
          <div className="flex items-center gap-6">
            <div className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
              Shift: <span className="text-zinc-900 dark:text-zinc-100">{session.user.name}</span>
            </div>
            
            {session.user.role === "ADMIN" && (
              <Link 
                href="/admin" 
                className="text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors"
              >
                Admin Panel
              </Link>
            )}
            <div className="w-px h-6 bg-zinc-200 dark:bg-zinc-800"></div>
            <div className="w-28">
              <SignOutButton />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 bg-zinc-50/50 dark:bg-zinc-900/20 p-4 md:p-6">
        <div className="container mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
