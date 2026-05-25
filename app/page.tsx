/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
import connectToDatabase from "@/lib/db";
import Product from "@/models/Product";
import StoreSettings from "@/models/StoreSettings";
import Link from "next/link";
import { Truck, HeadphonesIcon, RefreshCw, ShieldCheck, ArrowRight, Globe, Share2 } from "lucide-react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { StorefrontHeader } from "@/components/storefront-header";
import { ProductCard } from "@/components/product-card";
import { BannerCarousel } from "@/components/banner-carousel";
import { ScrollReveal } from "@/components/scroll-reveal";
import { ScrollToTop } from "@/components/scroll-to-top";
import { PageTransition } from "@/components/page-transition";
import { MagneticButton } from "@/components/magnetic-button";

export const dynamic = 'force-dynamic';

export default async function Storefront() {
  await connectToDatabase();
  const session = await getServerSession(authOptions);

  const settingsDoc = await StoreSettings.findOne({});
  const settings = JSON.parse(JSON.stringify(settingsDoc || {
    storeName: "MARGIX",
    logoUrl: "",
    footerText: "© 2025 Streexpoo_Margix Fashion. All rights reserved.",
    currencySymbol: "৳",
  }));

  const newArrivalsRaw = await Product.find({}).sort({ createdAt: -1 }).limit(8);
  const newArrivals = JSON.parse(JSON.stringify(newArrivalsRaw));

  const popularProductsRaw = await Product.find({}).sort({ sellingPrice: -1 }).limit(4);
  const popularProducts = JSON.parse(JSON.stringify(popularProductsRaw));

  return (
    <PageTransition>
      <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 font-sans selection:bg-blue-600 selection:text-white">

        {/* Top Notification Bar */}
        <div className="bg-[#facc15] text-black text-[10px] md:text-xs py-3 text-center font-bold tracking-wide relative z-[60]">
          Buy Product Pay Later | Delivery Charge Free All Over Bangladesh
        </div>

        {/* Combined Hero & Header Section to flawlessly eliminate the gap */}
        <div className="relative w-full">
          <div className="absolute top-0 left-0 right-0 z-[70] bg-transparent">
            <StorefrontHeader settings={settings} session={session} />
          </div>
          <BannerCarousel />
        </div>

        {/* Feature Bar */}
        <section className="px-4 md:px-10 py-8 md:py-16">
          <div className="max-w-[1400px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            <ScrollReveal delay={0} className="flex flex-col items-center md:items-start p-8 rounded-3xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 transition-all hover:shadow-xl hover:-translate-y-1">
              <div className="p-4 rounded-2xl bg-orange-100 dark:bg-orange-500/10 text-orange-600 mb-6">
                <Truck className="h-6 w-6" />
              </div>
              <h3 className="font-black text-lg mb-2">Free Delivery</h3>
              <p className="text-zinc-500 dark:text-zinc-400 text-sm font-medium">On all orders over {settings.currencySymbol}5000</p>
            </ScrollReveal>
            <ScrollReveal delay={100} className="flex flex-col items-center md:items-start p-8 rounded-3xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 transition-all hover:shadow-xl hover:-translate-y-1">
              <div className="p-4 rounded-2xl bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 mb-6">
                <HeadphonesIcon className="h-6 w-6" />
              </div>
              <h3 className="font-black text-lg mb-2">24/7 Support</h3>
              <p className="text-zinc-500 dark:text-zinc-400 text-sm font-medium">Get help at any time you need</p>
            </ScrollReveal>
            <ScrollReveal delay={200} className="flex flex-col items-center md:items-start p-8 rounded-3xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 transition-all hover:shadow-xl hover:-translate-y-1">
              <div className="p-4 rounded-2xl bg-blue-100 dark:bg-blue-500/10 text-blue-600 mb-6">
                <RefreshCw className="h-6 w-6" />
              </div>
              <h3 className="font-black text-lg mb-2">Easy Returns</h3>
              <p className="text-zinc-500 dark:text-zinc-400 text-sm font-medium">30 days return policy for all items</p>
            </ScrollReveal>
            <ScrollReveal delay={300} className="flex flex-col items-center md:items-start p-8 rounded-3xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 transition-all hover:shadow-xl hover:-translate-y-1">
              <div className="p-4 rounded-2xl bg-purple-100 dark:bg-purple-500/10 text-purple-600 mb-6">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="font-black text-lg mb-2">Secure Checkout</h3>
              <p className="text-zinc-500 dark:text-zinc-400 text-sm font-medium">100% secure payment methods</p>
            </ScrollReveal>
          </div>
        </section>

        {/* Highlight Section */}
        <section className="px-4 md:px-10 pb-8 md:pb-16 max-w-[1400px] mx-auto">
          <ScrollReveal>
            <div className="bg-[#111] rounded-[2rem] p-8 md:p-14 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl relative overflow-hidden border border-zinc-800">
              {/* Background design elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-yellow-500/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/4 pointer-events-none" />

              <div className="relative z-10 flex-1 text-center md:text-left">
                <span className="inline-block px-4 py-1.5 rounded-full bg-zinc-800 text-[10px] md:text-xs font-medium tracking-widest uppercase mb-4 text-[#facc15] border border-zinc-700">
                  Special Offer
                </span>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif mb-4 leading-tight">
                  Buy Product <span className="text-[#facc15] font-bold">Pay Later</span>
                </h2>
                <p className="text-zinc-400 text-sm md:text-base max-w-md mx-auto md:mx-0 font-light leading-relaxed">
                  Just confirm your order and our Sales Executive will call you soon to finalize the details. No hassle involved.
                </p>
              </div>

              <div className="relative z-10 flex items-center justify-center mt-4 md:mt-0">
                <MagneticButton strength={20}>
                  <Link href="#shop" className="bg-white text-zinc-900 hover:bg-zinc-200 px-8 py-4 rounded-full font-bold text-xs md:text-sm tracking-[0.2em] uppercase transition-colors shadow-2xl flex items-center gap-3">
                    SHOP NOW <ArrowRight className="h-5 w-5" />
                  </Link>
                </MagneticButton>
              </div>
            </div>
          </ScrollReveal>
        </section>

        {/* New Arrivals */}
        <section id="shop" className="max-w-[1600px] mx-auto px-4 md:px-10 py-12 md:py-24">
          <ScrollReveal>
            <div className="flex flex-col lg:flex-row items-baseline justify-between mb-12 gap-6">
              <div>
                <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-3 font-playfair italic">NEW DROP</h2>
                <div className="h-1.5 w-16 bg-blue-600 rounded-full" />
              </div>
              <div className="flex flex-wrap gap-x-6 gap-y-4 text-[10px] md:text-sm font-black tracking-widest text-zinc-400">
                <span className="text-zinc-900 dark:text-white border-b-4 border-blue-600 pb-2 cursor-pointer">ALL ITEMS</span>
                <span className="hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer">T-SHIRTS</span>
                <span className="hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer">SHIRT</span>
                <span className="hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer">PANT</span>
              </div>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 md:gap-x-8 gap-y-12">
            {newArrivals.map((product: any, index: number) => (
              <ScrollReveal key={product._id} delay={index * 50}>
                <ProductCard product={product} settings={settings} />
              </ScrollReveal>
            ))}
          </div>
        </section>

        {/* Promo Section */}
        <section className="px-4 md:px-10 py-8 md:py-20">
          <ScrollReveal>
            <div className="bg-zinc-50 dark:bg-zinc-900 rounded-[3rem] md:rounded-[4rem] overflow-hidden grid lg:grid-cols-2 items-center shadow-inner border border-zinc-100 dark:border-zinc-800">
              <div className="p-8 md:p-16 lg:p-24 text-center lg:text-left">
                <span className="text-blue-600 font-black tracking-[0.3em] text-[10px] md:text-xs mb-6 block uppercase">Season 2025</span>
                <h2 className="text-4xl md:text-7xl font-black tracking-tighter leading-[0.9] mb-8 dark:text-white font-playfair">
                  STREET<br />VIBE
                </h2>
                <p className="text-zinc-500 dark:text-zinc-400 mb-10 max-w-sm font-bold text-base md:text-lg leading-relaxed mx-auto lg:mx-0">
                  Explore the new collection designed with outstanding quality and minimalist aesthetic.
                </p>
                <MagneticButton strength={30}>
                  <Link href="#shop" className="inline-flex items-center gap-3 bg-[#0a192f] dark:bg-white dark:text-zinc-900 text-white font-black px-12 py-5 rounded-full text-sm tracking-[0.2em] hover:bg-blue-600 hover:text-white transition-all shadow-2xl hover:scale-105">
                    VIEW ALL <ArrowRight className="h-5 w-5" />
                  </Link>
                </MagneticButton>
              </div>
              <div className="h-[500px] lg:h-full min-h-[600px] relative group overflow-hidden rounded-[3rem] lg:rounded-none">
                <img
                  src="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=800&auto=format&fit=crop"
                  alt="Promo"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1500ms]"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all duration-500 pointer-events-none" />
              </div>
            </div>
          </ScrollReveal>
        </section>

        {/* Footer */}
        {/* Footer */}
        <footer className="bg-[#1f1f1f] text-white px-4 md:px-10 pt-12 md:pt-16 pb-6 border-t border-zinc-800">
          <ScrollReveal>
            <div className="max-w-[1400px] mx-auto">
              <div className="flex flex-col md:flex-row justify-between items-start gap-10 md:gap-8 mb-12">

                {/* Brand & Socials */}
                <div className="flex flex-col gap-4">
                  <Link href="/" className="font-serif text-3xl text-white">
                    Streexpo
                  </Link>
                  <p className="text-zinc-400 text-sm max-w-xs">
                    Premium fashion aesthetic designed with outstanding quality.
                  </p>
                  <div className="flex gap-4 mt-2">
                    <div className="h-8 w-8 rounded-full border border-zinc-500 flex items-center justify-center text-zinc-400 hover:text-white hover:border-white transition-colors cursor-pointer">
                      <Share2 className="h-4 w-4" />
                    </div>
                    <div className="h-8 w-8 rounded-full border border-zinc-500 flex items-center justify-center text-zinc-400 hover:text-white hover:border-white transition-colors cursor-pointer">
                      <Globe className="h-4 w-4" />
                    </div>
                  </div>
                </div>

                {/* Navigation Links */}
                <div className="grid grid-cols-2 gap-12 w-full md:w-auto md:flex md:gap-24">
                  {/* Company Section */}
                  <div>
                    <h4 className="font-medium text-lg mb-5 text-white">Company</h4>
                    <ul className="space-y-4 text-sm text-zinc-400">
                      <li>
                        <Link href="/about" className="hover:text-white transition-colors">
                          About Us
                        </Link>
                      </li>
                      <li>
                        <Link href="/contact" className="hover:text-white transition-colors">
                          Contact Us
                        </Link>
                      </li>
                      {/* <li>
                        <Link href="/faq" className="hover:text-white transition-colors">
                          FAQ's
                        </Link>
                      </li> 
                      */}
                    </ul>
                  </div>

                  {/* Legal Section */}
                  <div>
                    <h4 className="font-medium text-lg mb-5 text-white">Legal</h4>
                    <ul className="space-y-4 text-sm text-zinc-400">
                      <li>
                        <Link href="/privacy" className="hover:text-white transition-colors">
                          Privacy Policy
                        </Link>
                      </li>
                      <li>
                        <Link href="/terms" className="hover:text-white transition-colors">
                          Terms & Conditions
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-zinc-800 text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-zinc-500 text-xs">
                  © 2026 Streexpo. All Rights Reserved.
                </p>
              </div>
            </div>
          </ScrollReveal>
        </footer>

        <ScrollToTop />
      </div>
    </PageTransition>
  );
}