"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Loader2, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function CustomerLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (res?.error) {
        setError("Invalid email or password");
        setLoading(false);
        return;
      }

      router.push("/");
      router.refresh();
    } catch (err) {
      setError("An unexpected error occurred");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-outfit">
      {/* Simple Header */}
      <header className="py-4 px-8 border-b border-zinc-100 flex justify-between items-center">
        <Link href="/" className="font-bebas text-2xl tracking-wide text-zinc-900">
          MARGIX
        </Link>
        <Link href="/" className="text-xs font-bold text-zinc-500 hover:text-zinc-900 uppercase tracking-widest">
          Back to Store
        </Link>
      </header>

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="mb-6 text-center">
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-zinc-900 font-bebas">
              WELCOME BACK
            </h1>
            <p className="text-xs text-zinc-500 mt-2 uppercase font-bold tracking-wider">
              Sign in to your account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 border border-red-100">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-semibold text-zinc-900">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="flex h-10 w-full rounded-none border-b-2 border-zinc-200 bg-transparent px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-blue-600 transition-colors"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-sm font-semibold text-zinc-900">
                  Password
                </label>
                <Link href="#" className="text-xs text-zinc-500 hover:text-zinc-900 underline">
                  Forgot password?
                </Link>
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="flex h-10 w-full rounded-none border-b-2 border-zinc-200 bg-transparent px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-blue-600 transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group relative flex h-11 w-full items-center justify-center bg-zinc-900 px-4 py-2 text-xs font-black text-white transition-all hover:bg-[#0a192f] focus:outline-none disabled:pointer-events-none disabled:opacity-50 mt-6 tracking-widest"
            >
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <span className="flex items-center gap-2">
                  SIGN IN <ArrowRight className="h-4 w-4" />
                </span>
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-xs font-bold text-zinc-500">
            Don't have an account?{" "}
            <Link href="/register" className="text-zinc-900 hover:text-blue-600 underline">
              Create one now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
