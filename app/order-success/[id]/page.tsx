"use client";

import { CheckCircle2, ArrowRight, ShoppingBag, PhoneCall } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function OrderSuccessPage() {
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center p-4 md:p-6 font-outfit">
      <div className="max-w-xl w-full bg-white dark:bg-zinc-900 rounded-[2rem] md:rounded-[3.5rem] p-8 md:p-16 text-center shadow-2xl border border-zinc-100 dark:border-zinc-800 relative overflow-hidden">
        
        {/* Background Accent */}
        <div className="absolute top-0 left-0 w-full h-1.5 md:h-2 bg-blue-600" />
        
        <div className="mb-6 md:mb-10 inline-flex h-16 w-16 md:h-24 md:w-24 items-center justify-center rounded-full bg-blue-600/10 text-blue-600">
          <CheckCircle2 className="h-8 w-8 md:h-12 md:w-12" />
        </div>

        <h1 className="text-3xl md:text-5xl font-black text-zinc-900 dark:text-white font-bebas tracking-wide mb-4 md:mb-6 leading-tight">
          THANKS FOR YOUR ORDER
        </h1>
        
        <div className="inline-block bg-blue-600 text-white font-black px-6 py-2 rounded-full text-xs tracking-[0.2em] mb-8 font-bebas">
          ORDER ID: {id}
        </div>

        <div className="space-y-4 md:space-y-6 mb-8 md:mb-12">
          <p className="text-zinc-600 dark:text-zinc-400 font-bold text-base md:text-lg leading-relaxed">
            We have received your order!
          </p>
          <div className="flex flex-col items-center gap-3 bg-zinc-50 dark:bg-zinc-800/50 p-4 md:p-6 rounded-2xl md:rounded-3xl border border-zinc-100 dark:border-zinc-800">
            <PhoneCall className="h-5 w-5 md:h-6 md:w-6 text-blue-600" />
            <p className="text-[10px] md:text-sm font-bold text-zinc-500 dark:text-zinc-300 uppercase tracking-wide">
              Our Sales Executive will call you soon to confirm the order.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link 
            href="/" 
            className="flex-1 h-16 bg-[#0a192f] text-white font-black rounded-2xl flex items-center justify-center gap-3 hover:bg-blue-600 transition-all shadow-xl font-bebas tracking-widest uppercase"
          >
            CONTINUE SHOPPING <ArrowRight className="h-5 w-5" />
          </Link>
        </div>

        <p className="mt-10 text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em]">
          STREEXPO PREMIUM FASHION
        </p>
      </div>
    </div>
  );
}
