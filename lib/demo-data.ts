/**
 * Demo mode data
 * Provides example data for demonstration without authentication
 */

import type { UserMusicProfile } from "@/types/spotify";
import type { PlaylistNarrative } from "@/types/groq";

export const demoMusicProfile: UserMusicProfile = {
  averageAudioFeatures: {
    danceability: 0.72,
    energy: 0.65,
    valence: 0.68,
    acousticness: 0.35,
    instrumentalness: 0.12,
    liveness: 0.18,
    speechiness: 0.08,
    tempo: 125,
  },
  topGenres: [
    { genre: "Pop", count: 45, percentage: 30 },
    { genre: "Indie", count: 32, percentage: 21 },
    { genre: "Rock", count: 28, percentage: 19 },
    { genre: "Electronic", count: 25, percentage: 17 },
    { genre: "Folk", count: 20, percentage: 13 },
  ],
  topArtists: [
    {
      id: "demo-1",
      name: "Taylor Swift",
      count: 15,
      genres: ["Pop", "Country"],
      popularity: 95,
    },
    {
      id: "demo-2",
      name: "The Beatles",
      count: 12,
      genres: ["Rock", "Pop"],
      popularity: 90,
    },
    {
      id: "demo-3",
      name: "Billie Eilish",
      count: 10,
      genres: ["Pop", "Alternative"],
      popularity: 88,
    },
  ],
  timeRangePreferences: {
    shortTerm: {
      topTracks: [],
      averageFeatures: {
        danceability: 0.75,
        energy: 0.68,
        valence: 0.70,
      },
    },
    mediumTerm: {
      topTracks: [],
      averageFeatures: {
        danceability: 0.72,
        energy: 0.65,
        valence: 0.68,
      },
    },
    longTerm: {
      topTracks: [],
      averageFeatures: {
        danceability: 0.70,
        energy: 0.62,
        valence: 0.65,
      },
    },
  },
  recentlyPlayed: [],
  totalTracksAnalyzed: 150,
  generatedAt: new Date(),
};

export const demoPlaylistNarrative: PlaylistNarrative = {
  playlistName: "Cozy Christmas Vibes for Pop Lovers",
  playlistDescription:
    "A warm blend of your favorite pop and indie sounds with festive holiday cheer. Perfect for cozy winter evenings and holiday gatherings.",
  songRecommendations: [
    {
      searchQuery: "Mariah Carey - All I Want for Christmas Is You",
      reasoning:
        "Your love for pop music makes this classic a perfect fit. It matches your high energy and danceability preferences.",
      festiveConnection:
        "The ultimate Christmas pop anthem that brings joy and festive spirit to any celebration.",
    },
    {
      searchQuery: "Taylor Swift - Christmas Tree Farm",
      reasoning:
        "Taylor Swift is one of your top artists, and this song combines her signature style with holiday magic.",
      festiveConnection:
        "A modern Christmas classic that captures the warmth and nostalgia of the holiday season.",
    },
    {
      searchQuery: "The Beatles - Here Comes the Sun",
      reasoning:
        "While not explicitly Christmas, The Beatles are in your top artists and this uplifting track fits your positive valence preference.",
      festiveConnection:
        "A timeless song that brings light and joy, perfect for brightening up winter days.",
    },
    {
      searchQuery: "Billie Eilish - come out and play",
      reasoning:
        "Billie Eilish is one of your favorites, and this acoustic track matches your appreciation for indie and alternative sounds.",
      festiveConnection:
        "A gentle, introspective track perfect for quiet holiday moments and reflection.",
    },
    {
      searchQuery: "Wham! - Last Christmas",
      reasoning:
        "This pop classic matches your danceability preferences and brings infectious holiday energy.",
      festiveConnection:
        "The quintessential 80s Christmas pop song that gets everyone in the festive mood.",
    },
  ],
  overallNarrative:
    "Your musical year has been a beautiful journey through pop, indie, and rock landscapes. You've shown a strong preference for upbeat, danceable tracks with positive energy, which makes you the perfect candidate for a festive playlist that combines holiday classics with modern pop favorites.\n\nYour top artists like Taylor Swift, The Beatles, and Billie Eilish show a diverse taste that spans generations, from timeless classics to contemporary hits. This playlist celebrates that diversity by blending traditional Christmas songs with modern interpretations that match your musical DNA.\n\nAs we wrap up the year, this playlist is designed to bring warmth, joy, and that special holiday magic to your listening experience. Each song has been carefully selected to honor your musical preferences while adding that extra sprinkle of festive cheer.",
};

