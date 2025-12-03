/**
 * Groq AI API TypeScript types
 */

import type { UserMusicProfile } from "./spotify";

export interface GroqMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface GroqCompletionOptions {
  model?: string;
  temperature?: number;
  max_tokens?: number;
  top_p?: number;
  stream?: boolean;
}

export interface GroqCompletionResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: GroqMessage;
    finish_reason: string;
    delta?: GroqMessage;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface SongRecommendation {
  searchQuery: string;
  reasoning: string;
  festiveConnection: string;
}

export interface PlaylistNarrative {
  playlistName: string;
  playlistDescription: string;
  songRecommendations: SongRecommendation[];
  overallNarrative: string;
}

export interface GeneratePlaylistNarrativeOptions {
  userProfile: UserMusicProfile;
  temperature?: number;
  maxTokens?: number;
  stream?: boolean;
}

