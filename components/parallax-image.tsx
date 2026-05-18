"use client";

import { useEffect, useRef, useState } from "react";

interface ParallaxImageProps {
  src: string;
  alt: string;
  speed?: number; // Adjust speed (e.g., 0.2 for subtle, 0.8 for fast)
  className?: string;
  containerClassName?: string;
}

export function ParallaxImage({ src, alt, speed = 0.3, className = "", containerClassName = "" }: ParallaxImageProps) {
  const [offset, setOffset] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Disable parallax on mobile/touch for performance
    if (window.matchMedia("(pointer: coarse)").matches) return;

    let animationFrameId: number;
    
    const handleScroll = () => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Calculate only if the element is in or near the viewport
      if (rect.top <= windowHeight && rect.bottom >= 0) {
        const scrollCenter = windowHeight / 2;
        const containerCenter = rect.top + rect.height / 2;
        
        // Distance from center of screen
        const distFromCenter = containerCenter - scrollCenter;
        
        // Apply speed modifier
        setOffset(distFromCenter * speed);
      }
    };

    const onScroll = () => {
      animationFrameId = requestAnimationFrame(handleScroll);
    };

    window.addEventListener("scroll", onScroll);
    handleScroll(); // Initial position

    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, [speed]);

  return (
    <div ref={containerRef} className={`overflow-hidden relative ${containerClassName}`}>
      <img
        src={src}
        alt={alt}
        className={`absolute w-full h-[130%] object-cover top-[-15%] will-change-transform ${className}`}
        style={{
          transform: `translate3d(0, ${offset}px, 0)`,
        }}
      />
    </div>
  );
}
