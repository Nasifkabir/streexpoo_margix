"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, User, ShoppingBag, Menu, X, Share2, Globe, ChevronRight } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import { useCart } from "@/context/CartContext";

interface Settings {
  storeName: string;
  logoUrl?: string;
  facebookUrl?: string;
  instagramUrl?: string;
}

interface Session {
  user: {
    role: string;
  };
}

export function StorefrontHeader({ settings, session }: { settings: Settings; session: Session | null }) {
  const { cartCount } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isPopping, setIsPopping] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (searchQuery.trim().length > 1) {
      const fetchResults = async () => {
        try {
          const res = await fetch(`/api/products`);
          const data = await res.json();
          // filter client side
          const filtered = data.filter((p: any) => p.name && p.name.toLowerCase().includes(searchQuery.toLowerCase()));
          setSearchResults(filtered);
        } catch (err) {
          console.error(err);
        }
      };
      const timer = setTimeout(fetchResults, 300);
      return () => clearTimeout(timer);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (cartCount > 0) {
      setIsPopping(true);
      const timer = setTimeout(() => setIsPopping(false), 300);
      return () => clearTimeout(timer);
    }
  }, [cartCount]);

  return (
    <>
      <header
        className={`sticky top-0 w-full z-50 transition-all duration-300 ${isScrolled
          ? "bg-black/90 backdrop-blur-md py-3 shadow-lg"
          : "bg-transparent py-4 md:py-6"
          } px-4 md:px-10 flex items-center justify-between`}
      >
        <div className="flex-1 flex items-center gap-4">
          <button
            onClick={() => setIsMenuOpen(true)}
            className="lg:hidden text-white hover:text-yellow-400 transition-colors"
          >
            <Menu className="h-6 w-6" />
          </button>

          <Link href="/" className="flex items-center gap-3 group">
            <span className="font-serif text-3xl md:text-4xl text-white">
              Streexpo
            </span>
          </Link>
        </div>

        <nav className="hidden lg:flex flex-1 items-center justify-center gap-6 xl:gap-8 text-sm xl:text-[15px] font-medium text-white">
          <Link href="#" className="hover:text-yellow-400 transition-colors">Eid</Link>
          <Link href="#" className="hover:text-yellow-400 transition-colors">Women</Link>
          <Link href="#" className="hover:text-yellow-400 transition-colors">Men</Link>
          <Link href="#" className="hover:text-yellow-400 transition-colors">Teen</Link>
          <Link href="#" className="hover:text-yellow-400 transition-colors">Kids</Link>
          <Link href="#" className="hover:text-yellow-400 transition-colors">Nargisus</Link>
          <Link href="#" className="hover:text-yellow-400 transition-colors">Home Decor</Link>
        </nav>

        <div className="flex-1 flex items-center justify-end gap-3 md:gap-5">
          <Link
            href={session ? "/admin" : "/register"}
            className="text-white hover:text-yellow-400 transition-colors"
          >
            <User className="h-5 w-5 md:h-[22px] md:w-[22px]" />
          </Link>

          {/* Search */}
          <div className="relative" ref={searchRef}>
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="text-white hover:text-yellow-400 transition-colors"
            >
              <Search className="h-5 w-5 md:h-[22px] md:w-[22px]" />
            </button>

            {isSearchOpen && (
              <div className="absolute top-full right-[-50px] sm:right-0 mt-4 w-[90vw] sm:w-[320px] max-w-[350px] bg-white rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 border border-zinc-100">
                <div className="p-3 border-b border-zinc-100 flex items-center gap-2">
                  <Search className="h-4 w-4 text-zinc-400" />
                  <input
                    type="text"
                    autoFocus
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-transparent border-none outline-none text-sm text-zinc-900 placeholder:text-zinc-400"
                  />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery("")} className="text-zinc-400 hover:text-zinc-900">
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
                {searchQuery.trim().length > 1 && (
                  <div className="max-h-80 overflow-y-auto">
                    {searchResults.length > 0 ? (
                      searchResults.map(product => (
                        <Link
                          key={product._id}
                          href={`/product/${product._id}`}
                          onClick={() => setIsSearchOpen(false)}
                          className="flex items-center gap-3 p-3 hover:bg-zinc-50 transition-colors border-b border-zinc-50 last:border-0"
                        >
                          <img src={product.images?.[0] || product.image || "/placeholder.jpg"} alt={product.name} className="h-10 w-10 object-cover rounded bg-zinc-100" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-zinc-900 truncate">
                              {product.name.split(new RegExp(`(${searchQuery})`, 'gi')).map((part: string, i: number) =>
                                part.toLowerCase() === searchQuery.toLowerCase() ? <span key={i} className="bg-yellow-200">{part}</span> : part
                              )}
                            </p>
                            <p className="text-xs text-zinc-500 font-bold">{settings.currencySymbol || '৳'}{product.sellingPrice || product.price}</p>
                          </div>
                        </Link>
                      ))
                    ) : (
                      <div className="p-4 text-center text-sm text-zinc-500">No products found</div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          <Link href="/checkout" className="text-white hover:text-yellow-400 transition-colors relative group">
            <ShoppingBag className="h-5 w-5 md:h-[22px] md:w-[22px]" />
            <span className="absolute -top-1.5 -right-2 h-4 w-4 rounded-full bg-zinc-800 text-white text-[9px] font-bold flex items-center justify-center border border-white/20">
              {cartCount > 0 ? cartCount : 0}
            </span>
          </Link>
        </div>
      </header>

      {/* Mobile Slide-out Menu */}
      <div
        className={`fixed inset-0 z-[100] transition-opacity duration-500 ${isMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={() => setIsMenuOpen(false)}
        />

        {/* Menu Content */}
        <div
          className={`absolute inset-y-0 left-0 w-full max-w-[320px] bg-white dark:bg-zinc-950 shadow-2xl transition-transform duration-500 ease-out transform ${isMenuOpen ? "translate-x-0" : "-translate-x-full"
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
              {['Eid-ul-Adha', 'Women', 'Men', 'Teen', 'Kids', 'Nargisus', 'Home Decor'].map((item) => (
                <Link key={item} href="#" className="flex items-center justify-between p-4 rounded-2xl hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors group">
                  <span className="font-bold text-lg text-zinc-800 dark:text-zinc-200 tracking-wide">{item}</span>
                  <ChevronRight className="h-5 w-5 text-zinc-300 group-hover:text-yellow-500 transition-colors" />
                </Link>
              ))}
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
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
