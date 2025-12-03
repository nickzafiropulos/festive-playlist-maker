import { NextResponse } from "next/server";
import { isDemoMode } from "@/lib/env";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json({ isDemoMode: isDemoMode() });
}

