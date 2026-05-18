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
              title: "URBAN\nSTREET",
              subtitle: "STREEXPO NEW DROP",
              description: "Discover our latest premium collection crafted for your unique style.",
              imageUrl: "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?q=80&w=1200&auto=format&fit=crop",
              bgColor: "#0a192f",
              accentColor: "#3b82f6",
              buttonText: "EXPLORE NOW",
            },
            {
              id: 2,
              title: "MINIMAL\nLOOK",
              subtitle: "ESSENTIALS 2025",
              description: "Clean silhouettes and high-quality fabrics for your everyday wardrobe.",
              imageUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1200&auto=format&fit=crop",
              bgColor: "#18181b",
              accentColor: "#f97316",
              buttonText: "SHOP COLLECTION",
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
    <div className="px-2 md:px-10 py-4 md:py-6">
      <div className="h-[600px] md:h-[750px] w-full bg-zinc-100 dark:bg-zinc-900 animate-pulse rounded-[2rem] md:rounded-[3.5rem]" />
    </div>
  );

  return (
    <section className="px-2 md:px-10 py-4 md:py-6 relative" onMouseEnter={() => setIsHovering(true)} onMouseLeave={() => setIsHovering(false)}>
      <div className="relative h-[600px] md:h-[750px] w-full overflow-hidden rounded-[2rem] md:rounded-[3.5rem] shadow-2xl group">
        
        {/* Slides */}
        {banners.map((slide, index) => (
          <div
            key={slide._id || slide.id}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
              index === current ? "opacity-100 scale-100 z-10" : "opacity-0 scale-110 z-0"
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
                  className={`w-full h-full object-cover object-center transition-transform duration-[4000ms] ease-out ${index === current ? "scale-105" : "scale-100"}`}
                />
                {/* Gradient Overlay for text readability */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent md:to-black/30" />
                <div className="absolute inset-0 bg-black/30 sm:hidden" /> {/* Extra darkening for mobile */}
              </div>

              <div className="max-w-[1400px] mx-auto px-6 md:px-20 w-full h-full flex items-center relative z-20">
                
                {/* Text Content */}
                <div className={`md:w-2/3 lg:w-1/2 text-center md:text-left transition-all duration-700 delay-300 ${index === current ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}>
                  <span 
                    className="inline-block mb-4 text-[10px] md:text-sm font-black tracking-[0.4em] uppercase"
                    style={{ color: slide.accentColor || '#3b82f6' }}
                  >
                    {slide.subtitle}
                  </span>
                  <h1 className="text-6xl md:text-[6rem] lg:text-[7rem] font-black tracking-tighter leading-[0.85] mb-6 drop-shadow-2xl font-playfair italic whitespace-pre-line">
                    {slide.title.replace("\\n", "\n")}
                  </h1>
                  <p className="text-sm md:text-lg font-bold mb-10 max-w-md opacity-90 mx-auto md:mx-0 tracking-wide uppercase drop-shadow-md">
                    {slide.description}
                  </p>
                  <MagneticButton strength={25}>
                    <Link 
                      href="#shop" 
                      className="group inline-flex items-center gap-3 bg-white text-zinc-900 font-black px-10 py-5 rounded-full text-xs md:text-sm tracking-[0.2em] hover:bg-zinc-900 hover:text-white transition-all shadow-2xl hover:scale-105 active:scale-95 cursor-pointer"
                    >
                      {slide.buttonText} <ArrowRight className="h-5 w-5 group-hover:translate-x-2 transition-transform" />
                    </Link>
                  </MagneticButton>
                </div>

              </div>
            </div>
          </div>
        ))}

        {/* Navigation Buttons */}
        {banners.length > 1 && (
          <>
            <div className="absolute inset-y-0 left-4 md:left-8 flex items-center z-30 opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                onClick={prevSlide}
                className="h-12 w-12 md:h-16 md:w-16 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-zinc-900 transition-all cursor-pointer shadow-xl"
              >
                <ChevronLeft className="h-6 w-6 md:h-8 md:w-8" />
              </button>
            </div>
            <div className="absolute inset-y-0 right-4 md:right-8 flex items-center z-30 opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                onClick={nextSlide}
                className="h-12 w-12 md:h-16 md:w-16 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-zinc-900 transition-all cursor-pointer shadow-xl"
              >
                <ChevronRight className="h-6 w-6 md:h-8 md:w-8" />
              </button>
            </div>
          </>
        )}

        {/* Indicators */}
        {banners.length > 1 && (
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-3">
            {banners.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-1.5 transition-all duration-500 rounded-full cursor-pointer ${
                  current === i ? "w-12 bg-white" : "w-3 bg-white/30 hover:bg-white/50"
                }`}
              />
            ))}
          </div>
        )}

      </div>
    </section>
  );
}
