"use client";

import { useEffect, useRef } from "react";

interface SnowEffectProps {
  /** Number of snowflakes to render (default: 50) */
  count?: number;
  /** Additional CSS classes */
  className?: string;
  /** Mobile-optimized (reduces count on mobile) */
  mobileOptimized?: boolean;
}

/**
 * SnowEffect - Subtle CSS snowfall animation component
 * Creates a non-distracting background snow effect
 */
export function SnowEffect({ count = 50, className = "", mobileOptimized = true }: SnowEffectProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Reduce count on mobile for performance
    const isMobile = mobileOptimized && window.innerWidth < 768;
    const actualCount = isMobile ? Math.floor(count * 0.4) : count;

    // Create snowflakes
    const snowflakes: HTMLDivElement[] = [];
    for (let i = 0; i < actualCount; i++) {
      const snowflake = document.createElement("div");
      snowflake.className = "snowflake";
      
      // Random size between 2px and 6px
      const size = Math.random() * 4 + 2;
      snowflake.style.width = `${size}px`;
      snowflake.style.height = `${size}px`;
      
      // Random horizontal position
      snowflake.style.left = `${Math.random() * 100}%`;
      
      // Random animation duration (10-20 seconds)
      const duration = Math.random() * 10 + 10;
      snowflake.style.animationDuration = `${duration}s`;
      
      // Random delay
      snowflake.style.animationDelay = `${Math.random() * 5}s`;
      
      // Random opacity for depth
      snowflake.style.opacity = `${Math.random() * 0.5 + 0.3}`;
      
      container.appendChild(snowflake);
      snowflakes.push(snowflake);
    }

    return () => {
      snowflakes.forEach((snowflake) => snowflake.remove());
    };
  }, [count, mobileOptimized]);

  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 pointer-events-none overflow-hidden z-0 ${className}`}
      aria-hidden="true"
    />
  );
}

