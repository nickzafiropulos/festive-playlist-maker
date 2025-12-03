/**
 * Spotify API Client
 * 
 * Complete implementation of Spotify Web API integration
 */

import axios, { AxiosError, AxiosInstance } from "axios";
import type {
  SpotifyTrack,
  SpotifyAudioFeatures,
  SpotifyUser,
  SpotifyTopTracksResponse,
  SpotifyRecentlyPlayedResponse,
  SpotifyAudioFeaturesResponse,
  SpotifySearchResponse,
  SpotifyCreatePlaylistResponse,
  SpotifyError,
} from "@/types/spotify";

const SPOTIFY_API_BASE_URL = "https://api.spotify.com/v1";

export class SpotifyClient {
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private clientId: string;
  private clientSecret: string;
  private axiosInstance: AxiosInstance;

  constructor(
    accessToken?: string,
    refreshToken?: string,
    clientId?: string,
    clientSecret?: string
  ) {
    this.accessToken = accessToken || null;
    this.refreshToken = refreshToken || null;
    this.clientId = clientId || process.env.SPOTIFY_CLIENT_ID || "";
    this.clientSecret = clientSecret || process.env.SPOTIFY_CLIENT_SECRET || "";

    this.axiosInstance = axios.create({
      baseURL: SPOTIFY_API_BASE_URL,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Add request interceptor to include access token
    this.axiosInstance.interceptors.request.use(
      (config) => {
        if (this.accessToken) {
          config.headers.Authorization = `Bearer ${this.accessToken}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Add response interceptor for token refresh
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      async (error: AxiosError<SpotifyError>) => {
        const originalRequest = error.config as any;

        // If error is 401 and we haven't already retried
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const newToken = await this.refreshAccessToken();
            if (newToken) {
              this.accessToken = newToken;
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
              return this.axiosInstance(originalRequest);
            }
          } catch (refreshError) {
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  setAccessToken(token: string): void {
    this.accessToken = token;
  }

  setRefreshToken(token: string): void {
    this.refreshToken = token;
  }

  /**
   * Refresh the access token using the refresh token
   */
  private async refreshAccessToken(): Promise<string | null> {
    if (!this.refreshToken) {
      throw new Error("No refresh token available");
    }

    try {
      const response = await axios.post(
        "https://accounts.spotify.com/api/token",
        new URLSearchParams({
          grant_type: "refresh_token",
          refresh_token: this.refreshToken,
        }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Basic ${Buffer.from(
              `${this.clientId}:${this.clientSecret}`
            ).toString("base64")}`,
          },
        }
      );

      const { access_token, refresh_token } = response.data;
      this.accessToken = access_token;
      if (refresh_token) {
        this.refreshToken = refresh_token;
      }
      return access_token;
    } catch (error) {
      console.error("Error refreshing access token:", error);
      throw error;
    }
  }

  /**
   * Get user's top tracks
   * @param timeRange - 'short_term' (last 4 weeks), 'medium_term' (last 6 months), 'long_term' (all time)
   * @param limit - Number of tracks to return (1-50, default 20)
   */
  async getTopTracks(
    timeRange: "short_term" | "medium_term" | "long_term" = "medium_term",
    limit: number = 20
  ): Promise<SpotifyTrack[]> {
    try {
      const response = await this.axiosInstance.get<SpotifyTopTracksResponse>(
        "/me/top/tracks",
        {
          params: {
            time_range: timeRange,
            limit: Math.min(Math.max(1, limit), 50),
          },
        }
      );
      return response.data.items;
    } catch (error) {
      console.error("Error fetching top tracks:", error);
      throw this.handleError(error);
    }
  }

  /**
   * Get user's recently played tracks
   * @param limit - Number of tracks to return (1-50, default 20)
   */
  async getRecentlyPlayed(limit: number = 20): Promise<SpotifyTrack[]> {
    try {
      const response = await this.axiosInstance.get<SpotifyRecentlyPlayedResponse>(
        "/me/player/recently-played",
        {
          params: {
            limit: Math.min(Math.max(1, limit), 50),
          },
        }
      );
      return response.data.items.map((item) => item.track);
    } catch (error) {
      console.error("Error fetching recently played tracks:", error);
      throw this.handleError(error);
    }
  }

  /**
   * Get audio features for multiple tracks
   * @param trackIds - Array of track IDs (max 100)
   */
  async getAudioFeatures(trackIds: string[]): Promise<SpotifyAudioFeatures[]> {
    if (trackIds.length === 0) {
      return [];
    }

    // Spotify API allows max 100 tracks per request
    const chunks: string[][] = [];
    for (let i = 0; i < trackIds.length; i += 100) {
      chunks.push(trackIds.slice(i, i + 100));
    }

    try {
      const allFeatures: SpotifyAudioFeatures[] = [];
      for (const chunk of chunks) {
        const response = await this.axiosInstance.get<SpotifyAudioFeaturesResponse>(
          "/audio-features",
          {
            params: {
              ids: chunk.join(","),
            },
          }
        );
        allFeatures.push(...response.data.audio_features.filter((f) => f !== null));
      }
      return allFeatures;
    } catch (error) {
      console.error("Error fetching audio features:", error);
      throw this.handleError(error);
    }
  }

  /**
   * Create a new playlist for the user
   * @param userId - Spotify user ID
   * @param name - Playlist name
   * @param description - Playlist description
   * @param public - Whether playlist is public (default: false)
   */
  async createPlaylist(
    userId: string,
    name: string,
    description: string,
    publicPlaylist: boolean = false
  ): Promise<SpotifyCreatePlaylistResponse> {
    try {
      const response = await this.axiosInstance.post<SpotifyCreatePlaylistResponse>(
        `/users/${userId}/playlists`,
        {
          name,
          description,
          public: publicPlaylist,
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error creating playlist:", error);
      throw this.handleError(error);
    }
  }

  /**
   * Add tracks to a playlist
   * @param playlistId - Spotify playlist ID
   * @param trackUris - Array of track URIs (spotify:track:xxx format)
   */
  async addTracksToPlaylist(
    playlistId: string,
    trackUris: string[]
  ): Promise<{ snapshot_id: string }> {
    if (trackUris.length === 0) {
      throw new Error("No track URIs provided");
    }

    // Spotify API allows max 100 tracks per request
    const chunks: string[][] = [];
    for (let i = 0; i < trackUris.length; i += 100) {
      chunks.push(trackUris.slice(i, i + 100));
    }

    try {
      let lastSnapshotId = "";
      for (const chunk of chunks) {
        const response = await this.axiosInstance.post<{ snapshot_id: string }>(
          `/playlists/${playlistId}/tracks`,
          {
            uris: chunk,
          }
        );
        lastSnapshotId = response.data.snapshot_id;
      }
      return { snapshot_id: lastSnapshotId };
    } catch (error) {
      console.error("Error adding tracks to playlist:", error);
      throw this.handleError(error);
    }
  }

  /**
   * Search for tracks
   * @param query - Search query
   * @param limit - Number of results to return (1-50, default 20)
   */
  async searchTracks(query: string, limit: number = 20): Promise<SpotifyTrack[]> {
    try {
      const response = await this.axiosInstance.get<SpotifySearchResponse>(
        "/search",
        {
          params: {
            q: query,
            type: "track",
            limit: Math.min(Math.max(1, limit), 50),
          },
        }
      );
      return response.data.tracks.items;
    } catch (error) {
      console.error("Error searching tracks:", error);
      throw this.handleError(error);
    }
  }

  /**
   * Get current user's profile
   */
  async getCurrentUser(): Promise<SpotifyUser> {
    try {
      const response = await this.axiosInstance.get<SpotifyUser>("/me");
      return response.data;
    } catch (error) {
      console.error("Error fetching current user:", error);
      throw this.handleError(error);
    }
  }

  /**
   * Handle API errors
   */
  private handleError(error: unknown): Error {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<SpotifyError | { error?: string; error_description?: string }>;
      const status = axiosError.response?.status;
      
      // Handle 403 Forbidden - usually means missing scopes or permissions
      if (status === 403) {
        const errorData = axiosError.response?.data;
        const errorMessage = 
          (errorData as any)?.error?.message ||
          (errorData as any)?.error_description ||
          (errorData as any)?.error ||
          "Access forbidden. Please make sure you granted all required permissions when connecting with Spotify.";
        
        return new Error(
          `Spotify API Error: ${errorMessage} (Status: 403)\n\n` +
          `This usually means:\n` +
          `1. You didn't grant all required permissions when connecting\n` +
          `2. The app needs to be re-authorized\n` +
          `3. Try disconnecting and reconnecting your Spotify account`
        );
      }
      
      // Handle 401 Unauthorized
      if (status === 401) {
        return new Error(
          "Authentication failed. Please reconnect with Spotify."
        );
      }
      
      // Handle rate limiting
      if (status === 429) {
        const retryAfter = axiosError.response?.headers?.["retry-after"];
        return new Error(
          `Rate limit exceeded. Retry after ${retryAfter || "some time"} seconds.`
        );
      }
      
      // Handle other Spotify API errors
      if (axiosError.response?.data) {
        const errorData = axiosError.response.data as any;
        if (errorData.error) {
          const message = errorData.error.message || errorData.error;
          const errorStatus = errorData.error.status || status;
          return new Error(
            `Spotify API Error: ${message} (Status: ${errorStatus})`
          );
        }
      }
      
      return new Error(
        `Request failed: ${axiosError.message || "Unknown error"} (Status: ${status || "unknown"})`
      );
    }
    return error instanceof Error ? error : new Error("Unknown error occurred");
  }
}
