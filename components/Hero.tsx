"use client";

import { Button } from "@/components/ui/button";
import { SnowEffect } from "./SnowEffect";
import { Music, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

interface HeroProps {
  onConnectSpotify?: () => void;
}

/**
 * Hero - Main landing section with festive theming
 * Features animated snow, festive heading, and CTA button
 */
export function Hero({ onConnectSpotify }: HeroProps) {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4 py-20 overflow-hidden">
      <SnowEffect count={50} mobileOptimized={true} />
      
      {/* Festive SVG Decorations */}
      <div className="absolute top-10 left-10 opacity-20 animate-pulse">
        <Sparkles className="w-8 h-8 text-accent" />
      </div>
      <div className="absolute top-20 right-20 opacity-20 animate-pulse delay-300">
        <Sparkles className="w-6 h-6 text-secondary" />
      </div>
      <div className="absolute bottom-20 left-20 opacity-20 animate-pulse delay-700">
        <Sparkles className="w-10 h-10 text-accent" />
      </div>
      <div className="absolute bottom-10 right-10 opacity-20 animate-pulse delay-1000">
        <Sparkles className="w-7 h-7 text-secondary" />
      </div>

      {/* Holly Decoration SVG */}
      <div className="absolute top-32 right-32 opacity-15 hidden md:block">
        <svg
          width="40"
          height="40"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="text-primary"
        >
          <path d="M12 2L15 8L22 9L17 14L18 21L12 18L6 21L7 14L2 9L9 8Z" />
        </svg>
      </div>
      <div className="absolute bottom-32 left-32 opacity-15 hidden md:block">
        <svg
          width="35"
          height="35"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="text-secondary"
        >
          <path d="M12 2L15 8L22 9L17 14L18 21L12 18L6 21L7 14L2 9L9 8Z" />
        </svg>
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6 flex justify-center relative group"
        >
          <Music className="w-16 h-16 text-primary animate-bounce" />
          <motion.span
            className="absolute -top-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
            initial={{ scale: 0 }}
            whileHover={{ scale: 1 }}
          >
            🎅
          </motion.span>
        </motion.div>
        
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="font-heading text-4xl sm:text-6xl md:text-8xl font-bold text-primary mb-6 drop-shadow-lg"
        >
          Festive Playlist
          <br />
          <span className="text-secondary">Architect</span>
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-lg sm:text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed px-4"
        >
          Create your perfect Christmas playlist powered by AI. 
          We analyze your music taste and blend it with festive holiday spirit 
          to craft a personalized musical journey.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Button
            onClick={onConnectSpotify}
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <Music className="mr-2 w-5 h-5" />
            Connect with Spotify
          </Button>
        </motion.div>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-6 text-sm text-muted-foreground"
        >
          Free to use • No credit card required
        </motion.p>
      </div>
    </section>
  );
}

