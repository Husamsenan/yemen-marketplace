import { NextResponse } from "next/server";
import { getBearerToken, getSupabaseAnonClient, hasSupabaseConfig } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const body = await request.json();
  if (hasSupabaseConfig()) {
    const token = getBearerToken(request);
    if (!token) return NextResponse.json({ error: "Authentication required" }, { status: 401 });

    const supabase = getSupabaseAnonClient(token);
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) return NextResponse.json({ error: "Invalid session" }, { status: 401 });

    const plan = body.plan ?? "premium_7";
    const paidUntil = new Date();
    paidUntil.setDate(paidUntil.getDate() + (plan === "premium_30" ? 30 : plan === "premium_14" ? 14 : 7));

    const { data, error } = await supabase
      .from("premium_orders")
      .insert({
        user_id: userData.user.id,
        listing_id: body.listingId,
        plan,
        amount: Number(body.amount ?? 5),
        currency: body.currency ?? "USD",
        provider: body.provider ?? "manual",
        status: "paid",
        paid_at: new Date().toISOString()
      })
      .select("id,status,plan,amount,currency")
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    if (body.listingId) {
      await supabase.from("listings").update({ premium_until: paidUntil.toISOString() }).eq("id", body.listingId);
    }

    return NextResponse.json({ data });
  }

  return NextResponse.json({
    data: {
      id: `payment-${Date.now()}`,
      status: "paid",
      plan: body.plan ?? "premium-7-days",
      amount: body.amount ?? 5
    }
  });
}
