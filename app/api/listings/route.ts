import { NextResponse } from "next/server";
import { listings } from "@/app/data";
import { getBearerToken, getSupabaseAnonClient, hasSupabaseConfig } from "@/lib/supabase/server";
import { listingSelect, mapListingRow, type ListingRow } from "@/lib/marketplace/listings";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get("city");
  const category = searchParams.get("category");
  const q = searchParams.get("q")?.toLowerCase();

  if (hasSupabaseConfig()) {
    const supabase = getSupabaseAnonClient();
    let query = supabase
      .from("listings")
      .select(listingSelect)
      .eq("status", "active")
      .order("premium_until", { ascending: false, nullsFirst: false })
      .order("created_at", { ascending: false })
      .limit(60);

    if (city && city !== "all") query = query.or(`name_ar.eq.${city},name_en.eq.${city},slug.eq.${city}`, { foreignTable: "cities" });
    if (category && category !== "all") {
      query = query.or(`name_ar.eq.${category},name_en.eq.${category},slug.eq.${category}`, { foreignTable: "categories" });
    }
    if (q) query = query.textSearch("search_vector", q, { type: "websearch" });

    const { data, error } = await query.returns<ListingRow[]>();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({
      data: (data ?? []).map(mapListingRow)
    });
  }

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

  if (hasSupabaseConfig()) {
    const token = getBearerToken(request);
    if (!token) return NextResponse.json({ error: "Authentication required" }, { status: 401 });

    const supabase = getSupabaseAnonClient(token);
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) return NextResponse.json({ error: "Invalid session" }, { status: 401 });

    const [{ data: category }, { data: city }] = await Promise.all([
      supabase
        .from("categories")
        .select("id")
        .or(`name_ar.eq.${body.category},name_en.eq.${body.category},slug.eq.${body.category}`)
        .single(),
      supabase.from("cities").select("id").or(`name_ar.eq.${body.city},name_en.eq.${body.city},slug.eq.${body.city}`).single()
    ]);

    if (!category?.id || !city?.id) {
      return NextResponse.json({ error: "Invalid category or city" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("listings")
      .insert({
        seller_id: userData.user.id,
        category_id: category.id,
        city_id: city.id,
        title: body.title,
        title_en: body.titleEn,
        description: body.description,
        price: Number(body.price) || null,
        whatsapp: body.whatsapp,
        status: "pending"
      })
      .select("id,status")
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ data }, { status: 201 });
  }

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
