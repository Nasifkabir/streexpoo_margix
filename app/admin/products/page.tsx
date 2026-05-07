import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectToDatabase from "@/lib/db";
import Product from "@/models/Product";
import Link from "next/link";
import { Plus, Search } from "lucide-react";

export default async function ProductsPage() {
  const session = await getServerSession(authOptions);
  await connectToDatabase();

  const products = await Product.find({}).sort({ createdAt: -1 });

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-10">
      <div className="flex items-center justify-between font-outfit">
        <div>
          <h1 className="text-2xl font-black text-zinc-900 dark:text-zinc-100 font-bebas tracking-wide uppercase">Inventory Management</h1>
          <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-1 uppercase font-bold tracking-widest opacity-60">
            Manage your clothing shop inventory, pricing, and stock.
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center justify-center rounded-lg bg-blue-600 hover:bg-blue-700 px-6 py-2.5 text-xs font-black text-white transition-all focus:outline-none focus:ring-2 focus:ring-blue-600/50 shadow-lg shadow-blue-600/20 uppercase tracking-widest font-bebas"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Link>
      </div>

      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800/50 bg-white dark:bg-[#18181b] shadow-sm overflow-hidden">
        <div className="p-4 border-b border-zinc-200 dark:border-zinc-800/50 flex justify-between items-center bg-zinc-50 dark:bg-[#1e1e22]/50">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Search products..."
              className="flex h-9 w-full rounded-md border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800/50 pl-9 pr-4 py-2 text-xs text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-blue-600/50 focus:ring-1 focus:ring-blue-600/50 transition-all font-bold"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-zinc-500 uppercase bg-zinc-50 dark:bg-[#1e1e22]">
              <tr>
                <th scope="col" className="px-6 py-4 font-semibold w-16">Image</th>
                <th scope="col" className="px-6 py-4 font-semibold">Product Name</th>
                <th scope="col" className="px-6 py-4 font-semibold">Category</th>
                <th scope="col" className="px-6 py-4 font-semibold">Stock</th>
                <th scope="col" className="px-6 py-4 font-semibold">Purchase Rate</th>
                <th scope="col" className="px-6 py-4 font-semibold">Selling Price</th>
                <th scope="col" className="px-6 py-4 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-zinc-500">
                    No products found. Click "Add Product" to create one.
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr
                    key={product._id.toString()}
                    className="border-b border-zinc-100 dark:border-zinc-800/50 hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors"
                  >
                    <td className="px-6 py-2">
                      <div className="h-10 w-10 rounded-md bg-zinc-100 dark:bg-zinc-800 overflow-hidden border border-zinc-200 dark:border-zinc-700 flex items-center justify-center">
                        {product.imageUrl ? (
                          <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover" />
                        ) : (
                          <span className="text-[10px] text-zinc-400 font-medium">{product.category.substring(0, 3)}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-zinc-900 dark:text-zinc-200">
                      {product.name}
                    </td>
                    <td className="px-6 py-4 text-zinc-500 dark:text-zinc-400">{product.category}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${
                          product.stockQuantity > 10
                            ? "bg-blue-600/10 text-blue-600 dark:text-blue-400 border-blue-600/20"
                            : "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20"
                        }`}
                      >
                        {product.stockQuantity} in stock
                      </span>
                    </td>
                    <td className="px-6 py-4 text-zinc-600 dark:text-zinc-300">৳{product.purchaseRate}</td>
                    <td className="px-6 py-4 font-bold text-zinc-900 dark:text-zinc-100 font-outfit">৳{product.sellingPrice}</td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/admin/products/${product._id.toString()}`}
                        className="text-xs font-black text-blue-600 dark:text-blue-500 hover:text-blue-500 dark:hover:text-blue-400 uppercase tracking-widest font-bebas underline-offset-4 hover:underline"
                      >
                        Edit
                      </Link>
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
