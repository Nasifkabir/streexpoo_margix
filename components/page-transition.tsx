"use client";

import { useEffect, useState, ReactNode } from "react";

export function PageTransition({ children }: { children: ReactNode }) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Small delay to ensure styles are painted before revealing smoothly
    const timeout = setTimeout(() => {
      setIsLoaded(true);
    }, 150);
    
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div 
      className={`transition-opacity duration-[1500ms] ease-out ${
        isLoaded ? "opacity-100" : "opacity-0"
      }`}
    >
      {children}
    </div>
  );
}
