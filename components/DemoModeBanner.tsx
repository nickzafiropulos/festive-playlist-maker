"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";

export function DemoModeBanner() {
  return (
    <Alert className="mb-4 border-accent/50 bg-accent/10">
      <Info className="h-4 w-4 text-accent" />
      <AlertDescription className="text-sm">
        <strong>Demo Mode:</strong> You're viewing the app with example data. 
        Connect with Spotify to create your personalized playlist!
      </AlertDescription>
    </Alert>
  );
}

