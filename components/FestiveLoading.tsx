"use client";

import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

const loadingMessages = [
  "Checking if you've been naughty or nice...",
  "Mixing eggnog with your favourite beats...",
  "Wrapping your music taste in festive paper...",
  "Decking the halls with your top tracks...",
  "Rudolph is analyzing your playlists...",
  "Santa's elves are crafting your playlist...",
  "Jingle bells, jingle bells, analyzing your taste...",
  "Ho ho ho! Finding your perfect festive songs...",
];

interface FestiveLoadingProps {
  message?: string;
  showSkeleton?: boolean;
}

export function FestiveLoading({ message, showSkeleton = true }: FestiveLoadingProps) {
  const [currentMessage, setCurrentMessage] = useState(
    message || loadingMessages[0]
  );

  useEffect(() => {
    if (message) return;

    const interval = setInterval(() => {
      const randomMessage =
        loadingMessages[Math.floor(Math.random() * loadingMessages.length)];
      setCurrentMessage(randomMessage);
    }, 3000);

    return () => clearInterval(interval);
  }, [message]);

  return (
    <Card className="border-2 border-primary/20">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="text-center">
            <p className="text-lg font-medium text-primary animate-pulse">
              {currentMessage}
            </p>
          </div>
          {showSkeleton && (
            <div className="space-y-4 pt-4">
              <Skeleton className="h-8 w-64 mx-auto" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4 mx-auto" />
              <div className="space-y-2 pt-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

