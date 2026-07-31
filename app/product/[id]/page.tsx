/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
import connectToDatabase from "@/lib/db";
import Product from "@/models/Product";
import StoreSettings from "@/models/StoreSettings";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { StorefrontHeader } from "@/components/storefront-header";
import { ProductCard } from "@/components/product-card";
import { ProductDetailInteractive } from "@/components/product-detail-interactive";
import { ScrollReveal } from "@/components/scroll-reveal";
import { ScrollToTop } from "@/components/scroll-to-top";
import { PageTransition } from "@/components/page-transition";
import mongoose from "mongoose";
import Link from "next/link";
import { ArrowLeft, Share2, Globe } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await connectToDatabase();
  const { id } = await params;

  // Fetch settings
  const settingsDoc = await StoreSettings.findOne({});
  const settings = JSON.parse(
    JSON.stringify(
      settingsDoc || {
        storeName: "MARGIX",
        logoUrl: "",
        footerText: "© 2026 Streexpo. All rights reserved.",
        currencySymbol: "৳",
      }
    )
  );

  const session = await getServerSession(authOptions);

  // Validate ID
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return renderErrorState("Invalid product ID format.", settings, session);
  }

  // Fetch Product
  const productDoc = await Product.findById(id);
  if (!productDoc) {
    return renderErrorState("Product not found.", settings, session);
  }

  const product = JSON.parse(JSON.stringify(productDoc));

  // Fetch Related Products (same category, excluding current product)
  const relatedRaw = await Product.find({
    category: product.category,
    _id: { $ne: product._id },
  })
    .limit(4)
    .sort({ createdAt: -1 });

  const relatedProducts = JSON.parse(JSON.stringify(relatedRaw));

  return (
    <PageTransition>
      <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 font-sans selection:bg-blue-600 selection:text-white">
        
        {/* Top Notification Bar */}
        <div className="bg-[#facc15] text-black text-[10px] md:text-xs py-3 text-center font-bold tracking-wide relative z-[60]">
          Buy Product Pay Later | Delivery Charge Free All Over Bangladesh
        </div>

        {/* Header Spacer */}
        <div className="relative w-full h-[88px] bg-black">
          <div className="absolute top-0 left-0 right-0 z-[70] bg-transparent">
            <StorefrontHeader settings={settings} session={session} />
          </div>
        </div>

        {/* Main Content Area */}
        <main className="max-w-[1400px] mx-auto px-4 md:px-10 py-8 md:py-16">
          <ScrollReveal>
            <ProductDetailInteractive product={product} settings={settings} />
          </ScrollReveal>

          {/* Related Products Section */}
          {relatedProducts.length > 0 && (
            <section className="mt-20 md:mt-32 pt-16 border-t border-zinc-100 dark:border-zinc-800">
              <ScrollReveal>
                <div className="flex flex-col mb-12">
                  <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-3 font-playfair italic">
                    YOU MAY ALSO LIKE
                  </h2>
                  <div className="h-1.5 w-16 bg-blue-600 rounded-full" />
                </div>
              </ScrollReveal>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 md:gap-x-8 gap-y-12">
                {relatedProducts.map((p: any, index: number) => (
                  <ScrollReveal key={p._id} delay={index * 50}>
                    <ProductCard product={p} settings={settings} />
                  </ScrollReveal>
                ))}
              </div>
            </section>
          )}
        </main>

        {/* Footer */}
        <footer className="bg-[#1f1f1f] text-white px-4 md:px-10 pt-12 md:pt-16 pb-6 border-t border-zinc-800 mt-20">
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
                    </ul>
                  </div>

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
                  {settings.footerText || "© 2026 Streexpo. All Rights Reserved."}
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

function renderErrorState(message: string, settings: any, session: any) {
  return (
    <PageTransition>
      <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 font-sans flex flex-col">
        {/* Top Notification Bar */}
        <div className="bg-[#facc15] text-black text-xs py-3 text-center font-bold tracking-wide">
          Buy Product Pay Later | Delivery Charge Free All Over Bangladesh
        </div>

        {/* Header Spacer */}
        <div className="relative w-full h-[88px] bg-black">
          <div className="absolute top-0 left-0 right-0 z-[70] bg-transparent">
            <StorefrontHeader settings={settings} session={session} />
          </div>
        </div>

        {/* Error Card */}
        <main className="flex-1 flex flex-col items-center justify-center px-4 text-center max-w-md mx-auto py-20">
          <div className="p-8 md:p-12 rounded-[2rem] bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 shadow-xl space-y-6">
            <h2 className="text-4xl font-black font-bebas tracking-wide text-zinc-900 dark:text-white uppercase leading-none">
              Oops!
            </h2>
            <p className="text-sm font-bold text-zinc-500 dark:text-zinc-400 font-outfit uppercase tracking-widest">
              {message}
            </p>
            <div className="pt-4">
              <Link
                href="/"
                className="inline-flex items-center gap-2 bg-[#0a192f] text-white font-black px-8 py-4 rounded-xl text-xs tracking-widest hover:bg-blue-600 transition-colors font-bebas uppercase"
              >
                <ArrowLeft className="h-4 w-4" /> BACK TO SHOP
              </Link>
            </div>
          </div>
        </main>
      </div>
    </PageTransition>
  );
}
