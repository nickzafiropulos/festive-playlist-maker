/**
 * Shared TypeScript type definitions
 */

export interface Playlist {
  id: string;
  name: string;
  description: string | null;
  tracks: Track[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Track {
  id: string;
  name: string;
  artist: string;
  album: string;
  duration: number;
  previewUrl: string | null;
  spotifyUrl: string;
  imageUrl: string | null;
}

export interface User {
  id: string;
  name: string;
  email: string;
  imageUrl: string | null;
}

export interface PlaylistGenerationRequest {
  theme: string;
  mood: string;
  duration?: number;
  includePopular?: boolean;
  includeClassic?: boolean;
}

export interface PlaylistGenerationResponse {
  playlist: Playlist;
  reasoning: string;
}

