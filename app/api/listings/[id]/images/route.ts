import { NextResponse } from "next/server";
import { getBearerToken, getSupabaseAnonClient, hasSupabaseConfig } from "@/lib/supabase/server";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json().catch(() => ({}));

  if (hasSupabaseConfig()) {
    const token = getBearerToken(request);
    if (!token) return NextResponse.json({ error: "Authentication required" }, { status: 401 });

    const supabase = getSupabaseAnonClient(token);
    const { data, error } = await supabase
      .from("listing_images")
      .insert({
        listing_id: id,
        storage_path: body.storagePath ?? body.storage_path ?? body.url,
        public_url: body.url ?? body.publicUrl,
        width: body.width,
        height: body.height,
        sort_order: body.sortOrder ?? 0
      })
      .select("id,listing_id,public_url,sort_order")
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ data }, { status: 201 });
  }

  return NextResponse.json({
    data: {
      listingId: id,
      url: body.url ?? "https://images.unsplash.com/photo-1556155092-490a1ba16284?auto=format&fit=crop&w=900&q=70",
      optimized: true
    }
  });
}
