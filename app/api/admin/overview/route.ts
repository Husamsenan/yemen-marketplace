import { NextResponse } from "next/server";
import { listings } from "@/app/data";

export async function GET() {
  return NextResponse.json({
    data: {
      listings: listings.length,
      pending: listings.filter((listing) => listing.status === "pending").length,
      premium: listings.filter((listing) => listing.premium).length,
      reports: 0
    }
  });
}
