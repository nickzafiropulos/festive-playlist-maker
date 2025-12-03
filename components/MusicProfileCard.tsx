"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  Music, 
  Heart, 
  Zap, 
  TrendingUp, 
  Radio, 
  Users,
  Sparkles 
} from "lucide-react";
import type { UserMusicProfile } from "@/types/spotify";

interface MusicProfileCardProps {
  profile: UserMusicProfile;
}

/**
 * MusicProfileCard - Displays user's music profile with festive styling
 * Shows top genres, artists, and audio features
 */
export function MusicProfileCard({ profile }: MusicProfileCardProps) {
  const features = profile.averageAudioFeatures;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="w-full border-2 border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-lg">
      <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10">
        <div className="flex items-center gap-2">
          <Music className="w-6 h-6 text-primary" />
          <CardTitle className="font-heading text-2xl text-primary">
            Your Music Profile
          </CardTitle>
        </div>
        <CardDescription className="text-base">
          Discover your musical taste and preferences
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-6 space-y-6">
        {/* Top Genres */}
        {profile.topGenres.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-accent" />
              <h3 className="font-semibold text-lg">Top Genres</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {profile.topGenres.slice(0, 8).map((genre, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="bg-accent/20 text-accent-foreground hover:bg-accent/30 transition-colors"
                >
                  {genre.genre}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <Separator />

        {/* Top Artists */}
        {profile.topArtists.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Users className="w-5 h-5 text-secondary" />
              <h3 className="font-semibold text-lg">Top Artists</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {profile.topArtists.slice(0, 6).map((artist) => (
                <div
                  key={artist.id}
                  className="flex items-center gap-2 p-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <Music className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{artist.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {artist.count} tracks
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <Separator />

        {/* Audio Features */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Radio className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-lg">Audio Features</h3>
          </div>
          <div className="space-y-4">
            <FeatureBar
              label="Energy"
              value={features.energy}
              icon={<Zap className="w-4 h-4" />}
              color="text-secondary"
            />
            <FeatureBar
              label="Danceability"
              value={features.danceability}
              icon={<TrendingUp className="w-4 h-4" />}
              color="text-accent"
            />
            <FeatureBar
              label="Valence (Positivity)"
              value={features.valence}
              icon={<Heart className="w-4 h-4" />}
              color="text-primary"
            />
            <FeatureBar
              label="Acousticness"
              value={features.acousticness}
              icon={<Music className="w-4 h-4" />}
              color="text-muted-foreground"
            />
          </div>
        </div>

        {/* Summary Stats */}
        <div className="pt-4 border-t">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-primary">
                {profile.totalTracksAnalyzed}
              </p>
              <p className="text-xs text-muted-foreground">Tracks Analyzed</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-secondary">
                {profile.topArtists.length}
              </p>
              <p className="text-xs text-muted-foreground">Top Artists</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-accent">
                {profile.topGenres.length}
              </p>
              <p className="text-xs text-muted-foreground">Genres</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-primary">
                {Math.round(features.tempo)}
              </p>
              <p className="text-xs text-muted-foreground">Avg BPM</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
    </motion.div>
  );
}

interface FeatureBarProps {
  label: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}

function FeatureBar({ label, value, icon, color }: FeatureBarProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={color}>{icon}</span>
          <span className="text-sm font-medium">{label}</span>
        </div>
        <span className="text-sm text-muted-foreground">
          {Math.round(value * 100)}%
        </span>
      </div>
      <Progress 
        value={value * 100} 
        className="h-2"
      />
    </div>
  );
}

