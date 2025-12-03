import { NextResponse } from "next/server";
import { validateEnv } from "@/lib/env";

/**
 * Health check endpoint
 * Validates environment configuration
 */
export async function GET() {
  try {
    validateEnv();
    return NextResponse.json({
      status: "healthy",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: "unhealthy",
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

