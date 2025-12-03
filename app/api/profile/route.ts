import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { SpotifyClient } from "@/lib/spotify";
import { analyzeUserMusicProfile } from "@/lib/spotify-analyzer";
import { spotifyRateLimiter, getRateLimitId } from "@/lib/rate-limit";

// Force dynamic rendering (required when using headers/cookies)
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.accessToken) {
      return NextResponse.json(
        { error: "Unauthorized. Please connect with Spotify." },
        { status: 401 }
      );
    }

    // Rate limiting
    const rateLimitId = getRateLimitId(
      request.headers.get("x-session-id") || undefined,
      session.user?.id
    );

    if (!spotifyRateLimiter.isAllowed(rateLimitId)) {
      const timeUntilReset = spotifyRateLimiter.getTimeUntilReset(rateLimitId);
      return NextResponse.json(
        {
          error: "Rate limit exceeded. Please try again later.",
          retryAfter: Math.ceil(timeUntilReset / 1000),
        },
        {
          status: 429,
          headers: {
            "Retry-After": Math.ceil(timeUntilReset / 1000).toString(),
          },
        }
      );
    }

    const client = new SpotifyClient(session.accessToken, session.refreshToken);
    const profile = await analyzeUserMusicProfile(client, {
      topTracksLimit: 50,
      recentlyPlayedLimit: 50,
    });

    return NextResponse.json(profile);
  } catch (error) {
    console.error("Error fetching music profile:", error);
    
    // Log full error details for debugging
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    } else {
      console.error("Error object:", JSON.stringify(error, null, 2));
    }
    
    // Extract status code from error message if it's a Spotify API error
    let statusCode = 500;
    let errorMessage = error instanceof Error
      ? error.message
      : "Failed to analyze your music profile. Please try again.";
    
    // Check for specific Spotify API error status codes in the error message
    if (errorMessage.includes("Status: 403")) {
      statusCode = 403;
    } else if (errorMessage.includes("Status: 401")) {
      statusCode = 401;
    } else if (errorMessage.includes("Status: 429")) {
      statusCode = 429;
    }
    
    return NextResponse.json(
      {
        error: errorMessage,
      },
      { status: statusCode }
    );
  }
}

