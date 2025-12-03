"use client";

import { useState, useEffect } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { Hero } from "@/components/Hero";
import { MusicProfileCard } from "@/components/MusicProfileCard";
import { PlaylistGenerator } from "@/components/PlaylistGenerator";
import { PlaylistResults } from "@/components/PlaylistResults";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, RefreshCw, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import { Footer } from "@/components/Footer";
import { FestiveLoading } from "@/components/FestiveLoading";
import { ConfettiEffect } from "@/components/ConfettiEffect";
import { DemoModeBanner } from "@/components/DemoModeBanner";
import { analytics } from "@/lib/analytics";
import { demoMusicProfile, demoPlaylistNarrative } from "@/lib/demo-data";
import type { UserMusicProfile } from "@/types/spotify";
import type { PlaylistNarrative } from "@/types/groq";
import { SpotifyClient } from "@/lib/spotify";

type AppState =
  | "landing"
  | "analyzing"
  | "profile-ready"
  | "generating"
  | "results-ready"
  | "creating"
  | "success"
  | "error";

type ProgressStage = "idle" | "analyzing" | "finding" | "creating";

interface CreatedPlaylist {
  playlistId: string;
  playlistUrl: string;
  name: string;
}

export default function Home() {
  const { data: session, status } = useSession();
  const [appState, setAppState] = useState<AppState>("landing");
  const [progressStage, setProgressStage] = useState<ProgressStage>("idle");
  const [musicProfile, setMusicProfile] = useState<UserMusicProfile | null>(null);
  const [playlistNarrative, setPlaylistNarrative] = useState<PlaylistNarrative | null>(null);
  const [trackUris, setTrackUris] = useState<string[]>([]);
  const [createdPlaylist, setCreatedPlaylist] = useState<CreatedPlaylist | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [demoMode, setDemoMode] = useState<boolean>(false);

  // Check demo mode status on mount
  useEffect(() => {
    const checkDemoMode = async () => {
      try {
        const response = await fetch("/api/demo-mode");
        if (response.ok) {
          const data = await response.json();
          setDemoMode(data.isDemoMode);
        }
      } catch (err) {
        // If API fails, assume not demo mode (show connect button)
        setDemoMode(false);
      }
    };
    checkDemoMode();
  }, []);

  // Auto-fetch profile when authenticated or load demo mode
  useEffect(() => {
    if (demoMode && appState === "landing") {
      // Demo mode: load demo data
      setMusicProfile(demoMusicProfile);
      setAppState("profile-ready");
      analytics.track("demo_mode_activated");
    } else if (
      status === "authenticated" &&
      session?.accessToken &&
      appState === "landing"
    ) {
      handleAnalyzeProfile();
      analytics.track("spotify_connect_success");
    }
    // Note: We don't track unauthenticated status as an error
    // since it's a normal state when user hasn't logged in yet
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, session?.accessToken, appState, demoMode]);

  const handleConnectSpotify = () => {
    analytics.track("spotify_connect_clicked");
    signIn("spotify", { callbackUrl: window.location.origin });
  };

  const handleAnalyzeProfile = async () => {
    setAppState("analyzing");
    setError(null);
    setProgressStage("analyzing");
    analytics.track("profile_analysis_started");

    try {
      const response = await fetch("/api/profile");
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to analyze your music profile");
      }

      const profile: UserMusicProfile = await response.json();
      setMusicProfile(profile);
      setAppState("profile-ready");
      setProgressStage("idle");
      analytics.track("profile_analysis_completed", {
        tracksAnalyzed: profile.totalTracksAnalyzed,
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to analyze your music profile";
      setError(errorMessage);
      setAppState("error");
      setProgressStage("idle");
      analytics.trackError("profile_analysis_error", err instanceof Error ? err : new Error(String(err)));
    }
  };

  const handleGeneratePlaylist = async () => {
    if (!musicProfile) return;

    setAppState("generating");
    setError(null);
    setProgressStage("analyzing");
    analytics.track("playlist_generation_started");

    // Demo mode: use demo data
    if (demoMode) {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setPlaylistNarrative(demoPlaylistNarrative);
      setTrackUris([]); // No real tracks in demo mode
      setAppState("results-ready");
      setProgressStage("idle");
      analytics.track("playlist_generation_completed", { demo: true });
      return;
    }

    try {
      // Stage 1: Analyzing
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setProgressStage("finding");

      // Stage 2: Finding matches
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setProgressStage("creating");

      // Stage 3: Generating narrative
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(musicProfile),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate playlist");
      }

      const narrative: PlaylistNarrative = await response.json();
      setPlaylistNarrative(narrative);

      // Stage 4: Search for tracks on Spotify
      if (session?.accessToken) {
        const client = new SpotifyClient(session.accessToken, session.refreshToken);
        const uris: string[] = [];

        for (const recommendation of narrative.songRecommendations) {
          try {
            const tracks = await client.searchTracks(recommendation.searchQuery, 1);
            if (tracks.length > 0) {
              uris.push(tracks[0].uri);
            }
          } catch (err) {
            console.warn(`Failed to find track: ${recommendation.searchQuery}`, err);
            // Continue with other tracks even if one fails
          }
        }

        setTrackUris(uris);
      }

      setAppState("results-ready");
      setProgressStage("idle");
      analytics.track("playlist_generation_completed", {
        songCount: narrative.songRecommendations.length,
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to generate playlist";
      setError(errorMessage);
      setAppState("error");
      setProgressStage("idle");
      analytics.trackError("playlist_generation_error", err instanceof Error ? err : new Error(String(err)));
    }
  };

  const handleCreatePlaylist = async () => {
    if (!playlistNarrative || !trackUris.length) return;

    // Demo mode: show success without creating
    if (demoMode) {
      setCreatedPlaylist({
        playlistId: "demo-playlist",
        playlistUrl: "https://open.spotify.com",
        name: playlistNarrative.playlistName,
      });
      setAppState("success");
      analytics.track("playlist_created", { demo: true });
      return;
    }

    setAppState("creating");
    setError(null);

    try {
      const response = await fetch("/api/create-playlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          narrative: playlistNarrative,
          trackUris,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create playlist");
      }

      const result: CreatedPlaylist = await response.json();
      setCreatedPlaylist(result);
      setAppState("success");
      analytics.track("playlist_created", {
        playlistId: result.playlistId,
        trackCount: trackUris.length,
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to create playlist";
      setError(errorMessage);
      setAppState("error");
      analytics.trackError("playlist_creation_error", err instanceof Error ? err : new Error(String(err)));
    }
  };

  const handleStartOver = () => {
    setAppState("landing");
    setMusicProfile(null);
    setPlaylistNarrative(null);
    setTrackUris([]);
    setCreatedPlaylist(null);
    setError(null);
    setProgressStage("idle");
  };

  // Render based on app state
  if (appState === "landing") {
    return (
      <main className="min-h-screen flex flex-col">
        {demoMode && (
          <div className="container mx-auto px-4 pt-4">
            <DemoModeBanner />
          </div>
        )}
        {status === "authenticated" && (
          <div className="container mx-auto px-4 pt-4">
            <Alert className="mb-4 border-primary/50 bg-primary/10">
              <AlertCircle className="h-4 w-4 text-primary" />
              <AlertDescription className="text-sm">
                <strong>Connected as:</strong> {session?.user?.name || session?.user?.email}
                <Button
                  onClick={async () => {
                    await signOut({ redirect: false });
                    setAppState("landing");
                    setError(null);
                    setMusicProfile(null);
                  }}
                  variant="outline"
                  size="sm"
                  className="ml-4"
                >
                  Disconnect
                </Button>
              </AlertDescription>
            </Alert>
          </div>
        )}
        <Hero onConnectSpotify={handleConnectSpotify} />
        <Footer />
      </main>
    );
  }

  if (appState === "analyzing") {
    return (
      <main className="min-h-screen flex flex-col">
        <div className="container mx-auto px-4 py-12 flex-1">
          <div className="max-w-4xl mx-auto space-y-6">
            <FestiveLoading />
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  if (appState === "error") {
    const is403Error = error?.includes("403") || error?.toLowerCase().includes("forbidden");
    const needsReconnect = is403Error && !musicProfile;
    
    return (
      <main className="min-h-screen flex flex-col">
        <div className="container mx-auto px-4 py-12 flex-1">
          <div className="max-w-4xl mx-auto space-y-6">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Oops! Something went wrong</AlertTitle>
              <AlertDescription className="whitespace-pre-line">
                {error || "An unexpected error occurred"}
                {is403Error && (
                  <div className="mt-4 p-3 bg-destructive/10 rounded-md text-sm">
                    <strong>403 Forbidden Error:</strong> This usually means you didn't grant all required permissions when connecting with Spotify.
                    <br />
                    <br />
                    <strong>Quick Fix:</strong>
                    <ol className="list-decimal list-inside mt-2 space-y-1">
                      <li>Go to <a href="https://www.spotify.com/account/apps/" target="_blank" rel="noopener noreferrer" className="underline">your Spotify apps page</a></li>
                      <li>Remove access to this app</li>
                      <li>Come back and click "Reconnect with Spotify" below</li>
                      <li>Make sure to approve ALL permissions when asked</li>
                    </ol>
                  </div>
                )}
              </AlertDescription>
            </Alert>
            
            {musicProfile && <MusicProfileCard profile={musicProfile} />}
            
            <div className="flex flex-wrap gap-4">
              {needsReconnect ? (
                <>
                  <Button 
                    onClick={async () => {
                      await signOut({ redirect: false });
                      handleConnectSpotify();
                    }} 
                    className="bg-primary"
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Disconnect & Reconnect with Spotify
                  </Button>
                  <Button 
                    onClick={async () => {
                      await signOut({ redirect: false });
                      setAppState("landing");
                      setError(null);
                    }} 
                    variant="outline"
                  >
                    Disconnect Spotify
                  </Button>
                </>
              ) : (
                <>
                  <Button onClick={handleStartOver} variant="outline">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Start Over
                  </Button>
                  {musicProfile && (
                    <Button onClick={handleGeneratePlaylist}>
                      Try Generating Again
                    </Button>
                  )}
                  {!musicProfile && (
                    <Button onClick={handleAnalyzeProfile}>
                      Try Analyzing Again
                    </Button>
                  )}
                  {status === "authenticated" && (
                    <Button 
                      onClick={async () => {
                        await signOut({ redirect: false });
                        setAppState("landing");
                        setError(null);
                        setMusicProfile(null);
                      }} 
                      variant="outline"
                    >
                      Disconnect Spotify
                    </Button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  if (appState === "success" && createdPlaylist) {
    return (
      <main className="min-h-screen flex flex-col">
        <ConfettiEffect />
        <div className="container mx-auto px-4 py-12 flex-1">
          <div className="max-w-4xl mx-auto space-y-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="border-2 border-primary/20">
                <CardContent className="pt-6 text-center space-y-4">
                  <div className="text-6xl mb-4">🎉</div>
                  <h2 className="font-heading text-3xl text-primary">
                    Playlist Created Successfully!
                  </h2>
                  <p className="text-lg text-muted-foreground">
                    Your festive playlist "{createdPlaylist.name}" is ready on Spotify!
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                    <Button
                      onClick={() => window.open(createdPlaylist.playlistUrl, "_blank")}
                      size="lg"
                      className="bg-primary hover:bg-primary/90"
                    >
                      <ExternalLink className="mr-2 h-5 w-5" />
                      Open in Spotify
                    </Button>
                    <Button onClick={handleStartOver} variant="outline" size="lg">
                      <RefreshCw className="mr-2 h-5 w-5" />
                      Create Another
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col">
      <div className="container mx-auto px-4 py-12 flex-1">
        <div className="max-w-4xl mx-auto space-y-8">
        {/* Demo Mode Banner */}
        {demoMode && <DemoModeBanner />}

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Music Profile Card */}
        {musicProfile && (
          <MusicProfileCard profile={musicProfile} />
        )}


        {/* Playlist Generator */}
        {(appState === "profile-ready" || appState === "generating") && (
          <PlaylistGenerator
            onGenerate={handleGeneratePlaylist}
            isLoading={appState === "generating"}
            progressStage={progressStage}
          />
        )}

        {/* Playlist Results */}
        {(appState === "results-ready" || appState === "creating" || appState === "success") && playlistNarrative && (
          <PlaylistResults
            narrative={playlistNarrative}
            onCreatePlaylist={handleCreatePlaylist}
            isCreating={appState === "creating"}
            isSuccess={appState === "success"}
          />
        )}

        {/* Start Over Button */}
        {(appState === "profile-ready" || appState === "results-ready") && (
          <div className="flex justify-center pt-4">
            <Button onClick={handleStartOver} variant="outline">
              <RefreshCw className="mr-2 h-4 w-4" />
              Start Over
            </Button>
          </div>
        )}
        </div>
      </div>
      <Footer />
    </main>
  );
}
