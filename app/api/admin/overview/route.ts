import { NextResponse } from "next/server";
import { listings } from "@/app/data";
import { getSupabaseServiceClient, hasSupabaseConfig } from "@/lib/supabase/server";

export async function GET() {
  if (hasSupabaseConfig() && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    const supabase = getSupabaseServiceClient();
    const [allListings, pendingListings, premiumListings, reports, users] = await Promise.all([
      supabase.from("listings").select("id", { count: "exact", head: true }),
      supabase.from("listings").select("id", { count: "exact", head: true }).eq("status", "pending"),
      supabase.from("listings").select("id", { count: "exact", head: true }).gt("premium_until", new Date().toISOString()),
      supabase.from("reports").select("id", { count: "exact", head: true }).eq("status", "open"),
      supabase.from("profiles").select("id", { count: "exact", head: true })
    ]);

    const firstError = [allListings, pendingListings, premiumListings, reports, users].find((result) => result.error)?.error;
    if (firstError) return NextResponse.json({ error: firstError.message }, { status: 500 });

    return NextResponse.json({
      data: {
        listings: allListings.count ?? 0,
        pending: pendingListings.count ?? 0,
        premium: premiumListings.count ?? 0,
        reports: reports.count ?? 0,
        users: users.count ?? 0
      }
    });
  }

  return NextResponse.json({
    data: {
      listings: listings.length,
      pending: listings.filter((listing) => listing.status === "pending").length,
      premium: listings.filter((listing) => listing.premium).length,
      reports: 0
    }
  });
}
