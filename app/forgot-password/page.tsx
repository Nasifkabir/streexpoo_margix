"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2, ArrowRight, CheckCircle2, Mail } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to send email");
      }

      setSent(true);
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
        <Link href="/login" className="text-xs font-bold text-zinc-500 hover:text-blue-600 uppercase tracking-widest transition-colors">
          Back to Login
        </Link>
      </header>

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {sent ? (
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="h-20 w-20 rounded-full bg-emerald-100 flex items-center justify-center">
                  <CheckCircle2 className="h-10 w-10 text-emerald-600" />
                </div>
              </div>
              <h1 className="text-2xl font-black font-bebas tracking-wide text-zinc-900 dark:text-white">CHECK YOUR EMAIL</h1>
              <p className="text-sm text-zinc-500">
                We&apos;ve sent a password reset link to <strong className="text-zinc-900 dark:text-white">{email}</strong>. 
                The link expires in 1 hour.
              </p>
              <p className="text-xs text-zinc-400">Didn&apos;t receive it? Check your spam folder or try again.</p>
              <button
                onClick={() => setSent(false)}
                className="text-xs font-bold text-blue-600 hover:underline uppercase tracking-widest"
              >
                Try again
              </button>
            </div>
          ) : (
            <>
              <div className="mb-8 text-center">
                <div className="flex justify-center mb-4">
                  <div className="h-16 w-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <Mail className="h-8 w-8 text-blue-600" />
                  </div>
                </div>
                <h1 className="text-2xl md:text-3xl font-black tracking-tight text-zinc-900 dark:text-white font-bebas">
                  FORGOT PASSWORD?
                </h1>
                <p className="text-xs text-zinc-500 mt-2 font-bold tracking-wider">
                  Enter your email and we&apos;ll send you a reset link
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                  <div className="rounded-xl bg-red-50 dark:bg-red-900/20 p-4 text-sm text-red-600 dark:text-red-400 border border-red-100 dark:border-red-800">
                    {error}
                  </div>
                )}

                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className="flex h-12 w-full rounded-xl border-2 border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:border-blue-600 transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex h-12 w-full items-center justify-center rounded-xl bg-[#0a192f] px-4 text-sm font-black text-white transition-all hover:bg-blue-600 disabled:opacity-50 tracking-widest uppercase gap-2"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>SEND RESET LINK <ArrowRight className="h-4 w-4" /></>
                  )}
                </button>
              </form>

              <div className="mt-6 text-center text-xs font-bold text-zinc-500">
                Remember your password?{" "}
                <Link href="/login" className="text-zinc-900 dark:text-white hover:text-blue-600 underline">
                  Sign in
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
