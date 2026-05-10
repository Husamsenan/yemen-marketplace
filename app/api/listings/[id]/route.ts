import { NextResponse } from "next/server";
import { listings } from "@/app/data";
import { listingSelect, mapListingRow, type ListingRow } from "@/lib/marketplace/listings";
import { getBearerToken, getSupabaseAnonClient, hasSupabaseConfig } from "@/lib/supabase/server";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (hasSupabaseConfig()) {
    const supabase = getSupabaseAnonClient();
    const { data, error } = await supabase
      .from("listings")
      .select(listingSelect)
      .eq("id", id)
      .maybeSingle<ListingRow>();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    if (!data) return NextResponse.json({ error: "Listing not found" }, { status: 404 });

    await supabase.rpc("increment_listing_views", { listing_id: id });
    return NextResponse.json({ data: mapListingRow(data) });
  }

  const listing = listings.find((item) => item.id === id);
  if (!listing) return NextResponse.json({ error: "Listing not found" }, { status: 404 });
  return NextResponse.json({ data: listing });
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();
  if (hasSupabaseConfig()) {
    const token = getBearerToken(request);
    if (!token) return NextResponse.json({ error: "Authentication required" }, { status: 401 });

    const supabase = getSupabaseAnonClient(token);
    const { data, error } = await supabase
      .from("listings")
      .update({
        title: body.title,
        title_en: body.titleEn,
        description: body.description,
        price: body.price ? Number(body.price) : undefined,
        whatsapp: body.whatsapp,
        status: body.status
      })
      .eq("id", id)
      .select("id,status")
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ data });
  }

  return NextResponse.json({ data: { id, ...body } });
}
