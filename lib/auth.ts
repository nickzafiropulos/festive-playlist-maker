import { NextAuthOptions } from "next-auth";
import SpotifyProvider from "next-auth/providers/spotify";
import type { JWT } from "next-auth/jwt";
import { getEnv } from "@/lib/env";

const scopes = [
  "user-top-read",
  "user-read-recently-played",
  "playlist-modify-public",
  "playlist-modify-private",
  "user-read-email",
  "user-read-private",
].join(" ");

// Validate environment variables
let env: ReturnType<typeof getEnv> | null = null;
try {
  env = getEnv();
} catch (error) {
  console.error("Environment validation failed:", error);
  // Will use process.env as fallback for demo mode
}

export const authOptions: NextAuthOptions = {
  providers: [
    SpotifyProvider({
      clientId: env?.SPOTIFY_CLIENT_ID || process.env.SPOTIFY_CLIENT_ID || "",
      clientSecret: env?.SPOTIFY_CLIENT_SECRET || process.env.SPOTIFY_CLIENT_SECRET || "",
      authorization: {
        params: {
          scope: scopes,
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account, user }): Promise<JWT> {
      // Initial sign in
      if (account && user) {
        return {
          ...token,
          accessToken: account.access_token,
          refreshToken: account.refresh_token,
          accessTokenExpires: account.expires_at ? account.expires_at * 1000 : null,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.image,
          },
        } as JWT;
      }

      // Return previous token if the access token has not expired yet
      if (token.accessTokenExpires && Date.now() < token.accessTokenExpires) {
        return token;
      }

      // Access token has expired, try to update it
      return await refreshAccessToken(token);
    },
    async session({ session, token }) {
      if (token) {
        session.user = token.user as typeof session.user;
        session.accessToken = token.accessToken as string;
        session.refreshToken = token.refreshToken as string;
        session.error = token.error as string | undefined;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
  secret: env?.NEXTAUTH_SECRET || process.env.NEXTAUTH_SECRET || "demo-secret",
};

async function refreshAccessToken(token: JWT): Promise<JWT> {
  try {
    const url = "https://accounts.spotify.com/api/token";
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(
          `${env?.SPOTIFY_CLIENT_ID || process.env.SPOTIFY_CLIENT_ID || ""}:${env?.SPOTIFY_CLIENT_SECRET || process.env.SPOTIFY_CLIENT_SECRET || ""}`
        ).toString("base64")}`,
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: token.refreshToken as string,
      }),
    });

    const refreshedTokens = await response.json();

    if (!response.ok) {
      throw refreshedTokens;
    }

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken,
    };
  } catch (error) {
    console.error("Error refreshing access token", error);
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}

