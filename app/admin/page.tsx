import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectToDatabase from "@/lib/db";
import Product from "@/models/Product";
import { DollarSign, Package, TrendingUp } from "lucide-react";

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);
  await connectToDatabase();

  const productsCount = await Product.countDocuments();

  // Basic stats for now (will calculate real profit when Sales are implemented)
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-zinc-500 dark:text-zinc-400 mt-2">
          Welcome back, {session?.user.name}. Here is an overview of your shop.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Total Products Card */}
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
              Total Inventory Types
            </h3>
            <Package className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
          </div>
          <div className="mt-4">
            <span className="text-3xl font-bold">{productsCount}</span>
          </div>
        </div>

        {/* Total Sales Card (Placeholder) */}
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
              Today's Sales
            </h3>
            <TrendingUp className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
          </div>
          <div className="mt-4">
            <span className="text-3xl font-bold">0</span>
            <span className="text-sm text-zinc-500 dark:text-zinc-400 ml-2">items sold</span>
          </div>
        </div>

        {/* Total Profit Card (Placeholder) */}
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
              Estimated Profit
            </h3>
            <DollarSign className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
          </div>
          <div className="mt-4">
            <span className="text-3xl font-bold">৳0</span>
          </div>
        </div>
      </div>
    </div>
  );
}
