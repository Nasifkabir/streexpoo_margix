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

export const dynamic = 'force-dynamic';

export default async function Storefront() {
  await connectToDatabase();
  const session = await getServerSession(authOptions);

  const settingsDoc = await StoreSettings.findOne({});
  const settings = JSON.parse(JSON.stringify(settingsDoc || {
    storeName: "MARGIX",
    logoUrl: "",
    footerText: "© 2025 Margix Fashion. All rights reserved.",
    currencySymbol: "৳",
  }));

  const newArrivalsRaw = await Product.find({}).sort({ createdAt: -1 }).limit(8);
  const newArrivals = JSON.parse(JSON.stringify(newArrivalsRaw));
  
  const popularProductsRaw = await Product.find({}).sort({ sellingPrice: -1 }).limit(4);
  const popularProducts = JSON.parse(JSON.stringify(popularProductsRaw));

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 font-sans selection:bg-blue-600 selection:text-white overflow-x-hidden">

      {/* Top Notification Bar */}
      <div className="bg-zinc-900 dark:bg-black text-white text-[9px] md:text-xs py-2 md:py-3 text-center tracking-[0.2em] font-black uppercase">
        FREE SHIPPING ON ALL ORDERS OVER {settings.currencySymbol}5000
      </div>

      <StorefrontHeader settings={settings} session={session} />

      {/* Hero Section - Now Carousel */}
      <BannerCarousel />


      {/* Feature Bar */}
      <section className="px-4 md:px-10 py-8 md:py-16">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
          <div className="flex flex-col items-center md:items-start p-8 rounded-3xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 transition-all hover:shadow-xl hover:-translate-y-1">
            <div className="p-4 rounded-2xl bg-orange-100 dark:bg-orange-500/10 text-orange-600 mb-6">
              <Truck className="h-6 w-6" />
            </div>
            <h3 className="font-black text-lg mb-2">Free Delivery</h3>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm font-medium">On all orders over {settings.currencySymbol}5000</p>
          </div>
          <div className="flex flex-col items-center md:items-start p-8 rounded-3xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 transition-all hover:shadow-xl hover:-translate-y-1">
            <div className="p-4 rounded-2xl bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 mb-6">
              <HeadphonesIcon className="h-6 w-6" />
            </div>
            <h3 className="font-black text-lg mb-2">24/7 Support</h3>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm font-medium">Get help at any time you need</p>
          </div>
          <div className="flex flex-col items-center md:items-start p-8 rounded-3xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 transition-all hover:shadow-xl hover:-translate-y-1">
            <div className="p-4 rounded-2xl bg-blue-100 dark:bg-blue-500/10 text-blue-600 mb-6">
              <RefreshCw className="h-6 w-6" />
            </div>
            <h3 className="font-black text-lg mb-2">Easy Returns</h3>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm font-medium">30 days return policy for all items</p>
          </div>
          <div className="flex flex-col items-center md:items-start p-8 rounded-3xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 transition-all hover:shadow-xl hover:-translate-y-1">
            <div className="p-4 rounded-2xl bg-purple-100 dark:bg-purple-500/10 text-purple-600 mb-6">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h3 className="font-black text-lg mb-2">Secure Checkout</h3>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm font-medium">100% secure payment methods</p>
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section id="shop" className="max-w-[1600px] mx-auto px-4 md:px-10 py-12 md:py-24">
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

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 md:gap-x-8 gap-y-12">
          {newArrivals.map((product: any) => (
            <ProductCard key={product._id} product={product} settings={settings} />
          ))}
        </div>
      </section>

      {/* Promo Section */}
      <section className="px-4 md:px-10 py-8 md:py-20">
        <div className="bg-zinc-50 dark:bg-zinc-900 rounded-[3rem] md:rounded-[4rem] overflow-hidden grid lg:grid-cols-2 items-center shadow-inner border border-zinc-100 dark:border-zinc-800">
          <div className="p-8 md:p-16 lg:p-24 text-center lg:text-left">
            <span className="text-blue-600 font-black tracking-[0.3em] text-[10px] md:text-xs mb-6 block uppercase">Season 2025</span>
            <h2 className="text-4xl md:text-7xl font-black tracking-tighter leading-[0.9] mb-8 dark:text-white font-playfair">
              STREET<br />VIBE
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400 mb-10 max-w-sm font-bold text-base md:text-lg leading-relaxed mx-auto lg:mx-0">
              Explore the new collection designed with outstanding quality and minimalist aesthetic.
            </p>
            <Link href="#shop" className="inline-flex items-center gap-3 bg-[#0a192f] dark:bg-white dark:text-zinc-900 text-white font-black px-12 py-5 rounded-full text-sm tracking-[0.2em] hover:bg-blue-600 hover:text-white transition-all shadow-2xl hover:scale-105">
              VIEW ALL <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
          <div className="h-[500px] lg:h-full min-h-[600px] relative group overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=800&auto=format&fit=crop"
              alt="Promo"
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-all duration-500" />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white dark:bg-zinc-950 px-4 md:px-10 pt-24 pb-12">
        <div className="max-w-[1600px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24">
            <div className="lg:col-span-2">
              <Link href="/" className="font-black text-4xl tracking-tighter mb-8 block dark:text-white">
                {(settings.storeName || "MARGIX").toUpperCase()}
              </Link>
              <p className="text-zinc-500 dark:text-zinc-400 max-w-md font-bold text-lg leading-relaxed">
                Your premium destination for modern clothing. We prioritize quality, aesthetics, and the best customer experience.
              </p>
              <div className="flex gap-4 mt-10">
                {settings.facebookUrl && (
                  <Link href={settings.facebookUrl} className="h-14 w-14 rounded-3xl bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-zinc-600 dark:text-zinc-400 hover:bg-blue-600 hover:text-white transition-all shadow-sm">
                    <Share2 className="h-6 w-6" />
                  </Link>
                )}
                {settings.instagramUrl && (
                  <Link href={settings.instagramUrl} className="h-14 w-14 rounded-3xl bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-zinc-600 dark:text-zinc-400 hover:bg-blue-600 hover:text-white transition-all shadow-sm">
                    <Globe className="h-6 w-6" />
                  </Link>
                )}
              </div>
            </div>

            <div>
              <h4 className="font-black mb-8 uppercase text-xs tracking-[0.2em] text-zinc-400">Store Info</h4>
              <ul className="space-y-4 font-bold text-zinc-500 dark:text-zinc-400">
                <li className="hover:text-blue-600 transition-colors cursor-pointer">{settings.address}</li>
                <li className="hover:text-orange-500 transition-colors cursor-pointer">{settings.contactEmail}</li>
                <li className="hover:text-orange-500 transition-colors cursor-pointer">{settings.contactPhone}</li>
              </ul>
            </div>

            <div>
              <h4 className="font-black mb-8 uppercase text-xs tracking-[0.2em] text-zinc-400">Quick Links</h4>
              <ul className="space-y-4 font-bold text-zinc-500 dark:text-zinc-400">
                <li className="hover:text-orange-500 transition-colors cursor-pointer uppercase tracking-widest text-[10px]">Track Order</li>
                <li className="hover:text-orange-500 transition-colors cursor-pointer uppercase tracking-widest text-[10px]">Privacy Policy</li>
              </ul>
            </div>
          </div>

          <div className="pt-12 border-t border-zinc-100 dark:border-zinc-800 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-zinc-400 dark:text-zinc-500 text-[10px] font-black tracking-widest uppercase">
              {settings.footerText}
            </p>
            <p className="text-zinc-400 dark:text-zinc-500 text-[10px] font-black tracking-widest uppercase">
              DESIGNED BY MARGIX TEAM
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
