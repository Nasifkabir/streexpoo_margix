"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, User, ShoppingBag, Menu, X, Share2, Globe, ChevronRight } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import { useCart } from "@/context/CartContext";

export function StorefrontHeader({ settings, session }: { settings: any; session: any }) {
  const { cartCount } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header 
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? "bg-white/90 dark:bg-zinc-950/90 backdrop-blur-xl border-b border-zinc-100 dark:border-zinc-800 shadow-sm py-3" 
            : "bg-white dark:bg-zinc-950 py-4 md:py-6"
        } px-4 md:px-10 flex items-center justify-between`}
      >
        <div className="flex-1 flex items-center gap-4">
          <button 
            onClick={() => setIsMenuOpen(true)}
            className="md:hidden text-zinc-600 dark:text-zinc-400 hover:text-blue-600 transition-colors"
          >
            <Menu className="h-6 w-6" />
          </button>

          <Link href="/" className="flex items-center gap-3 group">
            {settings.logoUrl && (
              <img src={settings.logoUrl} alt={settings.storeName} className="h-10 md:h-14 w-auto object-contain transition-transform group-hover:scale-105" />
            )}
            {/* <span className="font-bebas text-2xl md:text-2xl tracking-[0.05em] text-zinc-900 dark:text-white uppercase leading-none">
              {(settings.storeName || "MARGIX")}
            </span> */}
          </Link>
        </div>

        <nav className="hidden md:flex flex-1 items-center justify-center gap-8 text-lg tracking-wider text-zinc-600 dark:text-zinc-400 font-bebas">
          <Link href="#" className="hover:text-blue-600 transition-colors uppercase">MEN'S T-SHIRT</Link>
          <Link href="#" className="hover:text-blue-600 transition-colors uppercase">SHIRT</Link>
          <Link href="#" className="hover:text-blue-600 transition-colors uppercase">PANT</Link>
        </nav>

        <div className="flex-1 flex items-center justify-end gap-3 md:gap-6">
          <div className="hidden sm:block">
            <ThemeToggle />
          </div>
          <button className="text-zinc-600 dark:text-zinc-400 hover:text-blue-600 transition-colors hidden md:block">
            <Search className="h-5 w-5 md:h-6 md:w-6" />
          </button>
          <Link 
            href={session ? (session.user.role === "CUSTOMER" ? "/profile" : "/admin") : "/login"} 
            className="text-zinc-600 dark:text-zinc-400 hover:text-blue-600 transition-colors hidden sm:block"
          >
            <User className="h-5 w-5 md:h-6 md:w-6" />
          </Link>
          <Link href="/checkout" className="text-zinc-600 dark:text-zinc-400 hover:text-blue-600 transition-colors relative group">
            <ShoppingBag className="h-5 w-5 md:h-6 md:w-6" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 h-4 w-4 rounded-full bg-blue-600 text-[10px] font-bold text-white flex items-center justify-center border-2 border-white dark:border-zinc-950 group-hover:scale-110 transition-transform font-bebas">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </header>

      {/* Mobile Slide-out Menu */}
      <div 
        className={`fixed inset-0 z-[100] transition-opacity duration-500 ${
          isMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={() => setIsMenuOpen(false)}
        />
        
        {/* Menu Content */}
        <div 
          className={`absolute inset-y-0 left-0 w-full max-w-[320px] bg-white dark:bg-zinc-950 shadow-2xl transition-transform duration-500 ease-out transform ${
            isMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex flex-col h-full">
            <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
              <span className="font-black text-xl tracking-tighter text-zinc-900 dark:text-white">
                {(settings.storeName || "MARGIX").toUpperCase()}
              </span>
              <button 
                onClick={() => setIsMenuOpen(false)}
                className="p-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto p-6 space-y-2">
              <Link href="#" className="flex items-center justify-between p-4 rounded-2xl hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors group">
                <span className="font-bold text-lg text-zinc-800 dark:text-zinc-200 uppercase tracking-wide">MEN'S T-SHIRT</span>
                <ChevronRight className="h-5 w-5 text-zinc-300 group-hover:text-blue-600 transition-colors" />
              </Link>
              <Link href="#" className="flex items-center justify-between p-4 rounded-2xl hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors group">
                <span className="font-bold text-lg text-zinc-800 dark:text-zinc-200 uppercase tracking-wide">SHIRT</span>
                <ChevronRight className="h-5 w-5 text-zinc-300 group-hover:text-blue-600 transition-colors" />
              </Link>
              <Link href="#" className="flex items-center justify-between p-4 rounded-2xl hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors group">
                <span className="font-bold text-lg text-zinc-800 dark:text-zinc-200 uppercase tracking-wide">PANT</span>
                <ChevronRight className="h-5 w-5 text-zinc-300 group-hover:text-blue-600 transition-colors" />
              </Link>
            </nav>

            <div className="p-8 border-t border-zinc-100 dark:border-zinc-800 space-y-6">
              <div className="flex items-center gap-4">
                {settings.facebookUrl && (
                  <Link href={settings.facebookUrl} className="p-3 rounded-full bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:bg-blue-600 hover:text-white transition-all">
                    <Share2 className="h-5 w-5" />
                  </Link>
                )}
                {settings.instagramUrl && (
                  <Link href={settings.instagramUrl} className="p-3 rounded-full bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:bg-blue-600 hover:text-white transition-all">
                    <Globe className="h-5 w-5" />
                  </Link>
                )}
              </div>
              <Link 
                href="/employee-login" 
                className="block w-full py-4 text-center text-xs font-black tracking-widest text-zinc-400 hover:text-blue-600 border border-zinc-100 dark:border-zinc-800 rounded-2xl transition-all"
              >
                EMPLOYEE LOGIN
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
