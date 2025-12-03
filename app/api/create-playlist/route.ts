import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { SpotifyClient } from "@/lib/spotify";
import type { PlaylistNarrative } from "@/types/groq";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.accessToken) {
      return NextResponse.json(
        { error: "Unauthorized. Please connect with Spotify." },
        { status: 401 }
      );
    }

    const { narrative, trackUris }: { narrative: PlaylistNarrative; trackUris: string[] } =
      await request.json();

    if (!narrative || !trackUris || trackUris.length === 0) {
      return NextResponse.json(
        { error: "Narrative and track URIs are required." },
        { status: 400 }
      );
    }

    const client = new SpotifyClient(session.accessToken, session.refreshToken);
    const user = await client.getCurrentUser();

    // Create playlist
    const playlist = await client.createPlaylist(
      user.id,
      narrative.playlistName,
      narrative.playlistDescription,
      true // public
    );

    // Add tracks
    await client.addTracksToPlaylist(playlist.id, trackUris);

    return NextResponse.json({
      success: true,
      playlistId: playlist.id,
      playlistUrl: playlist.external_urls.spotify,
      name: playlist.name,
    });
  } catch (error) {
    console.error("Error creating playlist:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to create playlist. Please try again.",
      },
      { status: 500 }
    );
  }
}

