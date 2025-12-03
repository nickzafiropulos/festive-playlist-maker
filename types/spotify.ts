/**
 * Spotify Web API TypeScript types
 * Based on Spotify Web API documentation
 */

export interface SpotifyTrack {
  album: {
    album_type: string;
    total_tracks: number;
    available_markets: string[];
    external_urls: {
      spotify: string;
    };
    href: string;
    id: string;
    images: Array<{
      url: string;
      height: number;
      width: number;
    }>;
    name: string;
    release_date: string;
    release_date_precision: string;
    restrictions?: {
      reason: string;
    };
    type: string;
    uri: string;
    artists: Array<{
      external_urls: {
        spotify: string;
      };
      href: string;
      id: string;
      name: string;
      type: string;
      uri: string;
    }>;
  };
  artists: Array<{
    external_urls: {
      spotify: string;
    };
    href: string;
    id: string;
    name: string;
    type: string;
    uri: string;
    genres?: string[];
  }>;
  available_markets: string[];
  disc_number: number;
  duration_ms: number;
  explicit: boolean;
  external_ids: {
    isrc?: string;
    ean?: string;
    upc?: string;
  };
  external_urls: {
    spotify: string;
  };
  href: string;
  id: string;
  is_playable?: boolean;
  linked_from?: {
    external_urls: {
      spotify: string;
    };
    href: string;
    id: string;
    type: string;
    uri: string;
  };
  restrictions?: {
    reason: string;
  };
  name: string;
  popularity: number;
  preview_url: string | null;
  track_number: number;
  type: string;
  uri: string;
  is_local: boolean;
}

export interface SpotifyAudioFeatures {
  danceability: number;
  energy: number;
  key: number;
  loudness: number;
  mode: number;
  speechiness: number;
  acousticness: number;
  instrumentalness: number;
  liveness: number;
  valence: number;
  tempo: number;
  type: string;
  id: string;
  uri: string;
  track_href: string;
  analysis_url: string;
  duration_ms: number;
  time_signature: number;
}

export interface SpotifyUser {
  country?: string;
  display_name: string | null;
  email?: string;
  explicit_content?: {
    filter_enabled: boolean;
    filter_locked: boolean;
  };
  external_urls: {
    spotify: string;
  };
  followers: {
    href: string | null;
    total: number;
  };
  href: string;
  id: string;
  images: Array<{
    url: string;
    height: number | null;
    width: number | null;
  }>;
  product?: string;
  type: string;
  uri: string;
}

export interface SpotifyArtist {
  external_urls: {
    spotify: string;
  };
  followers: {
    href: string | null;
    total: number;
  };
  genres: string[];
  href: string;
  id: string;
  images: Array<{
    url: string;
    height: number;
    width: number;
  }>;
  name: string;
  popularity: number;
  type: string;
  uri: string;
}

export interface SpotifyPlaylist {
  collaborative: boolean;
  description: string | null;
  external_urls: {
    spotify: string;
  };
  followers?: {
    href: string | null;
    total: number;
  };
  href: string;
  id: string;
  images: Array<{
    url: string;
    height: number | null;
    width: number | null;
  }>;
  name: string;
  owner: {
    external_urls: {
      spotify: string;
    };
    followers: {
      href: string | null;
      total: number;
    };
    href: string;
    id: string;
    type: string;
    uri: string;
    display_name: string | null;
  };
  public: boolean;
  snapshot_id: string;
  tracks: {
    href: string;
    total: number;
    items?: Array<{
      added_at: string;
      added_by: {
        external_urls: {
          spotify: string;
        };
        followers: {
          href: string | null;
          total: number;
        };
        href: string;
        id: string;
        type: string;
        uri: string;
      };
      is_local: boolean;
      track: SpotifyTrack | null;
    }>;
    limit: number;
    next: string | null;
    offset: number;
    previous: string | null;
  };
  type: string;
  uri: string;
}

export interface SpotifyPlaylistItem {
  added_at: string;
  added_by: {
    external_urls: {
      spotify: string;
    };
    followers: {
      href: string | null;
      total: number;
    };
    href: string;
    id: string;
    type: string;
    uri: string;
  };
  is_local: boolean;
  track: SpotifyTrack | null;
}

export interface SpotifyRecentlyPlayedItem {
  track: SpotifyTrack;
  played_at: string;
  context: {
    type: string;
    href: string;
    external_urls: {
      spotify: string;
    };
    uri: string;
  } | null;
}

export interface SpotifyTopTracksResponse {
  href: string;
  limit: number;
  next: string | null;
  offset: number;
  previous: string | null;
  total: number;
  items: SpotifyTrack[];
}

export interface SpotifyRecentlyPlayedResponse {
  href: string;
  limit: number;
  next: string | null;
  cursors: {
    after: string;
    before: string;
  };
  items: SpotifyRecentlyPlayedItem[];
}

export interface SpotifyAudioFeaturesResponse {
  audio_features: SpotifyAudioFeatures[];
}

export interface SpotifySearchResponse {
  tracks: {
    href: string;
    limit: number;
    next: string | null;
    offset: number;
    previous: string | null;
    total: number;
    items: SpotifyTrack[];
  };
}

export interface SpotifyCreatePlaylistResponse {
  collaborative: boolean;
  description: string | null;
  external_urls: {
    spotify: string;
  };
  followers: {
    href: string | null;
    total: number;
  };
  href: string;
  id: string;
  images: Array<{
    url: string;
    height: number | null;
    width: number | null;
  }>;
  name: string;
  owner: {
    external_urls: {
      spotify: string;
    };
    followers: {
      href: string | null;
      total: number;
    };
    href: string;
    id: string;
    type: string;
    uri: string;
    display_name: string | null;
  };
  public: boolean;
  snapshot_id: string;
  tracks: {
    href: string;
    total: number;
  };
  type: string;
  uri: string;
}

export interface SpotifyError {
  error: {
    status: number;
    message: string;
  };
}

/**
 * User Music Profile - Aggregate of user's music taste
 */
export interface UserMusicProfile {
  averageAudioFeatures: {
    danceability: number;
    energy: number;
    valence: number;
    acousticness: number;
    instrumentalness: number;
    liveness: number;
    speechiness: number;
    tempo: number;
  };
  topGenres: Array<{
    genre: string;
    count: number;
    percentage: number;
  }>;
  topArtists: Array<{
    id: string;
    name: string;
    count: number;
    genres: string[];
    popularity: number;
  }>;
  timeRangePreferences: {
    shortTerm: {
      topTracks: SpotifyTrack[];
      averageFeatures: Partial<SpotifyAudioFeatures>;
    };
    mediumTerm: {
      topTracks: SpotifyTrack[];
      averageFeatures: Partial<SpotifyAudioFeatures>;
    };
    longTerm: {
      topTracks: SpotifyTrack[];
      averageFeatures: Partial<SpotifyAudioFeatures>;
    };
  };
  recentlyPlayed: SpotifyTrack[];
  totalTracksAnalyzed: number;
  generatedAt: Date;
}

