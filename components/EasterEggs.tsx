"use client";

import { useEffect, useState } from "react";
import { SnowEffect } from "./SnowEffect";

/**
 * EasterEggs - Konami code and other festive surprises
 */
export function EasterEggs() {
  const [konamiActive, setKonamiActive] = useState(false);
  const [sequence, setSequence] = useState<string[]>([]);

  useEffect(() => {
    const konamiCode = [
      "ArrowUp",
      "ArrowUp",
      "ArrowDown",
      "ArrowDown",
      "ArrowLeft",
      "ArrowRight",
      "ArrowLeft",
      "ArrowRight",
      "KeyB",
      "KeyA",
    ];

    const handleKeyDown = (e: KeyboardEvent) => {
      setSequence((prev) => {
        const newSequence = [...prev, e.code].slice(-10);
        
        if (newSequence.join(",") === konamiCode.join(",")) {
          setKonamiActive(true);
          setTimeout(() => setKonamiActive(false), 30000); // 30 seconds
          return [];
        }
        
        return newSequence;
      });
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      {konamiActive && (
        <div className="fixed inset-0 pointer-events-none z-50">
          <SnowEffect count={200} mobileOptimized={false} />
        </div>
      )}
    </>
  );
}

