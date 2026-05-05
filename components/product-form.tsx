"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";

type ProductFormProps = {
  initialData?: {
    _id?: string;
    name: string;
    category: string;
    stockQuantity: number;
    purchaseRate: number;
    sellingPrice: number;
    imageUrl?: string;
  };
};

export function ProductForm({ initialData }: ProductFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [uploadingImage, setUploadingImage] = useState(false);
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    category: initialData?.category || "T-Shirt",
    stockQuantity: initialData?.stockQuantity || 0,
    purchaseRate: initialData?.purchaseRate || 0,
    sellingPrice: initialData?.sellingPrice || 0,
    imageUrl: initialData?.imageUrl || "",
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setError("");

    try {
      const uploadData = new FormData();
      uploadData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: uploadData,
      });

      if (!res.ok) throw new Error("Image upload failed");

      const data = await res.json();
      setFormData(prev => ({ ...prev, imageUrl: data.url }));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: ["stockQuantity", "purchaseRate", "sellingPrice"].includes(name)
        ? value === "" ? 0 : Number(value)
        : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const url = initialData?._id
        ? `/api/products/${initialData._id}`
        : "/api/products";
        
      const method = initialData?._id ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Something went wrong");
      }

      router.push("/admin/products");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-3xl">
      {error && (
        <div className="flex items-center gap-3 rounded-xl bg-red-50 dark:bg-red-900/20 p-4 text-sm text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800/30">
          <XCircle className="h-5 w-5" />
          <p>{error}</p>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2 md:col-span-2">
          <label htmlFor="name" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Product Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g. Premium Cotton T-Shirt"
            className="flex h-11 w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 px-4 py-2 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 dark:focus:ring-emerald-400/50 focus:border-transparent transition-all shadow-sm"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="category" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Category
          </label>
          <select
            id="category"
            name="category"
            required
            value={formData.category}
            onChange={handleChange}
            className="flex h-11 w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 px-4 py-2 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 dark:focus:ring-emerald-400/50 focus:border-transparent transition-all shadow-sm appearance-none cursor-pointer"
          >
            <option value="T-Shirt">T-Shirt</option>
            <option value="Shirt">Shirt</option>
            <option value="Pant">Pant</option>
            <option value="Hoodie">Hoodie</option>
            <option value="Jacket">Jacket</option>
            <option value="Accessories">Accessories</option>
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="stockQuantity" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Stock Quantity
          </label>
          <input
            id="stockQuantity"
            name="stockQuantity"
            type="number"
            min="0"
            required
            value={formData.stockQuantity}
            onChange={handleChange}
            className="flex h-11 w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 px-4 py-2 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 dark:focus:ring-emerald-400/50 focus:border-transparent transition-all shadow-sm"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="purchaseRate" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Purchase Rate (৳)
          </label>
          <input
            id="purchaseRate"
            name="purchaseRate"
            type="number"
            min="0"
            step="0.01"
            required
            value={formData.purchaseRate}
            onChange={handleChange}
            className="flex h-11 w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 px-4 py-2 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 dark:focus:ring-emerald-400/50 focus:border-transparent transition-all shadow-sm"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="sellingPrice" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Selling Price (৳)
          </label>
          <input
            id="sellingPrice"
            name="sellingPrice"
            type="number"
            min="0"
            step="0.01"
            required
            value={formData.sellingPrice}
            onChange={handleChange}
            className="flex h-11 w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 px-4 py-2 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 dark:focus:ring-emerald-400/50 focus:border-transparent transition-all shadow-sm"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Product Image
          </label>
          <div className="mt-1 flex justify-center rounded-[2rem] border border-dashed border-zinc-300 dark:border-zinc-700 px-6 pt-10 pb-10 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-all group">
            <div className="space-y-1 text-center w-full">
              {formData.imageUrl ? (
                <div className="relative w-full max-w-sm h-64 mx-auto mb-4 rounded-3xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-xl group-hover:scale-[1.02] transition-transform">
                  <img src={formData.imageUrl} alt="Preview" className="object-cover w-full h-full" />
                  <button 
                    type="button"
                    onClick={() => setFormData({ ...formData, imageUrl: "" })}
                    className="absolute top-4 right-4 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 shadow-lg transform hover:scale-110 transition-all"
                  >
                    <XCircle className="h-6 w-6" />
                  </button>
                </div>
              ) : (
                <div className="py-4">
                  <div className="mx-auto h-20 w-20 rounded-3xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <svg
                      className="h-10 w-10 text-zinc-400"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                      aria-hidden="true"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>
              )}
              
              {!formData.imageUrl && (
                <div className="flex flex-col items-center">
                  <div className="flex text-sm text-zinc-600 dark:text-zinc-400 justify-center">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer rounded-md bg-transparent font-bold text-emerald-600 dark:text-emerald-400 focus-within:outline-none hover:text-emerald-500"
                    >
                      <span>Upload a file</span>
                      <input 
                        id="file-upload" 
                        name="file-upload" 
                        type="file" 
                        className="sr-only" 
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={uploadingImage}
                      />
                    </label>
                    <p className="pl-1 font-medium">or drag and drop</p>
                  </div>
                  <p className="text-xs text-zinc-500 font-medium mt-1">
                    PNG, JPG, GIF up to 5MB
                  </p>
                  {uploadingImage && <p className="text-sm text-emerald-500 mt-4 flex items-center justify-center gap-2 font-bold"><Loader2 className="h-4 w-4 animate-spin"/> Uploading...</p>}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-4 pt-8 border-t border-zinc-100 dark:border-zinc-800/50">
        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex h-12 items-center justify-center rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-transparent px-8 py-2 text-sm font-bold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all focus:outline-none"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-2xl bg-emerald-500 px-8 py-2 text-sm font-bold text-white transition-all hover:scale-[1.02] hover:bg-emerald-600 focus:outline-none active:scale-[0.98] shadow-lg shadow-emerald-500/20 disabled:pointer-events-none disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : initialData ? (
            <span className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Update Product
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Save Product
            </span>
          )}
        </button>
      </div>
    </form>
  );
}
