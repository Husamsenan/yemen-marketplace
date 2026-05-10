import { NextResponse } from "next/server";
import { getBearerToken, getSupabaseAnonClient, hasSupabaseConfig } from "@/lib/supabase/server";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();
  if (hasSupabaseConfig()) {
    const token = getBearerToken(request);
    if (!token) return NextResponse.json({ error: "Authentication required" }, { status: 401 });

    const supabase = getSupabaseAnonClient(token);
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) return NextResponse.json({ error: "Invalid session" }, { status: 401 });

    const { data, error } = await supabase
      .from("reports")
      .insert({
        listing_id: id,
        reporter_id: userData.user.id,
        reason: body.reason,
        details: body.details
      })
      .select("id,listing_id,status,reason,created_at")
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ data }, { status: 201 });
  }

  return NextResponse.json({ data: { id: `report-${Date.now()}`, listingId: id, status: "open", ...body } }, { status: 201 });
}
