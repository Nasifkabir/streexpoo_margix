import { ProductForm } from "@/components/product-form";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import connectToDatabase from "@/lib/db";
import Product from "@/models/Product";
import { notFound } from "next/navigation";

export default async function EditProductPage({
  params,
}: {
  params: { id: string };
}) {
  await connectToDatabase();
  
  const product = await Product.findById(params.id);

  if (!product) {
    notFound();
  }

  // Convert mongoose document to plain object
  const initialData = {
    _id: product._id.toString(),
    name: product.name,
    category: product.category,
    stockQuantity: product.stockQuantity,
    purchaseRate: product.purchaseRate,
    sellingPrice: product.sellingPrice,
    imageUrl: product.imageUrl || "",
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/products"
          className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-zinc-200 dark:border-zinc-800 bg-transparent text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="sr-only">Back to Inventory</span>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Product</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-2">
            Update the details for {product.name}.
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 shadow-sm">
        <ProductForm initialData={initialData} />
      </div>
    </div>
  );
}
