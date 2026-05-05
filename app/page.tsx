import connectToDatabase from "@/lib/db";
import Product from "@/models/Product";
import StoreSettings from "@/models/StoreSettings";
import Link from "next/link";
import { Truck, HeadphonesIcon, RefreshCw, ShieldCheck, ArrowRight, Globe, Share2 } from "lucide-react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { StorefrontHeader } from "@/components/storefront-header";

export const dynamic = 'force-dynamic';

export default async function Storefront() {
  await connectToDatabase();
  const session = await getServerSession(authOptions);

  const settings = await StoreSettings.findOne({}) || {
    storeName: "MARGIX",
    logoUrl: "",
    footerText: "© 2025 Margix Fashion. All rights reserved.",
    currencySymbol: "৳",
  };
  
  const newArrivals = await Product.find({}).sort({ createdAt: -1 }).limit(8);
  const popularProducts = await Product.find({}).sort({ sellingPrice: -1 }).limit(4);

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 font-sans selection:bg-orange-500 selection:text-white">
      
      {/* Top Notification Bar */}
      <div className="bg-zinc-900 dark:bg-black text-white text-[10px] md:text-xs py-2.5 text-center tracking-[0.2em] font-black">
        FREE SHIPPING ON ALL ORDERS OVER {settings.currencySymbol}5000
      </div>

      <StorefrontHeader settings={settings} session={session} />

      {/* Hero Section */}
      <section className="px-4 md:px-10 py-4 md:py-6">
        <div className="bg-[#f04e23] text-white rounded-[2rem] md:rounded-[3.5rem] overflow-hidden relative shadow-2xl shadow-orange-500/20">
          <div className="max-w-[1600px] mx-auto px-8 md:px-20 pt-20 pb-0 md:pt-32 flex flex-col md:flex-row items-center justify-between min-h-[600px] md:min-h-[750px]">
            <div className="md:w-1/2 z-10 pb-16 md:pb-32 text-center md:text-left">
              <h1 className="text-6xl md:text-[9rem] font-black tracking-tighter leading-[0.85] mb-8 drop-shadow-2xl">
                NEW<br/>STORY
              </h1>
              <p className="text-base md:text-xl font-bold mb-10 max-w-sm opacity-90 mx-auto md:mx-0 tracking-wide uppercase">
                Discover our latest premium collection crafted for your unique style.
              </p>
              <Link href="#shop" className="group inline-flex items-center gap-3 bg-white text-zinc-900 font-black px-10 py-5 rounded-full text-sm tracking-[0.1em] hover:bg-zinc-900 hover:text-white transition-all shadow-xl hover:scale-105 active:scale-95">
                EXPLORE NOW <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            <div className="md:w-1/2 relative h-[450px] md:h-[800px] w-full flex items-end justify-center overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-[#f04e23] via-transparent to-transparent z-10" />
              <img 
                src="https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?q=80&w=800&auto=format&fit=crop" 
                alt="Model" 
                className="absolute bottom-0 h-full w-full object-cover object-top scale-110"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Feature Bar */}
      <section className="px-4 md:px-10 py-12 md:py-20">
        <div className="max-w-[1600px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
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
        <div className="flex flex-col lg:flex-row items-baseline justify-between mb-16 gap-8">
          <div>
            <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-4">NEW DROP</h2>
            <div className="h-2 w-24 bg-orange-500 rounded-full" />
          </div>
          <div className="flex flex-wrap gap-4 md:gap-10 text-xs md:text-sm font-black tracking-widest text-zinc-400">
            <span className="text-zinc-900 dark:text-white border-b-4 border-orange-500 pb-2">ALL ITEMS</span>
            <span className="hover:text-zinc-900 dark:hover:text-white cursor-pointer transition-colors pb-2">T-SHIRTS</span>
            <span className="hover:text-zinc-900 dark:hover:text-white cursor-pointer transition-colors pb-2">SHIRTS</span>
            <span className="hover:text-zinc-900 dark:hover:text-white cursor-pointer transition-colors pb-2">PANTS</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
          {newArrivals.map(product => (
            <div key={product._id.toString()} className="group cursor-pointer">
              <div className="aspect-[3/4] bg-zinc-100 dark:bg-zinc-900 rounded-[2.5rem] mb-6 overflow-hidden relative shadow-sm transition-all duration-500 group-hover:shadow-2xl group-hover:-translate-y-2">
                {product.imageUrl ? (
                  <img 
                    src={product.imageUrl} 
                    alt={product.name} 
                    className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700" 
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-zinc-300 dark:text-zinc-700 font-black text-3xl uppercase tracking-tighter">
                    {product.category}
                  </div>
                )}
                {product.stockQuantity === 0 && (
                  <div className="absolute top-6 right-6 bg-black text-white text-[10px] font-black px-4 py-2 rounded-full tracking-widest">SOLD OUT</div>
                )}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end justify-center pb-8 px-8">
                  <button className="w-full bg-white text-zinc-900 font-black text-[10px] tracking-widest py-4 rounded-2xl hover:bg-orange-500 hover:text-white transition-all transform translate-y-4 group-hover:translate-y-0 duration-300 shadow-xl">
                    ADD TO CART
                  </button>
                </div>
              </div>
              <div className="px-2">
                <h3 className="font-black text-lg mb-1 line-clamp-1 group-hover:text-orange-500 transition-colors uppercase tracking-tight">{product.name}</h3>
                <div className="flex items-center justify-between">
                  <p className="text-zinc-500 dark:text-zinc-400 text-xs font-bold uppercase tracking-widest">{product.category}</p>
                  <p className="font-black text-xl text-orange-500">{settings.currencySymbol}{product.sellingPrice}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Promo Section */}
      <section className="px-4 md:px-10 py-12 md:py-24">
        <div className="bg-zinc-50 dark:bg-zinc-900 rounded-[3rem] overflow-hidden grid lg:grid-cols-2 items-center shadow-inner border border-zinc-100 dark:border-zinc-800">
          <div className="p-12 md:p-24 lg:p-32 text-center lg:text-left">
            <span className="text-orange-500 font-black tracking-[0.3em] text-xs mb-8 block uppercase">Season 2025</span>
            <h2 className="text-5xl md:text-8xl font-black tracking-tighter leading-[0.9] mb-10 dark:text-white">
              STREET<br/>VIBE
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400 mb-12 max-w-sm font-bold text-lg leading-relaxed mx-auto lg:mx-0">
              Explore the new collection designed with outstanding quality and minimalist aesthetic.
            </p>
            <Link href="#shop" className="inline-flex items-center gap-3 bg-zinc-900 dark:bg-white dark:text-zinc-900 text-white font-black px-12 py-5 rounded-full text-sm tracking-[0.2em] hover:bg-orange-500 hover:text-white transition-all shadow-2xl hover:scale-105">
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
                {settings.storeName.toUpperCase()}
              </Link>
              <p className="text-zinc-500 dark:text-zinc-400 max-w-md font-bold text-lg leading-relaxed">
                Your premium destination for modern clothing. We prioritize quality, aesthetics, and the best customer experience.
              </p>
              <div className="flex gap-4 mt-10">
                {settings.facebookUrl && (
                  <Link href={settings.facebookUrl} className="h-14 w-14 rounded-3xl bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-zinc-600 dark:text-zinc-400 hover:bg-orange-500 hover:text-white transition-all shadow-sm">
                    <Share2 className="h-6 w-6" />
                  </Link>
                )}
                {settings.instagramUrl && (
                  <Link href={settings.instagramUrl} className="h-14 w-14 rounded-3xl bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-zinc-600 dark:text-zinc-400 hover:bg-orange-500 hover:text-white transition-all shadow-sm">
                    <Globe className="h-6 w-6" />
                  </Link>
                )}
              </div>
            </div>
            
            <div>
              <h4 className="font-black mb-8 uppercase text-xs tracking-[0.2em] text-zinc-400">Store Info</h4>
              <ul className="space-y-4 font-bold text-zinc-500 dark:text-zinc-400">
                <li className="hover:text-orange-500 transition-colors cursor-pointer">{settings.address}</li>
                <li className="hover:text-orange-500 transition-colors cursor-pointer">{settings.contactEmail}</li>
                <li className="hover:text-orange-500 transition-colors cursor-pointer">{settings.contactPhone}</li>
              </ul>
            </div>

            <div>
              <h4 className="font-black mb-8 uppercase text-xs tracking-[0.2em] text-zinc-400">Quick Links</h4>
              <ul className="space-y-4 font-bold text-zinc-500 dark:text-zinc-400">
                <li><Link href="/employee-login" className="hover:text-orange-500 transition-colors uppercase tracking-widest text-[10px]">Employee Access</Link></li>
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
