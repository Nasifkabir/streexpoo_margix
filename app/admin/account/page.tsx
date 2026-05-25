"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { CheckCircle2, Eye, EyeOff, KeyRound, Loader2, ShieldCheck } from "lucide-react";

export default function AdminAccountPage() {
  const { data: session } = useSession();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswords, setShowPasswords] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setSuccess(false), 5000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to change password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-2xl font-outfit">
      <div className="flex items-center gap-3 mb-8">
        <div className="h-10 w-10 rounded-xl bg-blue-600/10 flex items-center justify-center">
          <ShieldCheck className="h-5 w-5 text-blue-600" />
        </div>
        <div>
          <h1 className="text-2xl font-black font-bebas tracking-wide text-zinc-900 dark:text-white">MY ACCOUNT</h1>
          <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest">Admin profile &amp; security</p>
        </div>
      </div>

      {/* Account Info Card */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-zinc-100 dark:border-zinc-800 mb-6 shadow-sm">
        <h2 className="text-xs font-black text-zinc-400 uppercase tracking-widest mb-4">Account Information</h2>
        <div className="space-y-3">
          <div className="flex justify-between items-center py-2 border-b border-zinc-50 dark:border-zinc-800">
            <span className="text-sm font-bold text-zinc-500">Name</span>
            <span className="text-sm font-black text-zinc-900 dark:text-white">{session?.user?.name || "—"}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-zinc-50 dark:border-zinc-800">
            <span className="text-sm font-bold text-zinc-500">Email</span>
            <span className="text-sm font-black text-zinc-900 dark:text-white">{session?.user?.email || "—"}</span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-sm font-bold text-zinc-500">Role</span>
            <span className="text-[10px] font-black bg-blue-100 dark:bg-blue-900/30 text-blue-600 px-3 py-1 rounded-full uppercase tracking-widest">
              Administrator
            </span>
          </div>
        </div>
      </div>

      {/* Change Password Card */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-zinc-100 dark:border-zinc-800 shadow-sm">
        <div className="flex items-center gap-2 mb-6">
          <KeyRound className="h-5 w-5 text-blue-600" />
          <h2 className="text-sm font-black text-zinc-900 dark:text-white uppercase tracking-widest">Change Password</h2>
        </div>

        {success && (
          <div className="flex items-center gap-3 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 rounded-xl p-4 mb-5">
            <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
            <span className="text-sm font-bold">Password updated successfully!</span>
          </div>
        )}

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 text-red-600 dark:text-red-400 rounded-xl p-4 mb-5 text-sm font-bold">
            {error}
          </div>
        )}

        <form onSubmit={handleChangePassword} className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-black text-zinc-500 uppercase tracking-widest">Current Password</label>
            <div className="relative">
              <input
                type={showPasswords ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                placeholder="Your current password"
                className="flex h-12 w-full rounded-xl border-2 border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 px-4 pr-12 text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:border-blue-600 transition-colors"
              />
              <button type="button" onClick={() => setShowPasswords(!showPasswords)} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200">
                {showPasswords ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black text-zinc-500 uppercase tracking-widest">New Password</label>
            <input
              type={showPasswords ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={6}
              placeholder="Min. 6 characters"
              className="flex h-12 w-full rounded-xl border-2 border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 px-4 text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:border-blue-600 transition-colors"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black text-zinc-500 uppercase tracking-widest">Confirm New Password</label>
            <input
              type={showPasswords ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="Repeat new password"
              className="flex h-12 w-full rounded-xl border-2 border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 px-4 text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:border-blue-600 transition-colors"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="flex h-12 w-full items-center justify-center rounded-xl bg-[#0a192f] text-sm font-black text-white hover:bg-blue-600 transition-all disabled:opacity-50 uppercase tracking-widest gap-2 mt-2"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "UPDATE PASSWORD"}
          </button>
        </form>
      </div>
    </div>
  );
}
