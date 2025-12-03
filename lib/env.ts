/**
 * Environment variable validation
 * Validates all required environment variables at runtime
 */

interface EnvConfig {
  SPOTIFY_CLIENT_ID: string;
  SPOTIFY_CLIENT_SECRET: string;
  GROQ_API_KEY: string;
  NEXTAUTH_SECRET: string;
  NEXTAUTH_URL: string;
}

class EnvValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "EnvValidationError";
  }
}

/**
 * Validate environment variables
 * Throws EnvValidationError if any required variables are missing
 */
export function validateEnv(): EnvConfig {
  const errors: string[] = [];

  const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
  const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
  const GROQ_API_KEY = process.env.GROQ_API_KEY;
  const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET;
  const NEXTAUTH_URL = process.env.NEXTAUTH_URL || "http://localhost:3000";

  if (!SPOTIFY_CLIENT_ID) {
    errors.push("SPOTIFY_CLIENT_ID is required");
  }

  if (!SPOTIFY_CLIENT_SECRET) {
    errors.push("SPOTIFY_CLIENT_SECRET is required");
  }

  if (!GROQ_API_KEY) {
    errors.push("GROQ_API_KEY is required");
  }

  if (!NEXTAUTH_SECRET) {
    errors.push("NEXTAUTH_SECRET is required");
  }

  if (errors.length > 0) {
    throw new EnvValidationError(
      `Missing required environment variables:\n${errors.join("\n")}\n\n` +
        "Please check your .env.local file or environment configuration."
    );
  }

  return {
    SPOTIFY_CLIENT_ID: SPOTIFY_CLIENT_ID!,
    SPOTIFY_CLIENT_SECRET: SPOTIFY_CLIENT_SECRET!,
    GROQ_API_KEY: GROQ_API_KEY!,
    NEXTAUTH_SECRET: NEXTAUTH_SECRET!,
    NEXTAUTH_URL,
  };
}

/**
 * Get validated environment variables
 * Use this instead of accessing process.env directly
 */
export function getEnv(): EnvConfig {
  try {
    return validateEnv();
  } catch (error) {
    if (error instanceof EnvValidationError) {
      console.error("❌ Environment Configuration Error:");
      console.error(error.message);
      throw error;
    }
    throw error;
  }
}

/**
 * Check if we're in demo mode (when API keys are missing)
 */
export function isDemoMode(): boolean {
  return (
    !process.env.SPOTIFY_CLIENT_ID ||
    !process.env.GROQ_API_KEY ||
    process.env.DEMO_MODE === "true"
  );
}

