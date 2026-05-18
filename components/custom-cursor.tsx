"use client";

import { useEffect, useState } from "react";

export function CustomCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only apply on non-touch devices
    if (window.matchMedia("(pointer: coarse)").matches) return;
    
    // Make it visible once mounted on a non-touch device
    setIsVisible(true);

    const updatePosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("button") || target.closest("a") || target.closest("[role='button']")) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener("mousemove", updatePosition);
    document.addEventListener("mouseover", handleMouseOver);

    // Override all cursors when this is active
    document.body.style.cursor = 'none';
    const style = document.createElement('style');
    style.innerHTML = `* { cursor: none !important; }`;
    style.id = 'custom-cursor-style';
    document.head.appendChild(style);

    return () => {
      window.removeEventListener("mousemove", updatePosition);
      document.removeEventListener("mouseover", handleMouseOver);
      document.body.style.cursor = 'auto';
      const existingStyle = document.getElementById('custom-cursor-style');
      if (existingStyle) existingStyle.remove();
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div 
      className="fixed top-0 left-0 w-10 h-10 rounded-full border border-zinc-900 dark:border-white pointer-events-none z-[99999] transition-transform duration-100 ease-out flex items-center justify-center mix-blend-difference hidden md:flex"
      style={{
        transform: `translate(${position.x - 20}px, ${position.y - 20}px) scale(${isHovering ? 1.5 : 1})`,
        backgroundColor: isHovering ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
      }}
    >
      <div 
        className={`w-1.5 h-1.5 bg-zinc-900 dark:bg-white rounded-full transition-opacity duration-200 ${isHovering ? 'opacity-0' : 'opacity-100'}`} 
      />
    </div>
  );
}
