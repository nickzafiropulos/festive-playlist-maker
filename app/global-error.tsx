"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, RefreshCw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global error:", error);
  }, [error]);

  return (
    <html>
      <body>
        <main className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-background">
          <Card className="max-w-md w-full border-2 border-destructive/20">
            <CardContent className="pt-6 text-center space-y-4">
              <AlertCircle className="w-16 h-16 text-destructive mx-auto" />
              <h1 className="font-heading text-3xl font-bold text-destructive">
                Critical Error
              </h1>
              <p className="text-muted-foreground">
                A critical error occurred. Please refresh the page.
              </p>
              <Button onClick={reset} variant="default" className="mt-4">
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh Page
              </Button>
            </CardContent>
          </Card>
        </main>
      </body>
    </html>
  );
}

