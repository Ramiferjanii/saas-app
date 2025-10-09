import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// A working API route for Sentry testing
export function GET() {
  return NextResponse.json({ 
    data: "Sentry API is working correctly!",
    timestamp: new Date().toISOString()
  });
}
