"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to console in development
    console.error("Application error:", error);
  }, [error]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <Card className="max-w-md w-full border-2 border-destructive/20">
        <CardContent className="pt-6 text-center space-y-4">
          <AlertCircle className="w-16 h-16 text-destructive mx-auto" />
          <h1 className="font-heading text-3xl font-bold text-destructive">
            Something went wrong!
          </h1>
          <p className="text-muted-foreground">
            We encountered an unexpected error. Don't worry, your data is safe!
          </p>
          {process.env.NODE_ENV === "development" && (
            <div className="mt-4 p-4 bg-muted rounded-lg text-left">
              <p className="text-xs font-mono text-muted-foreground break-all">
                {error.message}
              </p>
            </div>
          )}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button onClick={reset} variant="default">
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
            <Button asChild variant="outline">
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                Go Home
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}

