/**
 * Spotify User Music Profile Analyzer
 * 
 * Analyzes user's music listening patterns and creates a comprehensive profile
 */

import { SpotifyClient } from "./spotify";
import type {
  SpotifyTrack,
  SpotifyAudioFeatures,
  UserMusicProfile,
} from "@/types/spotify";

/**
 * Analyze user's music profile by aggregating data from multiple sources
 * @param client - Initialized SpotifyClient instance
 * @param options - Analysis options
 */
export async function analyzeUserMusicProfile(
  client: SpotifyClient,
  options: {
    topTracksLimit?: number;
    recentlyPlayedLimit?: number;
  } = {}
): Promise<UserMusicProfile> {
  const { topTracksLimit = 50, recentlyPlayedLimit = 50 } = options;

  // First, test basic access with /me endpoint
  try {
    await client.getCurrentUser();
  } catch (error) {
    console.error("Failed to get current user - this will help diagnose the 403 error:", error);
    throw error;
  }

  // Fetch top tracks from all time ranges
  const [shortTermTracks, mediumTermTracks, longTermTracks, recentlyPlayed] =
    await Promise.all([
      client.getTopTracks("short_term", topTracksLimit),
      client.getTopTracks("medium_term", topTracksLimit),
      client.getTopTracks("long_term", topTracksLimit),
      client.getRecentlyPlayed(recentlyPlayedLimit),
    ]);

  // Combine all tracks for analysis
  const allTracks = [
    ...shortTermTracks,
    ...mediumTermTracks,
    ...longTermTracks,
    ...recentlyPlayed,
  ];

  // Remove duplicates based on track ID
  const uniqueTracks = Array.from(
    new Map(allTracks.map((track) => [track.id, track])).values()
  );

  // Get track IDs for audio features
  const trackIds = uniqueTracks.map((track) => track.id);

  // Fetch audio features for all tracks
  const audioFeatures = await client.getAudioFeatures(trackIds);

  // Calculate average audio features for each time range
  const shortTermFeatures = await calculateAverageFeatures(
    shortTermTracks,
    audioFeatures
  );
  const mediumTermFeatures = await calculateAverageFeatures(
    mediumTermTracks,
    audioFeatures
  );
  const longTermFeatures = await calculateAverageFeatures(
    longTermTracks,
    audioFeatures
  );

  // Calculate overall average features
  const averageFeatures = calculateOverallAverageFeatures(audioFeatures);

  // Extract and aggregate genres
  const genreMap = new Map<string, number>();
  uniqueTracks.forEach((track) => {
    track.artists.forEach((artist) => {
      // Note: Genres are typically on the artist object, but we need to fetch artist details
      // For now, we'll use a placeholder approach
      // In a full implementation, you'd fetch artist details to get genres
    });
  });

  // Get top artists
  const artistMap = new Map<
    string,
    { id: string; name: string; count: number; genres: string[]; popularity: number }
  >();

  uniqueTracks.forEach((track) => {
    track.artists.forEach((artist) => {
      const existing = artistMap.get(artist.id);
      if (existing) {
        existing.count += 1;
      } else {
        artistMap.set(artist.id, {
          id: artist.id,
          name: artist.name,
          count: 1,
          genres: [], // Would be populated from artist details API call
          popularity: 0, // Would be populated from artist details API call
        });
      }
    });
  });

  const topArtists = Array.from(artistMap.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, 20);

  // Aggregate genres (simplified - would need artist API calls for full implementation)
  const topGenres = aggregateGenres(uniqueTracks);

  return {
    averageAudioFeatures: {
      danceability: averageFeatures.danceability,
      energy: averageFeatures.energy,
      valence: averageFeatures.valence,
      acousticness: averageFeatures.acousticness,
      instrumentalness: averageFeatures.instrumentalness,
      liveness: averageFeatures.liveness,
      speechiness: averageFeatures.speechiness,
      tempo: averageFeatures.tempo,
    },
    topGenres,
    topArtists,
    timeRangePreferences: {
      shortTerm: {
        topTracks: shortTermTracks,
        averageFeatures: shortTermFeatures,
      },
      mediumTerm: {
        topTracks: mediumTermTracks,
        averageFeatures: mediumTermFeatures,
      },
      longTerm: {
        topTracks: longTermTracks,
        averageFeatures: longTermFeatures,
      },
    },
    recentlyPlayed,
    totalTracksAnalyzed: uniqueTracks.length,
    generatedAt: new Date(),
  };
}

/**
 * Calculate average audio features for a set of tracks
 */
async function calculateAverageFeatures(
  tracks: SpotifyTrack[],
  allFeatures: SpotifyAudioFeatures[]
): Promise<Partial<SpotifyAudioFeatures>> {
  if (tracks.length === 0) {
    return {};
  }

  const featuresMap = new Map(
    allFeatures.map((f) => [f.id, f])
  );

  const relevantFeatures = tracks
    .map((track) => featuresMap.get(track.id))
    .filter((f): f is SpotifyAudioFeatures => f !== undefined);

  if (relevantFeatures.length === 0) {
    return {};
  }

  return {
    danceability: average(relevantFeatures.map((f) => f.danceability)),
    energy: average(relevantFeatures.map((f) => f.energy)),
    valence: average(relevantFeatures.map((f) => f.valence)),
    acousticness: average(relevantFeatures.map((f) => f.acousticness)),
    instrumentalness: average(relevantFeatures.map((f) => f.instrumentalness)),
    liveness: average(relevantFeatures.map((f) => f.liveness)),
    speechiness: average(relevantFeatures.map((f) => f.speechiness)),
    tempo: average(relevantFeatures.map((f) => f.tempo)),
  };
}

/**
 * Calculate overall average audio features
 */
function calculateOverallAverageFeatures(
  features: SpotifyAudioFeatures[]
): SpotifyAudioFeatures["danceability"] extends number
  ? {
      danceability: number;
      energy: number;
      valence: number;
      acousticness: number;
      instrumentalness: number;
      liveness: number;
      speechiness: number;
      tempo: number;
    }
  : never {
  if (features.length === 0) {
    return {
      danceability: 0,
      energy: 0,
      valence: 0,
      acousticness: 0,
      instrumentalness: 0,
      liveness: 0,
      speechiness: 0,
      tempo: 0,
    } as any;
  }

  return {
    danceability: average(features.map((f) => f.danceability)),
    energy: average(features.map((f) => f.energy)),
    valence: average(features.map((f) => f.valence)),
    acousticness: average(features.map((f) => f.acousticness)),
    instrumentalness: average(features.map((f) => f.instrumentalness)),
    liveness: average(features.map((f) => f.liveness)),
    speechiness: average(features.map((f) => f.speechiness)),
    tempo: average(features.map((f) => f.tempo)),
  } as any;
}

/**
 * Aggregate genres from tracks
 * Note: This is a simplified version. Full implementation would fetch artist details
 */
function aggregateGenres(tracks: SpotifyTrack[]): Array<{
  genre: string;
  count: number;
  percentage: number;
}> {
  // Since genres are on artist objects and we'd need to fetch artist details,
  // this is a placeholder. In production, you'd:
  // 1. Extract unique artist IDs
  // 2. Fetch artist details with genres
  // 3. Aggregate genres

  // For now, return empty array
  // This would be populated with actual genre data from artist API calls
  return [];
}

/**
 * Calculate average of numbers
 */
function average(numbers: number[]): number {
  if (numbers.length === 0) return 0;
  return numbers.reduce((sum, n) => sum + n, 0) / numbers.length;
}

