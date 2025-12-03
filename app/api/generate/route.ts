import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { GroqClient, generatePlaylistNarrative } from "@/lib/groq";
import { groqRateLimiter, getRateLimitId } from "@/lib/rate-limit";
import type { UserMusicProfile } from "@/types/spotify";

// Force dynamic rendering (required when using headers/cookies)
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.accessToken) {
      return NextResponse.json(
        { error: "Unauthorized. Please connect with Spotify." },
        { status: 401 }
      );
    }

    const profile: UserMusicProfile = await request.json();

    if (!profile) {
      return NextResponse.json(
        { error: "Music profile is required." },
        { status: 400 }
      );
    }

    // Rate limiting
    const rateLimitId = getRateLimitId(
      request.headers.get("x-session-id") || undefined,
      session.user?.id
    );

    if (!groqRateLimiter.isAllowed(rateLimitId)) {
      const timeUntilReset = groqRateLimiter.getTimeUntilReset(rateLimitId);
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

    const groqClient = new GroqClient();
    const narrative = await generatePlaylistNarrative(groqClient, {
      userProfile: profile,
      temperature: 0.8,
      maxTokens: 4096,
    });

    return NextResponse.json(narrative);
  } catch (error) {
    console.error("Error generating playlist narrative:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to generate playlist. Please try again.",
      },
      { status: 500 }
    );
  }
}

