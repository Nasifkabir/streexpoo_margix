"use client";

import { useState, useEffect } from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { MagneticButton } from "@/components/magnetic-button";

const slides = [
  {
    id: 1,
    title: "URBAN\nSTREET",
    subtitle: "STREEXPO NEW DROP",
    description: "Discover our latest premium collection crafted for your unique style.",
    image: "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?q=80&w=1200&auto=format&fit=crop",
    bgColor: "bg-[#0a192f]",
    accentColor: "text-blue-500",
    buttonText: "EXPLORE NOW",
  },
  {
    id: 2,
    title: "MINIMAL\nLOOK",
    subtitle: "ESSENTIALS 2025",
    description: "Clean silhouettes and high-quality fabrics for your everyday wardrobe.",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1200&auto=format&fit=crop",
    bgColor: "bg-zinc-900",
    accentColor: "text-orange-500",
    buttonText: "SHOP COLLECTION",
  },
  {
    id: 3,
    title: "PREMIUM\nFIT",
    subtitle: "LUXURY SERIES",
    description: "Tailored to perfection. Experience the ultimate comfort and sophistication.",
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1200&auto=format&fit=crop",
    bgColor: "bg-[#1a1a1a]",
    accentColor: "text-amber-500",
    buttonText: "VIEW DETAILS",
  }
];

export function BannerCarousel() {
  const [banners, setBanners] = useState<any[]>([]);
  const [current, setCurrent] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await fetch("/api/banners");
        const data = await res.json();
        if (data && data.length > 0) {
          setBanners(data);
        } else {
          // Fallback slides
          setBanners([
            {
              id: 1,
              title: "SABILA NUR'S\nEID-UL-ADHA",
              subtitle: "Festive Glamour",
              description: "EXCLUSIVES",
              imageUrl: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2000&auto=format&fit=crop",
              bgColor: "#000",
              buttonText: "Shop This Style",
            },
            {
              id: 2,
              title: "SUMMER\nCOLLECTION",
              subtitle: "New Arrivals",
              description: "LIMITED EDITION",
              imageUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=2000&auto=format&fit=crop",
              bgColor: "#000",
              buttonText: "Shop This Style",
            }
          ]);
        }
      } catch (err) {
        console.error("Failed to fetch banners:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBanners();
  }, []);

  useEffect(() => {
    if (isHovering || banners.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isHovering, banners.length]);

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % banners.length);
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
  };

  if (loading) return (
    <div className="w-full">
      <div className="h-[600px] md:h-[800px] w-full bg-zinc-100 dark:bg-zinc-900 animate-pulse" />
    </div>
  );

  return (
    <section className="relative w-full" onMouseEnter={() => setIsHovering(true)} onMouseLeave={() => setIsHovering(false)}>
      <div className="relative h-[480px] sm:h-[600px] md:h-[800px] w-full overflow-hidden group">

        {/* Slides */}
        {banners.map((slide, index) => (
          <div
            key={slide._id || slide.id}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out ${index === current ? "opacity-100 scale-100 z-10" : "opacity-0 scale-110 z-0"
              }`}
          >
            <div
              className="text-white w-full h-full flex items-center transition-colors duration-1000 relative"
              style={{ backgroundColor: slide.bgColor }}
            >
              {/* Full Background Image */}
              <div className="absolute inset-0 z-0 overflow-hidden">
                <img
                  src={slide.imageUrl || slide.image}
                  alt={slide.title}
                  className={`w-full h-full object-cover object-[80%_center] md:object-center transition-transform duration-[4000ms] ease-out ${index === current ? "scale-105" : "scale-100"}`}
                />
                {/* Gradient Overlay for text readability */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-black/20 md:to-transparent" />
              </div>

              <div className="max-w-[1400px] mx-auto px-6 md:px-20 w-full h-full flex items-center relative z-20">

                {/* Text Content */}
                <div className={`md:w-2/3 lg:w-1/2 pt-16 md:pt-0 text-left transition-all duration-700 delay-300 ${index === current ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}>
                  <h3 className="font-serif text-xl sm:text-3xl md:text-5xl text-white mb-2 md:mb-4">
                    {slide.subtitle || "Festive Glamour"}
                  </h3>
                  <h1 className="text-4xl sm:text-5xl md:text-[5rem] lg:text-[6rem] font-black tracking-normal leading-[1.1] mb-2 md:mb-1 text-[#facc15] font-sans whitespace-pre-line uppercase">
                    {slide.title.replace("\\n", "\n")}
                  </h1>
                  <h2 className="text-sm sm:text-xl md:text-4xl font-light tracking-[0.1em] md:tracking-[0.2em] text-white mb-4 md:mb-8 font-sans max-w-xs md:mx-0">
                    {slide.description || "EXCLUSIVES"}
                  </h2>
                  <p className="font-serif text-sm sm:text-lg md:text-2xl text-white mb-6 md:mb-8">
                    Explore The Collection Now
                  </p>

                  <Link
                    href="#shop"
                    className="inline-flex items-center justify-center bg-white text-black font-medium px-10 py-4 text-sm hover:bg-zinc-200 transition-colors shadow-lg"
                  >
                    {slide.buttonText || "Shop This Style"}
                  </Link>
                </div>

              </div>
            </div>
          </div>
        ))}



        {/* Indicators */}
        {banners.length > 1 && (
          <div className="absolute top-1/2 right-6 md:right-10 -translate-y-1/2 z-30 flex flex-col gap-3">
            {banners.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`w-2.5 transition-all duration-500 rounded-full cursor-pointer ${current === i ? "h-8 bg-zinc-400" : "h-2.5 bg-zinc-600 hover:bg-zinc-500"
                  }`}
              />
            ))}
          </div>
        )}

        {/* Chat Button */}
        {/* <div className="absolute bottom-6 right-6 md:bottom-10 md:right-10 z-40 flex items-center gap-4">
          <div className="bg-white px-5 py-3 rounded-full shadow-lg hidden md:block">
            <span className="text-sm font-medium text-black">Chat with us</span>
          </div>
          <button className="h-14 w-14 bg-[#facc15] text-black rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform cursor-pointer">
            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.2L4 17.2V4h16v12z"/>
              <path d="M7 9h10v2H7zM7 12h7v2H7z"/>
            </svg>
          </button>
        </div> */}

      </div>
    </section>
  );
}
