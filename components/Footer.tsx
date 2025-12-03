"use client";

import { Github, Heart } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t bg-muted/50 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Branding */}
          <div>
            <h3 className="font-heading text-xl font-bold text-primary mb-2">
              Festive Playlist Architect
            </h3>
            <p className="text-sm text-muted-foreground">
              Made with <Heart className="inline w-4 h-4 text-secondary" /> for the NearForm Hackathon 2024
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold mb-3">Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="https://github.com/nearform"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
                >
                  <Github className="w-4 h-4" />
                  GitHub
                </Link>
              </li>
              <li>
                <Link
                  href="https://nearform.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  NearForm
                </Link>
              </li>
            </ul>
          </div>

          {/* Credits */}
          <div>
            <h4 className="font-semibold mb-3">Powered By</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link
                  href="https://developer.spotify.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors"
                >
                  Spotify Web API
                </Link>
              </li>
              <li>
                <Link
                  href="https://groq.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors"
                >
                  Groq AI (Llama 3)
                </Link>
              </li>
              <li>
                <Link
                  href="https://nextjs.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors"
                >
                  Next.js 14
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t text-center text-sm text-muted-foreground">
          <p>© 2024 NearForm. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

