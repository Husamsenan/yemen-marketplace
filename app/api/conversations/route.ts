import { NextResponse } from "next/server";
import { getBearerToken, getSupabaseAnonClient, hasSupabaseConfig } from "@/lib/supabase/server";

export async function GET(request: Request) {
  if (hasSupabaseConfig()) {
    const token = getBearerToken(request);
    if (!token) return NextResponse.json({ error: "Authentication required" }, { status: 401 });

    const supabase = getSupabaseAnonClient(token);
    const { data, error } = await supabase
      .from("conversations")
      .select("id,listing_id,buyer_id,seller_id,last_message_at,created_at,listings(title),messages(body,created_at)")
      .order("last_message_at", { ascending: false })
      .limit(50);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ data });
  }

  return NextResponse.json({
    data: [
      { id: "conversation-1", listingId: "solar-01", updatedAt: new Date().toISOString() }
    ]
  });
}

export async function POST(request: Request) {
  const body = await request.json();

  if (hasSupabaseConfig()) {
    const token = getBearerToken(request);
    if (!token) return NextResponse.json({ error: "Authentication required" }, { status: 401 });

    const supabase = getSupabaseAnonClient(token);
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) return NextResponse.json({ error: "Invalid session" }, { status: 401 });

    const { data: listing, error: listingError } = await supabase
      .from("listings")
      .select("seller_id")
      .eq("id", body.listingId)
      .single();

    if (listingError || !listing) return NextResponse.json({ error: "Listing not found" }, { status: 404 });

    const { data, error } = await supabase
      .from("conversations")
      .upsert({
        listing_id: body.listingId,
        buyer_id: userData.user.id,
        seller_id: listing.seller_id
      })
      .select("id,listing_id,buyer_id,seller_id,last_message_at")
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ data }, { status: 201 });
  }

  return NextResponse.json({ data: { id: `conversation-${Date.now()}`, ...body } }, { status: 201 });
}
