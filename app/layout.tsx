import type { Metadata } from "next";
import { Mountains_of_Christmas } from "next/font/google";
import { Providers } from "@/components/Providers";
import { EasterEggs } from "@/components/EasterEggs";
import "./globals.css";

const headingFont = Mountains_of_Christmas({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-heading",
});

export const metadata: Metadata = {
  title: "Festive Playlist Architect | AI-Powered Christmas Playlists",
  description: "Create your perfect personalized Christmas playlist powered by AI. We analyze your music taste and blend it with festive holiday spirit.",
  keywords: ["Christmas", "playlist", "Spotify", "AI", "music", "holiday", "festive"],
  authors: [{ name: "NearForm" }],
  openGraph: {
    title: "Festive Playlist Architect | AI-Powered Christmas Playlists",
    description: "Create your perfect personalized Christmas playlist powered by AI. We analyze your music taste and blend it with festive holiday spirit.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Festive Playlist Architect",
    description: "Create your perfect personalized Christmas playlist powered by AI.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${headingFont.variable} font-sans antialiased`}>
        <Providers>
          {children}
          <EasterEggs />
        </Providers>
      </body>
    </html>
  );
}

