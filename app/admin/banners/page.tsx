"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Layout, Image as ImageIcon, Type, Link as LinkIcon, Palette, Loader2, X } from "lucide-react";
import { useToast } from "@/context/ToastContext";

interface Banner {
  _id: string;
  title: string;
  subtitle: string;
  description: string;
  imageUrl: string;
  buttonText: string;
  bgColor: string;
  accentColor: string;
  order: number;
  isActive: boolean;
}

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    description: "",
    imageUrl: "",
    buttonText: "EXPLORE NOW",
    bgColor: "#0a192f",
    accentColor: "#3b82f6",
    order: 0,
    isActive: true,
  });

  const fetchBanners = async () => {
    try {
      const res = await fetch("/api/banners?all=true");
      const data = await res.json();
      setBanners(data);
    } catch (err) {
      showToast("Failed to fetch banners", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formDataUpload = new FormData();
    formDataUpload.append("file", file);

    try {
      setIsSubmitting(true);
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formDataUpload,
      });

      if (!res.ok) throw new Error("Upload failed");

      const data = await res.json();
      setFormData(prev => ({ ...prev, imageUrl: data.url }));
      showToast("Image uploaded successfully");
    } catch (err: any) {
      showToast(err.message, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const url = editingBanner ? `/api/banners/${editingBanner._id}` : "/api/banners";
      const method = editingBanner ? "PATCH" : "POST";
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to save banner");

      showToast(editingBanner ? "Banner updated" : "Banner created");
      setShowModal(false);
      setEditingBanner(null);
      setFormData({
        title: "",
        subtitle: "",
        description: "",
        imageUrl: "",
        buttonText: "EXPLORE NOW",
        bgColor: "#0a192f",
        accentColor: "#3b82f6",
        order: 0,
        isActive: true,
      });
      fetchBanners();
    } catch (err: any) {
      showToast(err.message, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (banner: Banner) => {
    setEditingBanner(banner);
    setFormData({
      title: banner.title,
      subtitle: banner.subtitle,
      description: banner.description,
      imageUrl: banner.imageUrl,
      buttonText: banner.buttonText,
      bgColor: banner.bgColor,
      accentColor: banner.accentColor,
      order: banner.order,
      isActive: banner.isActive,
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this banner?")) return;
    try {
      const res = await fetch(`/api/banners/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete banner");
      showToast("Banner deleted");
      fetchBanners();
    } catch (err: any) {
      showToast(err.message, "error");
    }
  };

  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-zinc-900 dark:text-zinc-100 font-bebas tracking-wide uppercase">Storefront Banners</h1>
          <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-1 uppercase font-bold tracking-widest opacity-60">
            Customize the dynamic hero carousel slides
          </p>
        </div>
        <button 
          onClick={() => {
            setEditingBanner(null);
            setFormData({
              title: "",
              subtitle: "",
              description: "",
              imageUrl: "",
              buttonText: "EXPLORE NOW",
              bgColor: "#0a192f",
              accentColor: "#3b82f6",
              order: 0,
              isActive: true,
            });
            setShowModal(true);
          }}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl font-bebas tracking-widest text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 cursor-pointer"
        >
          <Plus className="h-4 w-4" /> Add New Banner
        </button>
      </div>

      <div className="grid gap-6">
        {banners.length === 0 ? (
          <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] p-20 text-center border-2 border-dashed border-zinc-100 dark:border-zinc-800">
            <Layout className="h-16 w-16 text-zinc-200 mx-auto mb-6" />
            <p className="text-zinc-400 font-bold uppercase text-sm tracking-[0.2em]">No banners found</p>
          </div>
        ) : (
          banners.map((banner) => (
            <div key={banner._id} className="bg-white dark:bg-zinc-900 rounded-[2rem] border border-zinc-100 dark:border-zinc-800 p-6 flex flex-col md:flex-row items-center gap-8 group">
              <div className="w-full md:w-64 h-40 rounded-3xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 flex-shrink-0 relative">
                <img src={banner.imageUrl} alt={banner.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className={`absolute top-4 left-4 h-3 w-3 rounded-full ${banner.isActive ? "bg-emerald-500" : "bg-red-500 shadow-lg shadow-red-500/20"}`} />
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full" style={{ backgroundColor: banner.bgColor }} />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]" style={{ color: banner.accentColor }}>{banner.subtitle}</span>
                  </div>
                  <span className="text-[10px] font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-500 px-2 py-1 rounded-lg uppercase">Order: {banner.order}</span>
                </div>
                <h3 className="text-2xl font-black font-bebas tracking-wide text-zinc-900 dark:text-white uppercase leading-none">{banner.title.replace("\n", " ")}</h3>
                <p className="text-sm font-bold text-zinc-500 dark:text-zinc-400 line-clamp-2 uppercase tracking-tight">{banner.description}</p>
              </div>
              <div className="flex gap-2 w-full md:w-auto">
                <button 
                  onClick={() => handleEdit(banner)}
                  className="flex-1 md:flex-none p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800 text-zinc-400 hover:text-blue-600 hover:bg-blue-600/5 transition-all cursor-pointer"
                >
                  <Pencil className="h-5 w-5" />
                </button>
                <button 
                  onClick={() => handleDelete(banner._id)}
                  className="flex-1 md:flex-none p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800 text-zinc-400 hover:text-red-500 hover:bg-red-500/5 transition-all cursor-pointer"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-zinc-950 w-full max-w-4xl rounded-[3rem] p-8 md:p-12 shadow-2xl border border-zinc-100 dark:border-zinc-800 max-h-[90vh] overflow-y-auto relative">
            <button 
              onClick={() => setShowModal(false)}
              className="absolute top-8 right-8 p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-900 text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-all cursor-pointer"
            >
              <X className="h-6 w-6" />
            </button>

            <h2 className="text-3xl font-black font-bebas tracking-wide mb-8 text-zinc-900 dark:text-white uppercase">
              {editingBanner ? "Edit Banner" : "Add New Banner"}
            </h2>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                    <Type className="h-3 w-3" /> Title (use \n for line break)
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl px-6 py-4 font-bold focus:ring-2 focus:ring-blue-600 outline-none transition-all uppercase"
                    placeholder="e.g. URBAN\nSTREET"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                    <Layout className="h-3 w-3" /> Subtitle (Short Tagline)
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.subtitle}
                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                    className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl px-6 py-4 font-bold focus:ring-2 focus:ring-blue-600 outline-none transition-all uppercase"
                    placeholder="e.g. STREEXPO NEW DROP"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                    <Type className="h-3 w-3" /> Description
                  </label>
                  <textarea
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl px-6 py-4 font-bold focus:ring-2 focus:ring-blue-600 outline-none transition-all uppercase h-32 resize-none"
                    placeholder="e.g. Discover our latest premium collection..."
                  />
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                    <ImageIcon className="h-3 w-3" /> Banner Image
                  </label>
                  <div className="flex flex-col gap-4">
                    {formData.imageUrl && (
                      <div className="relative h-32 w-full rounded-2xl overflow-hidden border border-zinc-100 dark:border-zinc-800">
                        <img src={formData.imageUrl} className="h-full w-full object-cover" />
                        <button 
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, imageUrl: "" }))}
                          className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-lg shadow-lg"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                        id="banner-upload"
                      />
                      <label 
                        htmlFor="banner-upload"
                        className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-zinc-50 dark:bg-zinc-900 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl font-bold text-zinc-500 hover:text-blue-600 hover:border-blue-600 transition-all cursor-pointer"
                      >
                        <Plus className="h-5 w-5" /> {formData.imageUrl ? "Change Image" : "Upload Image"}
                      </label>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                      <Palette className="h-3 w-3" /> Background Color
                    </label>
                    <div className="flex items-center gap-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl px-4 py-2">
                      <input
                        type="color"
                        value={formData.bgColor}
                        onChange={(e) => setFormData({ ...formData, bgColor: e.target.value })}
                        className="h-10 w-10 rounded-xl bg-transparent border-none cursor-pointer"
                      />
                      <span className="font-bold text-zinc-600 dark:text-zinc-400 uppercase">{formData.bgColor}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                      <Palette className="h-3 w-3" /> Accent Color
                    </label>
                    <div className="flex items-center gap-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl px-4 py-2">
                      <input
                        type="color"
                        value={formData.accentColor}
                        onChange={(e) => setFormData({ ...formData, accentColor: e.target.value })}
                        className="h-10 w-10 rounded-xl bg-transparent border-none cursor-pointer"
                      />
                      <span className="font-bold text-zinc-600 dark:text-zinc-400 uppercase">{formData.accentColor}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Button Text</label>
                    <input
                      type="text"
                      value={formData.buttonText}
                      onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })}
                      className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl px-6 py-4 font-bold focus:ring-2 focus:ring-blue-600 outline-none transition-all uppercase"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Display Order</label>
                    <input
                      type="number"
                      value={formData.order}
                      onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                      className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl px-6 py-4 font-bold focus:ring-2 focus:ring-blue-600 outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-4">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="h-6 w-6 rounded-lg accent-blue-600"
                  />
                  <label htmlFor="isActive" className="text-sm font-black uppercase tracking-widest text-zinc-600 dark:text-zinc-400">Active Slide</label>
                </div>
              </div>

              <div className="md:col-span-2 pt-6">
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full py-5 bg-blue-600 text-white rounded-[2rem] font-bebas tracking-widest text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
                >
                  {isSubmitting ? <Loader2 className="h-6 w-6 animate-spin" /> : editingBanner ? "UPDATE BANNER" : "PUBLISH BANNER"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
