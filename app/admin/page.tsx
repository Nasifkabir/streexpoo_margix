import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectToDatabase from "@/lib/db";
import Product from "@/models/Product";
import Sale from "@/models/Sale";
import { TopCategoriesChart, TotalRevenueChart } from "@/components/dashboard-charts";
import PDFReportButton from "@/components/pdf-report-button";
import { 
  Shirt, 
  Tag, 
  PackageX, 
  UsersRound,
  ArrowUpRight,
  RefreshCcw
} from "lucide-react";

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);
  await connectToDatabase();

  // 1. Overview Stats
  const totalProducts = await Product.countDocuments();
  const outOfStock = await Product.countDocuments({ stockQuantity: 0 });
  
  // 2. Sales Data
  const sales = await Sale.find().populate("productId");
  
  const totalRevenue = sales.reduce((sum, sale) => sum + sale.totalAmount, 0);
  
  // Calculate revenue per day for line chart (last 7 days)
  const last7Days = Array.from({length: 7}, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return d.toISOString().split('T')[0];
  }).reverse();

  const revenueByDate: Record<string, number> = {};
  last7Days.forEach(d => revenueByDate[d] = 0);

  // Top Categories calculation
  const categorySales: Record<string, number> = {};

  sales.forEach(sale => {
    // Process Line Chart Data
    const dateStr = new Date(sale.date).toISOString().split('T')[0];
    if (revenueByDate[dateStr] !== undefined) {
      revenueByDate[dateStr] += sale.totalAmount;
    }

    // Process Donut Chart Data
    const category = sale.productId?.category || "Unknown";
    categorySales[category] = (categorySales[category] || 0) + sale.totalAmount;
  });

  const revenueData = Object.entries(revenueByDate).map(([date, revenue]) => ({
    name: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    revenue
  }));

  const topCategoriesData = Object.entries(categorySales)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  // Latest 5 products for the list
  const latestProducts = await Product.find().sort({ createdAt: -1 }).limit(5);

  const reportData = {
    totalRevenue,
    totalProducts,
    outOfStock,
    revenueByDate: revenueData,
    categorySales: topCategoriesData,
    latestProducts: JSON.parse(JSON.stringify(latestProducts)), // Serialize for client component
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-10">
      
      {/* Products Overview Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-outfit">
        <h2 className="text-xl font-black text-zinc-900 dark:text-zinc-100 font-bebas tracking-wide uppercase">Products Overview</h2>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-medium text-amber-600 dark:text-amber-500 bg-amber-500/10 px-3 py-1.5 rounded-md border border-amber-500/20">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
            </span>
            Live Updating
          </div>
          <PDFReportButton data={reportData} />
        </div>
      </div>

      {/* 4 Overview Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <OverviewCard 
          title="Total Product" 
          value={totalProducts.toLocaleString()} 
          icon={<Shirt className="h-5 w-5 text-indigo-500 dark:text-indigo-400" />} 
          trend="+12%" 
          trendUp={true} 
          iconBg="bg-indigo-500/10 dark:bg-indigo-500/20"
        />
        <OverviewCard 
          title="On Promotion" 
          value="0" 
          icon={<Tag className="h-5 w-5 text-blue-500 dark:text-blue-400" />} 
          trend="+0%" 
          trendUp={true} 
          iconBg="bg-blue-500/10 dark:bg-blue-500/20"
        />
        <OverviewCard 
          title="Out of Stock" 
          value={outOfStock.toString()} 
          icon={<PackageX className="h-5 w-5 text-orange-500 dark:text-orange-400" />} 
          trend="+5%" 
          trendUp={false} 
          iconBg="bg-orange-500/10 dark:bg-orange-500/20"
        />
        <OverviewCard 
          title="Clients with No Orders" 
          value="0" 
          icon={<UsersRound className="h-5 w-5 text-blue-500 dark:text-blue-400" />} 
          trend="-2%" 
          trendUp={true} 
          iconBg="bg-blue-500/10 dark:bg-blue-500/20"
        />
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Top Categories */}
        <div className="md:col-span-1 rounded-2xl bg-white dark:bg-[#18181b] border border-zinc-200 dark:border-zinc-800/50 p-6 flex flex-col shadow-sm">
          <h3 className="text-lg font-black text-zinc-900 dark:text-zinc-100 mb-6 font-bebas tracking-wide uppercase">Top Categories</h3>
          <div className="flex-1 flex flex-col justify-center">
            {topCategoriesData.length > 0 ? (
              <>
                <div className="text-center mb-[-40px] z-10 pointer-events-none mt-12">
                  <p className="text-xs text-zinc-500">Total sales</p>
                  <p className="text-xl font-bold text-zinc-900 dark:text-zinc-100">৳{totalRevenue.toLocaleString()}</p>
                </div>
                <TopCategoriesChart data={topCategoriesData} />
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-zinc-500">
                <p>No sales data yet.</p>
              </div>
            )}
          </div>
          <button className="mt-6 w-full py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 flex items-center justify-center gap-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
            <RefreshCcw className="h-4 w-4" /> Refresh Data
          </button>
        </div>

        {/* Total Revenue */}
        <div className="md:col-span-2 rounded-2xl bg-white dark:bg-[#18181b] border border-zinc-200 dark:border-zinc-800/50 p-6 flex flex-col shadow-sm">
          <div className="mb-6">
            <h3 className="text-lg font-black text-zinc-900 dark:text-zinc-100 font-bebas tracking-wide uppercase">Total Revenue</h3>
            <div className="flex items-end gap-3 mt-1">
              <span className="text-3xl font-black text-zinc-900 dark:text-zinc-100 font-outfit">৳{totalRevenue.toLocaleString()}</span>
              {totalRevenue > 0 && (
                <span className="flex items-center text-[10px] font-bold text-blue-600 dark:text-blue-400 bg-blue-600/10 px-2 py-0.5 rounded border border-blue-600/20 mb-1 uppercase tracking-tighter">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  +12% vs last Week
                </span>
              )}
            </div>
          </div>
          <div className="flex-1">
            <TotalRevenueChart data={revenueData} />
          </div>
        </div>
      </div>

      {/* Products List Table */}
      <div className="rounded-2xl bg-white dark:bg-[#18181b] border border-zinc-200 dark:border-zinc-800/50 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-zinc-200 dark:border-zinc-800/50">
          <h3 className="text-lg font-black text-zinc-900 dark:text-zinc-100 font-bebas tracking-wide uppercase">Products List</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-zinc-500 uppercase bg-zinc-50 dark:bg-[#1e1e22]">
              <tr>
                <th className="px-6 py-4 font-semibold">Product Name</th>
                <th className="px-6 py-4 font-semibold">Category</th>
                <th className="px-6 py-4 font-semibold">Price</th>
                <th className="px-6 py-4 font-semibold">Stock</th>
              </tr>
            </thead>
            <tbody>
              {latestProducts.map((p) => (
                <tr key={p._id.toString()} className="border-b border-zinc-100 dark:border-zinc-800/50 hover:bg-zinc-50 dark:hover:bg-zinc-800/20 transition-colors">
                  <td className="px-6 py-4 font-medium text-zinc-900 dark:text-zinc-200">{p.name}</td>
                  <td className="px-6 py-4 text-zinc-500 dark:text-zinc-400">{p.category}</td>
                  <td className="px-6 py-4 text-zinc-900 dark:text-zinc-200">৳{p.sellingPrice}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${p.stockQuantity > 5 ? 'bg-blue-600/10 text-blue-600 dark:text-blue-400 border border-blue-600/20' : 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20'}`}>
                      {p.stockQuantity} in stock
                    </span>
                  </td>
                </tr>
              ))}
              {latestProducts.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-zinc-500">
                    No products added yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

interface OverviewCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend: string;
  trendUp: boolean;
  iconBg: string;
}

function OverviewCard({ title, value, icon, trend, trendUp, iconBg }: OverviewCardProps) {
  return (
    <div className="rounded-2xl bg-white dark:bg-[#18181b] border border-zinc-200 dark:border-zinc-800/50 p-6 flex flex-col justify-between shadow-sm">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl ${iconBg}`}>
          {icon}
        </div>
      </div>
      <div>
        <h3 className="text-xs font-bold text-zinc-500 dark:text-zinc-400 mb-1 uppercase tracking-wider">{title}</h3>
        <div className="flex items-end gap-2">
          <span className="text-2xl font-black text-zinc-900 dark:text-zinc-100 font-outfit">{value}</span>
          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border mb-1 uppercase tracking-tight ${trendUp ? 'text-blue-600 dark:text-blue-400 bg-blue-600/10 border-blue-600/20' : 'text-orange-600 dark:text-orange-400 bg-orange-500/10 border-orange-500/20'}`}>
            {trend}
          </span>
        </div>
        <p className="text-[10px] text-zinc-500 mt-2 uppercase font-bold opacity-60">Vs last month</p>
      </div>
    </div>
  );
}
