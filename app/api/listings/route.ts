import { NextResponse } from "next/server";
import { listings } from "@/app/data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get("city");
  const category = searchParams.get("category");
  const q = searchParams.get("q")?.toLowerCase();
  const result = listings.filter((listing) => {
    if (city && city !== "all" && listing.city !== city) return false;
    if (category && category !== "all" && listing.category !== category) return false;
    if (q && !`${listing.title} ${listing.titleEn} ${listing.description}`.toLowerCase().includes(q)) return false;
    return true;
  });
  return NextResponse.json({ data: result });
}

export async function POST(request: Request) {
  const body = await request.json();
  return NextResponse.json(
    {
      data: {
        id: `api-${Date.now()}`,
        status: "pending",
        ...body
      }
    },
    { status: 201 }
  );
}
