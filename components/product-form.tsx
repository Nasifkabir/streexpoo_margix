"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, CheckCircle2, XCircle, Trash2, Plus, ChevronDown } from "lucide-react";

type ProductFormProps = {
  initialData?: {
    _id?: string;
    name: string;
    category: string;
    description?: string;
    stockQuantity: number;
    purchaseRate: number;
    sellingPrice: number;
    imageUrl?: string;
    variants?: {
      size: string;
      stockQuantity: number;
    }[];
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
    description: initialData?.description || "",
    stockQuantity: initialData?.stockQuantity || 0,
    purchaseRate: initialData?.purchaseRate || 0,
    sellingPrice: initialData?.sellingPrice || 0,
    imageUrl: initialData?.imageUrl || "",
    variants: initialData?.variants || [],
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
    <form onSubmit={handleSubmit} className="space-y-12 max-w-4xl font-outfit">
      {error && (
        <div className="flex items-center gap-3 rounded-xl bg-red-50 dark:bg-red-900/20 p-4 text-sm text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800/30">
          <XCircle className="h-5 w-5" />
          <p>{error}</p>
        </div>
      )}

      {/* Basic Info & Category Section */}
      <section className="space-y-10">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-3xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-black text-xl font-bebas">01</div>
          <h3 className="text-2xl font-black font-bebas tracking-wider uppercase">Product Identity</h3>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-[3.5rem] p-8 md:p-12 border-2 border-zinc-200 dark:border-zinc-800 shadow-sm space-y-10">
          <div className="space-y-4 group">
            <label htmlFor="name" className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 pl-2">
              Product Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Urban Oversized Tee"
              className="flex h-20 w-full rounded-[2rem] border-2 border-zinc-200 dark:border-zinc-700 bg-zinc-50/10 dark:bg-zinc-950 px-8 py-2 text-xl font-black text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-300 dark:placeholder:text-zinc-800 focus:outline-none focus:border-emerald-500 transition-all"
            />
          </div>

          <div className="space-y-4 group">
            <label htmlFor="description" className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 pl-2">
              Product Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe the product's fit, style, material, and unique features..."
              rows={4}
              className="flex w-full rounded-[2rem] border-2 border-zinc-200 dark:border-zinc-700 bg-zinc-50/10 dark:bg-zinc-950 px-8 py-6 text-base font-bold text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-300 dark:placeholder:text-zinc-800 focus:outline-none focus:border-emerald-500 transition-all resize-none"
            />
          </div>

          <div className="space-y-6">
            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 pl-2">
              Select Category
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {["T-Shirt", "Shirt", "Pant", "Hoodie", "Jacket", "Accessories"].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, category: cat }))}
                  className={`flex flex-col items-center justify-center p-6 rounded-[2rem] border-2 transition-all duration-300 ${formData.category === cat
                    ? "bg-[#0a192f] border-[#0a192f] text-white shadow-xl scale-[1.05]"
                    : "bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:border-zinc-900 hover:text-zinc-900 dark:hover:text-zinc-100"
                    }`}
                >
                  <span className="text-xs font-black uppercase tracking-widest">{cat}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing & Inventory Section */}
      <section className="space-y-10">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-3xl bg-blue-500/10 text-blue-600 flex items-center justify-center font-black text-xl font-bebas">02</div>
          <h3 className="text-2xl font-black font-bebas tracking-wider uppercase">Pricing & Stock</h3>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Pricing Card */}
          <div className="lg:col-span-2 bg-white dark:bg-zinc-900 rounded-[3.5rem] p-8 md:p-12 border-2 border-zinc-200 dark:border-zinc-800 shadow-sm grid sm:grid-cols-2 gap-8">
            <div className="space-y-4">
              <label htmlFor="purchaseRate" className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 pl-2">
                Cost Price (৳)
              </label>
              <div className="relative">
                <input
                  id="purchaseRate"
                  name="purchaseRate"
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  value={formData.purchaseRate || ""}
                  onChange={handleChange}
                  className="w-full h-20 bg-zinc-50/10 dark:bg-zinc-950 rounded-[2rem] border-2 border-zinc-200 dark:border-zinc-700 px-8 text-2xl font-black text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-emerald-500 transition-all"
                />
              </div>
            </div>

            <div className="space-y-4">
              <label htmlFor="sellingPrice" className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 pl-2">
                Selling Price (৳)
              </label>
              <div className="relative">
                <input
                  id="sellingPrice"
                  name="sellingPrice"
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  value={formData.sellingPrice || ""}
                  onChange={handleChange}
                  className="w-full h-20 bg-zinc-50/10 dark:bg-zinc-950 rounded-[2rem] border-2 border-zinc-200 dark:border-zinc-700 px-8 text-2xl font-black text-emerald-600 dark:text-emerald-400 focus:outline-none focus:border-emerald-500 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Main Stock Card */}
          <div className="bg-[#0a192f] dark:bg-emerald-600 rounded-[3.5rem] p-8 md:p-12 shadow-2xl text-white flex flex-col justify-between">
            <div className="space-y-2">
              <label htmlFor="stockQuantity" className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 opacity-70">
                Total Units In Stock
              </label>
              <input
                id="stockQuantity"
                name="stockQuantity"
                type="number"
                min="0"
                required
                readOnly={formData.variants.length > 0}
                value={formData.stockQuantity || ""}
                onChange={handleChange}
                className={`w-full bg-transparent border-none p-0 text-5xl font-black text-white focus:ring-0 ${formData.variants.length > 0 ? "cursor-not-allowed opacity-50" : ""}`}
              />
            </div>
            {formData.variants.length > 0 ? (
              <p className="text-[10px] font-black uppercase tracking-[0.2em] bg-white/20 px-4 py-2 rounded-full w-fit">
                Managed by sizes
              </p>
            ) : (
              <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">
                Manual stock override
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Variations Section */}
      <section className="space-y-10">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-3xl bg-purple-500/10 text-purple-600 flex items-center justify-center font-black text-xl font-bebas">03</div>
          <h3 className="text-2xl font-black font-bebas tracking-wider uppercase">Available Sizes & Stock</h3>
        </div>

        <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
          {["S", "M", "L", "XL", "XXL"].map((size) => {
            const variantIndex = formData.variants.findIndex(v => v.size === size);
            const isEnabled = variantIndex !== -1;
            const stock = isEnabled ? formData.variants[variantIndex].stockQuantity : 0;

            const toggleSize = () => {
              setFormData(prev => {
                let newVariants = [...prev.variants];
                if (isEnabled) {
                  newVariants = newVariants.filter(v => v.size !== size);
                } else {
                  newVariants.push({ size, stockQuantity: 0 });
                }
                const totalStock = newVariants.reduce((sum, v) => sum + v.stockQuantity, 0);
                return { ...prev, variants: newVariants, stockQuantity: totalStock };
              });
            };

            const updateStock = (val: number) => {
              setFormData(prev => {
                const newVariants = [...prev.variants];
                const idx = newVariants.findIndex(v => v.size === size);
                if (idx !== -1) {
                  newVariants[idx].stockQuantity = val;
                }
                const totalStock = newVariants.reduce((sum, v) => sum + v.stockQuantity, 0);
                return { ...prev, variants: newVariants, stockQuantity: totalStock };
              });
            };

            return (
              <div 
                key={size}
                className={`relative group flex flex-col p-6 rounded-3xl border-2 transition-all duration-300 ${
                  isEnabled 
                    ? "bg-emerald-500 border-emerald-500 shadow-xl" 
                    : "bg-[#0a192f] border-[#0a192f] shadow-sm"
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-2xl font-black font-bebas tracking-widest text-white`}>
                    {size}
                  </span>
                  <button
                    type="button"
                    onClick={toggleSize}
                    className={`h-8 w-8 rounded-full flex items-center justify-center transition-all duration-500 ${
                      isEnabled 
                        ? "bg-white text-emerald-500" 
                        : "bg-white/20 text-white rotate-45"
                    }`}
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>

                {isEnabled ? (
                  <div className="space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <p className="text-[9px] font-black text-emerald-50 uppercase tracking-[0.2em] opacity-80">Stock</p>
                    <input
                      type="number"
                      min="0"
                      value={stock || ""}
                      onChange={(e) => updateStock(Number(e.target.value))}
                      className="w-full h-10 bg-white rounded-xl border-none px-3 text-sm font-black text-[#0a192f] focus:ring-2 focus:ring-white/50"
                      placeholder="0"
                    />
                  </div>
                ) : (
                  <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Inactive</p>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Image Section */}
      <section className="space-y-10">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-3xl bg-orange-500/10 text-orange-600 flex items-center justify-center font-black text-xl font-bebas">04</div>
          <h3 className="text-2xl font-black font-bebas tracking-wider uppercase">Visual Presentation</h3>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-[3.5rem] p-12 border-2 border-zinc-200 dark:border-zinc-800 shadow-sm">
          <div className="mt-1 flex justify-center rounded-[3.5rem] border-4 border-dashed border-zinc-200 dark:border-zinc-800 px-6 pt-16 pb-16 hover:bg-zinc-50/30 dark:hover:bg-zinc-950 transition-all duration-700 group relative overflow-hidden">
            <div className="space-y-1 text-center w-full relative z-10">
              {formData.imageUrl ? (
                <div className="relative w-full max-w-sm h-80 mx-auto mb-4 rounded-[3rem] overflow-hidden border-8 border-white dark:border-zinc-950 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.2)] transition-transform group-hover:scale-[1.03] duration-700">
                  <img src={formData.imageUrl} alt="Preview" className="object-cover w-full h-full" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, imageUrl: "" })}
                      className="bg-white text-red-500 p-6 rounded-full hover:bg-red-500 hover:text-white shadow-2xl transform hover:scale-110 transition-all duration-500"
                    >
                      <Trash2 className="h-8 w-8" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="py-16">
                  <div className="mx-auto h-32 w-32 rounded-[3rem] bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-700 shadow-inner group-hover:shadow-emerald-500/20">
                    <Plus className="h-12 w-12 text-zinc-200 group-hover:text-white transition-colors" />
                  </div>

                  <div className="flex flex-col items-center">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer rounded-full bg-[#0a192f] px-10 py-5 font-black text-white hover:bg-blue-600 transition-all shadow-xl hover:scale-105 uppercase tracking-[0.2em] text-xs"
                    >
                      <span>Upload Product Media</span>
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
                    <p className="text-[10px] text-zinc-300 font-black mt-6 uppercase tracking-[0.3em] opacity-40">
                      PNG, JPG up to 10MB
                    </p>
                  </div>
                </div>
              )}

              {uploadingImage && (
                <div className="absolute inset-0 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md flex flex-col items-center justify-center z-20 rounded-[3rem]">
                  <Loader2 className="h-16 w-16 text-[#0a192f] dark:text-emerald-500 animate-spin mb-6" />
                  <p className="text-sm font-black text-zinc-900 dark:text-white uppercase tracking-[0.3em] animate-pulse">Syncing Media...</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="flex items-center justify-end gap-6 pt-16 border-t-2 border-zinc-50 dark:border-zinc-800/50">
        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex h-20 items-center justify-center rounded-[2rem] bg-transparent px-12 text-xs font-black uppercase tracking-[0.3em] text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-all"
        >
          Discard Changes
        </button>
        <button
          type="submit"
          disabled={loading}
          className="group relative inline-flex h-20 items-center justify-center overflow-hidden rounded-[2.5rem] bg-[#0a192f] px-16 text-sm font-black uppercase tracking-[0.3em] text-white transition-all hover:scale-[1.05] hover:bg-emerald-600 shadow-[0_20px_50px_rgba(10,25,47,0.3)] disabled:pointer-events-none disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="h-6 w-6 animate-spin" />
          ) : (
            <span className="flex items-center gap-3">
              <CheckCircle2 className="h-6 w-6" />
              {initialData ? "Commit Updates" : "Create Product"}
            </span>
          )}
        </button>
      </div>
    </form>
  );
}

