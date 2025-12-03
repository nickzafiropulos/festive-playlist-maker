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
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to analyze your music profile. Please try again.",
      },
      { status: 500 }
    );
  }
}

