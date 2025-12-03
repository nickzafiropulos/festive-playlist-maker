"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Music, CheckCircle2, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import { ConfettiEffect } from "./ConfettiEffect";
import type { PlaylistNarrative } from "@/types/groq";

interface PlaylistResultsProps {
  narrative: PlaylistNarrative;
  onCreatePlaylist?: () => void | Promise<void>;
  isCreating?: boolean;
  isSuccess?: boolean;
}

/**
 * PlaylistResults - Displays AI-generated playlist narrative and recommendations
 * Features typing animation and confetti on success
 */
export function PlaylistResults({
  narrative,
  onCreatePlaylist,
  isCreating = false,
  isSuccess = false,
}: PlaylistResultsProps) {
  const [displayedNarrative, setDisplayedNarrative] = useState("");
  const [showConfetti, setShowConfetti] = useState(false);

  // Typing animation for narrative
  useEffect(() => {
    if (!narrative.overallNarrative) return;

    let currentIndex = 0;
    const text = narrative.overallNarrative;
    
    const typingInterval = setInterval(() => {
      if (currentIndex < text.length) {
        setDisplayedNarrative(text.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        clearInterval(typingInterval);
      }
    }, 20); // Adjust speed here

    return () => clearInterval(typingInterval);
  }, [narrative.overallNarrative]);

  // Show confetti on success
  useEffect(() => {
    if (isSuccess) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isSuccess]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full space-y-6 relative"
    >
      {/* Confetti Effect */}
      {showConfetti && <ConfettiEffect />}

      {/* Playlist Header */}
      <Card className="border-2 border-primary/20 hover:border-primary/40 transition-all duration-300">
        <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10">
          <div className="flex items-center gap-2">
            <Music className="w-6 h-6 text-primary" />
            <CardTitle className="font-heading text-3xl text-primary">
              {narrative.playlistName}
            </CardTitle>
          </div>
          <CardDescription className="text-base mt-2">
            {narrative.playlistDescription}
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Narrative Section */}
      <Card className="border-2 border-accent/20">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-accent" />
            <CardTitle className="text-xl">Your Musical Year</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-base leading-relaxed whitespace-pre-wrap">
            {displayedNarrative}
            {displayedNarrative.length < narrative.overallNarrative.length && (
              <span className="animate-pulse">|</span>
            )}
          </p>
        </CardContent>
      </Card>

      {/* Song Recommendations */}
      <div>
        <h3 className="text-2xl font-heading text-primary mb-4 flex items-center gap-2">
          <Music className="w-6 h-6" />
          Song Recommendations
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {narrative.songRecommendations.map((song, index) => (
            <SongCard key={index} song={song} index={index} />
          ))}
        </div>
      </div>

      {/* Create Playlist Button */}
      <div className="flex justify-center pt-4">
        <Button
          onClick={onCreatePlaylist}
          disabled={isCreating}
          size="lg"
          className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50"
        >
          {isSuccess ? (
            <>
              <CheckCircle2 className="mr-2 w-5 h-5" />
              Playlist Created!
            </>
          ) : (
            <>
              <Music className="mr-2 w-5 h-5" />
              {isCreating ? "Creating Playlist..." : "Create Playlist on Spotify"}
            </>
          )}
        </Button>
      </div>
    </motion.div>
  );
}

interface SongCardProps {
  song: {
    searchQuery: string;
    reasoning: string;
    festiveConnection: string;
  };
  index: number;
}

function SongCard({ song, index }: SongCardProps) {
  const [artist, title] = song.searchQuery.split(" - ");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <Card className="border-2 border-muted hover:border-primary/40 transition-all duration-300 hover:shadow-md group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg group-hover:text-primary transition-colors">
              {title || song.searchQuery}
            </CardTitle>
            <CardDescription className="mt-1">{artist || "Unknown Artist"}</CardDescription>
          </div>
          <Badge variant="secondary" className="ml-2 bg-accent/20 text-accent-foreground">
            #{index + 1}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-1">Why it fits:</p>
          <p className="text-sm">{song.reasoning}</p>
        </div>
        <div className="pt-2 border-t">
          <p className="text-sm font-medium text-muted-foreground mb-1">Festive connection:</p>
          <p className="text-sm text-primary">{song.festiveConnection}</p>
        </div>
      </CardContent>
    </Card>
    </motion.div>
  );
}


