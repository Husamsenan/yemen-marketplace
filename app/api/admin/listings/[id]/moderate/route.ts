import { NextResponse } from "next/server";
import { getSupabaseServiceClient, hasSupabaseConfig } from "@/lib/supabase/server";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();
  const status = body.status ?? "active";

  if (hasSupabaseConfig() && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    const supabase = getSupabaseServiceClient();
    const { data, error } = await supabase
      .from("listings")
      .update({ status })
      .eq("id", id)
      .select("id,status")
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ data });
  }

  return NextResponse.json({ data: { listingId: id, status } });
}
