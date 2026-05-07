import connectToDatabase from "@/lib/db";
import Product from "@/models/Product";
import POSClient from "@/components/pos-client";

export default async function POSPage() {
  await connectToDatabase();
  
  // Only fetch products with stock > 0 to prevent selling out of stock items
  const productsRaw = await Product.find({ stockQuantity: { $gt: 0 } }).sort({ name: 1 });
  
  // Convert Mongoose docs to plain objects
  const products = productsRaw.map(p => ({
    _id: p._id.toString(),
    name: p.name,
    category: p.category,
    stockQuantity: p.stockQuantity,
    sellingPrice: p.sellingPrice,
    imageUrl: p.imageUrl,
  }));

  return <POSClient products={products} />;
}
