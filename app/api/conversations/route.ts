import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    data: [
      { id: "conversation-1", listingId: "solar-01", updatedAt: new Date().toISOString() }
    ]
  });
}
