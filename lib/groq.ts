/**
 * Groq AI Client
 * 
 * Complete implementation for Groq API integration using Llama 3
 */

import { Groq } from "groq-sdk";
import type {
  GroqMessage,
  GroqCompletionOptions,
  GroqCompletionResponse,
  PlaylistNarrative,
  GeneratePlaylistNarrativeOptions,
} from "@/types/groq";
import type { UserMusicProfile } from "@/types/spotify";

const DEFAULT_MODEL = "llama3-8b-8192";
const DEFAULT_MAX_RETRIES = 3;
const DEFAULT_RETRY_DELAY = 1000; // 1 second

export class GroqClient {
  private client: Groq | null = null;
  private apiKey: string | null = null;
  private model: string;

  constructor(apiKey?: string, model: string = DEFAULT_MODEL) {
    this.model = model;
    if (apiKey) {
      this.apiKey = apiKey;
      this.client = new Groq({
        apiKey: apiKey,
      });
    } else if (typeof window === "undefined" && process.env.GROQ_API_KEY) {
      // Server-side: use environment variable
      this.apiKey = process.env.GROQ_API_KEY;
      this.client = new Groq({
        apiKey: this.apiKey,
      });
    }
  }

  setApiKey(apiKey: string): void {
    this.apiKey = apiKey;
    this.client = new Groq({
      apiKey: apiKey,
    });
  }

  /**
   * Generate a completion with retry logic
   */
  async generateCompletion(
    messages: GroqMessage[],
    options: GroqCompletionOptions = {}
  ): Promise<GroqCompletionResponse> {
    if (!this.client) {
      throw new Error("Groq client not initialized. Please set API key.");
    }

    const {
      model = this.model,
      temperature = 0.7,
      max_tokens = 4096,
      top_p = 1,
      stream = false,
    } = options;

    let lastError: Error | null = null;

    for (let attempt = 0; attempt < DEFAULT_MAX_RETRIES; attempt++) {
      try {
        const response = await this.client.chat.completions.create({
          model,
          messages: messages as any,
          temperature,
          max_tokens,
          top_p,
          stream,
        });

        return response as unknown as GroqCompletionResponse;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        
        // Don't retry on certain errors
        if (this.isNonRetryableError(error)) {
          throw lastError;
        }

        // Wait before retrying (exponential backoff)
        if (attempt < DEFAULT_MAX_RETRIES - 1) {
          const delay = DEFAULT_RETRY_DELAY * Math.pow(2, attempt);
          await this.sleep(delay);
        }
      }
    }

    throw new Error(
      `Failed to generate completion after ${DEFAULT_MAX_RETRIES} attempts: ${lastError?.message}`
    );
  }

  /**
   * Generate a streaming completion
   */
  async *generateCompletionStream(
    messages: GroqMessage[],
    options: GroqCompletionOptions = {}
  ): AsyncGenerator<string, void, unknown> {
    if (!this.client) {
      throw new Error("Groq client not initialized. Please set API key.");
    }

    const {
      model = this.model,
      temperature = 0.7,
      max_tokens = 4096,
      top_p = 1,
    } = options;

    try {
      const stream = await this.client.chat.completions.create({
        model,
        messages: messages as any,
        temperature,
        max_tokens,
        top_p,
        stream: true,
      });

      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || "";
        if (content) {
          yield content;
        }
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      throw new Error(`Streaming error: ${errorMessage}`);
    }
  }

  /**
   * Check if error is non-retryable
   */
  private isNonRetryableError(error: unknown): boolean {
    if (error && typeof error === "object" && "status" in error) {
      const status = (error as { status: number }).status;
      // Don't retry on 400 (bad request) or 401 (unauthorized)
      return status === 400 || status === 401;
    }
    return false;
  }

  /**
   * Sleep utility for retry delays
   */
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

/**
 * Generate a festive playlist narrative based on user's music profile
 */
export async function generatePlaylistNarrative(
  client: GroqClient,
  options: GeneratePlaylistNarrativeOptions
): Promise<PlaylistNarrative> {
  const { userProfile, temperature = 0.8, maxTokens = 4096 } = options;

  // Build the system prompt
  const systemPrompt = buildSystemPrompt();

  // Build the user prompt with profile data
  const userPrompt = buildUserPrompt(userProfile);

  const messages: GroqMessage[] = [
    { role: "system", content: systemPrompt },
    { role: "user", content: userPrompt },
  ];

  try {
    const response = await client.generateCompletion(messages, {
      temperature,
      max_tokens: maxTokens,
      stream: false,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error("No content received from Groq API");
    }

    // Parse JSON response
    const narrative = parseNarrativeResponse(content);
    return narrative;
  } catch (error) {
    console.error("Error generating playlist narrative:", error);
    throw error instanceof Error
      ? error
      : new Error("Failed to generate playlist narrative");
  }
}

/**
 * Generate a streaming playlist narrative
 * Yields content chunks as they arrive
 * Use parseNarrativeResponse() on the accumulated content to get the final narrative
 */
export async function* generatePlaylistNarrativeStream(
  client: GroqClient,
  options: GeneratePlaylistNarrativeOptions
): AsyncGenerator<string> {
  const { userProfile, temperature = 0.8, maxTokens = 4096 } = options;

  // Build the system prompt
  const systemPrompt = buildSystemPrompt();

  // Build the user prompt with profile data
  const userPrompt = buildUserPrompt(userProfile);

  const messages: GroqMessage[] = [
    { role: "system", content: systemPrompt },
    { role: "user", content: userPrompt },
  ];

  try {
    for await (const chunk of client.generateCompletionStream(messages, {
      temperature,
      max_tokens: maxTokens,
    })) {
      yield chunk;
    }
  } catch (error) {
    console.error("Error generating streaming playlist narrative:", error);
    throw error instanceof Error
      ? error
      : new Error("Failed to generate streaming playlist narrative");
  }
}

/**
 * Helper function to generate streaming narrative and parse the final result
 * Accumulates all chunks and returns the parsed narrative
 */
export async function generatePlaylistNarrativeFromStream(
  client: GroqClient,
  options: GeneratePlaylistNarrativeOptions
): Promise<{ narrative: PlaylistNarrative; streamedContent: string }> {
  let fullContent = "";
  
  for await (const chunk of generatePlaylistNarrativeStream(client, options)) {
    fullContent += chunk;
  }

  const narrative = parseNarrativeResponse(fullContent);
  return { narrative, streamedContent: fullContent };
}

/**
 * Build the system prompt for playlist generation
 */
function buildSystemPrompt(): string {
  return `You are a festive music curator creating a personalized Christmas/holiday playlist. 
Your role is to analyze a user's music taste and suggest songs that blend their personal preferences with holiday spirit. 
Be warm, creative, and personal in your recommendations.

You must respond with a valid JSON object in this exact format:
{
  "playlistName": "A creative, festive playlist name (max 100 characters)",
  "playlistDescription": "A warm, personal description (2-3 sentences) explaining the playlist theme",
  "songRecommendations": [
    {
      "searchQuery": "Artist Name - Song Title (exact format for Spotify search)",
      "reasoning": "Why this song fits their taste (1-2 sentences)",
      "festiveConnection": "How it relates to holidays/Christmas (1-2 sentences)"
    }
  ],
  "overallNarrative": "2-3 paragraphs about their year in music, referencing specific artists/genres they love, their energy levels, and listening patterns. Be warm and personal."
}

Requirements:
- Generate 15-20 song recommendations
- Each searchQuery should be in format "Artist - Song Title" optimized for Spotify search
- Blend their favorite genres with festive/holiday themes
- Reference specific artists and genres from their profile
- Be creative with playlist names (e.g., "Cozy Christmas Vibes for [Genre] Lovers")
- Make the narrative personal and warm
- Ensure all JSON is valid and properly formatted`;
}

/**
 * Build the user prompt with profile data
 */
function buildUserPrompt(profile: UserMusicProfile): string {
  const topArtists = profile.topArtists
    .slice(0, 10)
    .map((a) => a.name)
    .join(", ");
  const topGenres = profile.topGenres
    .slice(0, 10)
    .map((g) => g.genre)
    .join(", ");

  return `Analyze this user's music profile and create a festive playlist:

TOP ARTISTS: ${topArtists || "Various artists"}

TOP GENRES: ${topGenres || "Various genres"}

AUDIO FEATURES:
- Energy: ${profile.averageAudioFeatures.energy.toFixed(2)} (0-1 scale)
- Danceability: ${profile.averageAudioFeatures.danceability.toFixed(2)} (0-1 scale)
- Valence (positivity): ${profile.averageAudioFeatures.valence.toFixed(2)} (0-1 scale)
- Acousticness: ${profile.averageAudioFeatures.acousticness.toFixed(2)} (0-1 scale)
- Tempo: ${profile.averageAudioFeatures.tempo.toFixed(0)} BPM

LISTENING PATTERNS:
- Short-term favorites: ${profile.timeRangePreferences.shortTerm.topTracks.length} tracks
- Medium-term favorites: ${profile.timeRangePreferences.mediumTerm.topTracks.length} tracks
- Long-term favorites: ${profile.timeRangePreferences.longTerm.topTracks.length} tracks
- Recently played: ${profile.recentlyPlayed.length} tracks
- Total tracks analyzed: ${profile.totalTracksAnalyzed}

Create a personalized festive playlist that:
1. Blends their favorite genres (${topGenres || "their preferred styles"}) with holiday spirit
2. Matches their energy level (${profile.averageAudioFeatures.energy > 0.6 ? "high energy" : profile.averageAudioFeatures.energy > 0.4 ? "moderate energy" : "chill/relaxed"})
3. References their top artists (${topArtists || "their favorite artists"})
4. Includes both classic holiday songs and modern tracks that fit their taste
5. Creates a warm, personal narrative about their musical year

Respond with ONLY the JSON object, no additional text.`;
}

/**
 * Parse the narrative response from JSON
 */
function parseNarrativeResponse(content: string): PlaylistNarrative {
  try {
    // Try to extract JSON from the response (in case there's extra text)
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      
      // Validate and ensure all required fields
      if (!parsed.playlistName || !parsed.playlistDescription || !parsed.songRecommendations || !parsed.overallNarrative) {
        throw new Error("Missing required fields in response");
      }

      // Ensure songRecommendations is an array with required fields
      if (!Array.isArray(parsed.songRecommendations)) {
        throw new Error("songRecommendations must be an array");
      }

      // Validate each recommendation
      parsed.songRecommendations = parsed.songRecommendations.map((rec: any) => {
        if (!rec.searchQuery || !rec.reasoning || !rec.festiveConnection) {
          throw new Error("Each recommendation must have searchQuery, reasoning, and festiveConnection");
        }
        return {
          searchQuery: String(rec.searchQuery),
          reasoning: String(rec.reasoning),
          festiveConnection: String(rec.festiveConnection),
        };
      });

      return {
        playlistName: String(parsed.playlistName),
        playlistDescription: String(parsed.playlistDescription),
        songRecommendations: parsed.songRecommendations,
        overallNarrative: String(parsed.overallNarrative),
      };
    }

    throw new Error("No JSON object found in response");
  } catch (error) {
    console.error("Error parsing narrative response:", error);
    console.error("Content received:", content);
    throw new Error(
      `Failed to parse narrative response: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}
