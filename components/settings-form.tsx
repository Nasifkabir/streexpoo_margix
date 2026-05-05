"use client";

import { useState } from "react";
import { Loader2, CheckCircle2, XCircle, Settings2, Image as ImageIcon } from "lucide-react";
import { useRouter } from "next/navigation";

export function SettingsForm({ initialData }: { initialData: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    storeName: initialData?.storeName || "",
    logoUrl: initialData?.logoUrl || "",
    contactEmail: initialData?.contactEmail || "",
    contactPhone: initialData?.contactPhone || "",
    address: initialData?.address || "",
    footerText: initialData?.footerText || "",
    facebookUrl: initialData?.facebookUrl || "",
    instagramUrl: initialData?.instagramUrl || "",
    currencySymbol: initialData?.currencySymbol || "৳",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingLogo(true);
    setError("");

    try {
      const uploadData = new FormData();
      uploadData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: uploadData,
      });

      if (!res.ok) throw new Error("Logo upload failed");

      const data = await res.json();
      setFormData(prev => ({ ...prev, logoUrl: data.url }));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update settings");
      }

      setSuccess(true);
      router.refresh();
      
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl bg-white dark:bg-[#18181b] p-6 sm:p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800/50 shadow-sm">
      <div className="flex items-center gap-3 pb-6 border-b border-zinc-200 dark:border-zinc-800/50">
        <div className="p-2.5 bg-emerald-500/10 rounded-xl text-emerald-600 dark:text-emerald-400">
          <Settings2 className="h-6 w-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">Global Store Settings</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Manage public storefront details</p>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-3 rounded-xl bg-red-50 dark:bg-red-900/20 p-4 text-sm text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800/30">
          <XCircle className="h-5 w-5" />
          <p>{error}</p>
        </div>
      )}

      {success && (
        <div className="flex items-center gap-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 p-4 text-sm text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/30">
          <CheckCircle2 className="h-5 w-5" />
          <p>Settings saved successfully!</p>
        </div>
      )}

      <div className="grid gap-8 md:grid-cols-2">
        {/* Left Column */}
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
              Store Logo
            </label>
            <div className="mt-1 flex justify-center rounded-xl border border-dashed border-zinc-300 dark:border-zinc-700 px-6 py-6 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors">
              <div className="space-y-2 text-center flex flex-col items-center">
                {formData.logoUrl ? (
                  <div className="relative w-32 h-32 mb-4 rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 p-2">
                    <img src={formData.logoUrl} alt="Logo Preview" className="object-contain w-full h-full" />
                    <button 
                      type="button"
                      onClick={() => setFormData({ ...formData, logoUrl: "" })}
                      className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 shadow-md scale-75"
                    >
                      <XCircle className="h-5 w-5" />
                    </button>
                  </div>
                ) : (
                  <ImageIcon className="mx-auto h-12 w-12 text-zinc-400" />
                )}
                
                {!formData.logoUrl && (
                  <>
                    <div className="flex text-sm text-zinc-600 dark:text-zinc-400 justify-center">
                      <label className="relative cursor-pointer rounded-md bg-transparent font-medium text-emerald-600 dark:text-emerald-400 focus-within:outline-none hover:text-emerald-500">
                        <span>Upload logo</span>
                        <input type="file" className="sr-only" accept="image/*" onChange={handleLogoUpload} disabled={uploadingLogo} />
                      </label>
                    </div>
                    {uploadingLogo && <p className="text-sm text-emerald-500 flex items-center justify-center gap-2"><Loader2 className="h-4 w-4 animate-spin"/> Uploading...</p>}
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Store Name
            </label>
            <input
              name="storeName"
              type="text"
              required
              value={formData.storeName}
              onChange={handleChange}
              className="flex h-11 w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 px-4 py-2 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-transparent transition-all shadow-sm"
            />
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Contact Email
            </label>
            <input
              name="contactEmail"
              type="email"
              value={formData.contactEmail}
              onChange={handleChange}
              className="flex h-11 w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 px-4 py-2 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all shadow-sm"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Contact Phone
            </label>
            <input
              name="contactPhone"
              type="text"
              value={formData.contactPhone}
              onChange={handleChange}
              className="flex h-11 w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 px-4 py-2 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all shadow-sm"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Physical Address
            </label>
            <input
              name="address"
              type="text"
              value={formData.address}
              onChange={handleChange}
              className="flex h-11 w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 px-4 py-2 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all shadow-sm"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Footer Copyright Text
            </label>
            <textarea
              name="footerText"
              rows={2}
              value={formData.footerText}
              onChange={handleChange}
              className="flex w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 px-4 py-3 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all shadow-sm resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Facebook URL
              </label>
              <input
                name="facebookUrl"
                type="text"
                value={formData.facebookUrl}
                onChange={handleChange}
                placeholder="https://facebook.com/..."
                className="flex h-11 w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 px-4 py-2 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all shadow-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Instagram URL
              </label>
              <input
                name="instagramUrl"
                type="text"
                value={formData.instagramUrl}
                onChange={handleChange}
                placeholder="https://instagram.com/..."
                className="flex h-11 w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 px-4 py-2 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all shadow-sm"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Currency Symbol
            </label>
            <input
              name="currencySymbol"
              type="text"
              value={formData.currencySymbol}
              onChange={handleChange}
              placeholder="৳, $, etc."
              className="flex h-11 w-24 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 px-4 py-2 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all shadow-sm"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <button
          type="submit"
          disabled={loading}
          className="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-xl bg-emerald-500 px-8 font-bold text-white transition-all hover:scale-[1.02] hover:bg-emerald-600 focus:outline-none active:scale-[0.98] shadow-lg shadow-emerald-500/20 disabled:opacity-50 disabled:pointer-events-none"
        >
          {loading ? (
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          ) : (
            "Save Settings"
          )}
        </button>
      </div>
    </form>
  );
}
