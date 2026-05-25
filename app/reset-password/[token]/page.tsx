"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, Eye, EyeOff, CheckCircle2, Lock } from "lucide-react";

export default function ResetPasswordPage() {
  const { token } = useParams<{ token: string }>();
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to reset password");

      setDone(true);
      setTimeout(() => router.push("/login"), 3000);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An unexpected error occurred";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col font-outfit">
      <header className="py-5 px-8 border-b border-zinc-100 dark:border-zinc-900 bg-white dark:bg-zinc-950 flex justify-between items-center">
        <Link href="/" className="font-bebas text-2xl tracking-wide text-zinc-900 dark:text-white uppercase">
          Streexpo
        </Link>
      </header>

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {done ? (
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="h-20 w-20 rounded-full bg-emerald-100 flex items-center justify-center">
                  <CheckCircle2 className="h-10 w-10 text-emerald-600" />
                </div>
              </div>
              <h1 className="text-2xl font-black font-bebas tracking-wide text-zinc-900 dark:text-white">PASSWORD RESET!</h1>
              <p className="text-sm text-zinc-500">Your password has been updated. Redirecting you to login...</p>
            </div>
          ) : (
            <>
              <div className="mb-8 text-center">
                <div className="flex justify-center mb-4">
                  <div className="h-16 w-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <Lock className="h-8 w-8 text-blue-600" />
                  </div>
                </div>
                <h1 className="text-2xl md:text-3xl font-black tracking-tight text-zinc-900 dark:text-white font-bebas">
                  SET NEW PASSWORD
                </h1>
                <p className="text-xs text-zinc-500 mt-2 font-bold tracking-wider">
                  Choose a strong password for your account
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                  <div className="rounded-xl bg-red-50 dark:bg-red-900/20 p-4 text-sm text-red-600 dark:text-red-400 border border-red-100 dark:border-red-800">
                    {error}
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">New Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Min. 6 characters"
                      required
                      className="flex h-12 w-full rounded-xl border-2 border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 pr-12 text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:border-blue-600 transition-colors"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200">
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Confirm Password</label>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    placeholder="Repeat your password"
                    required
                    className="flex h-12 w-full rounded-xl border-2 border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:border-blue-600 transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex h-12 w-full items-center justify-center rounded-xl bg-[#0a192f] text-sm font-black text-white transition-all hover:bg-blue-600 disabled:opacity-50 tracking-widest uppercase gap-2"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "UPDATE PASSWORD"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
